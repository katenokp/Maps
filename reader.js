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
        drawBlock(blockParentId, item, false); //todo ��������� ����������, ��������� �� ������� � ������
        /*item.children.forEach(function(childItem){
            drawBlock(item.id, childItem, true);
        })*/
    })
}

function addBlockName(rootNodeId, id, data){
    var item = rootNodeId.appendChild(document.createElement('a'));
    <!--todo ���� � �������� ������ ��� ��������, �� � ������ <a> ����� ������ ���������� onclick="collapseElement(this.id) � � ��� ������ �������� commentInput-->
    item.id = id + "_Item";
    item.className = "listItemLink";
    item.onclick = function(){collapseElement(this.id);};
    item.onselectstart = function(){return false;};
    item.onmousedown = function(){return false;};
    item.innerHTML = data.name;
}

function addDropDown(rootNodeId, id, data){
    var priorityWrapper = rootNodeId.appendChild(document.createElement("div")); //� ������ - listItemId_DropWrapper
    priorityWrapper.id = id + "_PriorityWrapper";
    priorityWrapper.className = "dropdownWrapper";

    var priorityButton = priorityWrapper.appendChild(document.createElement("button")); <!--������ ��������� ����� � ����������� �� ���������: priorityDefault, priority1 .. priority5-->
    priorityButton.id = id + "_PriorityButton";
    priorityButton.className = "dropButton " + getPriority(data); //todo
    priorityButton.onclick = function(){switchDropdownList(this.id);};

    var priorityDropDown = priorityWrapper.appendChild(document.createElement('div'));
    priorityDropDown.id = id + "_PriorityDropDown";
    priorityDropDown.className = "dropContent hidden";
    priorityDropDown.onclick = function(){switchDropdownList(this.id);};

    var priorityLinkDefault = priorityDropDown.appendChild(document.createElement('a'));
    priorityLinkDefault.href = "#";
    priorityLinkDefault.id = id + "_PriorityLinkDefault";
    priorityLinkDefault.className = "dropLink priorityDefault";
    priorityLinkDefault.onclick = function(){setPriority(this.id);};

    for(var i = 1; i <= 5; i++){
        var priorityLink = priorityDropDown.appendChild(document.createElement('a'));
        priorityLink.href = "#";
        priorityLink.id = id + "priorityLink" + i;
        priorityLink.className = "dropLink priority" + i;
        priorityLink.onclick = function(){setPriority(this.id);};
    }
}

//todo ������� ������ ��������: �� ������ � � �������
function addProgressBar(rootNodeId, id, data){
    var progress = rootNodeId.appendChild(document.createElement("progress"));
    progress.id = id + "_Progress";
    progress.className = "progressBar";
    progress.value = data.isDone ? 100 : 0; //todo ��������� �� ������ � ����
    progress.max = "100";
    progress.innerHTML = "45%";
}

function addComment(rootNodeId, id, data){
    var comment = rootNodeId.appendChild(document.createElement('input'));
    comment.id = id + "_Comment";
    comment.className = "commentInput";
    comment.type = "text";
    comment.value = data.comment + ".cs";
    comment.oninput = function(){markChangedItem(this.id);};
}

//todo ������� �� ������ ������

//todo ���������� � ���������� ������� ����� ��, ��� �����
//todo ��������, id ������������ �������� (�.� ��� � ����������), data - ������ ���� �����, ����� ���������� ����
function drawBlock(rootNodeId, data, isLastElement){
    var li = document.getElementById(rootNodeId).appendChild(document.createElement("li"));
    var id = data.id;
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

    addProgressBar(wrapper, id, data);

    addDropDown(wrapper, id, data);

    addBlockName(wrapper, id, data);

    addComment(wrapper, id, data);



    //������ �������� ��������

    if(data.children != null) {
        var childrenUl = li.appendChild(document.createElement('ul'));
        childrenUl.id = id + "_ChildrenUl";

        data.children.forEach(function (item) {
            console.log("children: " + item.id);
            drawBlock(childrenUl.id, item, true);
        });
    }

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

function getPriority(data){
    if(data.priority > 5 || data.priority <0) {
        console.error("Error: incorrect priority = '" + data.priority + "' for id '" + data.id + "'");
        return;
    }
    if(data.priority == 0)
        return "priorityDefault";
    else
        return "priority" + data.priority;
}




//exports.loadData = loadData;