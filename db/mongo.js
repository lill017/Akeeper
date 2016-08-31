/**
 * Created by Administrator on 2016/8/25 0025.
 */
var mongoskin = require('mongoskin');
var config = require('./../config.json');
var db = null;

exports.getCollection = function (collectionName) {
    if (!db) {
        /**
        var host = config.dbcfg.host,
            port = config.dbcfg.port,
            dbName = config.dbcfg.dbname,
            userName = config.dbcfg.username,
            password = config.dbcfg.password,
            str = 'mongodb://' + userName + ':' + password + '@' + host +':' + port+ '/' + dbName;
        var option = {
            native_parser: true,
            numberOfRetries: 1,
            retryMiliSeconds: 500,
            safe: true
        };
        db = mongoskin.db(str,option);
         */
        //连接本机mongodb ,使用帐号密码连接 mongoskin.db('username:password@服务器ip/数据库名

        db = mongoskin.db('mongodb://lill:lill@127.0.0.1:27017/akeeper?auto_reconnect=true&poolSize=3',
            {numberOfRetries: 1, retryMiliSeconds: 500, safe: true, native_parser: true},
            {socketOptions: {timeout: 5000}}
        );

    }
    return db.collection(collectionName);
}