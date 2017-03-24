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

function setUser(elemId){
    var listItemId = getLiId(elemId.replace('_user', ''));
    var dropButtonId = getDropButtonId(listItemId);

    var priorityClassName = document.getElementById(elemId).className;

    document.getElementById(dropButtonId).className = "dropButton " + priorityClassName;

    markChangedItem(elemId);
}

function setPriority(elemId){

    var listItemId = getLiId(elemId);
    var dropButtonId = getDropButtonId(listItemId);

    var priorityClassName = document.getElementById(elemId).className;

    document.getElementById(dropButtonId).className = "dropButton " + priorityClassName;

    markChangedItem(elemId);
}

function switchUserDropdownList(elemId) {
    var listItemId = getLiId(elemId.replace('_user', ''));
    var dropdownId = getDropdownId(listItemId);

    var className = document.getElementById(dropdownId).className;

    if(className.search("hidden") == -1){
        document.getElementById(dropdownId).className += ' hidden';
    } else {
        document.getElementById(dropdownId).className = className.replace(' hidden', '');
    }
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