function changeCheckboxes(idCheckbox){
    if(getWeight(idCheckbox).all == 1)
        changeWeightByCheckbox(idCheckbox);

    if(!document.getElementById(idCheckbox).checked)
        return;

    var parentUlId = document.getElementById(idCheckbox).closest('ul').id;
    if(parentUlId == 'root_ChildrenUl')
        return;

    var parentCheckboxId = parentUlId.replace('_ChildrenUl', '_Checkbox');
    var checkbox = document.getElementById(parentCheckboxId);
    checkbox.checked = checkbox.checked || isAllChildrenDone(parentUlId);
    if(checkbox.checked) {
        markChangedItem(checkbox.id);
    }
    changeCheckboxes(parentCheckboxId);
}

function changeWeightByCheckbox(idCheckbox){
    var weightId = getNodeId(idCheckbox) + "_indexInput";
    var newWeight = (document.getElementById(idCheckbox).checked ? "1" : "0") + "/1";

    document.getElementById(weightId).value = newWeight;
    updateProgressBar(weightId);
}

function changeWeights(idWeight){
    var parentUlId = document.getElementById(idWeight).closest('ul').id;
    if(parentUlId == 'root_ChildrenUl') {
        recalculateRootWeight();
        return;
    }

    var parentWeightId = parentUlId.replace('_ChildrenUl', '_indexInput');
    var parentWeightNode = document.getElementById(parentWeightId);
    parentWeightNode.value = getWeightString(calculateWeight(parentWeightId));
    updateProgressBar(parentWeightId);

    console.log("Weight for %s is changed. New value: %s", parentWeightId, parentWeightNode.value);
    markChangedItem(parentWeightId);

    changeWeights(parentWeightId);
}

function recalculateRootWeight(){
    var rootWeightId = "root_indexInput";
    document.getElementById(rootWeightId).innerHTML = getWeightString(calculateWeight(rootWeightId));
}

function updateProgressBar(itemWeightId){
    var progressBarId = getNodeId(itemWeightId) + '_ProgressBar';
    var progressBar = document.getElementById(progressBarId);
    var weight = getWeight(itemWeightId);

    progressBar.value = weight.done;
    progressBar.max = weight.all;

    updateHint(itemWeightId);
}

function updateHint(itemWeightId){
    var hintId = getNodeId(itemWeightId) + '_Hint';
    var hint = document.getElementById(hintId);
    var weight = getWeight(itemWeightId);
    hint.innerHTML = getWeightString(weight);
}

function isAllChildrenDone(parentUlId){
    var children = document.querySelectorAll('#' + parentUlId +' > li');
    var isAllDone = true;
    for(var i = 0; i< children.length; i++){
        isAllDone = isAllDone && document.getElementById(children[i].id+ '_Checkbox').checked;
    }
    return isAllDone;
}
