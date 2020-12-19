var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();


const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Session = require('express-session');
const flash = require('connect-flash');

var MongoDBStore = require('connect-mongodb-session')(Session);

app.use(passport.initialize());
app.use(passport.session());



// mongodb setup
var mongoose = require('mongoose');
var promise = mongoose.connect('mongodb://localhost/mydb', {
    useMongoClient: true
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
    console.log('connected successfully');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



///// 밑으로 추가 부분  /// 로그인 , 회원가입



//board sample master
var favicon = require('serve-favicon');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var index = require('./routes/index');
var users = require('./routes/users');
//



app.use(bodyParser.urlencoded({extended: true}));

// routes
const indexRoute      = require("./routes/index");

let url =  "mongodb://localhost/mydb";
mongoose.connect(url, {useNewUrlParser: true});


// 뷰엔진 설정
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));

// use routes
app.use("/", indexRoute);


app.use(flash());
app.use(index);

//세션
var store = new MongoDBStore({//세션을 저장할 공간
    uri: url,//db url
    collection: 'sessions'//콜렉션 이름
});

store.on('error', function(error) {//에러처리
    console.log(error);
});

app.use(Session({
    secret:'dalhav', //세션 암호화 key
    resave:false,//세션 재저장 여부
    saveUninitialized:true,
    rolling:true,//로그인 상태에서 페이지 이동 시마다 세션값 변경 여부
    cookie:{maxAge:1000*60*60},//유효시간
    store: store
}));



module.exports = app;
