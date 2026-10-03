const CARD_SYMBOLS = ['🦁', '🎨', '🚀', '🍕', '🎸', '⚽', '🍦', '👑'];

const createDeck = () => {
  const deck = [];
  let idCounter = 0;
  for (let i = 0; i < CARD_SYMBOLS.length; i++) {
    for (let j = 0; j < 2; j++) {
      const card = {
        id: idCounter,
        symbol: CARD_SYMBOLS[i],
        isMatched: false,
      };
      deck.push(card);
      idCounter++;
    }
  }
  return deck;
};

const shuffleDeck = (deck) => {
  const deckArr = [...deck];
  for (let i = deckArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deckArr[i], deckArr[j]] = [deckArr[j], deckArr[i]];
  }
  return deckArr;
};

function createInitialState() {
  const state = {
    deck: shuffleDeck(createDeck()),
    selectedCardIds: [],
    moves: 0,
    matches: 0,
    isLocked: false,
    isComplete: false,
    mismatchTimeoutId: null,
  };
  return state;
}

let gameState = createInitialState();

function createElement(tagName, className, textContent) {
  const element = document.createElement(tagName);
  if (className) {
    element.className = className;
  }
  if (textContent !== undefined) {
    element.textContent = textContent;
  }
  return element;
}

function createCardElement(card) {
  const button = createElement('button', 'card');
  button.type = 'button';
  button.dataset.cardId = card.id;
  button.setAttribute('aria-label', 'Hidden card');
  const span = createElement('span', 'card__symbol', card.symbol);
  button.append(span);
  return button;
}

function renderDeck(deck, boardElement) {
  boardElement.replaceChildren();
  deck.forEach((card) => {
    const tile = createCardElement(card);
    boardElement.append(tile);
  });
}

function handleCardClick(event) {
  const clicked = event.target.closest('.card');
  if (!clicked) return;
  if (gameState.isLocked || gameState.isComplete) return;
  const cardId = Number(clicked.dataset.cardId);
  const card = gameState.deck.find((card) => card.id === cardId);
  if (!card) return;
  if (card.isMatched) return;
  if (gameState.selectedCardIds.includes(cardId)) return;
  clicked.classList.add('is-flipped');
  clicked.setAttribute('aria-label', `Revealed card: ${card.symbol}`);
  gameState.selectedCardIds.push(cardId);
  if (gameState.selectedCardIds.length === 2) {
    gameState.isLocked = true;
    resolveSelectedPair();
  }
}

function updateCounters() {
  const movesCount = document.querySelector('.moves-count');
  const matchesCount = document.querySelector('.matches-count');
  movesCount.textContent = gameState.moves;
  matchesCount.textContent = `${gameState.matches} / ${CARD_SYMBOLS.length}`;
}

function resolveSelectedPair() {
  if (gameState.selectedCardIds.length !== 2) return;
  const [firstCardId, secondCardId] = gameState.selectedCardIds;
  const firstCard = gameState.deck.find((card) => card.id === firstCardId);
  const secondCard = gameState.deck.find((card) => card.id === secondCardId);
  if (!firstCard || !secondCard) return;
  gameState.moves++;
  updateCounters();

  const [firstCardDOM, secondCardDOM] = document.querySelectorAll(
    `[data-card-id="${firstCardId}"], [data-card-id="${secondCardId}"]`,
  );
  if (firstCard.symbol === secondCard.symbol) {
    firstCard.isMatched = true;
    secondCard.isMatched = true;
    firstCardDOM.classList.add('is-matched');
    secondCardDOM.classList.add('is-matched');
    firstCardDOM.classList.remove('is-flipped');
    secondCardDOM.classList.remove('is-flipped');
    firstCardDOM.setAttribute(
      'aria-label',
      `Matched card: ${firstCard.symbol}`,
    );
    secondCardDOM.setAttribute(
      'aria-label',
      `Matched card: ${secondCard.symbol}`,
    );
    firstCardDOM.disabled = true;
    secondCardDOM.disabled = true;
    gameState.matches++;
    checkGameCompletion();
    gameState.selectedCardIds = [];
    gameState.isLocked = false;
    updateCounters();
  } else {
    const timeoutId = setTimeout(() => {
      firstCardDOM.classList.remove('is-flipped');
      secondCardDOM.classList.remove('is-flipped');
      firstCardDOM.setAttribute('aria-label', `Hidden card`);
      secondCardDOM.setAttribute('aria-label', `Hidden card`);
      gameState.selectedCardIds = [];
      gameState.isLocked = false;
      gameState.mismatchTimeoutId = null;
    }, 1000);
    gameState.mismatchTimeoutId = timeoutId;
  }
}

function startNewGame() {
  if (gameState.mismatchTimeoutId !== null) {
    clearTimeout(gameState.mismatchTimeoutId);
  }
  gameState = createInitialState();
  const board = document.querySelector('.game-board');
  renderDeck(gameState.deck, board);
  updateCounters();
}

function checkGameCompletion() {
  if (gameState.matches === CARD_SYMBOLS.length) {
    gameState.isComplete = true;
    showVictoryModal();
  }
}

function createModalElement() {
  const dialog = createElement('dialog', 'modal');
  dialog.setAttribute('aria-labelledby', 'modal-title');
  const container = createElement('div', 'modal__content');
  dialog.append(container);
  return dialog;
}

function openModal(contentElements) {
  const modal = document.querySelector('.modal');
  const modalContent = document.querySelector('.modal__content');
  if (!modal || !modalContent) return;
  modalContent.replaceChildren(...contentElements);
  modal.showModal();
  document.body.classList.add('modal-open');
}

function closeModal() {
  const modal = document.querySelector('.modal');
  if (!modal) return;
  modal.close();
  document.body.classList.remove('modal-open');
}

function showVictoryModal() {
  const title = createElement('h2', 'modal__title', 'You won!');
  title.id = 'modal-title';
  const paragraph = createElement(
    'p',
    'modal__message',
    `You completed the game in ${gameState.moves} moves.`,
  );
  const actionsModal = createElement('div', 'modal__actions');
  const closeButton = createElement('button', 'button', 'Close');
  closeButton.type = 'button';
  closeButton.addEventListener('click', closeModal);
  const newGameButton = createElement('button', 'button', 'New Game');
  newGameButton.type = 'button';
  newGameButton.addEventListener('click', () => {
    closeModal();
    startNewGame();
  });
  actionsModal.append(newGameButton, closeButton);
  const contentElements = [title, paragraph, actionsModal];
  openModal(contentElements);
}

function renderApp() {
  const container = createElement('div', 'app');

  //header
  const header = createElement('header', 'header');
  const h1 = createElement('h1', 'title', 'Memory Game');
  const controls = createElement('div', 'header__controls');
  const newGameButton = createElement('button', 'button', 'New Game');
  newGameButton.type = 'button';
  const leaderboardButton = createElement('button', 'button', 'Leaderboard');
  leaderboardButton.type = 'button';

  //main
  const main = createElement('main', 'main');
  const sectionStats = createElement('section', 'game-status');
  sectionStats.setAttribute('aria-live', 'polite');
  sectionStats.setAttribute('aria-label', 'Game status');
  const pLeft = createElement('p', 'game-status__item', 'Moves: ');
  const spanMoves = createElement('span', 'moves-count', '0');
  const pRight = createElement('p', 'game-status__item', 'Pairs: ');
  const spanMatches = createElement('span', 'matches-count', '0 / 8');
  const sectionGame = createElement('section', 'game-board');
  sectionGame.setAttribute('aria-label', 'Memory game board');

  renderDeck(gameState.deck, sectionGame);

  //modal
  const modal = createModalElement();

  //appends
  document.body.append(container, modal);
  container.append(header, main);
  header.append(h1, controls);
  controls.append(newGameButton, leaderboardButton);
  main.append(sectionStats, sectionGame);
  sectionStats.append(pLeft, pRight);
  pLeft.append(spanMoves);
  pRight.append(spanMatches);

  //event
  sectionGame.addEventListener('click', handleCardClick);
  newGameButton.addEventListener('click', startNewGame);
  modal.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
  });
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });
}

renderApp();
