var normalize = require("./prepareData");

var linesLevels;
var index;


function parse(data) {
    var lines = data.split('\r\n');
    linesLevels = [];
    lines.forEach(function (line) {
        linesLevels.push(getStringLevel(line));
    });
    var result = parseAll(linesLevels);
    return {weight: calculateWeight(result), children: result};
}

function calculateWeight(itemsArray, currentCommonWeight){
    if(currentCommonWeight == undefined)
        currentCommonWeight = {all: 0, done: 0};
    if(itemsArray.length == undefined)
        throw new Error("Bad JSON file")
    itemsArray.forEach(function(item){
        if(item.children == null){
            item.weight = {all: 1, done: 0};
        }
        else if(item.children.length == 0){
            item.children = undefined;
            item.weight = {all: 1, done: 0};
        }
        else{
            item.weight = calculateWeight(item.children);
        }
        currentCommonWeight.all += item.weight.all;
    });
    return currentCommonWeight;
}


/*function calculateCompleteness(data, result) {

    data.forEach(function (item) {
        result.push({
            name: item.name,
            comment: item.comment,
            weight: normalizeWeight(item)
        });
        if (item.children != null) {
            calculateCompleteness(item.children, result);
        }
    });
}

function sumWeights(item) {
    if (item.children == null) {
        return {all: 1, done: 0};
    }
    if (item.children.length == 0) {
        item.children = undefined;
        return {all: 1, done: 0};
    }
    return calculateWeights(item.children);
}

function calculateWeights(itemsArray) {
    var weight = {all: 0, done: 0};
    itemsArray.forEach(function (item) {
        var itemWeight = sumWeights(item);
        item.weight = itemWeight;
        weight.all += item.weight.all;
    })
}*/

/*function calculateCompleteness(data){
 var result = {
 all: 0,
 done: 0
 };
 if(data.children == null){
 if(data.weight == null){
 result = {
 all: 1,
 done: data.isDone ? 1: 0
 };

 } else{
 result = data.weight;
 }
 } else{
 data.children.forEach(function(child){
 var childrenWeight = calculateCompleteness(child);
 result = {
 all: result.all + childrenWeight.all,
 done: result.done + childrenWeight.done
 }
 })
 }
 console.log("weight for %s: %d/%d", data.id, result.done, result.all);
 return result;

 }*/

function normalizeWeight(item) {
    var weight;
    var children = item.children;
    if (children == null) {
        if (item.weight == null) {
            weight = {
                all: 1,
                done: item.isDone ? 1 : 0
            };

        } else {
            weight = item.weight;
        }
    } else {
        var doneChildrenCount = 0;
        children.forEach(function (child) {
            if (child.isDone)
                doneChildrenCount++;
        });
        weight = {
            all: children.length,
            done: doneChildrenCount
        };
    }
    console.log("weight for %s: %d/%d", item.id, weight.done, weight.all);
    return weight;
}

function parseAll() {
    var result = [];
    if (linesLevels[0].level != 0)
        throw new Error('Bad structure on position 0');

    index = 0;
    while (index < linesLevels.length) {
        if (index == linesLevels.length - 1) {
            result.push({
                name: linesLevels[index].line
            });
            index++;
        }
        else {
            result.push({
                name: linesLevels[index].line,
                children: findAllChildrenOfItem(index)
            });
        }
    }

    return result;
}

function findAllChildrenOfItem() {
    var itemIndex = index;
    index++;
    var children = [];
    while (index < linesLevels.length) {
        //console.log(linesLevels[index].line + ", ", linesLevels[index].level);
        var relationship = getRelationship(linesLevels[itemIndex], linesLevels[index]);
        if (relationship == 'child') {
            children.push({
                name: linesLevels[index].line,
                comment: linesLevels[index].comment
                //weight: {done: 0, all: 1} //todo
            });
            index++;
        }
        else if (relationship == 'childOfChild') {
            index--;
            children[children.length - 1].children = findAllChildrenOfItem(linesLevels, index);
        }
        else if (relationship == 'neighbor' || 'nextNode') {
            return children;
        }
    }
    return children;

}


function getRelationship(firstItem, secondItem) {
    var levelsDifferent = firstItem.level - secondItem.level;
    if (levelsDifferent < -2)
        console.log('Bad structure, firstItem: {%s, %d}, secondItem: {%s, %d}', firstItem.line, firstItem.level, secondItem.line, secondItem.level);
    switch (levelsDifferent) {
        case  -1:
            return 'child';
        case  0:
            return 'neighbor';
        case -2:
            return "childOfChild";
        default :
            return 'nextNode';
    }
}


function getStringLevel(str) {
    var regexp = /^([ \t]+)([\d'"+-@#_№!%а-яА-Я\w].*)(?:->(['"+-@#_№!%а-яА-Я\w].*))?$/;
    var matches = str.match(regexp);
    if (matches == null)
        return {
            level: 0,
            line: str
        };
    //console.log("for line %s level %d", matches[0], matches[1].length);
    return {
        level: matches[1].length,
        line: matches[2],
        comment: matches[3]
    }

}

module.exports = parse;
