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
 * Default user preferences
 */
const DEFAULT_PREFS = {
    tone: 'balanced',
    detail: 'brief',
    focus: 'safety'
};

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
 * Load user preferences from storage
 */
async function loadUserPreferences() {
    try {
        const stored = await chrome?.storage?.local?.get('wardrobePreferences');
        return stored?.wardrobePreferences || DEFAULT_PREFS;
    } catch (error) {
        return DEFAULT_PREFS;
    }
}

/**
 * Get random advice from an array
 */
function getRandomAdvice(adviceArray) {
    if (!adviceArray || adviceArray.length === 0) return null;
    return adviceArray[Math.floor(Math.random() * adviceArray.length)];
}

/**
 * Create an advice object with metadata
 */
function createAdviceObject(text, severity, category, type, tone = 'fun', alwaysShow = false) {
    return {
        text,
        severity: severity || 5,
        category,
        type,
        tone,
        alwaysShow
    };
}


function getConditionFromCode(weatherCode, conditions) {
    for (const [conditionName, conditionData] of Object.entries(conditions)) {
        if (conditionData.codes && conditionData.codes.includes(weatherCode)) {
            return conditionName;
        }
    }
    return null;
}

/**
 * Detect dangerous combinations of weather conditions
 * @param {Number} temp - Apparent temperature
 * @param {Number} humidity - Relative humidity
 * @param {Number} windSpeed - Wind speed
 * @param {String} condition - Primary weather condition
 * @param {Number} weatherCode - Weather code
 * @returns {Array<String>} Array of detected combination names
 */
function detectCombinations(temp, humidity, windSpeed, condition, weatherCode) {
    const combos = [];
    
    // Cold rain combination
    if (condition === 'rain' && temp < 10) {
        combos.push('coldRain');
    }
    
    // Warm rain combination
    if (condition === 'rain' && temp > 25) {
        combos.push('warmRain');
    }
    
    // Blowing snow (wind + snow)
    if (condition === 'snow' && windSpeed >= 8) {
        combos.push('blowingSnow');
    }
    
    // Wind chill (cold + wind)
    if (temp < 5 && windSpeed >= 20) {
        combos.push('windyCold');
    }
    
    // Hot and humid
    if (temp >= 28 && humidity >= 70) {
        combos.push('hotHumid');
    }
    
    return combos;
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
 * Get precipitation intensity (light, moderate, heavy)
 * @param {Object} current - Current weather data
 * @param {Number} weatherCode - Weather code
 * @returns {String|null} Intensity level or null
 */
function getPrecipitationIntensity(current, weatherCode) {
    const precip = current.precipitation || 0;
    const rain = current.rain || 0;
    const snowfall = current.snowfall || 0;
    
    // Use weather code as primary indicator
    if (weatherCode === 51 || weatherCode === 71) return 'light';
    if (weatherCode === 61 || weatherCode === 63 || weatherCode === 73) return 'moderate';
    if (weatherCode === 65 || weatherCode === 75 || weatherCode === 85 || weatherCode === 86) return 'heavy';
    
    // Fallback to precipitation amount (mm)
    const totalPrecip = Math.max(precip, rain, snowfall);
    if (totalPrecip > 0 && totalPrecip < 2.5) return 'light';
    if (totalPrecip >= 2.5 && totalPrecip < 10) return 'moderate';
    if (totalPrecip >= 10) return 'heavy';
    
    return null;
}

/**
 * Get temperature-based advice
 * @param {Number} temp - Apparent temperature
 * @param {Array} tempCategories - Temperature categories from JSON
 * @returns {Object|null} Advice object with metadata or null
 */
function getTemperatureAdvice(temp, tempCategories) {
    for (const category of tempCategories) {
        if (temp >= category.min && temp < category.max) {
            const advice = getRandomAdvice(category.advice);
            if (!advice) return null;
            
            // Calculate severity based on temperature extremes
            let severity = 3; // Baseline
            if (temp < -10 || temp > 40) severity = 9;
            else if (temp < 0 || temp > 35) severity = 7;
            else if (temp < 5 || temp > 30) severity = 5;
            
            return createAdviceObject(
                advice,
                severity,
                'temperature',
                'baseline',
                category.tone || 'fun',
                category.alwaysShow || false
            );
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
 * @param {String} precipitationIntensity - Precipitation intensity (light, moderate, heavy)
 * @returns {Array<Object>} Array of advice objects
 */
function getConditionAdvice(weatherCode, condition, temp, windSpeed, conditions, precipitationIntensity = null) {
    const adviceList = [];
    if (!condition || !conditions[condition]) return adviceList;
    
    const conditionData = conditions[condition];
    
    // Check for specific rain conditions
    if (condition === 'rain') {
        // Freezing rain (highest priority - severity 10)
        if (conditionData.freezing && conditionData.freezing.codes.includes(weatherCode)) {
            const advice = getRandomAdvice(conditionData.freezing.advice);
            if (advice) {
                adviceList.push(createAdviceObject(
                    advice,
                    conditionData.freezing.severity || 10,
                    'rain',
                    'freezing',
                    conditionData.freezing.tone || 'serious',
                    conditionData.freezing.alwaysShow !== false
                ));
            }
        }
        
        // Heavy rain (severity 8)
        if (precipitationIntensity === 'heavy' || 
            (conditionData.heavy && conditionData.heavy.codes.includes(weatherCode))) {
            const advice = getRandomAdvice(conditionData.heavy.advice);
            if (advice) {
                adviceList.push(createAdviceObject(
                    advice,
                    conditionData.heavy.severity || 8,
                    'rain',
                    'heavy',
                    conditionData.heavy.tone || 'serious',
                    conditionData.heavy.alwaysShow || false
                ));
            }
        }
        
        // Moderate rain (severity 6)
        if (precipitationIntensity === 'moderate' || 
            (conditionData.moderate && conditionData.moderate.codes.includes(weatherCode))) {
            const advice = getRandomAdvice(conditionData.moderate.advice);
            if (advice) {
                adviceList.push(createAdviceObject(
                    advice,
                    conditionData.moderate.severity || 6,
                    'rain',
                    'moderate',
                    conditionData.moderate.tone || 'fun',
                    conditionData.moderate.alwaysShow || false
                ));
            }
        }
        
        // Light rain (severity 4)
        if (precipitationIntensity === 'light' || 
            (conditionData.light && conditionData.light.codes.includes(weatherCode))) {
            const advice = getRandomAdvice(conditionData.light.advice);
            if (advice) {
                adviceList.push(createAdviceObject(
                    advice,
                    conditionData.light.severity || 4,
                    'rain',
                    'light',
                    conditionData.light.tone || 'fun',
                    conditionData.light.alwaysShow || false
                ));
            }
        }
        
        // Showers (severity 5)
        if (conditionData.showers && conditionData.showers.codes.includes(weatherCode)) {
            const advice = getRandomAdvice(conditionData.showers.advice);
            if (advice) {
                adviceList.push(createAdviceObject(
                    advice,
                    conditionData.showers.severity || 5,
                    'rain',
                    'showers',
                    conditionData.showers.tone || 'fun',
                    conditionData.showers.alwaysShow || false
                ));
            }
        }
        
        // General rain advice (severity 5)
        if (adviceList.length === 0) {
            const advice = getRandomAdvice(conditionData.general);
            if (advice) {
                adviceList.push(createAdviceObject(
                    advice,
                    conditionData.severity || 5,
                    'rain',
                    'general',
                    conditionData.tone || 'fun',
                    conditionData.alwaysShow || false
                ));
            }
        }
    }
    // Check for specific snow conditions
    else if (condition === 'snow') {
        // Blowing snow (wind + snow) - severity 9
        if (conditionData.blowing && windSpeed >= conditionData.blowing.windSpeedMin) {
            const advice = getRandomAdvice(conditionData.blowing.advice);
            if (advice) {
                adviceList.push(createAdviceObject(
                    advice,
                    conditionData.blowing.severity || 9,
                    'snow',
                    'blowing',
                    conditionData.blowing.tone || 'serious',
                    conditionData.blowing.alwaysShow !== false
                ));
            }
        }
        
        // Heavy snow (severity 8)
        if (precipitationIntensity === 'heavy' || 
            (conditionData.heavy && conditionData.heavy.codes.includes(weatherCode))) {
            const advice = getRandomAdvice(conditionData.heavy.advice);
            if (advice) {
                adviceList.push(createAdviceObject(
                    advice,
                    conditionData.heavy.severity || 8,
                    'snow',
                    'heavy',
                    conditionData.heavy.tone || 'serious',
                    conditionData.heavy.alwaysShow || false
                ));
            }
        }
        
        // Moderate snow (severity 6)
        if (precipitationIntensity === 'moderate' || 
            (conditionData.moderate && conditionData.moderate.codes.includes(weatherCode))) {
            const advice = getRandomAdvice(conditionData.moderate.advice);
            if (advice) {
                adviceList.push(createAdviceObject(
                    advice,
                    conditionData.moderate.severity || 6,
                    'snow',
                    'moderate',
                    conditionData.moderate.tone || 'fun',
                    conditionData.moderate.alwaysShow || false
                ));
            }
        }
        
        // Light snow (severity 4)
        if (precipitationIntensity === 'light' || 
            (conditionData.light && conditionData.light.codes.includes(weatherCode))) {
            const advice = getRandomAdvice(conditionData.light.advice);
            if (advice) {
                adviceList.push(createAdviceObject(
                    advice,
                    conditionData.light.severity || 4,
                    'snow',
                    'light',
                    conditionData.light.tone || 'fun',
                    conditionData.light.alwaysShow || false
                ));
            }
        }
        
        // Snow grains (severity 3)
        if (conditionData.grains && conditionData.grains.codes.includes(weatherCode)) {
            const advice = getRandomAdvice(conditionData.grains.advice);
            if (advice) {
                adviceList.push(createAdviceObject(
                    advice,
                    conditionData.grains.severity || 3,
                    'snow',
                    'grains',
                    conditionData.grains.tone || 'fun',
                    conditionData.grains.alwaysShow || false
                ));
            }
        }
        
        // General snow advice (severity 5)
        if (adviceList.length === 0) {
            const advice = getRandomAdvice(conditionData.general);
            if (advice) {
                adviceList.push(createAdviceObject(
                    advice,
                    conditionData.severity || 5,
                    'snow',
                    'general',
                    conditionData.tone || 'fun',
                    conditionData.alwaysShow || false
                ));
            }
        }
    }
    // Other conditions (thunder, fog, sunny)
    else {
        const advice = getRandomAdvice(conditionData.advice);
        if (advice) {
            // Thunder is life-threatening (severity 10)
            const severity = condition === 'thunder' ? 10 : 
                           condition === 'fog' ? 6 : 
                           condition === 'wind' ? 7 :
                           condition === 'humid' ? 4 : 3;
            adviceList.push(createAdviceObject(
                advice,
                conditionData.severity || severity,
                condition,
                'general',
                conditionData.tone || (condition === 'thunder' ? 'serious' : 'fun'),
                conditionData.alwaysShow || (condition === 'thunder')
            ));
        }
    }
    
    return adviceList;
}

/**
 * Check for wind or humidity conditions
 * @param {Number} windSpeed - Wind speed
 * @param {Number} humidity - Relative humidity
 * @param {Object} conditions - Weather conditions from JSON
 * @returns {Array<Object>} Array of advice objects
 */
function getWindOrHumidityAdvice(windSpeed, humidity, conditions) {
    const adviceList = [];
    
    // Check wind
    if (conditions.wind && windSpeed >= conditions.wind.windSpeedMin) {
        const advice = getRandomAdvice(conditions.wind.advice);
        if (advice) {
            adviceList.push(createAdviceObject(
                advice,
                conditions.wind.severity || 7,
                'wind',
                'standalone',
                conditions.wind.tone || 'fun',
                conditions.wind.alwaysShow || false
            ));
        }
    }
    
    // Check humidity
    if (conditions.humid && humidity >= conditions.humid.humidityMin) {
        const advice = getRandomAdvice(conditions.humid.advice);
        if (advice) {
            adviceList.push(createAdviceObject(
                advice,
                conditions.humid.severity || 4,
                'humid',
                'standalone',
                conditions.humid.tone || 'fun',
                conditions.humid.alwaysShow || false
            ));
        }
    }
    
    return adviceList;
}

/**
 * Check for special combinations
 * @param {Number} temp - Apparent temperature
 * @param {Number} humidity - Relative humidity
 * @param {Number} windSpeed - Wind speed
 * @param {String} precipitationType - Type of precipitation (rain, snow, showers, null)
 * @param {Object} combinations - Combination rules from JSON
 * @param {Object} conditions - Weather conditions from JSON
 * @returns {Array<Object>} Array of advice objects
 */
function getCombinationAdvice(temp, humidity, windSpeed, precipitationType, combinations, conditions) {
    const adviceList = [];
    
    // Cold rain combination (severity 8 - dangerous)
    if (precipitationType === 'rain' && conditions.rain && conditions.rain.cold) {
        if (temp <= conditions.rain.cold.tempMax) {
            const advice = getRandomAdvice(conditions.rain.cold.advice);
            if (advice) {
                adviceList.push(createAdviceObject(
                    advice,
                    conditions.rain.cold.severity || 8,
                    'combination',
                    'coldRain',
                    conditions.rain.cold.tone || 'serious',
                    conditions.rain.cold.alwaysShow !== false
                ));
            }
        }
    }
    
    // Warm rain combination (severity 4 - comfort)
    if (precipitationType === 'rain' && conditions.rain && conditions.rain.warm) {
        if (temp >= conditions.rain.warm.tempMin) {
            const advice = getRandomAdvice(conditions.rain.warm.advice);
            if (advice) {
                adviceList.push(createAdviceObject(
                    advice,
                    conditions.rain.warm.severity || 4,
                    'combination',
                    'warmRain',
                    conditions.rain.warm.tone || 'fun',
                    conditions.rain.warm.alwaysShow || false
                ));
            }
        }
    }
    
    // Hot and humid (severity 6 - uncomfortable)
    if (combinations.hotHumid && 
        temp >= combinations.hotHumid.tempMin && 
        humidity >= combinations.hotHumid.humidityMin) {
        const advice = getRandomAdvice(combinations.hotHumid.advice);
        if (advice) {
            adviceList.push(createAdviceObject(
                advice,
                combinations.hotHumid.severity || 6,
                'combination',
                'hotHumid',
                combinations.hotHumid.tone || 'fun',
                combinations.hotHumid.alwaysShow || false
            ));
        }
    }
    
    // Windy and cold (severity 9 - dangerous)
    if (combinations.windyCold && 
        temp <= combinations.windyCold.tempMax && 
        windSpeed >= combinations.windyCold.windSpeedMin) {
        const advice = getRandomAdvice(combinations.windyCold.advice);
        if (advice) {
            adviceList.push(createAdviceObject(
                advice,
                combinations.windyCold.severity || 9,
                'combination',
                'windyCold',
                combinations.windyCold.tone || 'serious',
                combinations.windyCold.alwaysShow !== false
            ));
        }
    }
    
    return adviceList;
}

/**
 * Filter advice by user preferences
 * @param {Array<Object>} adviceList - Array of advice objects
 * @param {Object} prefs - User preferences
 * @returns {Array<Object>} Filtered advice list
 */
function filterByPreferences(adviceList, prefs) {
    if (!prefs || prefs.tone === 'balanced') return adviceList;
    
    // Filter by tone preference
    if (prefs.tone === 'serious') {
        return adviceList.filter(a => a.tone === 'serious');
    } else if (prefs.tone === 'fun') {
        return adviceList.filter(a => a.tone === 'fun');
    }
    
    return adviceList;
}

/**
 * Remove redundant advice (same category/type)
 * @param {Array<Object>} adviceList - Array of advice objects
 * @returns {Array<Object>} Deduplicated advice list
 */
function removeRedundancies(adviceList) {
    const seen = new Set();
    const filtered = [];
    
    for (const advice of adviceList) {
        const key = `${advice.category}-${advice.type}`;
        if (!seen.has(key)) {
            seen.add(key);
            filtered.push(advice);
        } else {
            // If duplicate, keep the one with higher severity
            const existing = filtered.find(a => `${a.category}-${a.type}` === key);
            if (existing && advice.severity > existing.severity) {
                const index = filtered.indexOf(existing);
                filtered[index] = advice;
            }
        }
    }
    
    return filtered;
}

/**
 * Select final advice based on severity and user preferences
 * @param {Array<Object>} adviceList - Sorted advice list
 * @param {Object} prefs - User preferences
 * @returns {String} Final formatted advice
 */
function selectFinalAdvice(adviceList, prefs) {
    if (adviceList.length === 0) {
        return "Dress comfortably for today's weather!";
    }
    
    // Always show critical advice (severity >= 8 or alwaysShow = true)
    const critical = adviceList.filter(a => a.severity >= 8 || a.alwaysShow);
    const nonCritical = adviceList.filter(a => a.severity < 8 && !a.alwaysShow);
    
    let selected = [];
    
    // For critical conditions, show only the most critical (severity >= 7)
    if (critical.length > 0) {
        selected = [critical[0]]; // Highest severity critical advice
    } else {
        // For non-critical, select based on detail preference
        const maxAdvice = prefs.detail === 'detailed' ? 3 : 1;
        selected = nonCritical.slice(0, maxAdvice);
    }
    
    // Apply focus preference
    if (prefs.focus === 'safety') {
        // Prioritize safety-related advice
        selected = selected.sort((a, b) => b.severity - a.severity);
    } else if (prefs.focus === 'comfort') {
        // Prioritize comfort-related advice (moderate severity)
        selected = selected.sort((a, b) => {
            const aComfort = a.severity >= 4 && a.severity <= 6 ? 1 : 0;
            const bComfort = b.severity >= 4 && b.severity <= 6 ? 1 : 0;
            return bComfort - aComfort || b.severity - a.severity;
        });
    }
    // 'style' focus doesn't change sorting
    
    // Format output
    if (selected.length === 1) {
        return selected[0].text;
    } else {
        return selected.map(a => a.text).join(' ');
    }
}

/**
 * Generate beautiful wardrobe advice from weather data
 * @param {Object} weatherData - Weather data from Open-Meteo API
 * @param {Object} userPrefs - Optional user preferences override
 * @returns {Promise<String>} Beautifully formatted wardrobe advice
 */
async function generateWardrobeAdvice(weatherData, userPrefs = null) {
    // Load advice data and preferences
    const data = await loadAdviceData();
    const prefs = userPrefs || await loadUserPreferences();
    
    // Extract data from API response
    const current = weatherData.current;
    const temp = current.apparent_temperature;
    const weatherCode = current.weather_code;
    const humidity = current.relative_humidity_2m;
    const windSpeed = weatherData.current_units.wind_speed_10m === 'mp/h' ? current.wind_speed_10m * 1.60934 : current.wind_speed_10m ; // convert to km/h if mph
    
    // Determine condition from weather code
    const condition = getConditionFromCode(weatherCode, data.weatherConditions);
    
    // Check precipitation
    const precipitationType = getPrecipitationType(current);
    const precipitationIntensity = getPrecipitationIntensity(current, weatherCode);
    
    // Detect combinations
    const detectedCombos = detectCombinations(temp, humidity, windSpeed, condition, weatherCode);
    
    // Collect ALL possible advice (don't stop at first match)
    const allAdvice = [];
    
    // 1. Life-threatening conditions (thunder, freezing rain, extreme temps)
    if (condition) {
        const conditionAdvice = getConditionAdvice(
            weatherCode,
            condition,
            temp,
            windSpeed,
            data.weatherConditions,
            precipitationIntensity
        );
        allAdvice.push(...conditionAdvice);
    }
    
    // 2. Dangerous combinations (windyCold, coldRain, blowingSnow)
    const combinationAdvice = getCombinationAdvice(
        temp,
        humidity,
        windSpeed,
        precipitationType,
        data.combinations,
        data.weatherConditions
    );
    allAdvice.push(...combinationAdvice);
    
    // 3. Other combinations (hotHumid, warmRain)
    // Already included in combinationAdvice above
    
    // 4. Precipitation with intensity
    // Already included in conditionAdvice above
    
    // 5. Standalone conditions (wind, humidity, fog)
    if (!condition || condition === 'sunny') {
        const windHumidityAdvice = getWindOrHumidityAdvice(windSpeed, humidity, data.weatherConditions);
        allAdvice.push(...windHumidityAdvice);
    }
    
    // 6. Temperature baseline advice
    const tempAdvice = getTemperatureAdvice(temp, data.temperatureCategories);
    if (tempAdvice) {
        allAdvice.push(tempAdvice);
    }
    
    // Score and sort by severity (highest first)
    allAdvice.sort((a, b) => {
        // Always show items first
        if (a.alwaysShow && !b.alwaysShow) return -1;
        if (!a.alwaysShow && b.alwaysShow) return 1;
        // Then by severity
        return b.severity - a.severity;
    });
    
    // Filter by relevance (remove duplicates/redundancies)
    let filtered = removeRedundancies(allAdvice);
    
    // Filter by user preferences (tone)
    filtered = filterByPreferences(filtered, prefs);
    
    // Select top 2-3 most important pieces
    return selectFinalAdvice(filtered, prefs);
}

export default generateWardrobeAdvice;