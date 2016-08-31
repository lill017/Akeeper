/**
 * Created by Administrator on 2016/8/29 0029.
 */

var express = require('express');
var router = express.Router();
var mongo = require('../db/mongo');
var security = require('../util/security');
var ObjectId = require('mongodb').ObjectID;

router.route('/addnew').post(function (req,res) {
    var Account = mongo.getCollection('account');
    var a_name = req.body.aname;
    var a_acc = req.body.acc;
    var a_pwd = req.body.apwd;
    var a_url = req.body.aurl;
    var a_des = req.body.ades;

    Account.insert({
        a_name:a_name,
        a_acc:security.cipher(a_acc),
        a_pwd:security.cipher(a_pwd),
        a_url:a_url,
        a_des:a_des,
        a_user:req.session.user._id
    },function (err,doc) {
        if (err) {
            res.send(500);
            console.log(err);
        } else {
            res.send(200);
        }
    })

});

router.route('/delete').post(function(req,res){
    var Account = mongo.getCollection('account');
    Account.remove({_id:ObjectId(req.body.id)},function(err,result){
        if(err){
            res.send(500);
            console.log('删除失败');
        }else{
            res.send(200);
            console.log('删除成功');
        }
    });

});

router.route('/view').post(function(req,res){
    var Account = mongo.getCollection('account');
    Account.findOne({_id:ObjectId(req.body.id)},function(err,result){
        if(err){
            res.send(500);
            console.log('未找到');
        }else{
            res.send({"account":security.decipher(result.a_acc),"password":security.decipher(result.a_pwd)});
        }
    });

});

router.route('/check').post(function(req,res){

        if(security.encrypt(req.body.pwd)==req.session.user.password){
            res.send({"result":"ok"});
        }else{
            res.send({"result":"no"});
        }


});

module.exports = router;