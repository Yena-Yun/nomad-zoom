// 이 프로젝트에서 Express가 하는 일은 매우 간단: pug로 만들어진 views를 설정 후 3000번 서버에 렌더하는 역할뿐 (나머지는 websocket에서 실시간으로 일어남)
import http from 'http';
import WebSocket from 'ws';
import express from 'express';

const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views'); // __dirname = 'src'
app.use('/public', express.static(__dirname + '/public'));
app.get('/', (req, res) => res.render('home'));
app.get('/*', (req, res) => res.redirect('/'));

const handleListen = () => console.log(`Listening on http://localhost:3000`);
// app.listen(3000, handleListen);

const server = http.createServer(app); // http 서버 (pug 뷰, 라우터)
const wss = new WebSocket.Server({ server }); // 웹소켓 서버 (실시간 통신)
// 둘 중에 하나만 써도 되는데 이 프로젝트에서는 하나의 포트 안에 http와 웹소켓을 모두 처리하고 있어서 두 개를 한번에 사용

// server.js의 socket = 연결된 브라우저(클라이언트)
// Frontend와 요청 및 응답을 주고받기 위한 소켓
wss.on('connection', (socket) => {
  // 브라우저에 연결되자마자 콘솔 출력
  console.log('connected to Browser');

  // on = Listener
  // 서버가 끊겼을 때를 대비한 Listener
  socket.on('close', () => console.log('disconnected from the Browser'));

  // 서버가 메시지를 보낼 때를 위한 Listener
  socket.on('message', (message) => {
    console.log(message.toString('utf8'));
  });

  // send: 실제 브라우저에 메시지를 보냄
  socket.send('hello!!');
});

server.listen(3000, handleListen);
