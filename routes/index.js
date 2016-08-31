var express = require('express');
var router = express.Router();
var mongo = require('../db/mongo');
var security = require('../util/security');
var ObjectId = require('mongodb').ObjectID;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'login' });
});

/* GET login page. */
router.route("/login").get(function(req,res) {    // 到达此路径则渲染login文件，并传出title值供 login使用
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
            if(security.encrypt(req.body.upwd) != doc.password){     //查询到匹配用户名的信息，但相应的password属性不匹配
                req.session.msg = "密码错误";
                res.send(500);
            }else{
                req.session.user = doc;//信息匹配成功，则将此对象（匹配到的user) 赋给session.user  并返回成功
                res.send(200);
            }
        }
    });
});

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
                password: security.encrypt(upwd)
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

/* GET home page. */
router.get("/index",function(req,res){
    if(!req.session.user){
        res.redirect("/");                //未登录则重定向到 /login 路径
    }
    var Account = mongo.getCollection('account');

    Account.find({a_user:req.session.user._id}).toArray(function(err, items){
        if(err){
            res.send(500);
            console.log(err)
        }
        res.render("index",{title:'Home',accounts:items});
    });

});

/* setpwd. */
router.post("/setpwd",function(req,res){    // 到达 /logout 路径则登出， session中user,error对象置空，并重定向到根路径
    var oldpwd = req.body.oldpwd;
    var newpwd = req.body.newpwd;
    if(security.encrypt(oldpwd)==req.session.user.password){
        var User = mongo.getCollection('user');
        User.update({_id:ObjectId(req.session.user._id)},{$set:{password:security.encrypt(newpwd)}},function (err,result) {
            if(err){
                res.send({"result":"fail"});
                console.log(err);
            }else{
                req.session.user.password = security.encrypt(newpwd);
                res.send({"result":"ok"});
            }
        });

    }else{
        res.send({"result":"fail"});
    }
});

/* GET logout page. */
router.get("/logout",function(req,res){    // 到达 /logout 路径则登出， session中user,error对象置空，并重定向到根路径
    req.session.user = null;
    req.session.msg = null;
    res.redirect("/");
});

module.exports = router;
