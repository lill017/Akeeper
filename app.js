var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongo = require('./db/mongo');
var routes = require('./routes/index');
var users = require('./routes/users');
//var login = require('./routes/login');
//var register = require('./routes/register');
//var home = require('./routes/home');
var account = require('./routes/account');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: 'secret',
    name: 'user',   //这里的name值得是cookie的name，默认cookie的name是：connect.sid
    cookie: {maxAge: 1000*60*60*24 },  //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
    resave: false,
    saveUninitialized: true
    }));
app.use(function(req,res,next){
  res.locals.user = req.session.user;   // 从session 获取 user对象
  var msg = req.session.msg;   //获取错误信息
  delete req.session.msg;
  res.locals.message = "";   // 展示的信息 message
  if(msg){
    res.locals.message = '<div class="alert alert-danger" style="margin-bottom:20px;color:red;">'+msg+'</div>';
  }
  next();  //中间件传递
});
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/account',account);
//app.use('/login', login);
//app.use('/register', register);
//app.use('/index', home);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
