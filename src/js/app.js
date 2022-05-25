import Card from './card';
import createForm from './newCardForm';

// localStorage.clear();

const addFormsLinks = document.querySelectorAll('.add-link');
[...addFormsLinks].forEach((item) => item.addEventListener('click', (e) => createForm(e)));

const cards = JSON.parse(localStorage.getItem('cards'));

if (cards) {
  cards.forEach((item) => new Card(item.id, item.columnIndex, item.title).createNewCard());
}
