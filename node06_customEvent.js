var http = require('http');
// 1. 이벤트가 정의되어있는 모듈을 객체 생성한다.
var events = require('events');
// 2. 이벤트 처리를 하기 위해서 events모듈 내에 있는 EventEmmiter를 초기화 해야한다.
var eventEmitter = new events.EventEmitter();
// 3. 이벤트가 발생하면 실행할 함수를 만든다. on, addListener(), once()
// 동시식?
eventEmitter.on('call',() => {
    console.log('call이벤트가 발생하였습니다.');
});

//                                       비동기식?
eventEmitter.addListener('check', function(){
    console.log("check이벤트가 발생하였습니다.");
})

// 한번만 실행됨
eventEmitter.once('test', function () {
    console.log('onceEvent');
})


var server = http.createServer(function (req, res) {
    eventEmitter.emit('call');
    eventEmitter.emit('check');
    eventEmitter.emit('test');
    res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
    res.end("노드에서 이벤트 테스트중...");
});

server.listen(10008, function(){
    console.log("server start ... ... http://localhost:10008");

})