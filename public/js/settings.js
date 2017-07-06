function getServices() {
    return getSettings().services;
}

function getUsers() {
    return getSettings().users;
}

function getSettings() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', "../../settings.json", false);
    xhr.send();
    if (xhr.status != 200) {
        console.error("Problem with file settings.json")
    }
    else {
        return JSON.parse(xhr.responseText);
    }
}

function findSettingName(settingsArray, settingId) {
    for(var i=0; i<settingsArray.length; i++)
        if(settingsArray[i].id.toLowerCase() == settingId.toLowerCase())
            return settingsArray[i];
    console.log("Unknown service " + settingId);
}

function getServiceById(serviceId) {
    return findSettingName(getServices(), serviceId);
}

function getUserBuId(userId) {
    return findSettingName(getUsers(), userId);
}

