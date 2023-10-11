function geoCoordsTo3D(lat, long, radius) {
    // Convert degrees to radians
    const latRad = (lat * Math.PI) / 180;
    const longRad = (long * Math.PI) / 180;
  
    // Calculate the Cartesian coordinates
    const x = radius * Math.cos(latRad) * Math.cos(longRad);
    const y = radius * Math.cos(latRad) * Math.sin(longRad);
    const z = radius * Math.sin(latRad);
  
    return { x: -x, y, z };
}

function callbackObjectsFromFilename(filename, callback){
    fetch(filename)
    .then((res) => res.json())
    .then((data) => {
        for (let i of data){
            callback(i.Station, i.Latitude, i.Longitude)
        }
    })
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

async function readJson(filename) {
    let result = await fetch(filename);
    result = await result.json();

    return result;
}

function daysToDate(days) {
    const date = new Date(0); // Start with Unix epoch (January 1, 1970)
    date.setDate(date.getDate() + days); // Add the specified number of days
    return date;
}

function dateToDays(date) {
    const epoch = new Date(0); // Unix epoch
    const diffMilliseconds = date - epoch; // Calculate the difference in milliseconds
    const millisecondsInADay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
    const days = Math.floor(diffMilliseconds / millisecondsInADay); // Convert milliseconds to days
    return days;
}

function dateToStr(date){
    return `${date.getDate()} ${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][date.getMonth()]}, ${date.getFullYear()}`
}

function moonquakeDataToDate(data){
    const date = new Date(0); 

    date.setFullYear(data.Year); // Set the year
    date.setDate(data.Day); // Set the day of the year
    date.setHours(data.H); // Set the hours
    date.setMinutes(data.M); // Set the minutes
    date.setSeconds(data.S); // Set the seconds

    return date; 
}

export default geoCoordsTo3D;
export { callbackObjectsFromFilename, readJson, daysToDate, dateToDays, getRandomColor, dateToStr, moonquakeDataToDate };