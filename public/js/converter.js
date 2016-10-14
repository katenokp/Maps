function submit(){
    var textField = document.getElementById('converterTextField');
    var formData = new FormData();
    formData.append('data', textField.value);

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
    }
}

function goToService(serviceName){
    //setTimeout(function(serviceName){
        document.location.href = '/'+serviceName;
    //},100)
}