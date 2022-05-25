export function addCardToLocalStorage(card) {
  let cards = JSON.parse(localStorage.getItem('cards'));
  if (!cards) cards = [];

  const repeatElem = cards.find((item) => item.id === card.id);

  if (repeatElem) {
    cards = cards.map((item) => {
      if (item === repeatElem) {
        const newItem = item;
        newItem.columnIndex = card.columnIndex;
        return newItem;
      }
      return item;
    });
  } else cards.push(card);

  localStorage.setItem('cards', JSON.stringify(cards));
}

export function removeCardFromLocalStorage(card) {
  const cards = JSON.parse(localStorage.getItem('cards'));

  if (!cards) return;

  const removedCardIndex = cards.findIndex((item) => item.id === card.id);
  cards.splice(removedCardIndex, 1);

  localStorage.setItem('cards', JSON.stringify(cards));
}

export function checkCardId(id) {
  const cards = JSON.parse(localStorage.getItem('cards'));

  if (!cards) return true;

  if (cards.find((item) => item.id === id)) {
    return false;
  }
  return true;
}
