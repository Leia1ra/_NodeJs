var http= require('http');

var server = http.createServer(function(req, res) {
    // 접속 주소 구하기
    var url = req.url
    res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
    if(url == '/'){
        res.end("<h1>홈페이지</h1>");
    } else if(url == '/username'){
        res.end("<h1>이름 : 이선왕</h1>");
    } else if(url == '/tel'){
        res.end("<h1>연락처 : 010-1234-1234</h1>");
    } else if(url == '/address'){
        res.end("<h1>주소 : 함평군</h1>");
    } else {
        res.end("<h1>404 Page</h1>");
    }
})

server.listen(10010, function(){
    console.log('server start ... http://localhost:10010/');
    console.log('server start ... http://localhost:10010/username');
    console.log('server start ... http://localhost:10010/tel');
    console.log('server start ... http://localhost:10010/address');
})