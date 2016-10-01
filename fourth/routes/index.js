var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
    //res.render('index', { title: 'Express' });
    var data = readData(res);
    //console.log(data);
    //res.render('map', {data: data.id});
    //todo сделать перед сохранением проверку на отсутствие одинаковых id
});

function readData(res){
    fs.readFile(path.join(__dirname,'../data/data.json'), 'utf8', function(err, data){
        if(err){
            throw err;
        }
        else{
            var parsedData = JSON.parse(data);
            //return JSON.parse(data);
            //console.log()
            parsedData.forEach(function(item){
                calculateCompleteness(item);
            });
            res.render('index', {data: parsedData});
        }
    })

}

function calculateCompleteness(data){
    var result = {
        all: 0,
        done: 0
    };
    if(data.children == null){
        if(data.weight == null){
             result = {
                all: 1,
                done: data.isDone ? 1: 0
            };

        } else{
            result = data.weight;
        }
    } else{
        data.children.forEach(function(child){
            var childrenWeight = calculateCompleteness(child);
            result = {
                all: result.all + childrenWeight.all,
                done: result.done + childrenWeight.done
            }
        })
    }
    console.log("weight for %s: %d/%d", data.id, result.done, result.all);
    return result;

}

/* GET home page. */
/*router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});*/



module.exports = router;
