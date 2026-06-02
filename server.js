const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const restRoutes = require('./rest');
const store = require('./store');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  const items = store.getAllItems();
  res.render('index', { items });
});

app.get('/chat', (req, res) => {
  res.render('chat');
});

app.post('/add', (req, res) => {
  const items = store.getAllItems();
  const newId = items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;

  const newItem = {
    id: newId,
    name: req.body.name,
    description: req.body.description
  };

  store.addItem(newItem);
  res.redirect('/');
});

app.post('/update', (req, res) => {
  const id = Number(req.body.id);

  store.updateItem(id, {
    name: req.body.name,
    description: req.body.description
  });

  res.redirect('/');
});

app.post('/delete', (req, res) => {
  const id = Number(req.body.id);
  store.deleteItem(id);
  res.redirect('/');
});

app.use('/', restRoutes);

io.on('connection', (socket) => {
  socket.data.username = 'User';
  socket.data.color = '#000000';

  socket.on('identify', (data) => {
    socket.data.username = data.username;
    socket.data.color = data.color;
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', {
      username: socket.data.username,
      color: socket.data.color,
      text: msg
    });
  });

  socket.on('file message', (data) => {
    io.emit('file message', {
      username: socket.data.username,
      color: socket.data.color,
      fileName: data.fileName,
      fileType: data.fileType,
      fileData: data.fileData
    });
  });
});

server.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
});