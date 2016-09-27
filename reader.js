//var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

function loadData() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'data/data.json', true);
    xhr.send();

    xhr.onreadystatechange = function () {
        if (xhr.readyState != 4) return;

        if (xhr.status != 200) {
            console.log((xhr.status + ': ' + xhr.statusText));
        } else {
            try {
                var parsedText = JSON.parse(xhr.responseText);
            } catch (e) {
                console.log("Error: " + e.message + 'trewq');
            }
            //window.allData = parsedText;
            drawBlockByAllFields('root', parsedText);
            getAllData(parsedText);
        }
    }
}

function getData(data) {
    document.getElementById(data.id + '_Checkbox').checked = data.state;
    document.getElementById(data.id + '_Priority').value = data.priority;
    document.getElementById(data.id + '_Id').value = data.id;
}

function getAllData(parsedText) {
    parsedText.forEach(function (item) {
        getData(item);
    })
}


function drawBlockByAllFields(blockParentId, data){
    data.forEach(function(item){
        drawBlock(blockParentId, item);
    })
}

function drawBlock(blockParentId, data){
    var li = document.getElementById(blockParentId).appendChild(document.createElement('li'));
    var id = data.id;
    li.innerHTML = data.name;
    li.id = id;

    var checkbox = li.appendChild(document.createElement('input'));
    checkbox.type = 'checkbox';
    checkbox.id = id + '_Checkbox';
    checkbox.checked = data.state;
    checkbox.onclick = function(){checkbox.value = checkbox.checked};

    var name = li.appendChild(document.createElement('input'));
    name.value = data.name;
    name.id = id + '_Id';

    var priority = li.appendChild(document.createElement('input'));
    priority.value = data.priority;
    priority.id = id + '_Priority';
}


//exports.loadData = loadData;