/**
 * @fileoverview Main new tab page initialization and weather data fetching
 * @author Shirak Soghomonian
 * @license MIT
 * Copyright (c) 2025 Shirak Soghomonian
 * GitHub: https://github.com/Shirak22/arev
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { getFromCache, storeToCache } from "./cache.js";
import render from "./render/render.js";
import { loadWeatherIconsMapping } from "./weather/weather-icon.js";
import renderForecast from "./weather/weather-forecast.js";
import { toaster } from "./render/toaster.js";



export const getPositionByGeolocation = async () => {
   const position = new Promise((resolve, reject)=> {
    try {   
         navigator.geolocation.getCurrentPosition((position)=> {
            toaster.show('Geolocation API , Position fetched successfully', 'success');
        resolve(position);
        });
    } catch (error) {
        toaster.show('Geolocation API , Error fetching location', 'error');
        reject(error);
    }
   }) 
   const getPosition = await position; 
  const location = await chrome.runtime.sendMessage({type: 'getLocationByCoords', latitude:getPosition.coords.latitude, longitude: getPosition.coords.longitude})
  return  location;
}

export const getLocationByIp = async () => {
    const response = await chrome.runtime.sendMessage({ type: 'getLocation' });
    if(response.error) {
        toaster.show('IP API , Error fetching location', 'error');
        return;
    };
    toaster.show('IP API , Position fetched successfully', 'success');
    return response;
}

export const getWeatherByCoords = async (latitude, longitude,USA) => {
    if(!latitude || !longitude){
        toaster.show('Coords are not correct...', 'error');
        return; 
    }
    const response = await chrome.runtime.sendMessage({ type: 'getWeatherByCoords', latitude: latitude, longitude: longitude, USA: USA });
    if(response) {
        toaster.show('Weather data fetched successfully', 'success');
        return response;
    }else {
        toaster.show('Weather data not found', 'error');
        return null;
    }
}




let position = null; 
let weather = null;
let cachedPosition = null ; 
let cachedWeather = null; 

export const setup = async () => {
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
        if(!position) {
            toaster.show('Position not found , check your internet connection...', 'error',10000);
            return;
          }
        weather = await getWeatherByCoords(position.latitude, position.longitude,position.USA);
        toaster.show('Weather data fetched successfully', 'success');
        weather && await storeToCache('weather', weather);
    } else {
        weather = cachedWeather.weather;
    }

    if(position && weather) {
        await render(position, weather);
        renderForecast(weather);
    } else {
        toaster.show('Check your internet connection...', 'error');
        console.log("no internet connection avalible ");
        return;
    }
    

}   
