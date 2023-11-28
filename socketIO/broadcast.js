var http = require('http');
var fs = require('fs');
const {listen} = require("express/lib/application");

var head = {'content-Type' :'text/html; charset=utf-8'};

var server = http.createServer(function (req, res) {
    if (req.url=='/chatForm'){
        fs.readFile(`${__dirname}/chat.html`,'utf-8', function (err, data) {
            if(!err){
                res.writeHead(200, head);
                res.end(data);
            }
        })
    }
})

server.listen(10024, function () {
    console.log('server Start... http://127.0.0.1:10024/chatForm');
})

/* 채팅프로그램 만들기 */
// npm install socket.io@2
// 1. 필요한 모듈 객체를 만든다.
var socketio = require('socket.io');

// 2. 현재 서버를 이용한 소켓서버를 생성한다.
var io = socketio.listen(server);

// 3. 접속을 대기하는 이벤트를 생성
io.sockets.on('connection', function(socket){
    console.log('클라이언트가 접속함');

    //hello 이벤트가 발생 : 클라이언트가 보낸 문자를
    socket.on('hello', function (msg) {
        console.log(msg);

        // hi이벤트 발생 : 서버가 클라이언트에게 문자 보내기
        // [1] 1:1 통신 :
        // socket.emit('hi', `[1:1통신]>>${msg}`);
        // [2] 1:N 통신 : 모든 접속자에세 문자 보내기
        // io.sockets.emit('hi', `[[public]] >> ${msg}`);
        // [3] broadcast : 나를 제외한 모든 접속자에게 데이터 보내기
        socket.broadcast.emit('hi', `[[broadcast]] >> ${msg}`);
    })
})