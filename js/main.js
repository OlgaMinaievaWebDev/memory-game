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
