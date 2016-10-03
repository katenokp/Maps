var fs = require('fs');
var save = require('./saver');

function prepareFile(fileName){
    fs.readFile(fileName, 'utf8', function(error, data){
        if(error){
            throw error;
        } else{
            var preparedData = getData(data);
            save(preparedData, 'preparedData.json', ["name", "id", "isDone", "priority", "weight", "children", "all", "done"]);
        }
    })
}

function getData(data){

    var parsedData = JSON.parse(data);
    var dataArray = [];
    parsedData.forEach(function(item){
        prepareItem(item/*, dataArray*/);
    });
    return parsedData;
}

function prepareItem(item){
    if(item.id == null){
        item.id = getNewGuid();
    }

    var priority = item.priority;
    if(priority == null || priority > 5 || priority<0){
        item.priority = 0; //todo �������� ��� �������� �� ����������
    }

    if(item.isDone == null){
        item.isDone = false;
    }

    if(item.children != null){
        item.children.forEach(function(childItem){
            prepareItem(childItem);
        })
    }
}

function prepareData(data){

}

/**
 * @return {string}
 */
function S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}

function getNewGuid() {
    return (S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
}

module.exports = prepareFile;