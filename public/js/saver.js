var fs = require('fs');
var path = require('path');
var diff3 = require('node-diff3').diff;
//var diff3 = require('diff3');

function saveToFile(reqBody, replacer, callback){
    var serviceName = reqBody.service;

    var dataFileName = path.join("./data/" + (serviceName + "/data.json")); //todo разобраться с правильным путём
    var newDataFileName = path.join("./data/" + (serviceName + "/newData.json"));
    var commonInformationFileName = path.join("./data/" + (serviceName + "/commonInformation.json"));

    console.warn("file path: %s", newDataFileName);
    fs.writeFile(newDataFileName, JSON.stringify(reqBody.data, replacer, '\t'), {"encoding": 'utf8'}, function(error){
        if(error){
            console.error(error);
            return false;
        } else{
            console.log("Data saved to file %s", newDataFileName);
            merge(dataFileName, newDataFileName);
            return saveCommonInformation(reqBody.weight, commonInformationFileName, callback);
        }
    });
}

function merge(existDataFileName, newDataFileName){
    var dataFileName = path.join("./data" + "/mergedData.json");
    diff3.diff3Merge(existDataFileName, existDataFileName, newDataFileName);
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