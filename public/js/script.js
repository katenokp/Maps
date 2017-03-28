function editDataFile(){
    var service = localStorage.getItem("service");

    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/converter?service=" + service, true);
    xhr.send();

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                location.href = "/converter";
            }
        }
    }
}

function setDropDownValue(elemId, dropDownType){

    var listItemId = getLiId(elemId, dropDownType);
    var dropButtonId = getDropDownButtonId(listItemId, dropDownType);

    var dropDownClassName = document.getElementById(elemId).className;

    document.getElementById(dropButtonId).className = "dropButton " + dropDownClassName;

    markChangedItem(elemId);
}

function switchDropDownList(elemId, dropDownType) {
    var listItemId = getLiId(elemId);
    var dropDownId = getDropDownId(listItemId, dropDownType);

    var className = document.getElementById(dropDownId).className;

    if(className.search("hidden") == -1){
        document.getElementById(dropDownId).className += ' hidden';
    } else {
        document.getElementById(dropDownId).className = className.replace(' hidden', '');
    }
}

function hideAllDropDownLists(event) {

    if (!event) event = window.event;

    var id = (event.target || event.srcElement).id;

    if( id.search("Priority_Button") != -1 || id.search("User_Button") != -1)
        return;

    var dropLists = document.getElementsByClassName("dropContent");

    for (var i = 0; i < dropLists.length; i++) {
        var dropDownId = dropLists[i].id;

        var className = document.getElementById(dropDownId).className;

        if(className.search("hidden") == -1){
            document.getElementById(dropDownId).className += ' hidden';
        }
    }
}

function markChangedItem(controlId){
    var liId = getLiId(controlId);
    var itemId = getItemId(liId);

    var itemClass = document.getElementById(itemId).className;

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

function getDropDownId(listItemIndex, dropDownType) {
    return listItemIndex + getDropDownPrefix(dropDownType) + "_DropDown";
}

function getDropDownButtonId(listItemIndex, dropDownType) {
    return listItemIndex + getDropDownPrefix(dropDownType) + "_Button";
}

function getDropDownPrefix(dropDownType){
    switch (dropDownType.toLowerCase()){
        case 'priority' : return '_Priority';
        case 'user' : return '_User';
        default : return '';
    }
}