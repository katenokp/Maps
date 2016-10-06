var fs = require('fs');
var path = require('path');

function saveToFile(reqBody, replacer){
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
            saveCommonInformation(reqBody.weight, commonInformationFileName);
            return true;
        }
    });
}

function saveCommonInformation(data, fileName){
    fs.writeFile(fileName, JSON.stringify(data, ["weight", "done", "all"], '\t'), {"encoding": 'utf8'}, function(error) {
        if (error) {
            console.error(error);
            return false;
        } else {
            console.log("Data saved to file %s", fileName);
            return true;
        }
    });
}

module.exports = saveToFile;