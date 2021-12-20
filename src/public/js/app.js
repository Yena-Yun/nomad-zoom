// MDN: var aWebSocket = new WebSocket(url [, protocols]);
// app.js의 socket: 서버로의 연결(Backend와 요청 및 응답을 주고받기 위한 소켓)
const socket = new WebSocket(`ws://${window.location.host}`);
// url에서 http 부분을 ws로 대체 + 현재 위치를 의미하는 location.host를 넣어줌 (localhost:3000 넣으면 웹만 해당되어서 모바일은 못씀)
// (브라우저 console에 window.location 치면 location 객체 볼 수 있음)

// socket이 open되면 서버에 연결됨
socket.addEventListener('open', () => {
  console.log('browser connected to server!');
});

socket.addEventListener('message', (message) => {
  console.log('New message:', message.data);
});

socket.addEventListener('close', () => {
  console.log('disconnected from server');
});

// 시간 지연을 주기 위해 setTimeout 사용
// 10초 뒤에 서버에게 메시지를 보냄
setTimeout(() => {
  socket.send('hello from the browser');
}, 5000);
