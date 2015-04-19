/**
 * Generates number of random geolocation points given a center and a radius.
 * @param  {Object} center A JS object with lat and lng attributes.
 * @param  {number} radius Radius in meters.
 * @param {number} count Number of points to generate.
 * @return {array} Array of Objects with lat and lng attributes.
 */

/**
 * Returns a Gaussian Random Number around a normal distribution defined by the mean
 * and standard deviation parameters.
 *
 * Uses the algorithm used in Java's random class, which in turn comes from
 * Donald Knuth's implementation of the Box–Muller transform.
 *
 * @param {Number} [mean = 0.0] The mean value, default 0.0
 * @param {Number} [standardDeviation = 1.0] The standard deviation, default 1.0
 * @return {Number} A random number
 */
(function() {

  /**
   * Returns a Gaussian Random Number around a normal distribution defined by the mean
   * and standard deviation parameters.
   *
   * Uses the algorithm used in Java's random class, which in turn comes from
   * Donald Knuth's implementation of the BoxÐMuller transform.
   *
   * @param {Number} [mean = 0.0] The mean value, default 0.0
   * @param {Number} [standardDeviation = 1.0] The standard deviation, default 1.0
   * @return {Number} A random number
   */
  Math.randomGaussian = function(mean, standardDeviation) {

    mean = defaultTo(mean, 0.0);
    standardDeviation = defaultTo(standardDeviation, 1.0);

    if (Math.randomGaussian.nextGaussian !== undefined) {
      var nextGaussian = Math.randomGaussian.nextGaussian;
      delete Math.randomGaussian.nextGaussian;
      return (nextGaussian * standardDeviation) + mean;
    } else {
      var v1, v2, s, multiplier;
      do {
        v1 = 2 * Math.random() - 1; // between -1 and 1
        v2 = 2 * Math.random() - 1; // between -1 and 1
        s = v1 * v1 + v2 * v2;
      } while (s >= 1 || s == 0);
      multiplier = Math.sqrt(-2 * Math.log(s) / s);
      Math.randomGaussian.nextGaussian = v2 * multiplier;
      return (v1 * multiplier * standardDeviation) + mean;
    }

  };

  /**
   * Returns a normal probability density function for the given parameters.
   * The function will return the probability for given values of X
   *
   * @param {Number} [mean = 0] The center of the peak, usually at X = 0
   * @param {Number} [standardDeviation = 1.0] The width / standard deviation of the peak
   * @param {Number} [maxHeight = 1.0] The maximum height of the peak, usually 1
   * @returns {Function} A function that will return the value of the distribution at given values of X
   */
  Math.getGaussianFunction = function(mean, standardDeviation, maxHeight) {

    mean = defaultTo(mean, 0.0);
    standardDeviation = defaultTo(standardDeviation, 1.0);
    maxHeight = defaultTo(maxHeight, 1.0);

    return function getNormal(x) {
      return maxHeight * Math.pow(Math.E, -Math.pow(x - mean, 2) / (2 * (
        standardDeviation * standardDeviation)));
    }
  };

  function defaultTo(value, defaultValue) {
    return isNaN(value) ? defaultValue : value;
  }

})();

/**
 * Generates number of random geolocation points given a center and a radius.
 * Reference URL: http://goo.gl/KWcPE.
 * @param  {Object} center A JS object with lat and lng attributes.
 * @param  {number} radius Radius in meters.
 * @return {Object} The generated random points as JS object with lat and lng attributes.
 */


function generateDist(points) {
  var dist = [];
  for (var i = 0; i < points; i++) {
    dist[i] = Math.randomGaussian(0.5, 0.15);
  }
  return dist.sort();

}



function isStop(i, stops) {
  var v = stops[i];
  if (v <= 0.5 && Math.randomGaussian(0.5, 0.15) <= v) {
    return true;
  } else if (v >= 0.5 && Math.randomGaussian(0.5, 0.15) >= v) {
    return true;
  }
  return false;
}



function logStop(seconds, stop, stopIndex) {
  console.log('Stop Generated :' + stopIndex, stop, seconds);
}

// var plotly = require('plotly')('joeandrews', 'go13hlmus5');
// var x = generateDist(3000);

// console.log('here');


// var data = [{
// 	x: x,
// 	type: "histogram"
// }];
// var graph_options = {
// 	filename: "basic-histogram",
// 	fileopt: "overwrite"
// }
// plotly.plot(data, graph_options, function(err, msg) {
// 	console.log(msg);
// });



function generateRandomPoint(center, radius) {
  var x0 = center.lng,
    y0 = center.lat,
    // Convert Radius from meters to degrees.
    rd = radius / 111300,

    u = Math.random(),
    v = Math.random(),

    w = rd * Math.sqrt(u),
    t = 2 * Math.PI * v,
    x = w * Math.cos(t),
    y = w * Math.sin(t),

    xp = x / Math.cos(y0);

  // Resulting point.
  return {
    'lat': y + y0,
    'lng': xp + x0
  };


}

function inPoly(point, vs) {
  // ray-casting algorithm based on
  // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

  var x = point[0],
    y = point[1];

  var inside = false;
  for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    var xi = vs[i][0],
      yi = vs[i][1];
    var xj = vs[j][0],
      yj = vs[j][1];

    var intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj -
      yi) + xi);
    if (intersect) inside = !inside;
  }

  return inside;
}

var deliveryZone = [
  [-87.63193130493164,
    41.933060978713954
  ],
  [-87.68205642700195,
    41.93242245865234
  ],
  [-87.68068313598633,
    41.931783932198684
  ],
  [-87.6793098449707,
    41.92846349160097
  ],
  [-87.67484664916992,
    41.92731406804794
  ],
  [-87.67433166503906,
    41.925142878165666
  ],
  [-87.67227172851562,
    41.92322706102551
  ],
  [-87.66883850097656,
    41.92233299334
  ],
  [-87.66780853271484,
    41.91339162745834
  ],
  [-87.66677856445312,
    41.87659111409952
  ],
  [-87.65682220458984,
    41.87671893034394
  ],
  [-87.64686584472656,
    41.876207663832474
  ],
  [-87.63742446899414,
    41.875952029043006
  ],
  [-87.61716842651367,
    41.875952029043006
  ],
  [-87.61699676513672,
    41.88221478702957
  ],
  [-87.6130485534668,
    41.884004033721155
  ],
  [-87.61373519897461,
    41.89282173182968
  ],
  [-87.61957168579102,
    41.901254912872794
  ],
  [-87.6240348815918,
    41.902277040963696
  ],
  [-87.62575149536133,
    41.91262516637686
  ],
  [-87.63158798217773,
    41.92654777417383
  ],
  [-87.63193130493164,
    41.933060978713954
  ]
];

// Usage Example.
// Generates 100 points that is in a 1km radius from the given lat and lng point.


// to start we simply output points within a radius around a point.
// computationally intensive in polygon test and recur till we have a valid point.

function generatePoint(options) {

  // inPoly([this.newAddress.location.lng, this.newAddress
  // 		.location.lat
  // 	],
  // 	zone)

  var point = generateRandomPoint(options.center, options.radius);

  if (inPoly([point.lng, point.lat], options.polygon)) {
    return point;
  } else {
    return generatePoint(options);
  }

}

function stopQueue(options) {
  this.options = options;
  this.stops = [];
};
EventEmitter = require('events').EventEmitter;
stopQueue.prototype.__proto__ = EventEmitter.prototype;
stopQueue.prototype.addStop = function(stop, stopCount, seconds) {
  var that = this;
  that.stops[stopCount] = setTimeout(function() {
    that.emit('newStop', stop);
    logStop(seconds, stop, stopCount);

  }, parseInt(seconds) * (1000 / parseInt(that.options.playbackSpeed)));
};
stopQueue.prototype.clearAll = function() {
  var that = this;
  for (var i = 0; i < that.stops.length; i++) {
    clearTimeout(that.stops[i]);
  }
};


module.exports = {

  init: function(options) {

    if (typeof options === 'undefined') {
      options = {};
    }
    options = {
      playbackSpeed: options.playbackSpeed || 10,
      // defaults to 1 this is realtime
      // will accept any integer from 1 - 10
      outputStops: options.outputStops || 400,

      // desired total number of deliveries for simulation
      simulationDuration: options.simulationDuration || 7200,
      // simulation time in seconds
      center: options.center || {
        lat: 41.908741,
        lng: -87.637939

      },
      polygon: options.polygon || deliveryZone,
      radius: options.radius || 5000
    };

    options.stopsPerSecond = options.outputStops * 4 / options.simulationDuration;

    var count = 0,
      stops = generateDist(options.outputStops * 4),
      stopCount = 0,
      st,
      sQ = new stopQueue(options),
      point,
      stopIndex = 0;
    sQ.on('newStop', console.log);
    for (var i = 0; i < options.simulationDuration; i++) {

      count = count + options.stopsPerSecond;
      if (count >= 1) {
        count = 0;

        st = isStop(stopIndex, stops);
        if (st) {
          // generate random point and random inventory

          point = generatePoint(options);
          sQ.addStop(point, stopCount, i);
          // add to queue.

          stopCount++;
        }
        stopIndex++;

      }

    };

    return sQ;
  },
  distance: function(d1, d2) {

    function deg2rad(deg) {
      return deg * (Math.PI / 180);
    }

    var R = 6371.1370; // Radius of the earth in km
    var dLat = deg2rad(d2.lat.toPrecision(10) - d1.lat.toPrecision(10)); // deg2rad below
    var dLon = deg2rad(d2.lng.toPrecision(10) - d1.lng.toPrecision(10));
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(d2.lat.toPrecision(10))) * Math.cos(deg2rad(d1.lat.toPrecision(
        10))) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return (d);

  }

};
