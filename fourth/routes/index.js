var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var normalize = require('../public/js/prepareData');

/* GET home page. */
router.get('/', function(req, res, next) {

    var commonInformationFileName = path.join(__dirname,'../data/commonInformation.json');
    var dataFileName = path.join(__dirname,'../data/ndflData1.json');
    //var dataFileNameToPrepare = path.join(__dirname,'../data/ndflData1.json'); //todo kill
    //normalize(dataFileName);

    readData(commonInformationFileName, dataFileName, res);
});

function readData(commonInformationFileName, dataFileName, res){
    fs.readFile(dataFileName, 'utf8', function(err, data){
        if(err){
            throw err;
        }
        else{
            fs.readFile(commonInformationFileName, 'utf8', function(error, commonData){
                if(error)
                    throw error;
                else{
                    var parsedData;
                    if(true){ //todo need normalize
                        parsedData = normalize(data);
                        //var preparedData = normalizeData(data);
                        //save(preparedData, fileName, ["name", "id", "isDone", "comment", "priority", "weight", "children", "done", "all"]);
                    } else {
                        parsedData = JSON.parse(data);
                    }
                    var weight = JSON.parse(commonData)[0].weight; //todo запилить поиск по названию сервиса
                    calculateAllCompleteness(parsedData);
                    res.render('index', {data: parsedData, weight: weight});
                }
            })

        }
    })

}

function calculateAllCompleteness(data){
    var dataWithWeight = [];
    calculateCompleteness(data, dataWithWeight)
}

function calculateCompleteness(data, result){

    data.forEach(function(item) {
        result.push({
            id: item.id,
            weight: calculateWeight(item)
        });
        if(item.children != null){
            calculateCompleteness(item.children, result);
        }
    });
}

/*function calculateCompleteness(data){
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

}*/

function calculateWeight(item){
    var weight;
    var children = item.children;
    if(children == null){
        if(item.weight == null){
            weight = {
                all: 1,
                done: item.isDone ? 1: 0
            };

        } else{
            weight = item.weight;
        }
    } else{
        var doneChildrenCount = 0;
        children.forEach(function(child){
            if(child.isDone)
                doneChildrenCount++;
        });
        weight = {
            all: children.length,
            done: doneChildrenCount
        };
    }
    console.log("weight for %s: %d/%d", item.id, weight.done, weight.all);
    return weight;
}

/* GET home page. */
/*router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});*/



module.exports = router;
