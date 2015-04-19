var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var RSG = require('./js/RandomStopGenerator.js');
var io = require('socket.io').listen(server);




app.use(express.static('public'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use('/polymer-components',  express.static(__dirname + '/polymer-components'));

app.get('/', function(req, res){
  res.sendfile(__dirname  + '/index.html');
});



io.on('connection', function(socket){
  socket.on('deliveries message', function(msg){
    console.log('deliveries: ' + msg);
  });
  socket.on('drivers message', function(msg){
    io.emit('chat message', msg);
    console.log('drivers: ' + msg);
  });
  socket.on('speed message', function(msg){
    io.emit('chat message', msg);
    console.log('speed: ' + msg);
  });
});
/*
var server = app.listen(1337, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('app listening at http://%s:%s', host, port);
});
*/

server.listen(1337);
