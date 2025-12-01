import { getFromCache, storeToCache } from "./cache.js";
import getWeatherDescription from "./weather/weather-description.js";





async function getPositionByGeolocation() {
   const position = new Promise((resolve, reject)=> {
    try {   
         navigator.geolocation.getCurrentPosition((position)=> {
        resolve(position);
        });
    } catch (error) {
        reject(error);
    }
   }) 
   const getPosition = await position; 
  const location = await chrome.runtime.sendMessage({type: 'getLocationByCoords', latitude:getPosition.coords.latitude, longitude: getPosition.coords.longitude})
  return  location;
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
    if(!latitude || !longitude){
        console.error("coords are not correct... "); 
        return; 
    }
    const response = await chrome.runtime.sendMessage({ type: 'getWeatherByCoords', latitude: latitude, longitude: longitude });
    if(response) {
        return response;
    }else {
        return null;
    }
}

const renderOnScreen = (location, weather) => {
    const weatherContainer = document.getElementById("weather-container");
    
    if(location && weather ){
        weatherContainer.innerHTML =  `
        <h1>Weather</h1>
        <p>City: <span id="city">${location.city}</span></p>
        <p>Country: <span id="country">${location.country}</span></p>
        <p>time: <span id="time">${weather.time}</span></p>
        <p>temperature: <span id="time">${weather.temperature_2m}</span></p>
        <p>feels like: <span id="temperature">${weather.apparent_temperature.toFixed(1)}°C</span></p>
        <p>Weather: <span id="weather">${getWeatherDescription(weather.weathercode)}</span></p>
        <p>Humidity: <span id="humidity">${weather.relative_humidity_2m}</span></p>
        <p>Wind Speed: <span id="wind-speed">${weather.wind_speed_10m}</span></p>
        <p>Weather Code: <span id="weather-code">${weather.weathercode}</span></p>
        `
    }
    if(!weather) weatherContainer.innerHTML =`<h1>No weather data.</h1>`;
    if(!location) weatherContainer.innerHTML =`<h1>${location.error}/h1>`;
}


let position = null; 
let weather = null;
let cachedPosition = null ; 
let cachedWeather = null; 

const setup = async () => {
  
  cachedPosition  = await getFromCache('position');
  cachedWeather = await getFromCache('weather'); 

  if(!cachedPosition){
    position = await getLocationByIp();
    if(!position) position = await getPositionByGeolocation(); 
    position && await storeToCache('position', position); 
  }else {
    position = cachedPosition.position; 
  }

    if (!cachedWeather) {
        weather = await getWeatherByCoords(position.latitude, position.longitude);
        weather && await storeToCache('weather', weather);
    } else {
        weather = cachedWeather.weather;
    }

    console.log(position);
    console.log(weather || null);
    
    //renderOnScreen(position,weather.current); 

    
}   

setup();