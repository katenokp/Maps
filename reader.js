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
                console.log("Error: " + e.message);
            }
            //window.allData = parsedText;
            drawBlockByAllFields("root", parsedText);
            //todo перенести построение страницы на сервер
        }
    }
}






//exports.loadData = loadData;