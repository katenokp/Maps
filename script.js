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

    if(event.target.id.search("PriorityButton") != -1)
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
    var items = document.getElementsByClassName("listItemLink");

    for (var i = 0; i < items.length; i++) {
        var itemClass = items[i].className;

        if(itemClass.search("changed") != -1)
            items[i].className = items[i].className.replace(' changed', '');
    }
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