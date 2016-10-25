function collapseElementAndChangeState(elementId) {
    var listItemId = getNodeId(elementId);
    var ulId = getUlId(listItemId);
    var markerId = getMarkerId(listItemId);

    var initialUlClass = document.getElementById(ulId).className;
    var initialMarkerClass = document.getElementById(markerId).className;

    var service = localStorage.getItem("service");
    var collapsedElementsIds = JSON.parse(localStorage.getItem(service + "_collapses")).ids;

    if (initialUlClass.search("hidden") == -1) {
        document.getElementById(ulId).className += ' hidden';
        document.getElementById(markerId).className += ' close';
        collapsedElementsIds.splice(collapsedElementsIds.indexOf(listItemId), 1);
    } else {
        document.getElementById(ulId).className = initialUlClass.replace(' hidden', '');
        document.getElementById(markerId).className = initialMarkerClass.replace(' close', '');
        collapsedElementsIds.push(listItemId);
    }

    localStorage.setItem(service + "_collapses", JSON.stringify({ids: collapsedElementsIds}));
}

function getCollapsesStates(){
    var service = localStorage.getItem("service");
    var allElementsIds = getAllItemsIds();
    var collapsedElementsIds = JSON.parse(localStorage.getItem(service + "_collapses")).ids;
    var collapsesStates = [];

    allElementsIds.forEach(function(id){
        if(document.getElementById(id+"_ChildrenUl") != null)
        collapsesStates.push({
            id: id,
            isExpanded: collapsedElementsIds.indexOf(id) != -1
        })
    });

    return collapsesStates;
}

function getAllItemsIds(){
    var allElements = document.getElementsByClassName("listItemId");
    var allElementsIds = [];
    for(var i=0; i<allElements.length; i++)
        allElementsIds.push(allElements[i].id);
    return allElementsIds;
}

function collapseAll() {
    var liControls = document.getElementsByTagName("li");

    for (var i = 0; i < liControls.length; i++) {
        var markerId = getMarkerId(liControls[i].id);
        var ulId = getUlId(liControls[i].id);

        if(document.getElementById(ulId) == null)
            continue;

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
            continue;

        var initialUlClass = document.getElementById(ulId).className;
        var initialMarkerClass = document.getElementById(markerId).className;

        if (initialUlClass.search("hidden") != -1) {
            document.getElementById(ulId).className = initialUlClass.replace(' hidden', '');
            document.getElementById(markerId).className = initialMarkerClass.replace(' close', '');
        }
    }
}

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

function expandAllByClick(){
    var service = localStorage.getItem("service");
    var listState = JSON.parse(localStorage.getItem(service + "_listState"));

    if(listState.expanded) {
        restoreUnexpandedState();
    } else {
        expandAll();
    }
    listState.expanded = !listState.expanded;
    listState.collapsed = false;

    localStorage.setItem(service + "_listState", JSON.stringify(listState));
}

function collapseAllByClick(){
    var service = localStorage.getItem("service");
    var listState = JSON.parse(localStorage.getItem(service + "_listState"));

    if(listState.collapsed) {
        restoreUncollapsedState();
    } else {
        collapseAll();
    }
    listState.collapsed = !listState.collapsed;
    listState.expanded = false;

    localStorage.setItem(service + "_listState", JSON.stringify(listState));
}

function restoreState(){
    var service = localStorage.getItem("service");
    var state = JSON.parse(localStorage.getItem(service+"_listState"));
    if(state.collapsed) {
        collapseAll();
        return;
    }
    if(state.expanded) {
        expandAll();
        return;
    }
    restoreUncollapsedState();
}

function restoreUnexpandedState(){
    var collapsesStates = getCollapsesStates();
    collapsesStates.forEach(function(item){
        if(!item.isExpanded){
            collapseElement(item.id);
        }
    })
}

function restoreUncollapsedState(){
    var collapsesStates = getCollapsesStates();
    collapsesStates.forEach(function(item){
        if(item.isExpanded){
            collapseElement(item.id);
        }
    })
}

function collapseElement(id){
    var listItemId = getNodeId(id);
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