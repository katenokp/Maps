function search(event){
    if(event.keyCode != 13)
        return;
    var value = document.getElementById("Search").value;
    if(value.trim() == "")
        clearResult();
    var viewedResultNumber = localStorage.getItem("viewedResultNumber");
    var foundElementsIds;
    if(viewedResultNumber == null){
        foundElementsIds = searchAllElements(value);
        localStorage.setItem("foundElementsIds", JSON.stringify(foundElementsIds));
        localStorage.setItem("searchValue", value);
        localStorage.setItem("viewedResultNumber", "0"); //todo
    } else{
        foundElementsIds = JSON.parse(localStorage.getItem("foundElementsIds"));
    }
    var currentFoundElementId = nextValue(foundElementsIds);



}

function uncollapseFoundElement(){

}

function getAllParentsIds(){

}

function nextValue(foundElementsIds){
    var foundElementsCount = foundElementsIds.length;
    var viewedResultNumber = parseInt(localStorage.getItem("viewedResultNumber"));
    if(viewedResultNumber == foundElementsCount - 1) {
        localStorage.setItem("viewedResultNumber", "0");
        return foundElementsIds[foundElementsCount-1];
    }
    localStorage.setItem("viewedResultNumber", viewedResultNumber + 1);
    return foundElementsIds[viewedResultNumber];
}

function searchAllElements(str){
    var nodesNames = document.getElementsByClassName("itemName");
    var searchNodesNamesIds = [];
    for(var i=0; i<nodesNames.length; i++){
        if(nodeNameContainsStr(nodesNames[i], str)){
            searchNodesNamesIds.push(getNodeId(nodesNames[i].id));
            console.log(nodesNames[i].innerHTML);
        }
    }
    return searchNodesNamesIds;
}

function nodeNameContainsStr(node, str){
    var normalizedStr = normalizeStr(str);
    var normalizedNodeName = normalizeStr(node.innerHTML);
    return normalizedNodeName.includes(normalizedStr);
}

function normalizeStr(str){
    return str.toLowerCase().trim().replace(/ /g, '');
}

function clearResult(){
    localStorage.removeItem("foundElementsIds");
    localStorage.removeItem("searchValue");
    localStorage.removeItem("viewedResultNumber");
}