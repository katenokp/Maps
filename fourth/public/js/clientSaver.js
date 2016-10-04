function getDataForSave(){
    var line = getItem(document.getElementById('root').children[0].id);
    return line;
}

function getItem(idItem){ //todo rename
    return(
    {
        name: getNodeName(idItem),
        id: idItem,
        isDone: getIsDone(idItem),
        priority: getPriority(idItem),
        comment: document.getElementById(idItem + "_commentInput").value,
        weight: getWeight(idItem)
    });
}

function getPriority(idItem){
    var button = document.getElementById(idItem + "_PriorityButton");
    if(~button.className.indexOf("priority"))
        return 0;
    var priorityClass = button.className.replace(/dropButton /, "").replace(/dropLink /, "").replace("priority", "");
    if(priorityClass == "Default")
        return 0;
    return parseInt(priorityClass);
}

function getWeight(idItem){
    var weightText = document.getElementById(idItem + '_indexInput').value;
    if(weightText == '')
        return {
            done : getIsDone(idItem) ? 1: 0,
            all : 1
        };
    var regexp = /(\d+?)[/\\;:&@](\d+?)/;
    var weightValues = weightText.match(regexp);
    if(weightValues.length != 3 || weightValues[1] > weightValues[2])
        throw new Error("Incorrect weight %s for node %s", weightText, getNodeName(idItem));
    return{
        done: weightValues[1],
        all: weightValues[2]
    }

}

function getNodeName(idItem){
    return document.getElementById(idItem + '_Item').innerHTML;
}

function getIsDone(idItem){
    return document.getElementById(idItem + '_Checkbox').checked
}

function save(){
    var data = getDataForSave();
    var dataJson = JSON.stringify(data);
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