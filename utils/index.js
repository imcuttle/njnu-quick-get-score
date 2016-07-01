/**
 * Created by Yc on 2016/6/30.
 */

module.exports = {
    extend : function (src) {
        var out = {};
        var others = [].slice.call(arguments);
        others.forEach(x=>{
            for(var k in x){
                if(x.hasOwnProperty(k))
                    out[k] = x[k];
            }
        })
        return out;
    },
    parseCookie : function(cookie){
        var cookies = {};
        if (!cookie) return cookies;
        var list = cookie.split(";");
        for (var i = 0; i < list.length; i++) {
            var pair = list[i].split("=");
            cookies[pair[0].trim()] = pair[1];
        }
        return cookies;
    }
}