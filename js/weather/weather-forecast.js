/**
 * @fileoverview Weather forecast rendering for 3-day forecast display
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

import getWeatherDescription from "./weather-description.js";
import getWeatherIcon from "./weather-icon.js";

const getDayOfWeek = (time) => {
    const day = new Date(time);
    const today = new Date();
    if(day.getDate() === today.getDate() + 1) {
        return 'Tomorrow';
    }else if (day.getDate() === today.getDate()) {
        return 'Today';
    }else {
        return day.toLocaleDateString('en-US', { weekday: 'long' });
    }
}
const renderForecast = (weather) => {
    const forecast = weather.daily;
    const forecastDays = document.querySelector('.weather-forecast-days');
    forecast.time.forEach((time, index) => {
        const icon = getWeatherIcon(forecast.weathercode[index]);
        const description = getWeatherDescription(forecast.weathercode[index]);
        const maxTemp = Math.round(forecast.temperature_2m_max[index]);
        const minTemp = Math.round(forecast.temperature_2m_min[index]);
       // check if time is tomorrow to right the word tomorrow in the forecastDayDate
        let tomorrow = getDayOfWeek(time);
       
        forecastDays.innerHTML += `
        <section class="weather-forecast-day">
            <img src="assets/icons/svg/${icon}" alt="${description}" class="weather-forecast-icon">
            <p class="weather-forecast-day-description">${description}</p>
            <p class="weather-forecast-day-temperature-min-max">${maxTemp}°/${minTemp}°</p>
            <p class="weather-forecast-day-date">${tomorrow}</p>
        </section>
    `;
    });

}

export default renderForecast;