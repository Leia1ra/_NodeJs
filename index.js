/*
    node.js는 이벤트기반 서버 프레임워크이다.
    모듈을 객체로 생성하여 사용할 수 있다.
*/  // 서버를 생성하여 접속을 받을 수 있도록 페이지 생성하기

// 1. http모듈을 생성하기
var http = require('http');

// 2. http모듈을 이용하여 서버를 생성한다.
var server
    = http.createServer(function (request, response) {
    // 접속한 클라이언트에게 응답하기 response에 쓰기를 하면 웹 브라우저에서 받아서 웹페이지로 보여준다.
    // 1. Content-Type 설정하기
    response.writeHead(200, {'Content-Type':'text/html; charset=utf-8'})
    // 2. 웹 페이지 내용 보내기
    response.write("<h1 style='color: red;'>노드 서버에서 보낸 컨텐츠</h1>");
    response.write("<p>http모듈을 이용하여 객체를 생성후 server를 생성</p>");
    // 3. 마지막을 알리는 함수 호출
    response.end("End...");
});

// 3. 접속을 대기하는 이벤트 처리
server.listen(3000, function () {
    console.log("server start... http://localhost:3000")
});