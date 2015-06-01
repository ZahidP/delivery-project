# Delivery Project

#### Directions

1. `npm install`
2. `bower install`
3. `node app.js`

## Summary
<hr>
### Deliveries
Select the average number of deliveries that will occur over a 2 hour period. These deliveries will be centered around the number chosen, but the total number will be based on a random distribution. 
### Drivers
Select the number of drivers that will service these deliveries. The deliveries will be optimimally divided between the drivers as the simulation runs. 
### Speed
The speed of the simulation. This number will be how much faster than real time the simulation will be. For example, 3 would mean 3 times as fast, the 3 hour interval would run in 1 hour.

<hr>
### Driver Assignment

#### Criteria 1:
Driver distance. The first criteria is straight line distance from each driver to the next stop.

#### Criteria 2:
Driver queue length. If a driver is closest to the delivery, but has a queue that is 2 stops longer than the next closest driver, we will assign the next closest driver.

<hr>
### Map & Parameter Updates
- Maps and parameters are updated via `WebSocket` connections using **Socket.io**.

	- __`function updateDrivers(drivers)`__: updates driver positions on the map
	- __`function updateDeliveries(deliveries)`__: updates delivery locations on the map

<hr>
### DriverAssignment.js

`var DA = require('./path/DriverAssignment.js');`

__assignDrivers__
```
// Assigns drivers to new deliveries
DA.assignDrivers(driversLocation,stopsArray,d1Queue,d2Queue,RSG);
```
  - **driverLocation:** Input the current location of both drivers
  - **stopsArray:** The array of randomly generated stops. 
  - **d1Queue:** The current queue of stops for driver 1.
  - **d2Queue:** The current queue of stops for driver 2.
  - **RSG:** Random stop generator.

__moveDrivers__
```
// Moves drivers to complete deliveries
DA.moveDrivers: function (msg,d1Queue,d2Queue) {
```
  - **msg:** Driver locations.
  - **d1Queue:** The current queue of stops for driver 1.
  - **d2Queue:** The current queue of stops for driver 2.




