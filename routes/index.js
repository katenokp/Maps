var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var normalize = require('../js/prepareData');
var serviceName = require('../servicesNames');
var replacer = require('../js/replacerForJSON');
var settings = require('../bin/settings.json');

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

router.get('/converter', function(req, res, next){
    var service = req.headers.referer != null ?
        req.headers.referer.replace(req.headers.host + "/", "").split("//")[1].toLowerCase() :
        null;
    if(service == '')
        service = null;
    if(service == null) {
        res.render('converter', {service: service, data: null});
    } else {
        //var dataFileName = path.join(__dirname, '../data/' + service + '/data.json');
        var dataFileName = path.join(settings.dataFolderPath, service, 'data.json');
        fs.readFile(dataFileName, 'utf8', function (err, data) {
                if (err) {
                    throw err;
                }
                else {
                    if(needNormalization()){
                        data = JSON.stringify(normalize.normalizeData(data));
                    }
                    res.render('converter', {service: service, data: data});
                }
            }
        )
    }

});

router.get('/test', function(req, res, next) {
    buildPage("Test", res);
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
    var commonInformationFileName = path.join(settings.dataFolderPath, service, 'commonInformation.json');
    //var commonInformationFileName = path.join(__dirname,'../data/' + service + '/commonInformation.json');
    //var dataFileName = path.join(__dirname,'../data/' + service + '/data.json');
    var dataFileName = path.join(settings.dataFolderPath, service, 'data.json');

    fs.readFile(dataFileName, 'utf8', function(err, data){
        if(err){
            throw err;
        }
        else{
            var file = data;
            fs.readFile(commonInformationFileName, 'utf8', function(error, commonData){
                if(error)
                    throw error;
                else{
                    var parsedData, weight;
                    if(needNormalization()){
                        parsedData = normalize.normalizeData(data);
                        weight = calculateRootCompleteness(parsedData);
                    } else {
                        parsedData = JSON.parse(data);
                        weight = JSON.parse(commonData).weight;
                    }
                    fs.writeFile(dataFileName, JSON.stringify(parsedData, replacer, '\t'), {"encoding": 'utf8'}, function(error){
                        if(error)
                            throw error;
                        else{
                            console.log('saved normalized data, file %s', dataFileName);
                            fs.writeFile(commonInformationFileName, JSON.stringify(weight, ["all", "done"], "\t"), {"encoding":"utf8"}, function(error){
                                if(error)
                                    throw error;
                                else{res.render('index', {data: parsedData, weight: weight, service: service, serviceName: serviceName[service]});}
                            })
                        }
                    });

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



/* GET home page. */
/*router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});*/



module.exports = router;
