// 이미지 파일을 클라이언트에게 보내기
var http = require('http');
var fs = require('fs');

var server = http.createServer((req, res) => {
    //이미지를 읽어 클라이언트(response)에 쓰기
    fs.readFile(`${__dirname}/tests/Testimg.png`,function(e, imgSrc){
        res.writeHead(200, {'content-Type':'image/png'});// 마임(image/jpeg 등등..)
        res.end(imgSrc);

    })
}).listen(10014, function () {
    console.log('server start ... http://localhost:10014/');
})