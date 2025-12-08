/**
 * @fileoverview Weather background image mapping and selection
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

let weatherBackgroundsMapping = null;
let loadingPromise = null;

const loadWeatherBackgroundsMapping = async () => {
    if (weatherBackgroundsMapping) return weatherBackgroundsMapping;
    if (loadingPromise) return loadingPromise;
    loadingPromise = (async () => {
        try {
            const response = await fetch('assets/backgrounds/weather-images.json');
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            weatherBackgroundsMapping = await response.json();
            return weatherBackgroundsMapping;
        } catch (error) {
            console.error('Failed to load weather backgrounds mapping:', error);
            return null;
        }
    })();
    return loadingPromise;  
}
loadWeatherBackgroundsMapping();
const getWeatherBackground = (weathercode) => {
    // check if weatherBackgroundsMapping is loaded
    if(!weatherBackgroundsMapping) {
        console.warn('Weather backgrounds mapping not loaded yet, using fallback');
        return 'clear-day.jpg'; // fallback
    }
    //get the right group of photos 
     const folder = weatherBackgroundsMapping.find(item => item.codes.includes(weathercode));
     const randomPhoto = folder?.photos[Math.floor(Math.random() * folder?.photos.length)];
     return {
        src: folder.folder + '/' + randomPhoto.filename,
        photographer: randomPhoto.photographer,
        url: randomPhoto.url
     }
}
export { loadWeatherBackgroundsMapping };
export default getWeatherBackground;