/**
 * Created by Administrator on 2016/8/26 0026.
 */
var crypto = require('crypto');

exports.encrypt = function(content){
    if(content == null || content == ""){
        return "";
    }else{
        var md5 = crypto.createHash('md5');//定义加密方式:md5不可逆,此处的md5可以换成任意hash加密的方法名称；
        md5.update(content);
        return md5.digest('hex');
    }
}