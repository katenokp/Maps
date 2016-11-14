var fs = require('fs');
var save = require('./saver');
var replacer = require('./replacerForJSON');

function prepareFile(fileName) {
    fs.readFile(fileName, 'utf8', function (error, data) {
        if (error) {
            throw error;
        } else {
            var preparedData = normalizeData(data);
            saveNormalizedData(preparedData, fileName, replacer);
        }
    })
}


function saveNormalizedData(preparedData, dataFileName, replacer) {

}

function normalizeData(data) {

    var parsedData = JSON.parse(data);
    normalizeItemsArray(parsedData);
    return parsedData;
}

function normalizeItemsArray(itemsArray) {
    itemsArray.forEach(function (item) {
        prepareItem(item);
        if (item.children != null && item.children.length == 0)
            item.children = undefined;
        if (item.children != undefined) {
            normalizeItemsArray(item.children);
        }
    });
}

function prepareItem(item) {
    if (item.id == null || item.id.trim() == "") {
        item.id = 'id' + getNewGuid();
    }

    item.name = changeQuotes(item.name);
    if (item.comment != undefined && item.comment.trim() != "" && item.comment != null)
        item.comment = changeQuotes(item.comment);

    var priority = item.priority;
    if (priority == null || priority > 5 || priority < 0) {
        item.priority = 0; //todo выкинуть эту проверку из рендеринга
    }

    if (item.isDone == null) {
        item.isDone = false;
    }

    if (item.children != undefined && item.children.length == 0) {
        item.children = undefined;
        item.weight = calculateWeight(item);
    }

    if (item.children == undefined){
        item.weight = calculateWeight(item);
    }

    if (item.weight == undefined) {
        item.weight = calculateWeight(item);
    }
}

function changeQuotes(str) {
    if (str == null)
        return null;
    return str.replace(/'([^']*)'/g, "«$1»").replace("'", "«").
        replace(/"([^"]*)"/g, "«$1»").replace('"', "«");
}

function calculateWeight(item) {
    var children = item.children;

    if (children == null) {
        if (item.weight == null) {
            return {
                done: item.isDone ? 1 : 0,
                all: 1
            }
        }
        if (item.weight.all == 1 && item.weight.done == 0 && item.isDone)
            item.weight.done = 1;
        return item.weight;
    }

    return sumWeightsAllChildren(children);
}

function Weight(done, all) {
    this.done = done;
    this.all = all;
}

function sumWeightsAllChildren(children) {
    var weight = new Weight(0, 0);
    children.forEach(function (item) {
        item.weight = calculateWeight(item);
        weight = sumWeights(weight, item.weight);
    });
    return weight;
}

function sumWeights(firstWeight, secondWeight) {
    if (firstWeight == null)
        firstWeight = new Weight(0, 0);
    if (secondWeight == null)
        secondWeight = new Weight(0, 0);
    return new Weight(firstWeight.done + secondWeight.done, firstWeight.all + secondWeight.all);
}

/**
 * @return {string}
 */
function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

function getNewGuid() {
    return (S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
}

module.exports.normalizeData = normalizeData;