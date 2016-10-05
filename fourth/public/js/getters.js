function getChildElements(ulId){
    return document.getElementById(ulId).children; //array of nodes
}

function getChildren(id){
    var ulId = getNodeId(id) + '_ChildrenUl';
    if(document.getElementById(ulId) == null)
        return null;
    return document.querySelectorAll('#' + ulId +' > li');
}

function getAllChildren(idItem){ //todo упростить
    var children = document.getElementById(idItem + "_ChildrenUl");
    if(children == undefined)
        return null;
    return children.id;
}

function getPriority(idItem){
    var idNode = getNodeId(idItem);
    var button = document.getElementById(idNode + "_PriorityButton");
    if(button.className.indexOf("priority") == -1)
        return 0;
    var priorityClass = button.className.replace(/dropButton /, "").replace(/dropLink /, "").replace("priority", "");
    if(priorityClass == "Default")
        return 0;
    return parseInt(priorityClass);
}

function getWeight(idItem){
    var idNode = getNodeId(idItem);
    var weightText = document.getElementById(idNode + '_indexInput').value;
    if(weightText == '')
        return {
            done : getIsDone(idNode) ? 1: 0,
            all : 1
        };
    var regexp = /(\d+?)[/\\;:&@](\d+)/;
    var weightValues = weightText.match(regexp);
    if(weightValues.length != 3 || weightValues[1] > weightValues[2])
        console.log("Incorrect weight %s for node %s", weightText, getNodeName(idItem));
    return new Weight(parseInt(weightValues[1]), parseInt(weightValues[2]));
}

function getNodeName(idItem){
    var idNode = getNodeId(idItem);
    return document.getElementById(idNode + '_Item').innerHTML;
}

function getIsDone(idItem){
    var idNode = getNodeId(idItem);
    return document.getElementById(idNode + '_Checkbox').checked
}

function getNodeId(id){
    var matches = id.match('([a-z|0-9|A-Z]+)_[a-z|0-9|A-Z]+$');
    if(matches == null)
        return id;
    return matches[matches.length-1];
    //var prefixes = ['_Checkbox', '_PriorityButton', '_PriorityDropDown', '_Item', '_commentInput', '_indexInput'];

}

