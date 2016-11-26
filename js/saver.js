var fs = require('fs');
var path = require('path');
var diff3 = require('node-diff3').diff;
var settings = require('../bin/settings.json');

var crypto = require('crypto');

function saveToFile(reqBody, replacer, callback, res){

    var name = 'braitsch';
    var hash = crypto.createHash('md5').update(name).digest('hex');
    console.log(hash);

    var startTime = Date.now();
    var serviceName = reqBody.service;

    var dataFileName = path.join(settings.dataFolderPath, serviceName, 'data.json');
    //var dataFileName = path.join("./data/" + (serviceName + "/data.json"));
    //var commonInformationFileName = path.join("./data/" + (serviceName + "/commonInformation.json"));
    var commonInformationFileName = path.join(settings.dataFolderPath, serviceName, "commonInformation.json");

    fs.readFile(dataFileName, 'utf8', function(error, actualDataFile){
        if(error)
            throw error;
        else{
            var actualData = actualDataFile.replace(/\t+/g, '').split('\n');
            var oldData = reqBody.oldData != null ?
                JSON.stringify(reqBody.oldData, replacer, '\t').replace(/\t+/g, '').split('\n') :
                actualData;

            console.log('beautify actual data - ', Date.now() - startTime);
            startTime = Date.now();

            var newData = JSON.stringify(reqBody.data, replacer, '\t').replace(/\t+/g, '').split('\n');

            console.log('beautify old data - ', Date.now() - startTime);
            startTime = Date.now();

            var patch = diff3.diffPatch(oldData, newData);

            console.log('get patch - ', Date.now() - startTime);
            startTime = Date.now();

            var isDataOnServiceChanged = diff3.diffComm(oldData, actualData).length == 0;

            console.log('comm - ', Date.now() - startTime);
            startTime = Date.now();

            actualData = diff3.patch(actualData, patch);

            console.log('patch - ', Date.now() - startTime);
            startTime = Date.now();

            fs.writeFile(dataFileName, actualData.join('\n'), {"encoding": 'utf8'}, function(error){
                var date = new Date();
                console.log(
                    [date.getMonth(), date.getDay(), date.getHours(), date.getMinutes(), date.getSeconds()].join('-')
                );
                var dateTime = [date.getMonth(), date.getDay(), date.getHours(), date.getMinutes(), date.getSeconds()].join('-');
                fs.createReadStream(dataFileName).pipe(fs.createWriteStream(dataFileName.replace('.json', dateTime + '.json')));
                if(error){
                    console.error(error);
                    return false
                } else{
                    date = new Date();
                    console.log(
                        [date.getMonth(), date.getDay(), date.getHours(), date.getMinutes(), date.getSeconds()].join('-')
                    );
                    dateTime = [date.getMonth(), date.getDay(), date.getHours(), date.getMinutes(), date.getSeconds()].join('-');
                    fs.createReadStream(dataFileName).pipe(fs.createWriteStream(dataFileName.replace('.json', dateTime + '.json')));
                    console.log("New data saved to file %s", dataFileName);
                    if(callback!=null)
                        callback();
                    saveCommonInformation(reqBody.weight, commonInformationFileName, res);
                    return isDataOnServiceChanged;
                }
            });
        }
    });
}

function findDifferences(actualData, oldData){
    var arr =
}


function merge(oldDataFileName, newDataFileName){
    /*var dataFileName = path.join("./data" + "/mergedData.json");
    diff3.merge(oldDataFileName, oldDataFileName, newDataFileName);*/

    var testReplacer = ["name", "all", "priority"];

    var oldData = JSON.stringify({all: 1, priority: 3, name: "name"}, testReplacer, '\t').split('\n');
    var oldData1 = JSON.stringify({all: 1, priority: 3, name: "name"}, testReplacer, '\t').split('\n');
    var first = JSON.stringify({all: 2, priority: 3, name: "name"}, testReplacer, '\t').split('\n');
    var second = JSON.stringify({all: 1, priority: 5, name: "name"}, testReplacer, '\t').split('\n');

    /*var patch1 = diff3.diffPatch(oldData, first);
    var patch2 = diff3.diffPatch(oldData, second);

    var afterFirst = diff3.patch(oldData, patch1);
    console.log(afterFirst);

    var afterSecond = diff3.patch(afterFirst, patch2);
    console.log(afterSecond);*/

    console.log(diff3.diffIndices(oldData, oldData1).length);
    console.log(diff3.diffIndices(oldData, first).length);
    console.log(diff3.diffIndices(second, oldData1).length);
    console.log(diff3.diffIndices(first, second).length);
}

function saveCommonInformation(data, fileName, res){
    fs.writeFile(fileName, JSON.stringify(data, ["weight", "done", "all"], '\t'), {"encoding": 'utf8'}, function(error) {
        if (error) {
            console.error(error);
            return false;
        } else {
            console.log("Data saved to file %s", fileName);
            res.status = 200;
            res.send("saved");
        }
    });
}

module.exports = saveToFile;