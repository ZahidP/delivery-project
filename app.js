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
      socket.on('init map', function(msg) {
            //return require('./api/map').initMap(msg)

            console.log(msg);
            var stopsArray = [];

            var simulator = RSG.init();
            // or init with options
            simulator = RSG.init({
                playbackSpeed:20,
                // defaults to 1 this is realtime and the simulation will take two hours.
                    // tests should be sped up to save time.
                // will accept any integer from 1 - 1000
                outputStops:100,
                // desired total number of deliveries for simulation
                simulationDuration:7200
                // simulation time in seconds
            });

            simulator.on('newStop',function(stop){
                // this is called every time a stop is generated
                var newStop = [stop.lat,stop.lng];
                stopsArray.push(newStop);
                io.emit('stops', stopsArray);
            });
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
