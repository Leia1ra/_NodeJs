var http = require('http');

var server = http.createServer(function (req, res) {
    var postData = '';
    // Post방식으로 서버에 접속을 하면 자동으로 Data란 이벤트가 발생한다.
    // post방식으로 서버에 접속하여 데이터를 보내는 작업 완료되면 end이벤트가 발생한다.
    //     이벤트 종류, 이벤트시 실행함수(서버로 넘어온 데이터)
    req.on('data', function (receiveData) {
        postData += receiveData;
    });
    // Post방식으로 서버에 접속하여 데이터 보내는 작업이 완료되면 end이벤트가 발생한다.
    req.on('end', function(){
        console.log(postData);
        var postParams = new URLSearchParams(postData);
        console.log(postParams);

        res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
        res.write(`<ol><li>번호 : ${postParams.get("no")}</li>`);
        res.write(`<li>제목 : ${postParams.get("title")}</li>`);
        res.end(`<li>글 내용 : ${postParams.get("content")}</li></ol>`);
    })
})

server.listen(10004,function () {
    console.log("server start ... ... http://localhost:10004/");
})