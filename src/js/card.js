import { addCardToLocalStorage, removeCardFromLocalStorage } from './localStorage';

export default class Card {
  constructor(id, index, string) {
    this.id = id;
    this.columnIndex = index;
    this.title = string;
  }

  addEventForCard(card) {
    card.addEventListener('pointerenter', (e) => {
      e.target.querySelector('.card-xmark').style.display = 'block';
    });

    card.addEventListener('pointerleave', (e) => {
      e.target.querySelector('.card-xmark').style.display = 'none';
    });

    this.addEventForCardMove(card);
  }

  addEventForCardMove(card) {
    let cardClone = null;
    let topDiff = 0;
    let leftDiff = 0;
    const movedCard = this;
    const board = document.querySelector('.board');

    function mouseDown(e) {
      if (e.target.classList.contains('card-xmark')) {
        e.target.click();
        return;
      }

      cardClone = card.cloneNode(true);

      if (!cardClone) return;

      card.classList.add('card-pre-removed');
      cardClone.classList.add('card-dragged');
      cardClone.style.width = `${card.getBoundingClientRect().width}px`;

      const topCoor = card.getBoundingClientRect().top + window.pageYOffset;
      const leftCoor = card.getBoundingClientRect().left + window.pageXOffset;

      cardClone.style.top = `${topCoor}px`;
      cardClone.style.left = `${leftCoor}px`;

      document.body.appendChild(cardClone);

      topDiff = e.pageY - topCoor;
      leftDiff = e.pageX - leftCoor;
    }

    function mouseMove(e) {
      if (!cardClone) return;

      const prevSpace = document.querySelector('div[data-space]');
      if (prevSpace) prevSpace.remove();

      board.style.cursor = 'grabbing';
      cardClone.style.top = `${e.pageY - topDiff}px`;
      cardClone.style.left = `${e.pageX - leftDiff}px`;

      const closestElem = document.elementFromPoint(e.clientX, e.clientY);

      if (closestElem.classList.contains('card') || closestElem.classList.contains('add-link')) {
        const space = document.createElement('div');
        space.classList.add('.card-pre-removed');
        space.dataset.space = true;
        space.style.height = `${card.getBoundingClientRect().height}px`;
        const column = closestElem.closest('.column');
        const cardBox = column.querySelector('.cards-container');
        if (cardBox.children.length > 0 && closestElem.classList.contains('card')) {
          cardBox.insertBefore(space, closestElem);
        } else {
          cardBox.appendChild(space);
        }
      }
    }

    function mouseUp(e) {
      if (!cardClone) return;

      const prevSpace = document.querySelector('div[data-space]');
      if (prevSpace) prevSpace.remove();

      const closestElem = document.elementFromPoint(e.clientX, e.clientY);
      const columns = document.querySelectorAll('.column');

      board.style.cursor = 'grab';

      if (closestElem.classList.contains('card') || closestElem.classList.contains('add-link')) {
        const column = closestElem.closest('.column');
        const cardBox = column.querySelector('.cards-container');

        if (cardBox.children.length > 0 && closestElem.classList.contains('card')) {
          cardBox.insertBefore(card, closestElem);
        } else {
          cardBox.appendChild(card);
        }

        movedCard.columnIndex = [...columns].findIndex((item) => item === column);
        addCardToLocalStorage(movedCard);
      }

      board.removeEventListener('mousemove', (event) => mouseMove(event));

      if (window.getSelection) {
        window.getSelection().removeAllRanges();
      }

      card.removeEventListener('mousedown', (event) => mouseDown(event));
      card.classList.remove('card-pre-removed');
      cardClone.remove();
      cardClone = null;

      board.style.cursor = 'default';
    }

    card.addEventListener('mousedown', (e) => mouseDown(e));

    board.addEventListener('mousemove', (e) => mouseMove(e));
    board.addEventListener('mouseup', (e) => mouseUp(e));
  }

  addEventForXmark(xmark) {
    xmark.addEventListener('click', (e) => {
      removeCardFromLocalStorage(this);
      e.target.closest('.card').remove();
    });
  }

  createNewCard() {
    const card = document.createElement('div');
    const cardTitle = document.createElement('p');
    const cardRemove = document.createElement('span');
    const columns = document.querySelectorAll('.column');
    const container = columns[this.columnIndex].querySelector('.cards-container');

    card.className = 'card';
    cardTitle.className = 'card-title';
    cardTitle.textContent = this.title;
    cardRemove.className = 'card-xmark';

    container.appendChild(card);
    card.appendChild(cardTitle);
    card.appendChild(cardRemove);

    this.addEventForXmark(cardRemove);
    this.addEventForCard(card);

    /* if (!this.id) {
      this.createId();
    } */
  }
}
