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
    localStorage.setItem(service + "_listState", JSON.stringify({expanded: false, collapsed: false}))
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
        restoreExpandedState();
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
    restoreExpandedState();
}

function restoreUnexpandedState(){
    var collapsesStates = getCollapsesStates();
    collapsesStates.forEach(function(item){
        if(!item.isExpanded){
            collapseElement(item.id);
        }
    })
}

function restoreExpandedState(){
    var collapsesStates = getCollapsesStates();
    collapsesStates.forEach(function(item){
        if(item.isExpanded){
            collapseElement(item.id);
        }
    })
}

function expandElementIfNeed(id){
    var listItemId = getNodeId(id);
    var ulId = getUlId(listItemId);
    var markerId = getMarkerId(listItemId);

    var initialUlClass = document.getElementById(ulId).className;
    var initialMarkerClass = document.getElementById(markerId).className;

    if (initialUlClass.search("hidden") != -1) {
        document.getElementById(ulId).className = initialUlClass.replace(' hidden', '');
        document.getElementById(markerId).className = initialMarkerClass.replace(' close', '');
        return true;
    }
    return false;
}

function collapseElementIfNeed(id){
    var listItemId = getNodeId(id);
    var ulId = getUlId(listItemId);
    var markerId = getMarkerId(listItemId);

    var initialUlClass = document.getElementById(ulId).className;

    if (initialUlClass.search("hidden") == -1) {
        document.getElementById(ulId).className += ' hidden';
        document.getElementById(markerId).className += ' close';
        return true;
    }
    return false;
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

function expandAllChildren(id){
    //todo
}