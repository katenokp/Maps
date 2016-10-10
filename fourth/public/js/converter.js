function submit(){
    var textField = document.getElementById('converterTextField');
    var formData = new FormData();
    formData.append('data', textField.value);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/convert", true);
    xhr.send(formData);
    document.location.href = '/';

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                console.log(xhr.response);
                //document.location.href = req.body
            }
            else {
                console.log("Error: can't convert data")
            }
        }
    }
}