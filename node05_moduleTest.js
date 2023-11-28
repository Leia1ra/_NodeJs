var http = require('http');

// 사용자 정의 모듈 가져오기
var myModule = require('./node04_module');

var server = http.createServer(function (req, res) {
    var param = req.url
    var params = param.substring(param.indexOf("?")+1);
    var getParams = new URLSearchParams(params);
    let n1 = getParams.get('n1');
    let n2 = getParams.get('n2');
    let dan = getParams.get('dan');

    res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'})
    var tag = `<div>상품코드 : ${myModule.productCode}</div>`;
    tag += `<div>상품코드 : ${myModule.productName}</div>`;
    tag += `<div>합(${n1}, ${n2}) = ${myModule.sum(n1,n2)}</div>`
    tag += `<div>합(${n1}, ${n2}) = ${myModule.minus(n1,n2)}</div>`
    tag += `<div>${myModule.gugudan(dan)}</div>`
    res.write(tag);
});

server.listen(10006, function(){
    console.log("server start ... ... http://localhost:10006/?n1=12&n2=5&dan=7");

})