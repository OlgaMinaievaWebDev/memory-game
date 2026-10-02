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

function createCardElement(card) {
  const button = createElement('button', 'card');
  button.type = 'button';
  button.dataset.cardId = card.id;
  button.setAttribute('aria-label', 'Hidden card');
  const span = createElement('span', 'card__symbol', card.symbol);
  button.append(span);
  return button;
}

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

function renderDeck(deck, boardElement) {
  deck.forEach((card) => {
    const tile = createCardElement(card);
    boardElement.append(tile);
  });
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

  //appends
  document.body.appendChild(container);
  container.append(header, main);
  header.append(h1, controls);
  controls.append(newGameButton, leaderboardButton);
  main.append(sectionStats, sectionGame);
  sectionStats.append(pLeft, pRight);
  pLeft.append(spanMoves);
  pRight.append(spanMatches);
}

renderApp();
