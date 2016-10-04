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

function isAllChildrenDone(parentUlId){ //todo marked
    var children = document.querySelectorAll('#' + parentUlId +' > li');
    var isAllDone = true;
    for(var i = 0; i< children.length; i++){
        isAllDone = isAllDone && document.getElementById(children[i].id+ '_Checkbox').checked;
    }
    return isAllDone;
}