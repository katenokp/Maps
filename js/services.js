var settings = require('../bin/settings.json');

function getService(serviceId) {
    var allServices = settings.services;
    for(var i=0; i<allServices.length; i++)
        if(allServices[i].id == serviceId)
            return allServices[i];
}


module.exports = getService;