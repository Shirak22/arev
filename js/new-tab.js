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
import render, { renderOfflineClock } from "./render/render.js";
import { loadWeatherIconsMapping } from "./weather/weather-icon.js";
import renderForecast from "./weather/weather-forecast.js";
import { toaster } from "./render/toaster.js";
import { getPreferences } from "./settings-preferences.js";



export const getPositionByGeolocation = async (notify = true) => {
   try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (currentPosition) => resolve(currentPosition),
          (error) => reject(error)
        );
      });

      const location = await chrome.runtime.sendMessage({
        type: 'getLocationByCoords',
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });

      if (!location || location.error) {
        if (notify) toaster.show('Geolocation error: could not resolve location.', 'error');
        return null;
      }

      return location;
   } catch (error) {
      if (notify) toaster.show('Geolocation error: permission denied or unavailable.', 'error');
      return null;
   }
}

export const getLocationByIp = async (notify = true) => {
    try {
        const response = await chrome.runtime.sendMessage({ type: 'getLocation' });
        if (!response || response.error) {
            if (notify) toaster.show('IP location error: unable to fetch location.', 'error');
            return null;
        }
        return response;
    } catch (error) {
        if (notify) toaster.show('IP location error: service unavailable.', 'error');
        return null;
    }
}

export const getLocationByManualCity = async (city, country = "", notify = true) => {
    const cityValue = city?.trim();
    const countryValue = country?.trim();

    if (!cityValue) {
        if (notify) toaster.show("Manual location error: city is required.", "error");
        return null;
    }

    const query = countryValue ? `${cityValue}, ${countryValue}` : cityValue;
    const endpoint = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`;

    try {
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        const match = data?.results?.[0];
        if (!match) {
            if (notify) toaster.show("Manual location error: city not found.", "error");
            return null;
        }

        return {
            city: match.name,
            country: match.country,
            latitude: match.latitude,
            longitude: match.longitude,
            USA: match.country_code === "US"
        };
    } catch (error) {
        if (notify) toaster.show("Manual location error: lookup failed.", "error");
        return null;
    }
};

export const getWeatherByCoords = async (latitude, longitude,USA, notify = true) => {
    if(!latitude || !longitude){
        if (notify) toaster.show('Invalid coordinates.', 'error');
        return null; 
    }
    try {
        const response = await chrome.runtime.sendMessage({ type: 'getWeatherByCoords', latitude: latitude, longitude: longitude, USA: USA });
        if (!response || response.error) {
            if (notify) toaster.show('Weather error: data not found.', 'error');
            return null;
        }
        return response;
    } catch (error) {
        if (notify) toaster.show('Weather error: request failed.', 'error');
        return null;
    }
}




let position = null; 
let weather = null;
let cachedPosition = null ; 
let cachedWeather = null; 

const withPositionPromptActions = (message) => {
  toaster.show(message, "error", 0, [
    {
      label: "Use geolocation",
      onClick: async () => {
        const geoPosition = await getPositionByGeolocation(true);
        if (!geoPosition) return;
        await storeToCache("position", geoPosition);
        const geoWeather = await getWeatherByCoords(geoPosition.latitude, geoPosition.longitude, geoPosition.USA, true);
        if (!geoWeather) return;
        await storeToCache("weather", geoWeather);
        await render(geoPosition, geoWeather);
        renderForecast(geoWeather);
      }
    },
    {
      label: "Set city manually",
      onClick: async () => {
        const city = window.prompt("Enter city name");
        if (!city) return;
        const country = window.prompt("Enter country (optional)");
        const manualPosition = await getLocationByManualCity(city, country || "", true);
        if (!manualPosition) return;
        await storeToCache("position", manualPosition);
        const manualWeather = await getWeatherByCoords(manualPosition.latitude, manualPosition.longitude, manualPosition.USA, true);
        if (!manualWeather) return;
        await storeToCache("weather", manualWeather);
        await render(manualPosition, manualWeather);
        renderForecast(manualWeather);
      }
    }
  ]);
};

export const setup = async () => {
  // Offline-first: render immediate fallback UI, then hydrate with live weather if available.
  await renderOfflineClock();

  // Ensure weather icons mapping is loaded before rendering
  await loadWeatherIconsMapping();
 
  const preferences = await getPreferences();
  const locationMethod = preferences.locationMethod || "ip";
  const manualCity = preferences.manualCity || "";
  const manualCountry = preferences.manualCountry || "";

  cachedPosition  = await getFromCache('position');
  cachedWeather = await getFromCache('weather'); 

  if(!cachedPosition){
    if (locationMethod === "manual") {
      position = await getLocationByManualCity(manualCity, manualCountry, true);
    } else if (locationMethod === "geolocation") {
      position = await getPositionByGeolocation(true);
    } else {
      position = await getLocationByIp(false);
      if (!position) {
        withPositionPromptActions("IP location failed. Choose another location method.");
      }
    }
    position && await storeToCache('position', position); 
  }else {
    position = cachedPosition.position; 
  }
  

    if (!cachedWeather) {
        if(position) weather = await getWeatherByCoords(position.latitude, position.longitude,position.USA, false);
        weather && await storeToCache('weather', weather);
    } else {
        weather = cachedWeather.weather;
    }

    if(position && weather) {
        await render(position, weather);
        renderForecast(weather);
    }
}   
