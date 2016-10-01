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
            res.render('index', {data: parsedData});
        }
    })

}

/* GET home page. */
/*router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});*/



module.exports = router;
