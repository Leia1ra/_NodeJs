// 홈페이지내용을 index.html의 문자로 사용하기

var http = require('http');
var fs = require('fs');

// 마임을 구하기 위한 모듈 다운로드 받기
// npm install mime@2
var mime = require('mime');

http.createServer((req, res) => {
    var url = req.url;
    // index.html을 읽어서 클라이언트에게 보내기
    if(url === '/index'){
        fs.readFile(`${__dirname}/index.html`, 'utf-8', function(err, data){
            res.writeHead(200, {'content-Type' : 'text/html; charset=utf-8'});
            if(!err){
                res.end(data);
            } else {
                console.log("에러");
            }
        });
    } else if(url.indexOf('/tests') === 0){// 접속주소가 이미지이면 /img로 시작한다.
        // 마임을 알아내서 파일의 종류를 구분하여 response에 쓰기를 한다.
        var mimeType = mime.getType(url.substring(1));
        console.log(mimeType);
        console.log(`${__dirname}${url}`);
        fs.readFile(`${__dirname}${url}`,function (err, data){
            if(!err){
                res.writeHead(200, {'content-Type':mimeType});
                res.end(data);
            }
        });
    }


}).listen(10014, function(){
    console.log('server start ... http://localhost:10014/index');

})