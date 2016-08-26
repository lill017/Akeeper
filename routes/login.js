/**
 * Created by Administrator on 2016/8/26 0026.
 */
var express = require('express');
var router = express.Router();
var mongo = require('../db/mongo');

/* GET login page. */
router.route("/login").get(function(req,res) {    // 到达此路径则渲染login文件，并传出title值供 login.html使用
    res.render("login", {title: 'User Login'});
}).post(function(req,res){                        // 从此路径检测到post方式则进行post数据的处理操作
    //get User info
    //获取集合对象
    var User = mongo.getCollection('user');
    var uname = req.body.uname;                //获取post上来的 data数据中 uname的值
    User.findOne({name:uname},function(err,doc){   //查询数据库中的匹配信息
        if(err){
            res.send(500);
            console.log(err);
        }else if(!doc){
            req.session.msg = '用户名不存在';
            res.send(500);
        }else{
            if(req.body.upwd != doc.password){     //查询到匹配用户名的信息，但相应的password属性不匹配
                req.session.msg = "密码错误";
                res.send(500);
            }else{                                     //信息匹配成功，则将此对象（匹配到的user) 赋给session.user  并返回成功
                req.session.user = doc;
                res.send(200);
            }
        }
    });
});
module.exports = router;