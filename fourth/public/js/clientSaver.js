function readDataForSave(ulId){
    var lines = [];
    var elements = getChildElements(ulId);
    for(var i = 0; i<elements.length; i++){
        lines.push(readItem(elements[i].id));
    }
    return lines;
}

function readItem(idItem){ //todo rename
    var parsedItem = {
        name: getNodeName(idItem),
        id: idItem,
        isDone: getIsDone(idItem),
        priority: getPriority(idItem),
        comment: document.getElementById(idItem + "_commentInput").value,
        weight: getWeight(idItem)
    };
    var childrenUlId = getAllChildren(idItem);
    if(childrenUlId != null){
        parsedItem.children = readDataForSave(childrenUlId);
    }
    return parsedItem;
}

function save(){
    var serviceName = document.getElementById("saveButton").name;
    var data = readDataForSave('root_ChildrenUl');
    var dataJson = JSON.stringify({service: serviceName, data: data});

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/save", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(dataJson);

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                console.log(xhr.response);
            }
            else {
                console.log("Error: can't save data")
            }
        }
    }
}