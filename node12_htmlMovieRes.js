var http = require('http');
var fs = require('fs');
var server = http.createServer(function (req, res) {
    var mapping = req.url;
    if(mapping === '/'){
        fs.readFile(`${__dirname}/movie.html`,'utf-8',function(err, data){
            if(!err){
                res.writeHead(200,{'content-Type':'text/html; charset=utf-8'});
                res.end(data);
            }
        })
    } else if(mapping.indexOf('/tests') === 0){
        // 스트리밍 : 동영상은 파일의 용량이 크므로 한번에 전송하지 않고 여러번 나누어 전송한다.
        // 1. 스트리밍 처리를 위한 객체 생성하기
        var stream = fs.createReadStream(mapping.substring(1));

        // 2. data이벤트 : 영상파일이 읽어지면 data 이벤트가 발생한다.
        var cnt = 1;
        stream.on('data', function (movieData) {
            res.write(movieData);
            console.log(cnt++, movieData.length);
        });

        // 3. end이벤트 : 데이터가 마지막으로 read 될 때 발생하는 이벤트.
        stream.on('end', function () {
            res.end();
            console.log('전송 완료');
        })

        // 4. error이벤트 : 읽기 처리시 에러가 발생하먼 처리할 이벤트
        stream.on('error', function(){
            res.end();
            console.log('error Stream');
        })
    }
});

server.listen(10016,function () {
    console.log('server start ... http://localhost:10016/');

})