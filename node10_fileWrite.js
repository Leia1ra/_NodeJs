var fs = require('fs');

// 1. 비동기식 쓰기
var writeData = "비동기식으로 파일에 쓰기 연습중, \r\n줄바꿈 확인하기...";
fs.writeFile(`${__dirname}/tests/fileWrite.txt`, writeData, 'utf-8', function(error){
    if(error){
        console.log("에러발생");
    } else {
        console.log("쓰기완료");
    }
});

// 2. 동기식 쓰기
var writeDataSync = "동기식으로 fileWrite";
try{
    fs.writeFileSync(`${__dirname}/tests/fileWriteSync.txt`, writeDataSync, 'utf-8')
    console.log('동기식 쓰기 완료');
} catch (err){
    console.log(`동기식 쓰기 에러 발생 : ${err}`);
}
