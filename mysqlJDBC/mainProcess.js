var http = require('http');
var fs = require('fs');
// express 모듈 : 클라이언트 get, post방식으로 접속할 때 접속을 받아내는 함수 : get(), post() // npm install express
var express = require('express');
// const {text} = require("express");

// session 객체를 추가하기 위한 모듈 // npm install express-session
var session = require('express-session');

// 서버 생성
var app = express();
var server = http.createServer(app);

// ejs 파일 사용 (Embed Java Script) // npm install ejs
var ejs = require('ejs');

// 사이트 접속자의 ip를 구하는 모듈 // npm install request-ip
var requestIp = require('request-ip');


// POST 방식의 접속시 request를 위한 설정
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));// 한글 인코딩


// mysql Connection // npm install mysql2
var mysqldb = require('mysql2');
var connection = mysqldb.createConnection({
    host:'localhost',
    port:3306,
    user:'root',
    password:'tiger1234',
    database:'_JSP'
});
connection.connect(); // DB 연결



// 홈 http://localhost:10018/index
var head = {'content-Type' :'text/html; charset=utf-8'};
app.get('/index', function (req, res) {
    if(session.user == undefined || session.user == null){
        res.render(`${__dirname}/index.ejs`,{logStatus : 'N'});
    } else {
        res.render(`${__dirname}/index.ejs`,{
            user : session.user,
            logStatus : 'Y'
        });
    }

    /*fs.readFile(__dirname+'/index.ejs', function (err, data) {
        if(!err){
            res.writeHead(200, head);
            res.end(data);
        }
    })*/
})

// 로그인 http://localhost:10018/login
app.get('/login', function (req, res) {
    fs.readFile(`${__dirname}/login.html`, function (err, data) {
        if(!err){
            res.writeHead(200, head);
            res.end(data);
        }
    })
})



/* Login Action Page*/
app.post('/loginOk', function(req, res){
    var userid = req.body.userid;
    var userpwd = req.body.userpwd;
    console.log(userid, userpwd);

    // db 조회
    var sql = "SELECT * FROM users WHERE userid=? AND userpwd=?";

    // 쿼리문 실행      쿼리문, 데이터 배열       , 콜백함수(select문 실행후 호출)
    connection.execute(sql, [userid, userpwd], function(err, result, fields){
        if(err){//쿼리문 수행시 에러 발생하면 로그인 폼으로 이동
            // history.back();
            res.redirect('/login');
        } else { // 쿼리 정상 수행
            console.log(result);
            if(result.length > 0){
                session.user = {
                    userid : result[0].userid,
                    username : result[0].username,
                    authorized : true // 인증받은
                }
                // ejs 파일을 읽어 데이터와 함깨 보내기
                fs.readFile(`${__dirname}/index.ejs`,'utf-8', function (err, data) {
                    if(err){
                        res.writeHead(200, head);
                        res.end("404 Page");
                    } else {
                        res.render(`${__dirname}/index.ejs`,{
                            user:session.user,
                            logStatus : 'Y'
                        })
                        // res.redirect('/index');
                        /*res.end(ejs.render(data, {
                            user : session.user,
                            logStatus : "Y",
                        }));*/
                    }
                });
                // res.redirect("");
            } else {
                res.redirect('/login');
            }
        }
    });
})

/* LogOut Action Page */
app.get('/logout', function (req, res) {
    console.log(`로그아웃 시작 ${session.user}`);
    if(session.user){
        session.user = null;
    }
    console.log(`로그아웃 종료 ${session.user}`);
    res.redirect("/index");
})

/* board Page */
app.get('/boardList', function (req, res) {
    var sql = "SELECT b.no, b.subject, b.userid, u.username, b.hit, date_format(b.writedate, '%m-%d %H:%i') writedate FROM board b JOIN users u on b.userid = u.userid ORDER BY b.no DESC"

    connection.execute(sql, function (err, result, fields) {
        if(!err){
            console.log(result);
            var totalRecord = result.length;
            res.render(`${__dirname}/list.ejs`,{
                records:result,
                totalRecord:totalRecord,
                pageNum:3
            })
        }
    })
})

/* board write */
app.get('/write', function (req, res) {
    // 로그인 여부 확인

    if(session.user == undefined || session.user == null){// 로그인인 안된 경우
        res.writeHead(200, head);
        res.write("<script>");
        res.write("alert('로그인 후 글쓰기가 가능합니다.');");
        res.write("location.href='/login';");
        res.end("</script>")
    } else {// 로그인이 된 경우
        fs.readFile(`${__dirname}/write.ejs`,'utf-8', function (err, data) {
            if(!err){
                res.writeHead(200, head);
                res.end(data);
            }
        })
    }
})

/* board write Action */
app.post('/writeOk',function (req,res) {
    // 데이터 준비
    var subject = req.body.subject;
    var content = req.body.content;
    var userid = session.user.userid;
    var ip = requestIp.getClientIp(req).substring(7);
    console.log(ip);
    var sql = "INSERT into board(subject, content, userid, ip) VALUES(?,?,?,?)"
    var bindData = [subject, content, userid, ip];

    connection.execute(sql,bindData, function (err, result, fields) {
        console.log(result);
        if(!err && result.affectedRows === 1){
            res.redirect("/boardList");
        } else {
            res.writeHead(200, head);
            res.write("<script>");
            res.write("alert('글등록이 실패하였습니다.');");
            res.write("history.back();");
            res.end("</script>")
        }
    });

})

app.get('/view', function (req, res) {
    let query = req.url.substring(6);
    let params = new URLSearchParams(query);
    // console.log(req.body.no);
    let no = params.get('no');
    console.log(no);
    // 조회수
    connection.execute('UPDATE board SET hit = hit + 1 WHERE no=?', [no], function (err, result, fields) {
        console.log("조회수 증가");
    })

    // 레코드 선택
    var sql = "SELECT no, subject, content, hit, writedate, userid FROM board WHERE no=?";
    connection.execute(sql,[no], function (err, result, fields) {
        console.log(result);
        if(err){
            res.redirect("/boardList");
        } else {
            var logCheck = "N";
            if(session.user !== undefined && session.user !== null && result[0].userid === session.user.userid){
                logCheck = "Y";
            }
            res.render(`${__dirname}/view.ejs`,{
                result:result,
                logCheck:logCheck
            });
        }
    });
})

/* edit page */
app.get('/edit',function (req, res) {
    var no = req.url.substring(req.url.indexOf("?")+1);
    console.log(no);
    var params = new URLSearchParams(no);
    var sql = "SELECT no, subject, content FROM board WHERE no=?";
    connection.execute(sql,[params.get('no')], function (err, result, fields) {
        console.log(result);
        if(err){
            res.redirect(`/view?no=${params.get('no')}`);
        } else {
            res.render(`${__dirname}/edit.ejs`, {
                record:result,
            });
        }
    });
});
/* edit page Action */
app.post('/editOk', function(req, res){
    // 데이터 준비
    var no = req.body.no;
    var subject = req.body.subject;
    var content = req.body.content;
    console.log(no + subject + content);
    console.log(no + subject + content);

    var sql = "UPDATE board SET subject=?, content=? WHERE no=?"

    connection.execute(sql, [subject, content, no], function (err, result, fields) {
        console.log(result);
        if(err || result.affectedRows != 1){
            res.writeHead(200, head);
            res.write("<script>");
            res.write("alert('글수정이 실패하였습니다.');");
            // res.write("history.back();");
            res.write("history.go(-1)");
            res.end("</script>")
        } else {
            res.redirect(`/view?no=${no}`);
        }
    });
})
app.get('/del', function (req,res) {
    var url = req.url.substring(req.url.indexOf('?')+1);
    var params = new URLSearchParams(url);
    var sql = 'DELETE FROM board WHERE no=?';
    connection.execute(sql,[params.get('no')],function (err, result, fields) {
        if(err || result.affectedRows != 1){
            res.redirect('/view?no='+params.get('no'));
        } else {
            res.redirect("/boardList");
        }
    })
})

server.listen(10018, function () {
    console.log('server Start... http://127.0.0.1:10018/index')
})



