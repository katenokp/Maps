function goToService(serviceName){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/"+serviceName, true);
    xhr.send();

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                console.log(xhr.response);
            }
            else {
                console.log("Error: incorrect service name: %s", serviceName);
            }
        }
    }
}