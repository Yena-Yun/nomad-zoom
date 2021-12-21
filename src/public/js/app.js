const messageList = document.querySelector('ul');
const nickForm = document.querySelector('#nick');
const messageForm = document.querySelector('#message');

// MDN: var aWebSocket = new WebSocket(url [, protocols]);
// app.js의 socket: 서버로의 연결(Backend와 요청 및 응답을 주고받기 위한 소켓)
const socket = new WebSocket(`ws://${window.location.host}`);
// url에서 http 부분을 ws로 대체 + 현재 위치를 의미하는 location.host를 넣어줌 (localhost:3000 넣으면 웹만 해당되어서 모바일은 못씀)
// (브라우저 console에 window.location 치면 location 객체 볼 수 있음)

// 아래 3개: event가 발생하길 '기다리고 있다가' 해당 이벤트가 발생하면 콜백함수 실행
// socket open = 서버에 연결됨
socket.addEventListener('open', () => {
  console.log('browser connected to server!');
});

// 서버로부터 메시지를 받으면 실행됨
socket.addEventListener('message', (message) => {
  console.log('New message:', message.data);
  const li = document.createElement('li');
  li.innerText = message.data;
  messageList.append(li);
});

socket.addEventListener('close', () => {
  console.log('disconnected from server');
});

// 서버에게 데이터를 보냄 (addEventListener X, 기다리고 있다가 받는 수동적인 입장이 아니라 사용자가 엔터를 침으로써 서버에게 보낼 때를 정할 수 있으므로 Listener를 쓰지 않는다)
function makeMessage(type, payload) {
  const msg = { type, payload };
  // 그냥 msg는 JS 객체상태 => 백엔드는 JS 언어를 이해하지 못함: [object Object]로 뜸 => 백엔드가 이해할 수 있는 string 형태로 보내야 한다
  // (또는 보안적인 이유도 있음: 서버가 JS로 되어있는데 예를 들어 Go로 JS 객체를 받으면 누군가가 Go를 이용해 서버에 접속하려 할 수 있음)
  // WebSocket은 브라우저에 있는 API임 / 백엔드에서는 다양한 프로그래밍 언어를 사용할 수 있기 때문에 이 브라우저의 API는 어떠한 판단도 하면 안 됨 (결정은 백엔드에서 / 프론트에서 데이터를 string 형태로 바꿔 보내면 그걸 가지고 백엔드에서 하고 싶은 것을 함)
  return JSON.stringify(msg);
  // (JSON이라는 건 객체 안에 key: value 형태로 들어있다는 것)
  // 예: { type: 'nickname', payload: input.value }
}

// nickname을 변경하고 싶을 때 백엔드로 보내는 메시지
const handleNickSubmit = (e) => {
  e.preventDefault();
  const input = nickForm.querySelector('input');
  socket.send(makeMessage('nickname', input.value));
};

// chat으로 보내는 메시지
const handleSubmit = (e) => {
  e.preventDefault();
  const input = messageForm.querySelector('input');
  socket.send(makeMessage('message', input.value));
  input.value = '';
};

// 서버로 input창의 내용을 submit
nickForm.addEventListener('submit', handleNickSubmit);
messageForm.addEventListener('submit', handleSubmit);

// 시간 지연을 주기 위해 setTimeout 사용
// 10초 뒤에 서버에게 메시지를 보냄
// setTimeout(() => {
//   socket.send('hello from the browser');
// }, 5000);
