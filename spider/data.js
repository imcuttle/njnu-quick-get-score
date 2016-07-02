/**
 * Created by Yc on 2016/6/30.
 */
var queryString = require('queryString');
var http = require('http');
var u = require('../utils/index');
var iconv = require('iconv-lite');
var net = require('net');
var zlib = require("zlib");


module.exports = function (result,id,callback) {
    // http://223.2.10.25/student/xscj.stuckcj.jsp?menucode=JW130706
    var options = {
        hostname:result,
        path:'/student/xscj.stuckcj.jsp?menucode=JW130706',
        headers:{
            "Referer": `http://${result}/frame/jw/teacherstudentmenu.jsp?menucode=JW1314`,
            "Cookie": `JSESSIONID=${id}.kingo154`,
            "Accept-Encoding": "gzip, deflate, sdch",
            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Encoding": "gzip, deflate, sdch",
            "Accept-Language": "zh-CN,zh;q=0.8",
            "User-Agent": "Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36",
            "Cache-Control": "max-age=0",
            "Upgrade-Insecure-Requests": 1
        },
        method:'GET'
    };
    http.request(options,function (res) {
        var chunks = [];
        var gunzip = zlib.createGunzip();
        res.pipe(gunzip);
        gunzip.on('data', function(chunk) {
            chunks.push(chunk);
        });
        gunzip.on('end', function() {
            var decodedBody = iconv.decode(Buffer.concat(chunks), 'gbk');
            // console.log(decodedBody);
            var userCode;
            decodedBody.replace(/<input.+?id="userCode".+?value="(.+?)".*?>/i,(m,c)=>{
                userCode = c;
            });
            if(userCode!=null){
                options.method = 'POST';
                options.path = '/student/xscj.stuckcj_data.jsp';
                options.headers = u.extend(options.headers,{
                    'Referer':`http://${result}/student/xscj.stuckcj.jsp?menucode=JW130706`,
                    "Content-Type":"application/x-www-form-urlencoded"
                });
                http.request(options,function (res) {
                        var chunks = [];
                        var gunzip = zlib.createGunzip();
                        res.pipe(gunzip);
                        gunzip.on('data', function(chunk) {
                            chunks.push(chunk);
                        });
                        gunzip.on('end', function() {
                            var decodedBody = iconv.decode(Buffer.concat(chunks), 'gbk');
                            callback(null,decodedBody);
                        });
                    })
                    .end(queryString.stringify(
                        {
                            sjxz:'sjxz1',
                            ysyx:'yxcj',
                            userCode:userCode,
                            xn1:2020,
                            ysyxS:'on',
                            sjxzS:'on',
                            menucode_current:''
                        }
                    ));
            }else{
                callback(new Error('USERCODE IS UNDEFINED'));
            }

        });
    }).end();
};