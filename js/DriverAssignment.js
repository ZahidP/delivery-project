//var RSG = require('./js/RandomStopGenerator.js');
EventEmitter = require('events').EventEmitter;


/*
d1Queue.prototype.__proto__ = EventEmitter.prototype;
d2Queue.prototype.addStop = function(stop, stopCount, seconds) {



  // use this to service a stop
  that.emit('stopServiced', stop);
*/

module.exports = {


  // @param:msg --> drivers' current locations
  // process new deliveries
  // assign them to drivers' queues
  assignDrivers: function(msg,stopsArray,d1Queue,d2Queue,RSG){

    console.log('next update');
    console.log(msg);
    var d1Loc = {"lat":msg[0][0], "lng":msg[0][1]};
    var d2Loc = {"lat":msg[1][0], "lng":msg[1][1]};

    // essentially these deliveries will be served in first come first served order
    // ideally we would account for delivery time and location but traffic and directions are not
    // being factored in so we will just do FCFS

    // distance from both drivers' current position to the most recent delivery location
    if (stopsArray[0] !== undefined) {
      var recent = stopsArray[stopsArray.length-1];
      var recentObj = {"lat":recent[0], "lng":recent[1]};
      var d1Distance = RSG.distance(d1Loc,recentObj);
      var d2Distance = RSG.distance(d2Loc,recentObj);


      // we add the delivery to the queue of d1 if it is closer
      // unless the d1 queue is longer
      if (d1Distance <= d2Distance && (d1Queue.length <= d2Queue.length+2)) {
        d1Queue.push(recent);
      }
      else if (d1Distance <= d2Distance && (d1Queue.length >= d2Queue.length)) {
        d2Queue.push(recent);
      }
      // we add the delivery to the queue of d2 if it is closer
      // unless the d1 queue is longer
      else if (d2Distance <= d1Distance && (d2Queue.length <= d1Queue.length+2)) {
        d2Queue.push(recent);
      }
      else {
        d1Queue.push(recent);
      }
      //console.log('d1Queue');
      //console.log(d1Queue);
      //console.log('d2Queue');
      //console.log(d2Queue);
    }


    var driversInfo = [d1Queue,d2Queue];

    return driversInfo;

  },

  // @param: msg  --> drivers' current location
  // @param: d1Queue,d2Queue --> queue of driver deliveries
  moveDrivers: function (msg,d1Queue,d2Queue,RSG) {

    var nextPositions = [];
    var d1Loc = {"lat":msg[0][0], "lng":msg[0][1]};
    var d2Loc = {"lat":msg[1][0], "lng":msg[1][1]};

    // look at first element at each queue
    // this should be prioritized delivery
    if (d1Queue.length) {
      var d1Delivery = d1Queue[0];
      var d1DeliveryObj = {"lat":d1Delivery[0], "lng":d1Delivery[1]};

      nextStepLat = (d1Loc.lat-d1DeliveryObj.lat)/10;
      console.log('latitude step');
      console.log(nextStepLat);
      nextStepLng = (d1Loc.lng-d1DeliveryObj.lng)/10;

      d1Loc.lat = d1Loc.lat + nextStepLat;
      d1Loc.lng = d1Loc.lng + nextStepLng;

      var d1Distance = RSG.distance(d1Loc,d1DeliveryObj);

      var d1L = [d1Loc.lat,d2Loc.lng];


      if (d1Distance < .001) {
        d1Queue.shift();
      }


    }
    if (d2Queue.length) {
      var d2Delivery = d2Queue[0];
      var d2DeliveryObj = {"lat":d2Delivery[0], "lng":d2Delivery[1]};

      nextStepLat = d2Loc.lat-d2DeliveryObj.lat;
      nextStepLng = d2Loc.lng-d2DeliveryObj.lng

      d2Loc.lat = d2Loc.lat + nextStepLat;
      d2Loc.lng = d2Loc.lng + nextStepLng

      var d2Distance = RSG.distance(d1Loc,d2DeliveryObj);

      if (d2Distance < .001) {
        d2Queue.shift();
      }

      var d2L = [d2Loc.lat,d2Loc.lng];


    }


    console.log('new d1 location');
    console.log(d1L);

    console.log('new d2 location');
    console.log(d2L);

    if (d1L && d2L) {
    var driversLocation = [d1L,d2L];
    }
    else {
      var driversLocation = msg;
    }
    console.log(d1Queue);
    var driversInfo = [d1Queue,d2Queue,driversLocation];
    return driversInfo;



  }

}
