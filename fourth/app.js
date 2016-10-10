var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var saveData = require('./public/js/saver');
var parser = require('./public/js/parser');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//app.locals.pretty = true; //чтобы html не пихался в одну строку

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

app.post('/save', function(req, res){
    //var data = req.body;
    console.warn('post');
    var saveDataStatus = saveData(req.body, ["name", "id", "isDone", "comment", "priority", "weight", "children", "done", "all"]); //todo вынести формат файла в настройки
    if(saveDataStatus){
        res.status = 200;
        res.send("saved")
    } else{
        res.status = 500;
        res.send();
    }
});

app.use('/convert', bodyParser.urlencoded({
    extended: true
}));

app.post('/convert', function(req, res, next){
    if(req.body.service == null)
    {
        res.status = 500;
        res.send();
    }

    var data = {
        data: parser(req.body.text),
        service: req.body.service,
        weight: {
            all: 0,
            done: 0
        }
    };

    var saveDataStatus = saveData(data, ["name", "children"]);
    if(saveDataStatus){
        res.status = 200;
        res.send(req.body.service)
    } else{
        res.status = 500;
        res.send();
    }
});

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
  //app.locals.pretty = true
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
