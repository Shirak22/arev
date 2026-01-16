/**
 * @fileoverview Popup page initialization and weather data fetching
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
import { toaster } from "./render/toaster.js";
import { loadWeatherIconsMapping } from "./weather/weather-icon.js";

import { renderPopup } from "./render/render-popup.js";
import { getLocationByIp, getPositionByGeolocation, getWeatherByCoords } from "./new-tab.js";







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
        weather = await getWeatherByCoords(position.latitude, position.longitude,position.USA);
        weather && await storeToCache('weather', weather);
    } else {
        weather = cachedWeather.weather;
    }



    renderPopup( weather || null);

    // Settings gear icon click handler
    const settingsGear = document.getElementById('settings-gear');
    if (settingsGear) {
        settingsGear.addEventListener('click', () => {
            chrome.tabs.create({ url: chrome.runtime.getURL('settings.html') });
        });
    }

}   

setup();