var http = require('http');
var fs = require('fs');
var formidable = require('formidable');
var util = require('util');


var server = http.createServer(function(req, res) {
    if (req.method.toLowerCase() == 'get') {
            displayForm(res);
    } else if (req.method.toLowerCase() == 'post') {
        //processAllFieldsOfTheForm(req, res);
        processFormFieldsIndividual(req, res);
    }

});

function displayForm(res) {
    fs.readFile('form.html', function(err,data) {
        res.writeHead(200, {
            'Content-Type': 'text/html',
            'Content-Length': data.length
        });
        res.write(data);
        res.end();
    })
}

function processFormFieldsIndividual(req, res) {
    var fields = {};
    var form = new formidable.IncomingForm();
    form.on('field', function(field,value) {
        fields[field] = value;
        console.log(fields);
    });
    form.on('fileBegin', function(name,file) {
        file.path = './temp/' + file.name ;
    })
    form.on('file', function(name, file) {
        console.log(name);
        console.log(file);
        fields[name] = file;
    });
    form.on('progress', function(bytesReceived, bytesExpected) {
        var progress = {
            type:'progress',
            bytesReceived: bytesReceived,
            bytesExpected: bytesExpected
        }
          console.log(progress);
    });
  
    form.on('end', function() {
        res.writeHead(200, {
            'content-type': 'text/plain'
        });
        res.write('received the data: \n\n');
        res.end(util.inspect({
            fields: fields
        }))
    })
    form.parse(req);
}

function processAllFieldsOfTheForm(req, res) {
    var form = new formidable.IncomingForm();
    
    form.parse(req, function(err, fields, files) {
       res.writeHead(200, {
           'content-type': 'text/plain'
       });
       res.write('received the data: \n\n');
       res.end(util.inspect({
           fields: fields,
           files: files
       }, {colors:true}))
    });
}

server.listen(1185)
console.log('server listening on port 1185');