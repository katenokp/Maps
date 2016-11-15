function validate() {
    var service = document.forms['converterForm'].elements['service'].value;
    var textField = document.getElementById('converterTextField');
    var checkbox = document.getElementById('listItemId_Checkbox');
    if(service != '' && !checkbox.checked){
        document.getElementById('serviceNameRadioButton_' + service.toLowerCase()).checked = false;
    }
    if (service != '' && (textField.value[0]=='[' || textField.value[0]=='{' )) {

        try {
            var preparedData = JSON.parse(textField.value)
        } catch (e) {
            alert(e.message);
            return false;
        }

        textField.value = JSON.stringify(preparedData);
    }
    document.getElementById("converterForm").submit();
    setTimeout(function(){location.href = location.href.replace('converter', service)}, 1000);


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

function prepareData() {

}

function setService(service, data) {
    if (service != 'null') {
        document.getElementById("listItemId_Checkbox").checked = true;
        document.getElementById("serviceNameRadioButton_" + service).checked = true;
        try{
            document.getElementById("converterTextField").value = JSON.stringify(JSON.parse(data), ["name", "id", "isDone", "comment", "priority", "weight", "children", "done", "all"], '\t');
        } catch (error){
            document.getElementById("converterTextField").value = data;
            alert(error.message);
        }
    }
}
function resetServiceInConverter(){
    ['ndfl', 'fss', 'pfr', 'kopf', 'fms', 'test'].forEach(function(item){
        document.getElementById('serviceNameRadioButton_' + item).checked = false;
    })
}

function resetServiceInConverter(){
    /*['ndfl', 'fss', 'pfr', 'kopf', 'fms', 'test'].forEach(function(item){
        document.getElementById('serviceNameRadioButton_' + item).checked = false;
    })*/
}

function goToService(serviceName) {
    //setTimeout(function(serviceName){
    document.location.href = '/' + serviceName;
    //},100)
}