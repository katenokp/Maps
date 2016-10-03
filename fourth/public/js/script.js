function collapseElement(elementId) {
    var listItemId = getLiId(elementId);
    var ulId = getUlId(listItemId);
    var markerId = getMarkerId(listItemId);

    var initialUlClass = document.getElementById(ulId).className;
    var initialMarkerClass = document.getElementById(markerId).className;

    if (initialUlClass.search("hidden") == -1) {
        document.getElementById(ulId).className += ' hidden';
        document.getElementById(markerId).className += ' close';
    } else {
        document.getElementById(ulId).className = initialUlClass.replace(' hidden', '');
        document.getElementById(markerId).className = initialMarkerClass.replace(' close', '');
    }
}

function collapseAll() {
    var liControls = document.getElementsByTagName("li");

    for (var i = 0; i < liControls.length; i++) {
        var markerId = getMarkerId(liControls[i].id);
        var ulId = getUlId(liControls[i].id);

        if(document.getElementById(ulId) == null)
            break;

        var initialUlClass = document.getElementById(ulId).className;

        if (initialUlClass.search("hidden") == -1) {
            document.getElementById(ulId).className += ' hidden';
            document.getElementById(markerId).className += ' close';
        }
    }
}

function expandAll() {
    var liControls = document.getElementsByTagName("li");
    for (var i = 0; i < liControls.length; i++) {

        var ulId = getUlId(liControls[i].id);
        var markerId = getMarkerId(liControls[i].id);

        if(document.getElementById(ulId) == null)
            break;

        var initialUlClass = document.getElementById(ulId).className;
        var initialMarkerClass = document.getElementById(markerId).className;

        if (initialUlClass.search("hidden") != -1) {
            document.getElementById(ulId).className = initialUlClass.replace(' hidden', '');
            document.getElementById(markerId).className = initialMarkerClass.replace(' close', '');
        }
    }
}

function setPriority(elemId){

    var listItemId = getLiId(elemId);
    var dropButtonId = getDropButtonId(listItemId);

    var priorityClassName = document.getElementById(elemId).className;

    document.getElementById(dropButtonId).className = "dropButton " + priorityClassName;

    markChangedItem(elemId);
}

function switchDropdownList(elemId) {
    var listItemId = getLiId(elemId);
    var dropdownId = getDropdownId(listItemId);

    var className = document.getElementById(dropdownId).className;

    if(className.search("hidden") == -1){
        document.getElementById(dropdownId).className += ' hidden';
    } else {
        document.getElementById(dropdownId).className = className.replace(' hidden', '');
    }
}

function hideAllDropdownLists(event) {

    if (!event) event = window.event;

    if((event.target || event.srcElement).id.search("PriorityButton") != -1)
        return;

    var dropLists = document.getElementsByClassName("dropContent");

    for (var i = 0; i < dropLists.length; i++) {
        var dropdownId = dropLists[i].id;

        var className = document.getElementById(dropdownId).className;

        if(className.search("hidden") == -1){
            document.getElementById(dropdownId).className += ' hidden';
        }
    }
}

function markChangedItem(controlId){
    var liId = getLiId(controlId);
    var itemId = getItemId(liId);

    var itemClass =document.getElementById(itemId).className;

    if(itemClass.search("changed") == -1)
        document.getElementById(itemId).className += " changed";
}

function unmarkAllItems(){
    var linkControls = document.getElementsByTagName("a");

    for (var i = 0; i < linkControls.length; i++) {
        if(linkControls[i].id.search("_Item") == -1)
            continue;

        var listItemClass = linkControls[i].className;

        if(listItemClass.search("changed") != -1)
            linkControls[i].className = linkControls[i].className.replace(' changed', '');
    }
}

function keyCodeSave(){
    document.body.addEventListener('keydown', function (e) {
        if ((e.keyCode === 83) && (e.ctrlKey)) {
            e.preventDefault();
            (console.log("ok"));
        }
    });
}

function extensionGrayLines(){
    var liElements = document.getElementsByTagName("li");
    var extensionValue = 0;

    for (var i = 1; i < liElements.length; i++) {
        var previousLi = liElements[i - 1];
        var currentLi = liElements[i];

        var previousLiStyles = window.getComputedStyle(previousLi, null);
        var previousA = window.$(previousLiStyles + " a");
        var previousLiTextStyles = window.getComputedStyle(previousA, null);

        extensionValue = parseInt(previousLiStyles.height) - parseInt(previousLiTextStyles.height);

        if(extensionValue != 0)
            currentLi.firstChild.style = "padding-top: " + extensionValue + "px";
    }
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
            if(xhr.status == 200) {
                console.log(xhr.response);
            }
            else{
                console.log("Error: can't save data")
            }
        }
        /*xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send(dataJson);
        xhr.end();

        alert(xhr.responseText);*/
    };
    /*xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    try{
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send(data);
    }
    catch(e){alert('error: '+ e)}*/
}

function getDataForSave(){
    var line = getItem(document.getElementById('root').children[0].id);
    return line;
}

function getItem(idItem){ //todo rename
    return(
    {
        name: document.getElementById(idItem + '_Item').innerHTML,
        id: idItem,
        isDone: document.getElementById(idItem + '_Checkbox').checked
    });
}

function getItemId(liId){
    return liId + "_Item";
}

function getLiId(elemId) {
    return elemId.split("_")[0];
}

function getUlId(listItemIndex) {
    return listItemIndex + "_ChildrenUl";
}

function getMarkerId(listItemIndex) {
    return listItemIndex + "_Marker";
}

function getDropdownId(listItemIndex) {
    return listItemIndex + "_PriorityDropDown";
}

function getDropButtonId(listItemIndex) {
    return listItemIndex + "_PriorityButton";
}