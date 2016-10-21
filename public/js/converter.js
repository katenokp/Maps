function submit(){
    console.log("submit");
    var textField = document.getElementById('converterTextField');

    try {
        var preparedData = JSON.parse(textField.value)
    } catch (e){
        alert(e.message);
        return false;
    }

    textField.value = JSON.stringify(preparedData);
    document.getElementById("converterForm").submit();



    /*var formData = new FormData();
    var data = JSON.stringify(JSON.parse(textField.value));
    formData.append('data', data);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/converter", true);
    xhr.send(formData);

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                console.log(xhr.response);
                document.location.href('/Pfr');
            }
            else {
                console.log("Error: can't convert data")
            }
        }
    }*/
}

function prepareData(){

}

function setService(service, data) {
    if (service != 'null') {
        document.getElementById("listItemId_Checkbox").checked = true;
        document.getElementById("serviceNameRadioButton_" + service).checked = true;
        document.getElementById("converterTextField").value = JSON.stringify(JSON.parse(data),["name", "id", "isDone", "comment", "priority", "weight", "children", "done", "all"], '\t');
    }
}

function goToService(serviceName){
    //setTimeout(function(serviceName){
        document.location.href = '/'+serviceName;
    //},100)
}