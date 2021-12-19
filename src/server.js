// 이 프로젝트에서 Express가 하는 일은 매우 간단: pug로 만들어진 views를 설정 후 3000번 서버에 렌더하는 역할뿐 (나머지는 websocket에서 실시간으로 일어남)
import express from 'express';

const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views'); // __dirname = 'src'
app.use('/public', express.static(__dirname + '/public'));
app.get('/', (req, res) => res.render('home'));
app.get('/*', (req, res) => res.redirect('/'));

const handleListen = () => console.log(`Listening on http://localhost:3000`);
app.listen(3000, handleListen);
