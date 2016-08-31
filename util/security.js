/**
 * Created by Administrator on 2016/8/26 0026.
 */
var crypto = require('crypto');
var config = require('./../config.json');

//不可逆加密
exports.encrypt = function(content){
    if(content == null || content == ""){
        return "";
    }else{
        var md5 = crypto.createHash('md5');//定义加密方式:md5不可逆,此处的md5可以换成任意hash加密的方法名称；
        md5.update(content);
        return md5.digest('hex');
    }
};
//加密
exports.cipher = function(text){
    var algorithm = config.safecfg.algorithm;
    var key = config.safecfg.key;
    var encrypted = "";
    var cip = crypto.createCipher(algorithm, key);
    encrypted += cip.update(text, 'utf-8', 'hex');
    encrypted += cip.final('hex');
    return encrypted
};
//解密
exports.decipher = function(encrypted){
    var algorithm = config.safecfg.algorithm;
    var key = config.safecfg.key;
    var decrypted = "";
    var decipher = crypto.createDecipher(algorithm, key);
    decrypted += decipher.update(encrypted, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
};

