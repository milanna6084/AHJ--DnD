import Card from './card';

import { checkCardId, addCardToLocalStorage } from './localStorage';

export default function createForm(e) {
  const columns = document.querySelectorAll('.column');
  const form = document.createElement('form');
  const input = document.createElement('input');
  const buttonsWrapper = document.createElement('div');
  const addButton = document.createElement('button');
  const xmark = document.createElement('img');

  e.target.style.display = 'none';

  input.setAttribute('placeholder', 'Enter a title for this card...');
  buttonsWrapper.className = 'form-buttons-wrapper';
  addButton.className = 'add-button';
  addButton.textContent = 'Add card';
  xmark.className = 'close-form-icon';

  function createId() {
    const id = Math.floor(Math.random() * 100);

    if (checkCardId(id)) {
      return id;
    }
    return createId();
  }

  addButton.addEventListener('click', (event) => {
    event.preventDefault();
    e.target.style.display = 'block';
    const index = [...columns].findIndex((item) => item === e.target.closest('.column'));
    const newCard = new Card(createId(), index, input.value);
    newCard.createNewCard();
    addCardToLocalStorage(newCard);
    form.remove();
  });

  xmark.addEventListener('click', () => {
    e.target.style.display = 'block';
    form.remove();
  });

  e.target.closest('.column').appendChild(form);
  form.appendChild(input);
  form.appendChild(buttonsWrapper);
  buttonsWrapper.appendChild(addButton);
  buttonsWrapper.appendChild(xmark);
}
