/**
 * Created by Yc on 2016/6/30.
 */

var http = require('http'),
    fs = require('fs');
var options = require('./spider/options');
var login = require('./spider/login');
var lookup = require('./spider/data');
var ranNum = require('./server/ranNumber');
var u = require('./utils/index');
var url = require('url');
var md5 = require('./utils/md5');

http.createServer((req,res)=>{
    var cookie = u.parseCookie(req.headers.cookie);
    if(!cookie['connect.id']){
        res.setHeader('Set-Cookie',[`connect.id=${md5.hex_md5(''+Date.now())}`])
    }
    if(req.url.startsWith('/ranNumber')){
        var ops = u.extend(options,{path:'/cas/genValidateCode'});
        ranNum(cookie['connect.id'],(numres)=>{
            numres.pipe(res);
        })
    }else if(req.url.startsWith('/ajax')){
        var arg = url.parse(req.url, true).query;
        if(arg.act=='login'){
            delete arg.act;
            console.log(arg.username);
            login(arg,cookie['connect.id'],(st)=>{
                st.pipe(res);
            });
        }else{
            delete arg.act;
            lookup(arg.result,cookie['connect.id'],(err,data)=>{
                if(err) {
                    console.error(err);
                    res.end(JSON.stringify({code:500,message:'出错'}));
                }
                else
                    res.end(data);
            })
        }
    }else
        fs.readFile(__dirname+'/static/'+(req.url==='/'?'index.html':req.url),
            function (err,data) {
                if(err){
                    res.writeHead(500);
                    return res.end('Error loading');
                }
                res.writeHead(200);
                res.end(data);
            }
        );
}).listen(3010);

// login()