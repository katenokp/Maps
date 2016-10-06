var fs = require('fs');
var path = require('path');

function saveToFile(data, serviceName, replacer){
    var fullFileName = path.join("./data/" + ("saved" + serviceName + "Data.json")); //todo разобраться с правильным путём
    console.warn("file path: %s", fullFileName);
    fs.writeFile(fullFileName, JSON.stringify(data, replacer, '\t'), {"encoding": 'utf8'}, function(error){
        if(error){
            console.error(error);
            return false;
        } else{
            console.log("Data saved to file %s", fullFileName);
            return true;
        }
    });

}

module.exports = saveToFile;