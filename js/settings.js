/**
 * @fileoverview Settings page functionality for Arev Chrome Extension
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

import { getLocationByIp, getPositionByGeolocation, getWeatherByCoords, setup } from "./new-tab.js";
import { getFromCache, storeToCache } from "./cache.js";



// Credits button click handler

const refreshLocationButton = document.querySelector('.settings-refresh-button');
const aboutButton = document.querySelector('.settings-about-button');
const creditsButton = document.querySelector('.settings-terms-button');
const location = document.querySelector('.settings-location-container');

(async ()=> {
    let position = await getFromCache('position');
    let weather = await getFromCache('weather');
    
    if(position && weather) {
        location.innerHTML = `
        <p>Country: ${position.position.country}</p>
        <p>City: ${position.position.city}</p>
        <p>Latitude: ${weather.weather.latitude}</p>
        <p>Longitude: ${weather.weather.longitude}</p>
        <p>Weather updated: ${weather.weather.current.time}</p>
        <p>Location updated: ${new Date(position.timestamp_position).toLocaleString()}</p>
        `;
    }
    else console.error('Position or weather not found');
})();

const refreshLocation = async() => {
    let weather = null; 
    await  chrome.storage.local.clear();
     let position = await getLocationByIp();
    if(!position) position = await getPositionByGeolocation();
    position && await storeToCache('position', position);
    if(position) {
        weather = await getWeatherByCoords(position.latitude, position.longitude);
        weather && await storeToCache('weather', weather);
        if(weather) {
            location.innerHTML = `
            <p>Country: ${position.country}</p>
            <p>City: ${position.city}</p>
            <p>Latitude: ${weather.latitude}</p>
            <p>Longitude: ${weather.longitude}</p>
            <p>Weather updated: ${new Date(weather.current.time).toLocaleString()}</p>
            <p>Location updated: ${new Date(Date.now()).toLocaleString()}</p>
            <p><b>Location updated successfully</b></p>
            `;
        }
        else console.error('Weather not refreshed');
    }

    else console.error('Position not refreshed');

}

refreshLocationButton.addEventListener('click', refreshLocation);
aboutButton.addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('about.html') });
});

creditsButton.addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('credits.html') });
});