/**
 * Created by Administrator on 2016/8/26 0026.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get("/index",function(req,res){
    if(!req.session.user){                     //到达/home路径首先判断是否已经登录
        req.session.error = "请先登录"
        res.redirect("/login");                //未登录则重定向到 /login 路径
    }
    res.render("index",{title:'Home'});         //已登录则渲染home页面
});

module.exports = router;