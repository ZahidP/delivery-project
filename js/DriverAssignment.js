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
  assignDrivers: function(msg,stopsArray,d1Queue,d2Queue,RSG,stops){

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
        console.log('D1 Queue:')
        console.log(d1Queue);
      }
      else if (d1Distance <= d2Distance && (d1Queue.length >= d2Queue.length)) {
        d2Queue.push(recent);
        console.log('D2 Queue:')
        console.log(d2Queue);
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
  moveDrivers: function (msg,d1Queue,d2Queue,RSG,stopsArray,io) {

    var nextPositions = [];
    var d1Loc = {"lat":msg[0][0], "lng":msg[0][1]};
    var d2Loc = {"lat":msg[1][0], "lng":msg[1][1]};
    var stepSize = .001;  // .001 change in both lat/lng corresponds to about 140 meters movement

    // look at first element at each queue
    // this should be prioritized delivery
    if (d1Queue.length) {
      var d1Delivery = d1Queue[0],
          d1DeliveryObj = {"lat":d1Delivery[0], "lng":d1Delivery[1]},
          deltaLat = (d1DeliveryObj.lat-d1Loc.lat),
          deltaLng = (d1DeliveryObj.lng-d1Loc.lng),
          signLat1 = deltaLat?deltaLat<0?-1:1:0,
          signLng1 = deltaLng?deltaLng<0?-1:1:0;
      d1Loc.lat = d1Loc.lat + stepSize * signLat1;
      d1Loc.lng = d1Loc.lng + stepSize * signLng1;
      var d1Distance = RSG.distance(d1Loc,d1DeliveryObj);

      if (d1Distance < 0.1) {
        for( var i = 0; i < stopsArray.length; i++ ) {
          if( stopsArray[i][3] ===  d1Queue[0][3]) {
            stopsArray[i][2] = 1;   // this stop has been served
            io.emit('stops', stopsArray);
            break;
            }
          }
        d1Queue.shift();
        console.log('queue 1 shifted');
        console.log(d1Queue);
        console.log('stops arr');
        console.log(stopsArray);
      }
      var d1L = [d1Loc.lat,d1Loc.lng];
    }

    if (d2Queue.length) {
      var d2Delivery = d2Queue[0],
          d2DeliveryObj = {"lat":d2Delivery[0], "lng":d2Delivery[1]},
          deltaLat2 = (d2DeliveryObj.lat-d2Loc.lat),
          deltaLng2 = (d2DeliveryObj.lng-d2Loc.lng),
          signLat2 = deltaLat2 ? deltaLat2 <0?-1:1:0,
          signLng2 = deltaLng2 ? deltaLng2 <0?-1:1:0;
      d2Loc.lat = d2Loc.lat + stepSize * signLat2;
      d2Loc.lng = d2Loc.lng + stepSize * signLng2;
      var d2Distance = RSG.distance(d2Loc,d2DeliveryObj);
      console.log('d2Distance');
      console.log(d2Distance);
      if (d2Distance < 0.1) {
        for( var i = 0; i < stopsArray.length; i++ ) {
          if( stopsArray[i][3] ===  d2Queue[0][3]) {
            stopsArray[i][2] = 1;   // this stop has been served
            io.emit('stops', stopsArray);
            break;
            }
        }
        d2Queue.shift();
        console.log('queue 2 shifted');
        console.log(d2Queue);
      }
      var d2L = [d2Loc.lat,d2Loc.lng];
    }



    if (d1L && d2L) {
    var driversLocation = [d1L,d2L];
    }
    else if (d1L===undefined && d2L) {
      console.log(msg[0]);
      console.log(d2L);
      console.log('d1L===undefined && d2L');
      var driversLocation = [msg[0],d2L];
    }
    else if (d1L && d2L===undefined) {
      console.log('d1L && d2L===undefined');
      var driversLocation = [d1L,msg[1]];
    }
    else {
      var driversLocation = msg;
    }
    var driversInfo = [d1Queue,d2Queue,driversLocation,stopsArray];
    return driversInfo;



  }

}
