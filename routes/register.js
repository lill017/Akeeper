/**
 * Created by Administrator on 2016/8/26 0026.
 */
var express = require('express');
var router = express.Router();
var mongo = require('../db/mongo');

/* GET register page. */
router.route("/register").get(function(req,res){    // 到达此路径则渲染register文件，并传出title值供 register.html使用
    res.render("register",{title:'User register'});
}).post(function(req,res){
    //获取user集合
    var User = mongo.getCollection('user');
    var uname = req.body.uname;
    var upwd = req.body.upwd;
    User.findOne({name: uname},function(err,doc){   // 同理 /login 路径的处理方式
        if(err){
            res.send(500);
            console.log(err);
        }else if(doc){
            req.session.msg ='用户已存在';
            res.send(500);
            console.log('用户已存在');
        }else{
            User.insert({                             // 插入数据库
                name: uname,
                password: upwd
            },function(err,doc){
                if (err) {
                    res.send(500);
                    console.log(err);
                } else {
                    req.session.msg = '注册成功！';
                    res.send(200);
                }
            });
        }
    });
});

module.exports = router;