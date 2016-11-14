function collapseElementAndChangeState(elementId) {
    var listItemId = getNodeId(elementId);
    var ulId = getUlId(listItemId);
    var markerId = getMarkerId(listItemId);

    var initialUlClass = document.getElementById(ulId).className;
    var initialMarkerClass = document.getElementById(markerId).className;

    if (localStorage.getItem("found") == true) {
        fixateExpandedState();
        localStorage.removeItem("found");
    }

    var isCollapsed;
    var service = localStorage.getItem("service");
    var expandedElementsIds = JSON.parse(localStorage.getItem(service + "_expanded")).ids;

    if (initialUlClass.search("hidden") == -1) {//collapse
        document.getElementById(ulId).className += ' hidden';
        document.getElementById(markerId).className += ' close';
        expandedElementsIds.splice(expandedElementsIds.indexOf(listItemId), 1);
        isCollapsed = true;
    } else {//expand
        document.getElementById(ulId).className = initialUlClass.replace(' hidden', '');
        document.getElementById(markerId).className = initialMarkerClass.replace(' close', '');
        expandedElementsIds.push(listItemId);
        isCollapsed = false;
    }

    var currentListState = JSON.parse(localStorage.getItem(service + "_listState"));
    if (currentListState.collapsed || currentListState.expanded) {
        resetCollapseAndExpandState(service);
    } else {
        localStorage.setItem(service + "_expanded", JSON.stringify({ids: expandedElementsIds}));
    }
    return isCollapsed;
}

function resetCollapseAndExpandState(service) {
    localStorage.setItem(service + "_listState", JSON.stringify({expanded: false, collapsed: false}));
    resetAllocationButton("collapseAllButton");
    resetAllocationButton("expandAllButton");
    localStorage.setItem(service + "_expanded", JSON.stringify({ids: getExpandStatesFromPage()}));
}

function getCollapsesStatesFromStorage() {
    var service = localStorage.getItem("service");
    var allElementsIds = getAllItemsIds();
    var collapsedElementsIds = JSON.parse(localStorage.getItem(service + "_expanded")).ids;
    if (collapsedElementsIds == null || allElementsIds.length == 0)
        return;
    var collapsesStates = [];

    allElementsIds.forEach(function (id) {
        if (document.getElementById(id + "_ChildrenUl") != null)
            collapsesStates.push({
                id: id,
                isCollapsed: collapsedElementsIds.indexOf(id) != -1
            })
    });

    return collapsesStates;
}

function getAllItemsIds() {
    var allElements = document.getElementsByClassName("listItemId");
    var allElementsIds = [];
    for (var i = 0; i < allElements.length; i++)
        allElementsIds.push(allElements[i].id);
    return allElementsIds;
}

function collapseAll() {
    var liControls = document.getElementsByTagName("li");

    for (var i = 0; i < liControls.length; i++) {
        var markerId = getMarkerId(liControls[i].id);
        var ulId = getUlId(liControls[i].id);

        if (document.getElementById(ulId) == null)
            continue;

        var initialUlClass = document.getElementById(ulId).className;

        if (initialUlClass.search("hidden") == -1) {
            document.getElementById(ulId).className += ' hidden';
            document.getElementById(markerId).className += ' close';
        }
    }
    //changeButtonIconByClick("collapse");
}

function expandAll() {
    var liControls = document.getElementsByTagName("li");
    for (var i = 0; i < liControls.length; i++) {

        var ulId = getUlId(liControls[i].id);
        var markerId = getMarkerId(liControls[i].id);

        if (document.getElementById(ulId) == null)
            continue;

        var initialUlClass = document.getElementById(ulId).className;
        var initialMarkerClass = document.getElementById(markerId).className;

        if (initialUlClass.search("hidden") != -1) {
            document.getElementById(ulId).className = initialUlClass.replace(' hidden', '');
            document.getElementById(markerId).className = initialMarkerClass.replace(' close', '');
        }
    }
    //changeButtonIconByClick("expand");
}

function expandAllByClick() {
    var service = localStorage.getItem("service");
    var listState = JSON.parse(localStorage.getItem(service + "_listState"));

    if (listState.expanded) {
        restoreUnexpandedState();
        resetAllocationButton("expandAllButton")
    } else if (listState.collapsed) {
        listState.collapsed = false;
        resetAllocationButton("collapseAllButton");
        fixateExpandedState();
        expandAll();
        allocateButton("expandAllButton");
    } else {
        expandAll();
        allocateButton("expandAllButton");
    }
    listState.expanded = !listState.expanded;
    listState.collapsed = false;

    localStorage.setItem(service + "_listState", JSON.stringify(listState));
}

function collapseAllByClick() {
    var service = localStorage.getItem("service");
    var listState = JSON.parse(localStorage.getItem(service + "_listState"));

    if (listState.collapsed) {
        restoreExpandedState();
        resetAllocationButton("collapseAllButton")
    } else if (listState.expanded) {
        listState.expanded = false;
        resetAllocationButton("expandAllButton");
        fixateExpandedState();
        collapseAll();
        allocateButton("collapseAllButton");
    } else {
        collapseAll();
        allocateButton("collapseAllButton");
    }
    listState.collapsed = !listState.collapsed;
    listState.expanded = false;

    localStorage.setItem(service + "_listState", JSON.stringify(listState));
}

function restoreState() {
    var service = localStorage.getItem("service");
    var state = JSON.parse(localStorage.getItem(service + "_listState"));
    if (state.collapsed) {
        collapseAll();
        return;
    }
    if (state.expanded) {
        expandAll();
        return;
    }
    restoreExpandedState();
}

function restoreUnexpandedState() {
    var collapsesStates = getCollapsesStatesFromStorage();
    collapsesStates.forEach(function (item) {
        if (!item.isCollapsed) {
            collapseElement(item.id);
        }
    })
}

function restoreExpandedState() {
    var collapsesStates = getCollapsesStatesFromStorage();
    if (collapsesStates.length == 0)
        return;
    collapsesStates.forEach(function (item) {
        if (item.isCollapsed) {
            collapseElement(item.id);
        }
    })
}

function expandElementIfNeed(id) {
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

function collapseElementIfNeed(id) {
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

function collapseElement(id) {
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

function expandAllChildren(id) {
    //todo
}

function fixateExpandedState() {
    var service = localStorage.getItem("service");
    var collapsesStates = getExpandStatesFromPage();
    localStorage.setItem(service + "_expanded", JSON.stringify({ids: collapsesStates}));
}

function getExpandStatesFromPage() {
    var allItemsIds = getAllItemsIds();
    var collapses = [];

    allItemsIds.forEach(function (item) {
        var ulId = getUlId(item);

        if (document.getElementById(ulId) != null && document.getElementById(ulId).className.search("hidden") == -1) {
            collapses.push(item);
        }
    });

    return collapses;
}

/*function changeButtonIconByClick(actionName) {
 var id;
 switch (actionName) {
 case "collapse":
 id = "collapseAllButton";
 break;
 case "expand":
 id = "expandAllButton";
 break;
 default :
 console.error("incorrect action " + actionName);
 }
 switchClass(id, "active");
 }*/

function createListState(service) {
    if (location.href.indexOf('converter') != -1)
        location.href = location.href.replace('converter', service);
    localStorage.setItem("service", service);
    if (localStorage.getItem(service + "_expanded") == null)
        localStorage.setItem(service + "_expanded", JSON.stringify({ids: []}));
    clearFoundResultsFromStorage();
    if (localStorage.getItem(service + "_listState") == null)
        localStorage.setItem(service + "_listState", JSON.stringify(
            {
                collapsed: false,
                expanded: false
            }
        ));
}

function clearActivateClass() { //hack
    var state = JSON.parse(localStorage.getItem(service + "_listState"));
    if (!state.collapsed) {
        resetAllocationButton("collapseAllButton");
    }
    if (!state.expanded) {
        resetAllocationButton("expandAllButton")
    }
}

function resetAllocationButton(buttonId) {
    document.getElementById(buttonId).className = document.getElementById(buttonId).className.replace('active').trim();
}

function allocateButton(buttonId) {
    document.getElementById(buttonId).className += ' active';
}

function collapseOrExpandWithChildren(id, isCollapsed) {
    var childrenIds = getChildren(getNodeId(id));
    childrenIds.forEach(function (item) {
        if (document.getElementById(getUlId(getNodeId(item.id))) != null) {
            if (isCollapsed) {
                collapseElementIfNeedAndChangeState(item.id);
            }
            else {
                expandElementIfNeedAndChangeState(item.id);
            }
            collapseOrExpandWithChildren(item.id, isCollapsed);
        }
    })
}

function collapseOrExpandElementByClick(id, event) {
    var isCollapsed = collapseElementAndChangeState(id);
    if (event.ctrlKey) {
        collapseOrExpandWithChildren(id, isCollapsed);
    }
}

function collapseElementIfNeedAndChangeState(id) {
    if (collapseElementIfNeed(id)) {
        var service = localStorage.getItem("service");
        var collapsedElementsIds = JSON.parse(localStorage.getItem(service + "_expanded")).ids;
        collapsedElementsIds.splice(collapsedElementsIds.indexOf(id), 1);
        localStorage.setItem(service + "_expanded", JSON.stringify({ids: collapsedElementsIds}));
    }
}

function expandElementIfNeedAndChangeState(id) {
    if (expandElementIfNeed(id)) {
        var service = localStorage.getItem("service");
        var collapsedElementsIds = JSON.parse(localStorage.getItem(service + "_expanded")).ids;
        collapsedElementsIds.push(collapsedElementsIds.indexOf(id));
        localStorage.setItem(service + "_expanded", JSON.stringify({ids: collapsedElementsIds}));
    }
}
