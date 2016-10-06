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

    if(item.weight == null || item.children != null){
        item.weight = calculateWeight(item);
    }
}

function calculateWeight(item){
    var children = item.children;

    if(children == null) {
        if(item.weight.all == 1 && item.weight.done == 0 && item.isDone)
            item.weight.done = 1;
        return item.weight;
    }

    return sumWeightsAllChildren(children);
}

function Weight(done, all){
    this.done = done;
    this.all = all
}

function sumWeightsAllChildren(children){
    var weight = new Weight(0, 0);
    children.forEach(function (item) {
        item.weight = calculateWeight(item);
        weight = sumWeights(weight, item.weight);
    });
    return weight;
}

function sumWeights(firstWeight, secondWeight){
    if(firstWeight == null)
        firstWeight = new Weight(0, 0);
    if(secondWeight == null)
        secondWeight = new Weight(0, 0);
    return new Weight(firstWeight.done + secondWeight.done, firstWeight.all + secondWeight.all);
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