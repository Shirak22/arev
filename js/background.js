/**
 * @fileoverview Background service worker for Chrome extension
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

import getLocation from "./location/get-location.js";
import getLocationByCoords from "./location/get-location-by-coords.js";
import fetchWeatherByCoords from "./weather/fetch-weather-by-coords.js";




async function setup() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if(message.type === 'getLocationByCoords') {
           (async() => {
            const getLocation = await getLocationByCoords(message.latitude, message.longitude);
            if(getLocation) {
                sendResponse(getLocation);
            }else {
                sendResponse({ error: 'No location found' });
            }
            })();
            return true;
        }else if(message.type === 'getLocation') {
        (async ()=> {
            const getLocation__response = await getLocation();
            if(getLocation__response) {
                sendResponse(getLocation__response);
            }else {
                sendResponse({ error: 'No location found' });
            }
            })();
            return true;
        }else if (message.type === 'getWeatherByCoords') {
            (async() => {
                const getWeather = await fetchWeatherByCoords(message.latitude, message.longitude);
                if(getWeather) {
                    sendResponse(getWeather);
                }else {
                    sendResponse({ error: 'No weather found' });
                }
            })();
            return true;
        }
    });
}   
setup();
