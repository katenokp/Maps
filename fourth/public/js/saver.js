var fs = require('fs');
var path = require('path');

function saveToFile(data, fileName){
    var fullFileName = path.join("./data/" + fileName); //todo разобраться с правильным путём
    console.warn("file path: %s", fullFileName);
    fs.writeFile(fullFileName, JSON.stringify(data, null, '\t'), {"encoding": 'utf8'}, function(error){
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