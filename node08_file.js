// fs : 파일의 내용을 읽고, 쓰기를 할 수 있는 모듈 FileSystem
// fs라는 모듈을 추가하여야 한다. 콘솔에서 해당프로젝트 구현
// > npm install fs
const fs = require("fs");
var http  = require('http');

// 파일 입출력을 하기 위해서 해당파일의 경로 + 파일명이 필요하다.

// [노드 전체의 전역변수]
// [1] __filename : 현재 실행되는 파일의 경로와 파일명을 절대주소로 가지고 있다.
// [2] __dirname : 현재 실행되는 파일의 경로를 절대주소로 가지고 있다.

console.log("__filename -> " + __filename);
console.log("__dirname -> " + __dirname);

// 비동기식으로 파일 읽는 방법 : 읽기, 쓰기 명령이 바로 실행되지 않고 스레드로 처리된다.
fs.readFile(`${__dirname}/index.js`,'utf-8', function(error, data){
    // fs.readFile(경로, 인코딩, 실행함수(에러, 읽은내용));
    if(!error){
        console.log("파일 읽기 : 비동기식");
        console.log(data);
    } else {
        console.log("파일 읽기 에러..");
    }
});

// 동기식으로 파일 읽는 방법 : 읽기, 쓰기 명령을 만나면 바로 실행된다.
var data = fs.readFileSync(`${__dirname}/tests/test.txt`, 'utf-8');
console.log("파일 읽기 : 동기식 ___________________________________________________");
console.log(data);

// var server = http.createServer(function(req, res) {
//     // 접속 주소 구하기
//
//     res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
//
// })
//
//
// server.listen(10012, function(){
//     console.log('server start ... http://localhost:10012/');
// })