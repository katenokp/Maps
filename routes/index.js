var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var normalize = require('../js/prepareData');
var replacer = require('../js/replacerForJSON');
var settings = require('../bin/settings.json');
var getService = require('../js/services')
var getUsers = require('../js/users')
var url = require('url');

/* GET home page. */
router.get('/', function(req, res, next) {
    var serviceNamesArray = [];
    for(var i=0; i<settings.services.length; i++){
        serviceNamesArray.push({
            name: settings.services[i].name,
            code: settings.services[i].id
        })
    }
    /*for (property in serviceName){
        serviceNamesArray.push({
            name: serviceName[property],
            code: property
        })
    }*/
    res.render('start', {servicesNames: serviceNamesArray});
});

router.get('/converter', function(req, res, next){
    var service = req.headers.referer != null ?
        req.headers.referer.replace(req.headers.host + "/", "").split("//")[1].split("?")[1].toLowerCase() :
        null;
    if(service == '')
        service = null;
    if(service == null) {
        res.render('converter', {currentService: service, services: settings.services, data: null});
    } else {
        var dataFileName = path.join(settings.dataFolderPath, service, 'data.json');
        fs.readFile(dataFileName, 'utf8', function (err, data) {
                if (err) {
                    res.statusCode = 409;
                    res.message = err.message;
                }
                else {
                    if(needNormalization()){
                        data = JSON.stringify(normalize.normalizeData(data));
                    }
                    res.render('converter', {currentService: service, services: settings.services, data: data});
                }
            }
        )
    }

});

router.get('/start', function(req, res, next) {
    buildPage(url.parse(req.url).query, res);
});

/*router.get('/normalize', function(req, res, err){
    res.render()
})*/

function buildPage(serviceId, res){
    var commonInformationFileName = path.join(settings.dataFolderPath, serviceId, 'commonInformation.json');
    //var commonInformationFileName = path.join(__dirname,'../data/' + service + '/commonInformation.json');
    //var dataFileName = path.join(__dirname,'../data/' + service + '/data.json');
    var dataFileName = path.join(settings.dataFolderPath, serviceId, 'data.json');

    fs.readFile(dataFileName, 'utf8', function(err, data){
        if(err){
            throw err;
        }
        else{
            var file = data;
            fs.readFile(commonInformationFileName, 'utf8', function(error, commonData){
                if(error) {
                    res.statusCode = 409;
                    res.message = error.message;
                }
                else{
                    var parsedData, weight;
                    if(needNormalization()){
                        try {
                            parsedData = normalize.normalizeData(data);
                            weight = calculateRootCompleteness(parsedData);
                        } catch(error){
                            if(error.message.indexOf('JSON') != -1) {
                                res.render('error', {
                                    message: 'Ошибка в данных. Поправьте файл ' + dataFileName,
                                    error: {stack: error.message}
                                });
                                return;
                            }
                            else
                                throw error;
                        }
                    } else {
                        parsedData = JSON.parse(data);
                        weight = JSON.parse(commonData).weight;
                    }
                    fs.writeFile(dataFileName, JSON.stringify(parsedData, replacer, '\t'), {"encoding": 'utf8'}, function(error){
                        if(error)
                        {
                            res.statusCode = 409;
                            res.message = error.message;
                        }
                        else{
                            console.log('saved normalized data, file %s', dataFileName);
                            fs.writeFile(commonInformationFileName, JSON.stringify(weight, ["all", "done"], "\t"), {"encoding":"utf8"}, function(error){
                                if(error)
                                {
                                    res.statusCode = 409;
                                    res.message = error.message;
                                }
                                else{
                                    var service = getService(serviceId);
                                    var users = settings.users;
                                    res.render('index', {data: parsedData, weight: weight, serviceInfo: service, allUsers: users});}
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
