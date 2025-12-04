import { getFromCache, storeToCache } from "./cache.js";
import render from "./render/render.js";
import { loadWeatherIconsMapping } from "./weather/weather-icon.js";
import renderForecast from "./weather/weather-forecast.js";




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
    if(response.error) return null;
    return response;
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




let position = null; 
let weather = null;
let cachedPosition = null ; 
let cachedWeather = null; 

const setup = async () => {
  // Ensure weather icons mapping is loaded before rendering
  await loadWeatherIconsMapping();
  
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
    // const testCurrentWeather = {
    //     current: {
    //         temperature_2m: 4,
    //         apparent_temperature: 10,
    //         weathercode: 99,//heavy snow,
    //         relative_humidity_2m: 70,
    //         wind_speed_10m: 2
    //     }
    // }
    
    render(position, weather);
    renderForecast(weather);

    
}   

setup();