/**
 * @fileoverview Generate wardrobe advice from weather data
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

let adviceData = null;

/**
 * Load wardrobe advice data from JSON file
 */
async function loadAdviceData() {
    if (adviceData) return adviceData;
    
    try {
        const response = await fetch('assets/wardrobe-advice-data.json');
        adviceData = await response.json();
        return adviceData;
    } catch (error) {
        console.error('Failed to load wardrobe advice data:', error);
        throw error;
    }
}

/**
 * Get random advice from an array
 */
function getRandomAdvice(adviceArray) {
    if (!adviceArray || adviceArray.length === 0) return null;
    return adviceArray[Math.floor(Math.random() * adviceArray.length)];
}


function getConditionFromCode(weatherCode, conditions) {
    for (const [conditionName, conditionData] of Object.entries(conditions)) {
        if (conditionData.codes && conditionData.codes.includes(weatherCode)) {
            return conditionName;
        }
    }
    return null;
}

function getPrecipitationType(current) {
    if (current.rain > 0) return 'rain';
    if (current.snowfall > 0) return 'snow';
    if (current.showers > 0) return 'showers';
    if (current.precipitation > 0) {
        // Infer from weather code if precipitation exists
        const code = current.weather_code;
        if (code >= 51 && code <= 67) return 'rain';
        if (code >= 71 && code <= 86) return 'snow';
        if (code >= 80 && code <= 82) return 'showers';
    }
    return null;
}

/**
 * Get temperature-based advice
 * @param {Number} temp - Apparent temperature
 * @param {Array} tempCategories - Temperature categories from JSON
 * @returns {String|null} Temperature advice or null
 */
function getTemperatureAdvice(temp, tempCategories) {
    for (const category of tempCategories) {
        if (temp >= category.min && temp < category.max) {
            return getRandomAdvice(category.advice);
        }
    }
    return null;
}

/**
 * Get condition-specific advice based on weather code and precipitation
 * @param {Number} weatherCode - Weather code from API
 * @param {String} condition - Condition name
 * @param {Number} temp - Apparent temperature
 * @param {Number} windSpeed - Wind speed
 * @param {Object} conditions - Weather conditions from JSON
 * @returns {String|null} Condition advice or null
 */
function getConditionAdvice(weatherCode, condition, temp, windSpeed, conditions) {
    if (!condition || !conditions[condition]) return null;
    
    const conditionData = conditions[condition];
    
    // Check for specific rain conditions
    if (condition === 'rain') {
        // Freezing rain (highest priority)
        if (conditionData.freezing && conditionData.freezing.codes.includes(weatherCode)) {
            return getRandomAdvice(conditionData.freezing.advice);
        }
        
        // Warm rain
        if (conditionData.warm && temp >= conditionData.warm.tempMin) {
            return getRandomAdvice(conditionData.warm.advice);
        }
        
        // Cold rain
        if (conditionData.cold && temp <= conditionData.cold.tempMax) {
            return getRandomAdvice(conditionData.cold.advice);
        }
        
        // Light rain
        if (conditionData.light && conditionData.light.codes.includes(weatherCode)) {
            return getRandomAdvice(conditionData.light.advice);
        }
        
        // Moderate rain
        if (conditionData.moderate && conditionData.moderate.codes.includes(weatherCode)) {
            return getRandomAdvice(conditionData.moderate.advice);
        }
        
        // Heavy rain
        if (conditionData.heavy && conditionData.heavy.codes.includes(weatherCode)) {
            return getRandomAdvice(conditionData.heavy.advice);
        }
        
        // Showers
        if (conditionData.showers && conditionData.showers.codes.includes(weatherCode)) {
            return getRandomAdvice(conditionData.showers.advice);
        }
        
        // General rain advice
        return getRandomAdvice(conditionData.general);
    }
    
    // Check for specific snow conditions
    if (condition === 'snow') {
        // Blowing snow (wind + snow)
        if (conditionData.blowing && windSpeed >= conditionData.blowing.windSpeedMin) {
            return getRandomAdvice(conditionData.blowing.advice);
        }
        
        // Light snow
        if (conditionData.light && conditionData.light.codes.includes(weatherCode)) {
            return getRandomAdvice(conditionData.light.advice);
        }
        
        // Moderate snow
        if (conditionData.moderate && conditionData.moderate.codes.includes(weatherCode)) {
            return getRandomAdvice(conditionData.moderate.advice);
        }
        
        // Heavy snow
        if (conditionData.heavy && conditionData.heavy.codes.includes(weatherCode)) {
            return getRandomAdvice(conditionData.heavy.advice);
        }
        
        // Snow grains
        if (conditionData.grains && conditionData.grains.codes.includes(weatherCode)) {
            return getRandomAdvice(conditionData.grains.advice);
        }
        
        // General snow advice
        return getRandomAdvice(conditionData.general);
    }
    
    // Other conditions (thunder, fog, sunny)
    return getRandomAdvice(conditionData.advice);
}

/**
 * Check for wind or humidity conditions
 * @param {Number} windSpeed - Wind speed
 * @param {Number} humidity - Relative humidity
 * @param {Object} conditions - Weather conditions from JSON
 * @returns {String|null} Wind or humidity advice or null
 */
function getWindOrHumidityAdvice(windSpeed, humidity, conditions) {
    // Check wind
    if (conditions.wind && windSpeed >= conditions.wind.windSpeedMin) {
        return getRandomAdvice(conditions.wind.advice);
    }
    
    // Check humidity
    if (conditions.humid && humidity >= conditions.humid.humidityMin) {
        return getRandomAdvice(conditions.humid.advice);
    }
    
    return null;
}

/**
 * Check for special combinations
 * @param {Number} temp - Apparent temperature
 * @param {Number} humidity - Relative humidity
 * @param {Number} windSpeed - Wind speed
 * @param {Object} combinations - Combination rules from JSON
 * @returns {String|null} Combination advice or null
 */
function getCombinationAdvice(temp, humidity, windSpeed, combinations) {
    // Hot and humid
    if (combinations.hotHumid && 
        temp >= combinations.hotHumid.tempMin && 
        humidity >= combinations.hotHumid.humidityMin) {
        return getRandomAdvice(combinations.hotHumid.advice);
    }
    
    // Windy and cold
    if (combinations.windyCold && 
        temp <= combinations.windyCold.tempMax && 
        windSpeed >= combinations.windyCold.windSpeedMin) {
        return getRandomAdvice(combinations.windyCold.advice);
    }
    
    return null;
}

/**
 * Generate beautiful one-line wardrobe advice from weather data
 * @param {Object} weatherData - Weather data from Open-Meteo API
 * @returns {Promise<String>} Beautifully formatted wardrobe advice (1-2 lines)
 */
async function generateWardrobeAdvice(weatherData) {
    // Load advice data
    const data = await loadAdviceData();
    
    // Extract data from API response
    const current = weatherData.current;
    const temp = current.apparent_temperature;
    const weatherCode = current.weather_code;
    const humidity = current.relative_humidity_2m;
    const windSpeed = current.wind_speed_10m;
    
    // Determine condition from weather code
    const condition = getConditionFromCode(weatherCode, data.weatherConditions);
    
    // Check precipitation
    const precipitationType = getPrecipitationType(current);
    
    // Priority 1: Special combinations (highest priority)
    const combinationAdvice = getCombinationAdvice(temp, humidity, windSpeed, data.combinations);
    if (combinationAdvice) {
        return combinationAdvice;
    }
    
    // Priority 2: Condition-specific advice (weather code + precipitation)
    let conditionAdvice = null;
    if (condition) {
        conditionAdvice = getConditionAdvice(
            weatherCode, 
            condition, 
            precipitationType, 
            temp, 
            windSpeed, 
            data.weatherConditions
        );
    }
    
    // Priority 3: Wind or humidity (if no condition from weather code)
    if (!conditionAdvice) {
        conditionAdvice = getWindOrHumidityAdvice(windSpeed, humidity, data.weatherConditions);
    }
    
    // Priority 4: Temperature advice
    const tempAdvice = getTemperatureAdvice(temp, data.temperatureCategories);
    
    // Combine advice intelligently
    if (conditionAdvice && tempAdvice) {
        // For critical conditions, prioritize condition advice
        if (condition === 'thunder' || condition === 'snow' || temp < 0 || temp > 35) {
            return conditionAdvice;
        }
        
        // 50% chance of combining both
        if (Math.random() > 0.5) {
            return `${tempAdvice} ${conditionAdvice}`;
        } else {
            return conditionAdvice;
        }
    }
    
    // Return whichever is available
    return conditionAdvice || tempAdvice || "Dress comfortably for today's weather!";
}

export default generateWardrobeAdvice;