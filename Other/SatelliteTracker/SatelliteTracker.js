// Work in progress

const ISS_TLE = 
    `1 25544U 98067A   21122.75616700  .00027980  00000-0  51432-3 0  9994
     2 25544  51.6442 207.4449 0002769 310.1189 193.6568 15.48993527281553`;

// Initialize the satellite record with this TLE
const satrec = satellite.twoline2satrec(
  ISS_TLE.split('\n')[0].trim(), 
  ISS_TLE.split('\n')[1].trim()
);

// Get the position of the satellite at the given date
const date = new Date();
const positionAndVelocity = satellite.propagate(satrec, date);
const gmst = satellite.gstime(date);
const position = satellite.eciToGeodetic(positionAndVelocity.position, gmst);

console.log(position.longitude);// in radians
console.log(position.latitude);// in radians
console.log(position.height);// in km



