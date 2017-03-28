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

function getDropDownValue(idItem, dropDownType){
    var idNode = getNodeId(idItem);
    var button = document.getElementById(idNode + "_"+ dropDownType + "_Button");
    if(button.className.indexOf(dropDownType.toLowerCase()) == -1)
        return 0;
    var regexp = dropDownType.toLowerCase() + '(\\d+|\\w+)';
    var matches = button.className.match(regexp);
    var priorityClass = matches[1];
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
    return parseWeight(weightText);
}

function parseWeight(weightText){
    var regexp = /(\d+?)[/\\;:&@](\d+)/;
    var weightValues = weightText.match(regexp);
    if(weightValues.length != 3 || parseInt(weightValues[1]) > parseInt(weightValues[2]))
        console.log("Incorrect weight %s for node %s", weightText, getNodeName(idItem));
    return new Weight(parseInt(weightValues[1]), parseInt(weightValues[2]));
}

function getRootWeight(){
    var weightText = document.getElementById('root_indexInput').innerHTML;
    return parseWeight(weightText);
}

function getNodeName(idItem){
    var idNode = getNodeId(idItem);
    return document.getElementById(idNode + '_Item').innerHTML;
}

function getIsDone(idItem){
    var idNode = getNodeId(idItem);
    return document.getElementById(idNode + '_Checkbox').checked
}

function getWeightString(weight){
    if(weight == null)
        return '';
    return weight.done + '\/' + weight.all;
}

function getNodeId(id){
    var matches = id.match('(.+)_[^_]+$');
    if(matches == null)
        return id;
    return matches[matches.length-1];
    //var prefixes = ['_Checkbox', '_PriorityButton', '_PriorityDropDown', '_Item', '_commentInput', '_indexInput'];
}

function getParentUlId(nodeId){
    return document.getElementById(nodeId).closest('ul').id;
}

function getParentId(nodeId){
    return getNodeId(getParentUlId(nodeId));
}

function getAllParentsIds(id){
    var parentsIds = [];
    var parentId = getParentId(id);
    while(parentId != "root"){
        parentsIds.push(parentId);
        parentId = getParentId(parentId);
    }
    return parentsIds;
}

