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
    console.log("Unknown setting " + settingId);
}

function getServiceById(serviceId) {
    return findSettingName(getServices(), serviceId);
}

function getUserById(userId) {
    return findSettingName(getUsers(), userId)
}

function getUserId(userId) {
    if (userId == 0) return 0;
    var users = getUsers();
    for(var i=0; i<users.length; i++)
        if(users[i].id.toLowerCase() == userId.toLowerCase())
            return i+1;
    console.log("Unknown user " + userId);;
}

function getUserByNumber(number) {
    return getUsers()[number];
}