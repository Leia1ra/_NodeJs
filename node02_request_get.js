var http = require('http');

var server = http.createServer(function (req, res) {
    // 클라이언트 측에서 서버로 보낸 정보는 requset객체 내의 url변수가 가지고 있다.
    console.log(req.url);

    var data = req.url;
    var idx = data.indexOf('?'); //?의 위치를 구하고-> ?다음 문자부터 문자를 구한다.
    var param = data.substring(idx+1);
    console.log(param);

    // URLSearchParams 문자열로 되어잉ㅆ는 쿼리데이터를 처리하는 클래스
    var params = new URLSearchParams(param);
    console.log(params);

    res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'})
    res.write("<h2>서버에서 Get방식으로 Request한 데이터</h2>")
    res.write("<div>번호 " + params.get('num')+ "</div>");
    res.write("<div>이름 " + params.get('name')+ "</div>");
    res.write(`<div>연락처 ${params.get('tel')}</div>`);
    // res.end("end");

    res.write("<hr><h2>Post방식 전송 확인용 Form</h2>")
    res.write(`<form method="post" action="http://localhost:10004">`);
    res.write("<label>번호 : <input type='text' name='no'></label><br>");
    res.write("<label>이름 : <input type='text' name='name'></label><br>");
    res.write("<label>연락처 : <input type='text' name='tel'></label><br>");
    res.write("<label>글내용 : <br> <textarea name='content' rows='5' cols='50'></textarea></label><br>");
    res.write(`<input type="submit" value="보내기">`);

    res.end(`</form>`);
})

server.listen(10002,function () {
    console.log("server start ... ... http://localhost:10002/?num=1234&name=hong&tel=010-1234-3333");
})