function getDataForSave(){
    var line = getItem(document.getElementById('root').children[0].id);
    return line;
}

function getItem(idItem){ //todo rename
    return(
    {
        name: document.getElementById(idItem + '_Item').innerHTML,
        id: idItem,
        isDone: document.getElementById(idItem + '_Checkbox').checked,
        priority: getPriority(idItem),
        comment: document.getElementById(idItem + "_commentInput").value
    });
}

function getPriority(idItem){
    var button = document.getElementById(idItem + "_PriorityButton");
    if(button.className.indexOf("priority") == -1)
        return 0;
    var priorityClass = button.className.replace(/dropButton /, "").replace(/dropLink /, "").replace("priority", "");
    if(priorityClass == "Default")
        return 0;
    return parseInt(priorityClass);
}

function getWeight(idItem){

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