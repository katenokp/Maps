var fs = require('fs');
var path = require('path');

function saveToFile(reqBody, replacer, callback){
    var serviceName = reqBody.service;

    var dataFileName = path.join("./data/" + (serviceName + "/data.json")); //todo разобраться с правильным путём
    var commonInformationFileName = path.join("./data/" + (serviceName + "/commonInformation.json"));

    console.warn("file path: %s", dataFileName);
    fs.writeFile(dataFileName, JSON.stringify(reqBody.data, replacer, '\t'), {"encoding": 'utf8'}, function(error){
        if(error){
            console.error(error);
            return false;
        } else{
            console.log("Data saved to file %s", dataFileName);
            return saveCommonInformation(reqBody.weight, commonInformationFileName, callback);
        }
    });
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