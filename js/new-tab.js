const weatherContainer = document.getElementById("weather-container");

let position = null;
let weatherData = null;



async function getPositionByGeolocation() {
    //show loading text until position is resolved
    let pos; 
     pos = await chrome.storage.local.get(['position']);
    if(pos) {
        return pos;
    }else {
        pos =  new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const response = await chrome.runtime.sendMessage({ type: 'getLocationByCoords', latitude: position.coords.latitude, longitude: position.coords.longitude });
                if(!response) return null;
                resolve(response);
            }, (error) => {
                reject(error);
            });
        });
        return pos;
    }
}

async function getLocationByIp() {
    const response = await chrome.runtime.sendMessage({ type: 'getLocation' });
    if(response) {
        return response;
    }else {
        return null;
    }
}

async function getWeatherByCoords(latitude, longitude) {
    const response = await chrome.runtime.sendMessage({ type: 'getWeatherByCoords', latitude: latitude, longitude: longitude });
    if(response) {
        return response;
    }else {
        return null;
    }
}

const setup = async () => {
    position = await getPositionByGeolocation();
    if(position) {
        console.log(position)
        weatherData = await getWeatherByCoords(position.latitude, position.longitude);
        if(weatherData) {
            console.log(position.city);
            console.log(weatherData);
        }else {
            console.log('No weather data found');
        }
    }else {
        console.log('No position found');
    }
   
}   

setup();