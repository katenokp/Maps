var fs = require('fs');
var save = require('./saver');

function prepareFile(fileName){
    fs.readFile(fileName, 'utf8', function(error, data){
        if(error){
            throw error;
        } else{
            var preparedData = normalizeData(data);
            save(preparedData, fileName, ["name", "id", "isDone", "comment", "priority", "weight", "children", "done", "all"]);
        }
    })
}

function normalizeData(data){

    var parsedData = JSON.parse(data);
    parsedData.forEach(function(item){
        prepareItem(item);
    });
    return parsedData;
}

function prepareItem(item){
    if(item.id == null){
        item.id = 'id' + getNewGuid();
    }

    var priority = item.priority;
    if(priority == null || priority > 5 || priority<0){
        item.priority = 0; //todo выкинуть эту проверку из рендеринга
    }

    if(item.isDone == null){
        item.isDone = false;
    }

    if(item.children != null){
        var childrenWeightSum = {
            done:0,
            all:0
        };
        item.children.forEach(function(childItem){
            var childWeight = prepareItem(childItem); //todo не очевидно, что childItem при этом тоже нормализуется
            childrenWeightSum = {
                done: childrenWeightSum.done + childWeight.done,
                all: childrenWeightSum.all + childWeight.all
            }
        });
        item.weight = childrenWeightSum;
    } else{
        item.weight = {
            done:0,
            all:1
        };
    }

    return item.weight;
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

module.exports = normalizeData;