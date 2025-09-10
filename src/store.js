let nextId = 1;
let items = [];

function listItems() {
  return items.slice();
}

function createItem(data) {
  const name = (data?.name ? String(data.name) : '').trim();

  if (!name) throw new Error('Name is required');
  const item = { id: nextId++, name };
  items.push(item);
  return item;
}

function getItem(id) {
  const numId = Number(id);
  if (!Number.isInteger(numId) || numId <= 0) return null;
  return items.find((i) => i.id === numId) || null;
}

function updateItem(id, data) {
  const item = getItem(id);
  if (!item) return null;
  if (data && typeof data.name !== 'undefined') {
    const name = String(data.name).trim();
    if (!name) throw new Error('Name is required');
    item.name = name;
  }
  return item;
}

function deleteItem(id) {
  const numId = Number(id);
  const idx = items.findIndex((i) => i.id === numId);
  if (idx === -1) return false;
  items.splice(idx, 1);
  return true;
}

function searchItems(q) {
  const term = (q || '').toString().trim().toLowerCase();
  if (!term) return [];
  return items.filter((i) => i.name.toLowerCase().includes(term));
}

// For tests
function resetStore() {
  nextId = 1;
  items = [];
}

module.exports = {
  listItems,
  createItem,
  getItem,
  updateItem,
  deleteItem,
  searchItems,
  resetStore,
};
