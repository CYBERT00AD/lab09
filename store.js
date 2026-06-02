const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'db.json');

function readData() {
  const data = fs.readFileSync(dbPath, 'utf8');
  return JSON.parse(data);
}

function writeData(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
}

function getAllItems() {
  return readData();
}

function getItemById(id) {
  const items = readData();
  return items.find(item => item.id === id);
}

function addItem(item) {
  const items = readData();
  items.push(item);
  writeData(items);
}

function updateItem(id, newData) {
  const items = readData();
  const index = items.findIndex(item => item.id === id);

  if (index === -1) {
    return false;
  }

  items[index] = { ...items[index], ...newData, id };
  writeData(items);
  return true;
}

function deleteItem(id) {
  const items = readData();
  const newItems = items.filter(item => item.id !== id);

  if (items.length === newItems.length) {
    return false;
  }

  writeData(newItems);
  return true;
}

module.exports = {
  getAllItems,
  getItemById,
  addItem,
  updateItem,
  deleteItem
};