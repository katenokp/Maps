var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');

var routes = require('./routes/index');
var users = require('./routes/users');
var saveData = require('./js/saver');
var parser = require('./js/parser');
var replacer = require('./js/replacerForJSON');
var getService = require('./js/services');
var getUsers= require('./js/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//app.locals.pretty = true; //чтобы html не пихался в одну строку

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

/*app.use(logger('combined', {
    skip: function (req, res) { return res.statusCode < 400 }
}));*/
/*logger('combined', {
    skip: function (req, res) { return res.statusCode < 400 }
});*/
app.use(logger('common', {
    stream: fs.createWriteStream('./log.log', {flags: 'a'})
}));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({limit: '10mb'}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

app.post('/save', function (req, res) {
    //var data = req.body;
    console.warn('post');
    var isDataOnServiceChanged = false;
    var saveDataStatus = saveData(req.body, replacer);
    //if(saveDataStatus){
    res.status = 200;
    res.send("saved");
    //} else{
    //res.status = 500;
    //res.send();
    //}
});

app.use('/converter', bodyParser.urlencoded({
    extended: true
}));

app.post('/converter', function (req, res, next) {
    if (req.body.service == null) {

        var preparedData = prepareData(req.body.text, true);
        if(preparedData == null)
            preparedData = parser(req.body.text);
        var result = JSON.stringify(preparedData, replacer, '\t');
        res.status = 200;
        //res.render('convert', {data: result});
        res.send(result.substr(1, result.length-2));
    }

    else {
        var parsedData = prepareData(req.body.text, false);
        if(parsedData == null)
            parsedData = parser(req.body.text);

        var data = {
            data: parsedData,
            service: req.body.service,
            weight: {
                all: 0,
                done: 0
            }
        };

        var saveDataStatus = saveData(data, replacer, function () {
            //res.status = 200;
            res.render('index', {
                data: data.data,
                weight: {all: 0, done: 0},
                serviceInfo: getService(data.service),
                allUsers: getUsers()
            })
        });


        /*if (saveDataStatus) {
         res.status = 200;
         res.send();
         } else {
         res.status = 500;
         res.send();
         }*/
    }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    //app.locals.pretty = true
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        console.log(err.message);
        console.log(err.stack);
        res.render('error', {
            message: err.message.replace(__dirname + '\\', '..'),
            error: err,
            dirname: __dirname + '\\'
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message.replace(__dirname, ''),
        error: {}
    });
});


function prepareData(data, needClearIds){
    if(data[0] != '[' && data[0] != '{'){
        return null;
    }
    var parsedData = JSON.parse(data);
    if(needClearIds)
        clearIds(parsedData);
    return parsedData;
}


function clearIds(itemsArray){
    if(itemsArray.length == undefined)
        throw new Error("Bad JSON file");
    itemsArray.forEach(function(item){
        item.id = undefined;
        if(item.children != undefined)
            clearIds(item.children);
    })
}

module.exports = app;
