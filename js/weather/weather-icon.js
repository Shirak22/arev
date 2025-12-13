/**
 * @fileoverview Weather icon mapping using MeteoIcons by bas.dev
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

let weatherIconsMapping = null;
let loadingPromise = null;

// Load JSON at module initialization
const loadWeatherIconsMapping = async () => {
    if (weatherIconsMapping) return weatherIconsMapping;
    if (loadingPromise) return loadingPromise;
    
    loadingPromise = (async () => {
        try {
            const response = await fetch('assets/icons/weather-icons-mapping.json');
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            weatherIconsMapping = await response.json();
            return weatherIconsMapping;
        } catch (error) {
            console.error('Failed to load weather icons mapping:', error);
            return null;
        }
    })();
    
    return loadingPromise;
};

// Start loading immediately
loadWeatherIconsMapping();
// need to check if night or day


const getWeatherIcon = (weather_code) => {
    let icon = '';
    if (!weatherIconsMapping) {
        console.warn('Weather icons mapping not loaded yet, using fallback');
        return 'clear-day.svg'; // fallback
    }
    // check if night or day
    const isNight = new Date().getHours() > 18 || new Date().getHours() < 6;
    if (isNight) {
        icon = weatherIconsMapping[weather_code]?.night || 'clear-night.svg';	
    } else {
        icon = weatherIconsMapping[weather_code]?.day || 'clear-day.svg';   
    }
    
    return icon;
}

export default getWeatherIcon;
export { loadWeatherIconsMapping };