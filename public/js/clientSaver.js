function readDataForSave(ulId){
    var lines = [];
    var elements = getChildElements(ulId);
    for(var i = 0; i<elements.length; i++){
        lines.push(readItem(elements[i].id));
    }
    return lines;
}

function readItem(idItem){ //todo rename
    var parsedItem = {
        name: getNodeName(idItem),
        id: idItem,
        isDone: getIsDone(idItem),
        priority: getDropDownValue(idItem, 'Priority'),
        user: getDropDownValue(idItem, 'User'),
        comment: document.getElementById(idItem + "_commentInput").value,
        weight: getWeight(idItem)
    };
    var childrenUlId = getAllChildren(idItem);
    if(childrenUlId != null){
        parsedItem.children = readDataForSave(childrenUlId);
    }
    return parsedItem;
}

function errorHandler(e) {
    /*var msg = '';
    switch (e.code) {
        case FileError.QUOTA_EXCEEDED_ERR:
            msg = 'QUOTA_EXCEEDED_ERR';
            break;
        case FileError.NOT_FOUND_ERR:
            msg = 'NOT_FOUND_ERR';
            break;
        case FileError.SECURITY_ERR:
            msg = 'SECURITY_ERR';
            break;
        case FileError.INVALID_MODIFICATION_ERR:
            msg = 'INVALID_MODIFICATION_ERR';
            break;
        case FileError.INVALID_STATE_ERR:
            msg = 'INVALID_STATE_ERR';
            break;
        default:
            msg = 'Unknown Error';
            break;
    }
    console.log('Error: ' + msg);*/
    console.log(e);
}

function parseServiceName(serviceName){
    var services = {
        Ndfl: "НДФЛ",
        Fss: "ФСС",
        Pfr: "ПФР",
        Kopf: "Kopf",
        Fms: "ФМС",
        Forms: "Формы",
        Test: "Test"
    };
    return services[serviceName];
}

function readOldData(fs){
    var serviceName = this.serviceName;
    var newData = this.newData;
    console.log("service name = " + serviceName);
    fs.root.getFile(serviceName+"/oldData.json", {}, function(fileEntity){
        fileEntity.file(function(file){
            var reader = new FileReader();
            var oldData;
            reader.onloadend = function(e){
                oldData = JSON.parse(this.result);

                var dataJson = JSON.stringify({service: serviceName, weight: getRootWeight(), data: newData, oldData: oldData});

                var xhr = new XMLHttpRequest();
                xhr.open("POST", "/save", true);
                xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                xhr.send(dataJson);

                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        if (xhr.status == 200) {
                            console.log(xhr.response);
                            fs.root.getFile(serviceName+"/oldData.json", {}, function(oldFile){
                                oldFile.remove(function(){
                                    console.log("file removed from storage");
                                    location.reload();
                                    console.log("refreshed");
                                });
                            })
                        }
                        else {
                            console.log("Error: can't save data")
                        }
                    }
                }

            };
            var rr =  reader.readAsText(file);
            //return rr;
        }, errorHandler);
    }, errorHandler);

    /*fs.root.getDirectory(serviceName, {}, function(directory){
        var dirReader = directory.createReader();
        dirReader.readEntries(function(entries){
            console.log("name = " + entries[0].name);
            entries[0].remove(function() {
                    console.log("removed");
                }
            )
        })
    }, errorHandler)*/
}

function getOldData(serviceName, data){
    this.serviceName = serviceName;
    this.newData = data;
    window.webkitRequestFileSystem(window.PERSISTENT, 10*1024*1024, readOldData, errorHandler);
}

function saveByButton(){
    var serviceName = document.getElementById("saveButton").name;
    var data = readDataForSave('root_ChildrenUl');

    getOldData(serviceName, data);

}