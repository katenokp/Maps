var fs = require('fs');
var path = require('path');
var diff3 = require('node-diff3').diff;
//var diff3 = require('diff3');

function saveToFile(reqBody, replacer, callback){
    var serviceName = reqBody.service;

    var oldDataFileName = path.join("./data/" + (serviceName + "/oldData.json")); //todo разобраться с правильным путём
    var newDataFileName = path.join("./data/" + (serviceName + "/newData.json"));
    var commonInformationFileName = path.join("./data/" + (serviceName + "/commonInformation.json"));

    var oldData = JSON.stringify(reqBody.oldData, replacer, '\t').split('\n');
    var newData = JSON.stringify(reqBody.data, replacer, '\t').split('\n');

    console.warn("file path: %s", newDataFileName);
    fs.writeFile(newDataFileName, JSON.stringify(reqBody.data, replacer, '\t'), {"encoding": 'utf8'}, function(error){
        if(error){
            console.error(error);
            return false;
        } else{
            console.log("New data saved to file %s", newDataFileName);{
                fs.writeFile(oldDataFileName, JSON.stringify(reqBody.oldData, replacer, '\t'), {"encoding": "utf8"}, function(error){
                    if(error)
                        console.log(error);
                    else{
                        //var r0 = diff3.diffComm(oldData, newData);
                        /*var r1 = diff3.diffPatch(oldData, newData);
                        var r2 = diff3.patch(oldData, r1);
                        //console.log(r0);
                        console.log(r2);*/
                        merge(oldDataFileName, newDataFileName);
                    }
                });

            }
            return saveCommonInformation(reqBody.weight, commonInformationFileName, callback);
        }
    });
}

function merge(oldDataFileName, newDataFileName){
    /*var dataFileName = path.join("./data" + "/mergedData.json");
    diff3.merge(oldDataFileName, oldDataFileName, newDataFileName);*/

    var testReplacer = ["name", "all", "priority"];

    var oldData = JSON.stringify({all: 1, priority: 3, name: "name"}, testReplacer, '\t').split('\n');
    var first = JSON.stringify({all: 2, priority: 3, name: "name"}, testReplacer, '\t').split('\n');
    var second = JSON.stringify({all: 1, priority: 5, name: "name"}, testReplacer, '\t').split('\n');

    var patch1 = diff3.diffPatch(oldData, first);
    var patch2 = diff3.diffPatch(oldData, second);

    var afterFirst = diff3.patch(oldData, patch1);
    console.log(afterFirst);

    var afterSecond = diff3.patch(afterFirst, patch2);
    console.log(afterSecond);
}

function saveCommonInformation(data, fileName, callback){
    fs.writeFile(fileName, JSON.stringify(data, ["weight", "done", "all"], '\t'), {"encoding": 'utf8'}, function(error) {
        if (error) {
            console.error(error);
            return false;
        } else {
            console.log("Data saved to file %s", fileName);
            if(callback!=null)
                callback();
        }
    });
}

module.exports = saveToFile;