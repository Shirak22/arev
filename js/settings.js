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

import { getLocationByIp, getLocationByManualCity, getPositionByGeolocation, getWeatherByCoords } from "./new-tab.js";
import { getFromCache, storeToCache } from "./cache.js";
import { toaster } from "./render/toaster.js";
import { getPreferences, setPreferences } from "./settings-preferences.js";

const refreshLocationButton = document.querySelector(".settings-refresh-button");
const saveBackgroundButton = document.querySelector(".settings-save-background-button");
const aboutButton = document.querySelector(".settings-about-button");
const creditsButton = document.querySelector(".settings-terms-button");
const locationValue = document.querySelector(".settings-location-value");
const locationMethodInputs = document.querySelectorAll('input[name="location-method"]');
const backgroundModeInputs = document.querySelectorAll('input[name="background-mode"]');
const cityInput = document.querySelector(".settings-city-input");
const countryInput = document.querySelector(".settings-country-input");
const backgroundInput = document.querySelector(".settings-background-input");
const manualLocationSection = document.querySelector(".settings-manual-location");
const citySuggestions = document.querySelector(".settings-city-suggestions");
let citySearchDebounceId = null;
let citySearchRequestId = 0;

const setCheckedValue = (selector, value) => {
    const input = document.querySelector(`${selector}[value="${value}"]`);
    if (input) input.checked = true;
};

const getSelectedValue = (inputs, fallback) => {
    const selected = [...inputs].find((input) => input.checked);
    return selected?.value || fallback;
};

const updateManualSectionVisibility = () => {
    const selectedMethod = getSelectedValue(locationMethodInputs, "ip");
    manualLocationSection.style.display = selectedMethod === "manual" ? "flex" : "none";
};

const hideCitySuggestions = () => {
    citySuggestions.classList.remove("show");
    citySuggestions.innerHTML = "";
};

const renderCitySuggestions = (results) => {
    citySuggestions.innerHTML = "";
    if (!results.length) {
        hideCitySuggestions();
        return;
    }

    results.forEach((result) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "settings-city-suggestion-item";
        const admin = result.admin1 ? `${result.admin1}, ` : "";
        button.textContent = `${result.name}, ${admin}${result.country}`;
        button.addEventListener("click", () => {
            cityInput.value = result.name;
            countryInput.value = result.country;
            hideCitySuggestions();
        });
        citySuggestions.appendChild(button);
    });

    citySuggestions.classList.add("show");
};

const fetchCitySuggestions = async () => {
    const cityQuery = cityInput.value.trim();
    const countryQuery = countryInput.value.trim().toLowerCase();
    if (cityQuery.length < 2) {
        hideCitySuggestions();
        return;
    }

    const requestId = ++citySearchRequestId;
    try {
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityQuery)}&count=10&language=en&format=json`;
        const response = await fetch(url);
        if (!response.ok) {
            hideCitySuggestions();
            return;
        }

        const data = await response.json();
        if (requestId !== citySearchRequestId) return;

        const results = (data?.results || []).filter((item) => {
            if (!countryQuery) return true;
            return item.country?.toLowerCase().includes(countryQuery) || item.country_code?.toLowerCase().includes(countryQuery);
        });

        renderCitySuggestions(results);
    } catch (error) {
        hideCitySuggestions();
    }
};

const scheduleCitySuggestions = () => {
    if (citySearchDebounceId) clearTimeout(citySearchDebounceId);
    citySearchDebounceId = setTimeout(fetchCitySuggestions, 250);
};

const renderLocationStatus = async () => {
    const position = await getFromCache("position");
    const weather = await getFromCache("weather");

    if (!(position && weather)) {
        locationValue.textContent = "No cached location/weather data.";
        return;
    }

    locationValue.innerHTML = [
        `Country: ${position.position.country}`,
        `City: ${position.position.city}`,
        `Latitude: ${weather.weather.latitude}`,
        `Longitude: ${weather.weather.longitude}`,
        `Weather updated: ${new Date(weather.weather.current.time).toLocaleString()}`,
        `Location updated: ${new Date(position.timestamp_position).toLocaleString()}`
    ].join("<br>");
};

const refreshLocation = async () => {
    const selectedMethod = getSelectedValue(locationMethodInputs, "ip");
    const manualCity = cityInput.value.trim();
    const manualCountry = countryInput.value.trim();
    let position = null;

    await setPreferences({
        locationMethod: selectedMethod,
        manualCity,
        manualCountry
    });

    if (selectedMethod === "manual") {
        position = await getLocationByManualCity(manualCity, manualCountry, true);
    } else if (selectedMethod === "geolocation") {
        position = await getPositionByGeolocation(true);
    } else {
        position = await getLocationByIp(true);
    }

    if (!position) {
        toaster.show("Location refresh failed.", "error");
        return;
    }

    const weather = await getWeatherByCoords(position.latitude, position.longitude, position.USA, true);
    if (!weather) return;

    await storeToCache("position", position);
    await storeToCache("weather", weather);
    await renderLocationStatus();
    toaster.show("Location updated successfully.", "success");
};

const saveBackgroundPreferences = async () => {
    const selectedMode = getSelectedValue(backgroundModeInputs, "dynamic");
    const customBackgroundUrl = backgroundInput.value.trim();

    if (selectedMode === "custom" && !customBackgroundUrl) {
        toaster.show("Please enter a background URL.", "error");
        return;
    }

    await setPreferences({
        backgroundMode: selectedMode,
        customBackgroundUrl
    });
    toaster.show("Background preference saved.", "success");
};

const hydrateSettings = async () => {
    const preferences = await getPreferences();
    setCheckedValue('input[name="location-method"]', preferences.locationMethod);
    setCheckedValue('input[name="background-mode"]', preferences.backgroundMode);
    cityInput.value = preferences.manualCity || "";
    countryInput.value = preferences.manualCountry || "";
    backgroundInput.value = preferences.customBackgroundUrl || "";
    updateManualSectionVisibility();
    await renderLocationStatus();
};

refreshLocationButton.addEventListener("click", refreshLocation);
saveBackgroundButton.addEventListener("click", saveBackgroundPreferences);
locationMethodInputs.forEach((input) => {
    input.addEventListener("change", updateManualSectionVisibility);
});
cityInput.addEventListener("input", scheduleCitySuggestions);
countryInput.addEventListener("input", scheduleCitySuggestions);
cityInput.addEventListener("focus", scheduleCitySuggestions);
countryInput.addEventListener("focus", scheduleCitySuggestions);
cityInput.addEventListener("blur", () => setTimeout(hideCitySuggestions, 120));
countryInput.addEventListener("blur", () => setTimeout(hideCitySuggestions, 120));

aboutButton.addEventListener("click", () => {
    chrome.tabs.create({ url: chrome.runtime.getURL("about.html") });
});

creditsButton.addEventListener("click", () => {
    chrome.tabs.create({ url: chrome.runtime.getURL("credits.html") });
});

hydrateSettings();