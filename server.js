var http = require('http');
var reader = require('./reader');

var port = 8777;

var nodeStatic = require('node-static');

var file = new nodeStatic.Server('.', {
    cache: 0
});


function start(request, response){
    request.addListener("data", /*saver.writeToFile*/function(postDataChunk){
     postData += postDataChunk;
     console.log("Received POST data chunk '" +
     postDataChunk + "'.");
     //saver.
     fs.writeFileSync("data/savedData.json", postDataChunk);
     });
    /*request.addListener("end", function(){
     route(handle, pathname, response, postData);
     });*/

    file.serve(request, response);
    //reader.loadData();

}

http.createServer(start).listen(port);
console.log("port: " + port);

