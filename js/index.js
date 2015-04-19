
var leaf = require('leaflet-realtime');


var map = L.map('map'),
    realtime = L.realtime({
        url: 'https://wanderdrone.appspot.com/',
        crossOrigin: true,
        type: 'json'
    }, {
        interval: 3 * 1000
    }).addTo(map);

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

realtime.on('update', function() {
    map.fitBounds(realtime.getBounds(), {maxZoom: 3});
});


// random stop generator code


var simulator = RSG.init();
// or init with options
simulator = RSG.init({
    playbackSpeed:1, 
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
};


// rsg also has the following utility functions
RSG.distance(point1,point2);
    // points are code var stop ={lat:47.0004,lng:-87.63245};
// this returns the straight line distance in meters between two points

    simulator.clearAll();
// this should be called to halt the simulation early if the drivers can't do any more deliveries or the   
    // or to reset the simulation.
