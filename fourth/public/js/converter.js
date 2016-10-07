function getStringLevel(str){
    var regexp = /^(\t+)[\S]+$/;
    var matches = str.match(regexp);
    if(matches == null)
        return 0;
    return matches[1].length;
}

function submit(){
    var textField = document.getElementById('converterTextField');
    var formData = new FormData();
    formData.append('data', textField.value);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/convert", true);
    xhr.send(formData);

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                console.log(xhr.response);
                textField.value = '';
            }
            else {
                console.log("Error: can't convert data")
            }
        }
    }
}