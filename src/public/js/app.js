// var aWebSocket = new WebSocket(url [, protocols]);
const socket = new WebSocket(`ws://${window.location.host}`); // url에서 http 부분을 ws로 대체하고 url에는 현재 위치를 의미하는 location.host를 넣어준다 (그냥 localhost:3000 넣으면 모바일에서 못씀)

// app.js의 socket: 서버로의 연결(Backend와 요청 및 응답을 주고받기 위한 소켓)
console.log(socket);
