var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var RSG = require('./js/RandomStopGenerator.js');
var DA = require('./js/DriverAssignment.js');
var io = require('socket.io').listen(server);




app.use(express.static('public'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use('/polymer-components',  express.static(__dirname + '/polymer-components'));
app.use('/js',  express.static(__dirname + '/js'));


app.get('/', function(req, res){
  res.sendfile(__dirname  + '/index.html');
});



io.on('connection', function(socket){

      // "GLOBALS"
      var d1Queue = [],
          d2Queue = [],
          driverQueues = [],
          d1CurrentRoute = [],
          d2CurrentRoute = [],
          stopsArray = [];


      var driversLocation = [
                      [41.899, -87.621],
                      [41.885, -87.628]
      ];



      socket.on('init map', function(msg) {
            //return require('./api/map').initMap(msg)

            console.log(msg);



            io.emit('driver update', driversLocation);
            console.log('speed: ' + msg.speed);
            //var simulator = RSG.init();
            // or init with options
            var simulator = RSG.init({
                playbackSpeed:msg.speed,
                // defaults to 1 this is realtime and the simulation will take two hours.
                    // tests should be sped up to save time.
                // will accept any integer from 1 - 1000
                outputStops:msg.deliveries,
                // desired total number of deliveries for simulation
                simulationDuration:7200
                // simulation time in seconds
            });

            socket.on('stop map', function (msg) {
              simulator.clearAll();
            })

            simulator.on('newStop',function(stop){
                // this is called every time a stop is generated
                var newStop = [stop.lat,stop.lng];
                stopsArray.push(newStop);
                io.emit('stops', stopsArray);
                driverQueues = DA.assignDrivers(driversLocation,stopsArray,d1Queue,d2Queue,RSG);
                d1Queue = driverQueues[0];
                d2Queue = driverQueues[1];
            });

              console.log('queueue');
              console.log(d1Queue);
              console.log(d2Queue);
            setInterval(function () {
              driverInfo = DA.moveDrivers(driversLocation,d1Queue,d2Queue,RSG);
              d1Queue = driverInfo[0];
              d2Queue = driverInfo[1];
              driversLocation = driverInfo[2];
              io.emit('driver update', driversLocation);


            }, 1000);



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
