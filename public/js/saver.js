var fs = require('fs');
var path = require('path');
var diff3 = require('node-diff3').diff;

function saveToFile(reqBody, replacer){
    var serviceName = reqBody.service;

    var dataFileName = path.join("./data/" + (serviceName + "/data.json")); //todo разобраться с правильным путём
    var commonInformationFileName = path.join("./data/" + (serviceName + "/commonInformation.json"));

    fs.readFile(dataFileName, 'utf8', function(error, actualDataFile){
        if(error)
            throw error;
        else{
            var actualData = actualDataFile.split('\n');
            var oldData = JSON.stringify(reqBody.oldData, replacer, '\t').split('\n');
            var newData = JSON.stringify(reqBody.data, replacer, '\t').split('\n');

            var patch = diff3.diffPatch(oldData, newData);

            actualData = diff3.patch(actualData, patch);

            fs.writeFile(dataFileName, actualData.join('\n'), {"encoding": 'utf8'}, function(error){
                if(error){
                    console.error(error);
                    return false
                } else{
                    console.log("New data saved to file %s", dataFileName);

                    return saveCommonInformation(reqBody.weight, commonInformationFileName);
                }
            });
        }
    });
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