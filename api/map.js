var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var RSG = require('../js/RandomStopGenerator.js');
var io = require('socket.io').listen(server);


exports.initMap = function (msg) {

  console.log(msg);

    var stopsArray = [];

    var simulator = RSG.init();
    // or init with options
    simulator = RSG.init({
        playbackSpeed:msg.speed,
        // defaults to 1 this is realtime and the simulation will take two hours.
            // tests should be sped up to save time.
        // will accept any integer from 1 - 1000
        outputStops:msg.deliveries,
        // desired total number of deliveries for simulation
        simulationDuration:7200
        // simulation time in seconds
    });

    simulator.on('newStop',function(stop){
        // this is called every time a stop is generated
        var newStop = [stop.lat,stop.lng];
        stopsArray.push(newStop);
        io.emit('stops', stopsArray);
    }



};
