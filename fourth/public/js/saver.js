var fs = require('fs');
var path = require('path');

function saveToFile(serviceName, data, replacer){
    var fullFileName = path.join("./data/" + (serviceName + "/data.json")); //todo ����������� � ���������� ����
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