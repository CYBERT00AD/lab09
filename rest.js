const express = require('express');
const store = require('./store');

const router = express.Router();

router.get('/items', (req, res) => {
  res.json(store.getAllItems());
});

router.get('/items/:id', (req, res) => {
  const id = Number(req.params.id);
  const item = store.getItemById(id);

  if (!item) {
    return res.status(404).send('Запись не найдена');
  }

  res.json(item);
});

router.post('/items', (req, res) => {
  const items = store.getAllItems();
  const newId = items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;

  const newItem = {
    id: newId,
    name: req.body.name,
    description: req.body.description
  };

  store.addItem(newItem);
  res.status(201).json(newItem);
});

router.put('/items/:id', (req, res) => {
  const id = Number(req.params.id);

  const success = store.updateItem(id, {
    name: req.body.name,
    description: req.body.description
  });

  if (!success) {
    return res.status(404).send('Запись не найдена');
  }

  res.send('Запись обновлена');
});

router.delete('/items/:id', (req, res) => {
  const id = Number(req.params.id);
  const success = store.deleteItem(id);

  if (!success) {
    return res.status(404).send('Запись не найдена');
  }

  res.send('Запись удалена');
});

module.exports = router;