let http = require('http');
let fs = require('fs');
var head = {'content-Type' :'text/html; charset=utf-8'};

let server = http.createServer(function (req, res) {
    if(req.url==='/chat'){
        fs.readFile(`${__dirname}/roomChat.html`, 'utf-8', function (err, data) {
            if(!err){
                res.writeHead(200, head);
                res.end(data);
            }
        })
    }
}).listen(10026, function () {
    console.log('server Start... http://127.0.0.1:10026/chat');
})

/* 채팅 */
// let socketio = require('socket-io');
let socketio = require('socket.io');
let io = socketio.listen(server)

// 접속대기
io.sockets.on('connection',function (socket) {
    let rName;
    // 방 생성 이벤트
    socket.on('join',function (roomName) {
        // 방 만들기
        // 룸 이름을 접속 socket에 조인하면 서로 문자를 주고 받을 수 있다.
        socket.join(roomName);
        rName = roomName;
        io.sockets.in(rName).emit('response',`${rName}방이 만들어졌습니다.`);
    })
    // 메시지 전송 이벤트
    socket.on('sendMessage', function (receive){
        //같은 룸 접속자에게 문자 보내기
        io.sockets.in(rName).emit('response', `${rName} -> ${receive} (${new Date()})`);
    });
})

