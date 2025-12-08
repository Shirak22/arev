/**
 * @fileoverview Render function for popup weather display
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

import getWeatherIcon from "../weather/weather-icon.js";
import getWeatherDescription from "../weather/weather-description.js";

export const renderPopup = (weather) => {
    const popupWeatherDescription = document.querySelector('#popup-weather-description');
    const popupWeatherTemperature = document.querySelector('#popup-weather-temperature');


    popupWeatherDescription.innerHTML = `
    <img src="assets/icons/svg/${getWeatherIcon(weather.current.weathercode)}" alt="Weather Icon">
    <p>${getWeatherDescription(weather.current.weathercode)}</p>
    `;
    popupWeatherTemperature.innerHTML = `
    <h2>${Math.round(weather.current.temperature_2m)}°C</h2>
    <p>Feels like ${Math.round(weather.current.apparent_temperature)}°C</p>
    <p>WS ${Math.round(weather.current.wind_speed_10m)} m/s</p>
    <p>H ${Math.round(weather.current.relative_humidity_2m)}%</p>
`;
}