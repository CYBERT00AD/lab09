const socket = io();

const chatForm = document.getElementById('chatForm');
const messageInput = document.getElementById('messageInput');
const messages = document.getElementById('messages');
const fileInput = document.getElementById('fileInput');
const sendFileBtn = document.getElementById('sendFileBtn');

const colors = ['#e74c3c', '#3498db', '#2ecc71', '#9b59b6', '#f1c40f', '#e67e22', '#1abc9c'];

function getOrCreateUserData() {
  const stored = localStorage.getItem('chatUserData');
  if (stored) {
    return JSON.parse(stored);
  }

  const randomId = Math.floor(Math.random() * 10000);
  const username = `User${randomId}`;
  const color = colors[Math.floor(Math.random() * colors.length)];

  const data = { username, color };
  localStorage.setItem('chatUserData', JSON.stringify(data));
  return data;
}

const userData = getOrCreateUserData();

socket.on('connect', () => {
  socket.emit('identify', {
    username: userData.username,
    color: userData.color
  });
});

function addTextMessage(username, color, text) {
  const li = document.createElement('li');

  const nameSpan = document.createElement('span');
  nameSpan.textContent = `${username}: `;
  if (color) {
    nameSpan.style.color = color;
    nameSpan.style.fontWeight = 'bold';
  }

  const textSpan = document.createElement('span');
  textSpan.textContent = text;

  li.appendChild(nameSpan);
  li.appendChild(textSpan);
  messages.appendChild(li);
}

function addFileMessage(username, color, fileName, fileType, url) {
  const li = document.createElement('li');

  const nameSpan = document.createElement('span');
  nameSpan.textContent = `${username}: `;
  if (color) {
    nameSpan.style.color = color;
    nameSpan.style.fontWeight = 'bold';
  }
  li.appendChild(nameSpan);

  if (fileType && fileType.startsWith('image/')) {
    const img = document.createElement('img');
    img.src = url;
    img.alt = fileName;
    img.style.maxWidth = '200px';
    li.appendChild(img);
  } else {
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.textContent = `файл: ${fileName}`;
    li.appendChild(a);
  }

  messages.appendChild(li);
}

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const text = messageInput.value.trim();
  if (!text) return;

  socket.emit('chat message', text);
  messageInput.value = '';
});

sendFileBtn.addEventListener('click', () => {
  const file = fileInput.files[0];
  if (!file) {
    alert('Выберите файл');
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    const arrayBuffer = reader.result;
    const bytes = new Uint8Array(arrayBuffer);

    socket.emit('file message', {
      fileName: file.name,
      fileType: file.type,
      fileData: Array.from(bytes)
    });

    fileInput.value = '';
  };
  reader.readAsArrayBuffer(file);
});

socket.on('chat message', (data) => {
  addTextMessage(data.username, data.color, data.text);
});

socket.on('file message', (data) => {
  const bytes = new Uint8Array(data.fileData);
  const blob = new Blob([bytes], { type: data.fileType || 'application/octet-stream' });
  const url = URL.createObjectURL(blob);

  addFileMessage(data.username, data.color, data.fileName, data.fileType, url);
});