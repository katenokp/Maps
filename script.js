function collapseElement(elementId) {
    var listItemId = getListItemId(elementId);
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
    var listItems = document.getElementsByClassName("listItemLink");
    for (var i = 0; i < listItems.length; i++) {

        var ulId = getUlId(listItems[i].id);
        var markerId = getMarkerId(listItems[i].id);

        var initialUlClass = document.getElementById(ulId).className;

        if (initialUlClass.search("hidden") == -1) {
            document.getElementById(ulId).className += ' hidden';
            document.getElementById(markerId).className += ' close';
        }
    }
}

function setPriority(elemId){

    var listItemId = getListItemId(elemId);
    var dropButtonId = getDropButtonId(listItemId);

    var priorityClassName = document.getElementById(elemId).className;

    document.getElementById(dropButtonId).className = "PriorityDropDown " + priorityClassName;

    markChangedItem(elemId);
}

function switchDropdownList(elemId) {
    var listItemId = getListItemId(elemId);
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

    var itemId = getListItemId(controlId);
    document.getElementById(itemId).className += " changed";
}

function getListItemId(elemId) {
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