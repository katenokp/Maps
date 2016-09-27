//var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

function loadData() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "data/data.json", true);
    xhr.send();

    xhr.onreadystatechange = function () {
        if (xhr.readyState != 4) return;

        if (xhr.status != 200) {
            console.log((xhr.status + ": " + xhr.statusText));
        } else {
            try {
                var parsedText = JSON.parse(xhr.responseText);
            } catch (e) {
                console.log("Error: " + e.message + "trewq");
            }
            //window.allData = parsedText;
            drawBlockByAllFields("root", parsedText);
            //getAllData(parsedText); todo
        }
    }
}

function getData(data) {
    document.getElementById(data.id + "_Checkbox").checked = data.state;
    document.getElementById(data.id + "_Priority").value = data.priority;
    document.getElementById(data.id + "_Id").value = data.id;
}

function getAllData(parsedText) {
    parsedText.forEach(function (item) {
        getData(item);
    })
}


function drawBlockByAllFields(blockParentId, data){
    data.forEach(function(item){
        drawBlock(blockParentId, item, false); //todo научиться определять, последний ли элемент в списке
    })
}

function drawBlock(blockParentId, data, isLastElement){
    var li = document.getElementById(blockParentId).appendChild(document.createElement("li"));
    var id = data.id;
    //li.innerHTML = data.name;
    li.id = id;
    if(isLastElement)
        li.className = "last";

    var block = li.appendChild(document.createElement("div"));
    block.id = id + "_Block";
    block.className = "grayLinesBlock";

    var wrapper = block.appendChild(document.createElement("div"));
    wrapper.id = id + "_Wrapper";
    wrapper.className = "listItemWrapper";

    var checkbox = wrapper.appendChild(document.createElement("input"));
    checkbox.type = "checkbox";
    checkbox.id = id + "_Checkbox";
    checkbox.className = "checkbox";
    checkbox.checked = data.isDone;
    checkbox.onchange = function(){markChangedItem(this.id);};

    var em = wrapper.appendChild(document.createElement("em"));
    em.id = id + "_Marker";
    if(data.idChildren == null)
        em.className = "hidden";
    else
        em.className = "marker close";
    em.onclick = function(){collapseElement(this.id);};

    var progress = wrapper.appendChild(document.createElement("progress"));
    progress.id = id + "_Progress";
    progress.className = "progressBar";
    progress.value = "0";
    progress.max = "100";
    progress.innerHTML = "45%";
    
    var priorityWrapper = wrapper.appendChild(document.createElement("div")); //в вёрстке - listItemId_DropWrapper
    priorityWrapper.id = id + "_PriorityWrapper";
    priorityWrapper.className = "dropdownWrapper";
    
    var priorityButton = priorityWrapper.appendChild(document.createElement("button"));
    priorityButton.id = id + "_PriorityButton";
    priorityButton.className = "dropButton";
    priorityButton.onclick = function(){switchDropdownList(this.id);};

    var priorityDropDown = priorityWrapper.appendChild(document.createElement('div'));
    priorityDropDown.id = id + "_PriorityDropDown";
    priorityDropDown.className = "dropContent hidden";
    priorityDropDown.onclick = function(){switchDropdownList(this.id);};

    var priorityLinkDefault = priorityDropDown.appendChild(document.createElement('a'));
    priorityLinkDefault.href = "#";
    priorityLinkDefault.id = id + "_PriorityLinkDefault";
    priorityLinkDefault.className = "dropLink";

    for(var i = 1; i <= 5; i++){
        var priorityLink = priorityDropDown.appendChild(document.createElement('a'));
        priorityLink.href = "#";
        priorityLink.id = id + "priorityLink" + i;
    }

    var item = wrapper.appendChild(document.createElement('a'));
    item.id = id + "_Item";
    item.className = "listItemLink";
    item.onclick = function(){collapseElement(this.id);};
    item.onselectstart = function(){return false;};
    item.onmousedown = function(){return false;};
    item.innerHTML = data.name;

    var comment = wrapper.appendChild(document.createElement('input'));
    comment.id = id + "_Comment";
    comment.className = "commentInput";
    comment.type = "text";
    comment.value = data.comment + ".cs";
    comment.oninput = function(){markChangedItem(this.id);};




    /*var checkbox = li.appendChild(document.createElement("input"));
    checkbox.type = "checkbox";
    checkbox.id = id + "_Checkbox";
    checkbox.checked = data.isDone;
    checkbox.onclick = function(){checkbox.value = checkbox.checked};

    var name = li.appendChild(document.createElement("input"));
    name.value = data.name;
    name.id = id + "_Id";

    var priority = li.appendChild(document.createElement("input"));
    priority.value = data.priority;
    priority.id = id + "_Priority";*/
}




//exports.loadData = loadData;