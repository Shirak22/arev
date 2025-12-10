/**
 * @fileoverview Fetch weather data by coordinates using Open-Meteo API
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
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

// https://api.open-meteo.com/v1/forecast?latitude=58.37&longitude=16.19&current=weather_code,temperature_2m,apparent_temperature,relative_humidity_2m&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=3&timezone=auto
const weatherParameters = 'current=weather_code,temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,wind_speed_10m_max,precipitation,rain,showers,snowfall';
const forecastParameters = 'forecast_days=3';
const timezone = 'timezone=auto';

const fetchWeatherByCoords = async (latitude, longitude) => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&${weatherParameters}&${forecastParameters}&${timezone}`;
    try {
        const fetchWeather = await fetch(url); 
        const data = await fetchWeather.json();
        return data ; 


    } catch (error) {
        console.error("couldn't fetch weather ",error)
    }
}

export default fetchWeatherByCoords;