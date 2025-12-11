/**
 * @fileoverview Main render function for new tab weather display
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

import getWeatherBackground from "../weather/weather-background.js";
import getWeatherDescription from "../weather/weather-description.js";
import getWeatherIcon from "../weather/weather-icon.js";
import generateWardrobeAdvice from "../weather/weather-advice.js";

const render = (position, weather) => {
    if(!weather) return;
    const mainContainer = document.querySelector('#main-container');
    const city = document.querySelector('.location-city');
    const time = document.querySelector('.weather-time');
    const icon = document.querySelector('.weather-icon');
    const windSpeedValue = document.querySelector('.weather-temperature-wind-speed-value');
    const humidityValue = document.querySelector('.weather-temperature-humidity-value');
    const description = document.querySelector('.weather-description');
    const temperature = document.querySelector('.weather-temperature-value');
    const feelsLike = document.querySelector('.weather-temperature-feels-like');
    const recommendation = document.querySelector('.clothes-recommendation');
    const credits = document.querySelector('.photograph-credits-name');
    const link = document.querySelector('.photograph-credits-link');
    const background = getWeatherBackground(weather.current.weather_code, weather.current.is_day);
    console.log("##background##",weather);

    city.textContent = position.city + ", " + position.country;
    time.textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }); //
    icon.src = `assets/icons/svg/${getWeatherIcon(weather.current.weather_code)}`;
     description.textContent = getWeatherDescription(weather.current.weather_code);
     temperature.textContent = Math.round(weather.current.temperature_2m) + weather.current_units.temperature_2m;
     feelsLike.textContent =  Math.round(weather.current.apparent_temperature) + weather.current_units.apparent_temperature;
     windSpeedValue.textContent = Math.round(weather.current.wind_speed_10m) + weather.current_units.wind_speed_10m;
     humidityValue.textContent = Math.round(weather.current.relative_humidity_2m) + weather.current_units.relative_humidity_2m;
     mainContainer.style.backgroundImage = `url(${background.src})`;
    credits.textContent = background.photographer;
    link.href = background.url;
    
    recommendation.textContent = generateWardrobeAdvice(weather);
}

export default render;