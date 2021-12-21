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

// 가짜 DB (= 메시지를 보낼 각각의 브라우저들)
// => 연결 후 받은 메시지들(socket)을 크롬과 파이어폭스 두 브라우저에 모두 전달 가능 (전역관리 느낌) / 꼭 브라우저가 다른 종류가 아니더라도 크롬 창 2개를 띄워서 해도 같은 결과
// => 각각의 다른 브라우저에 메시지를 전달할 수 있다 = 채팅할 때 받는 사람과 보내는 사람 모두에게 메시지를 띄울 수 있다!
const sockets = [];

// server.js의 socket = 연결된 브라우저(클라이언트)
// Frontend와 요청 및 응답을 주고받기 위한 소켓
wss.on('connection', (socket) => {
  // 누군가 서버에 연결하면 그 connection을 가짜 DB 배열에 넣음
  sockets.push(socket); // socket = 서버에 연결된 클라이언트(브라우저)쪽의 사용자

  // 브라우저에 연결되자마자 콘솔 출력
  console.log('connected to Browser');

  // on = Listener
  // 서버가 끊겼을 때를 대비한 Listener
  socket.on('close', () => console.log('disconnected from the Browser'));

  // 서버가 메시지를 (받아서) 클라이언트에게 보낼 때를 위한 Listener
  socket.on('message', (message) => {
    // form으로 받은 메시지를 프론트에 다시 보냄
    // (= 카톡에서 메시지를 쳐서 엔터를 누르면 서버가 그 메시지를 받고
    // (어딘가에 저장하고) 다시 보내줘서 사용자 쪽에서 자신이 작성한 메시지를 화면에서 볼 수 있음)
    // socket.send(message.toString('utf8'));

    // 가짜 DB 활용
    // 메시지를 보낸 socket에 다시 메시지를 전달하는 대신 (=> 이렇게 하면 한 브라우저에게밖에 전달이 안됨)
    // 각 브라우저들에게 메시지를 보낸다 (=> 여러 브라우저에 메시지 전달 가능)
    sockets.forEach((aSocket) => {
      aSocket.send(message.toString('utf8'));
    });
  });

  // send: 실제 브라우저에 메시지를 보냄
  // socket.send('hello!!');
});

server.listen(3000, handleListen);
