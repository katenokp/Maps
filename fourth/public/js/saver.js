var fs = require('fs');
var path = require('path');

function saveToFile(data, fileName){
    var fullFileName = path.join("./data/" + fileName);
    console.warn("file path: %s", fullFileName);
    fs.writeFile(fullFileName, JSON.stringify(data, null, '\t'), {"encoding": 'utf8'}, function(error){
        if(error){
            console.error(error);
            return false;
        } else{
            return true;
        }
    });

}

module.exports = saveToFile;