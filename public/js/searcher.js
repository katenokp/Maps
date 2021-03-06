function search(event) {
    if (event != null && event.keyCode != 13)
        return;
    var value = document.getElementById("Search").value;
    if (value.trim() == "") {
        clearFoundResult();
        return;
    }
    resetCollapseAndExpandState(localStorage.getItem("service"));
    if (localStorage.getItem("searchValue") != null && value != localStorage.getItem("searchValue")) {
        clearFoundResult();
    }
    var viewedResultNumber = localStorage.getItem("viewedResultNumber");
    var foundElementsIds;
    if (viewedResultNumber == null) {
        foundElementsIds = searchAllElements(value);
        if (foundElementsIds.length == 0)
            return;
        localStorage.setItem("found", "true");
        localStorage.setItem("foundElementsIds", JSON.stringify(foundElementsIds));
        localStorage.setItem("searchValue", value);
        localStorage.setItem("viewedResultNumber", "0");
    } else {
        foundElementsIds = JSON.parse(localStorage.getItem("foundElementsIds"));
        restorePreviousState();
    }
    var currentFoundElementId = nextValue(foundElementsIds);
    expandFoundElement(currentFoundElementId);
}

function expandFoundElement(foundElementId) {
    var parentIds = getAllParentsIds(foundElementId);
    var changedElementsIds = [];
    parentIds.forEach(function (item) {
        var isElementChanged = expandElementIfNeed(item);
        if (isElementChanged) {
            changedElementsIds.push(item);
        }
    });
    markFoundItem(foundElementId);
    console.log(document.getElementById(getItemId(foundElementId)).innerHTML);
    document.getElementById(foundElementId).scrollIntoView();
    localStorage.setItem("changedElementsIds", JSON.stringify(changedElementsIds));
}

function restorePreviousState() {
    var changedElementsIds = JSON.parse(localStorage.getItem("changedElementsIds"));
    if (changedElementsIds == null)
        return;
    changedElementsIds.forEach(function (item) {
        collapseElementIfNeed(item);
    });
    localStorage.removeItem("changedElementsIds");

    unmarkPreviousFoundElement();
}

function unmarkPreviousFoundElement() {
    var foundElementsIds = JSON.parse(localStorage.getItem("foundElementsIds"));

    var previousFoundValueNumber = parseInt(localStorage.getItem("viewedResultNumber")) - 1;
    if (previousFoundValueNumber == -1)
        previousFoundValueNumber = foundElementsIds.length - 1;
    markFoundItem(foundElementsIds[previousFoundValueNumber]);
}

function nextValue(foundElementsIds) {
    var foundElementsCount = foundElementsIds.length;
    var viewedResultNumber = parseInt(localStorage.getItem("viewedResultNumber"));
    if (viewedResultNumber == foundElementsCount - 1) {
        localStorage.setItem("viewedResultNumber", "0");
        return foundElementsIds[foundElementsCount - 1];
    }
    localStorage.setItem("viewedResultNumber", viewedResultNumber + 1);
    return foundElementsIds[viewedResultNumber];
}

function searchAllElements(str) {
    var nodesNames = document.getElementsByClassName("itemName");
    var searchNodesNamesIds = [];
    for (var i = 0; i < nodesNames.length; i++) {
        if (nodeNameContainsStr(nodesNames[i], str)) {
            searchNodesNamesIds.push(getNodeId(nodesNames[i].id));
            console.log(nodesNames[i].innerHTML);
        }
    }
    return searchNodesNamesIds;
}

function nodeNameContainsStr(node, str) {
    var normalizedStr = normalizeStr(str);
    var normalizedNodeName = normalizeStr(node.innerHTML);
    return normalizedNodeName.includes(normalizedStr);
}

function normalizeStr(str) {
    return str.toLowerCase().trim();//.replace(/ /g, '');
}

function clearFoundResult() {
    restorePreviousState();
    fixateExpandedState();
    clearFoundResultsFromStorage();
}

function clearFoundResultsFromStorage(){
    localStorage.removeItem("foundElementsIds");
    localStorage.removeItem("searchValue");
    localStorage.removeItem("viewedResultNumber");
    localStorage.removeItem("found");
}

function markFoundItem(controlId) {
    switchClass(getItemId(getNodeId(controlId)), 'highlight');
}

function switchClass(id, className) {
    if (document.getElementById(id).className.indexOf(className) == -1) {
        document.getElementById(id).className += ' ' + className;
    } else {
        document.getElementById(id).className = document.getElementById(id).className.replace(className, '').trim();
    }
}
