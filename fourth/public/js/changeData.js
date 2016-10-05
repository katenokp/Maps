function changeCheckboxes(idCheckbox){
    if(!document.getElementById(idCheckbox).checked)
        return;
    var parentUlId = document.getElementById(idCheckbox).closest('ul').id;
    if(parentUlId == 'root')
        return;
    var parentCheckboxId = parentUlId.replace('_ChildrenUl', '_Checkbox');
    var checkbox = document.getElementById(parentCheckboxId);
    checkbox.checked = checkbox.checked || isAllChildrenDone(parentUlId);
    if(checkbox.checked)
        markChangedItem(checkbox.id);
    changeCheckboxes(parentCheckboxId);
}

function isAllChildrenDone(parentUlId){
    var children = document.querySelectorAll('#' + parentUlId +' > li');
    var isAllDone = true;
    for(var i = 0; i< children.length; i++){
        isAllDone = isAllDone && document.getElementById(children[i].id+ '_Checkbox').checked;
    }
    return isAllDone;
}

function getNodeId(id){
    var matches = id.match('([a-z|0-9|A-Z]+)_[a-z|0-9|A-Z]+$');
    if(matches == null)
        return id;
    return matches[matches.length-1];
    //var prefixes = ['_Checkbox', '_PriorityButton', '_PriorityDropDown', '_Item', '_commentInput', '_indexInput'];

}

function getChildren(id){
    var ulId = getNodeId(id) + 'ChildrenUl';
    if(document.getElementById(ulId) == null)
        return null;
    return document.querySelectorAll('#' + ulId +' > li');
}