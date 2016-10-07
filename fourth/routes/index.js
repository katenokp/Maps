var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var normalize = require('../public/js/prepareData');
var serviceName = require('../servicesNames');

/* GET home page. */
router.get('/', function(req, res, next) {
    var serviceNamesArray = [];
    for (property in serviceName){
        serviceNamesArray.push({
            name: serviceName[property],
            code: property
        })
    }
    res.render('start', {servicesNames: serviceNamesArray});
});

router.get('/ndfl', function(req, res, next) {
    buildPage("Ndfl", res);
});

router.get('/fss', function(req, res, next) {
    buildPage("Fss", res);
});

router.get('/pfr', function(req, res, next) {
    buildPage("Pfr", res);
});

router.get('/kopf', function(req, res, next) {
    buildPage("Kopf", res);
});

router.get('/fms', function(req, res, next) {
    buildPage("Fms", res);
});

/*router.get('/normalize', function(req, res, err){
    res.render()
})*/

function buildPage(service, res){
    var commonInformationFileName = path.join(__dirname,'../data/' + service + '/commonInformation.json');
    var dataFileName = path.join(__dirname,'../data/' + service + '/data.json');

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
                    if(needNormalization()){
                        parsedData = normalize(data);
                        //var preparedData = normalizeData(data);
                        //save(preparedData, fileName, ["name", "id", "isDone", "comment", "priority", "weight", "children", "done", "all"]);
                    } else {
                        parsedData = JSON.parse(data);
                    }
                    var weight = JSON.parse(commonData).weight; //todo �������� ����� �� �������� �������
                    weight = calculateRootCompleteness(parsedData);
                    res.render('index', {data: parsedData, weight: weight, service: service, serviceName: serviceName[service]});
                }
            })

        }
    })

}

function needNormalization(){
    return true; //todo
}

function calculateRootCompleteness(data){
    var weight = {done:0, all:0};
    data.forEach(function(item){
        weight.done += item.weight.done;
        weight.all += item.weight.all;
    });
    return weight;
}

function calculateCompleteness(data, result){

    data.forEach(function(item) {
        result.push({
            id: item.id,
            weight: normalizeWeight(item)
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

function normalizeWeight(item){
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
