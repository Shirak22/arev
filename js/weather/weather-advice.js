/**
 * Generate beautiful one-line wardrobe advice from weather data
 * @param {Object} weatherData - Weather data from Open-Meteo API
 * @returns {String} Beautifully formatted wardrobe advice (1-2 lines)
 */
function generateWardrobeAdvice(weatherData) {
    // Extract data from API response
    const current = weatherData.current;
    const daily = weatherData.daily;
    const apparent = current.temperature_2m;
    const temp = current.apparent_temperature;
    const weatherCode = current.weathercode;
    const humidity = current.relative_humidity_2m;
    const windSpeed = current.wind_speed_10m;
    
    // Define temperature categories with emojis
    const tempCategories = [
        { min: -Infinity, max: -10, advice: [
          "❄️ Layer like an Arctic explorer!", 
          "🥶 Bundle up—it's frostbite weather!",
          "🧊 You could freeze coffee mid-pour!",
          "🐧 Waddle-worthy weather ahead!"
        ]},
        { min: -10, max: 0, advice: [
          "🧥 Cozy coat weather—embrace the puff!", 
          "🧣 Scarf and gloves are your best friends.",
          "⛄ Perfect snowman-building conditions!",
          "☕ Hot beverage required by law (unofficially)."
        ]},
        { min: 0, max: 10, advice: [
          "🧥 Jacket recommended with warm layers.", 
          "🍂 Perfect for your favorite autumn jacket.",
          "🦆 If ducks aren't shivering, you're overdressed.",
          "🍁 Crunchy leaf weather activated!"
        ]},
        { min: 10, max: 16, advice: [
          "👔 Light jacket or a stylish sweater.", 
          "🎩 Channel your inner cozy mystery novelist.",
          "🌬️ 'Brisk' is the forecasters' code for 'jacket optional but wise.'",
          "📚 Library-cardigan weather unlocked!"
        ]},
        { min: 16, max: 22, advice: [
          "👚 Light layers for mild perfection.", 
          "🌤️ The 'just right' Goldilocks zone!",
          "😌 Temperature so nice, you'll forget to check it.",
          "🎭 The 'easy to layer, easy to shed' drama."
        ]},
        { min: 22, max: 28, advice: [
          "👕 T-shirt weather—show some skin!", 
          "🩳 Perfect for shorts and sunshine.",
          "🥤 Iced drink territory—enjoy responsibly!",
          "😎 Sunglasses on, worries off."
        ]},
        { min: 28, max: 35, advice: [
          "😎 Light, breezy fabrics recommended.", 
          "🧊 Stay cool and hydrated out there!",
          "🔥 Dress like you respect the sun's power.",
          "🥵 'Is it hot in here or is it just weather?'"
        ]},
        { min: 35, max: Infinity, advice: [
          "🔥 Seek shade and wear minimal layers.", 
          "🧴 Sunscreen is non-negotiable today!",
          "🥵 You might melt, but your style won't.",
          "🧊 Consider carrying personal AC unit."
        ]}
      ];
    
    // Define weather condition modifiers
    const weatherModifiers = {
        rain: [
          "☔ Don't forget your umbrella!", 
          "🌧️ A waterproof layer would be wise.",
          "🦆 Duck-approved weather today!",
          "💧 Spontaneous shower simulator engaged."
        ],
        snow: [
          "❄️ Boots with grip are essential!", 
          "⛄ Dress like a happy snowman.",
          "🎿 Channel your inner winter Olympian.",
          "🧤 Lost glove probability: 87%."
        ],
        thunder: [
          "⚡ Stay dry and avoid tall objects!", 
          "🌩️ Best to postpone outdoor adventures.",
          "😨 Nature's light show demands respect!",
          "🏠 Indoor hobbies highly recommended."
        ],
        fog: [
          "🌫️ Bright colors for visibility!", 
          "👻 Mysterious weather calls for caution.",
          "🔍 Where did everything go?",
          "🎬 Perfect for dramatic, slow-mo entrances."
        ],
        wind: [
          "💨 Windproof layers will save the day!", 
          "🎩 Secure that hat or it's gone!",
          "🪁 Free kite flying included!",
          "💇‍♂️ Forget your hairstyle, embrace the chaos."
        ],
        humid: [
          "💧 Breathable fabrics are key!", 
          "🌿 Dress for a tropical vibe.",
          "🥵 You're not sweating, you're 'glistening.'",
          "🪷 Embrace your inner rainforest creature."
        ],
        sunny: [
          "☀️ Sunglasses and sunscreen advised!", 
          "😎 Protect your skin and your eyes.",
          "🦎 Perfect lizard-basking weather.",
          "🌻 Solar-powered mode activated."
        ]
      };
    
    // Map weather codes to conditions
    const codeToCondition = {
      rain: [55,56,57,61,66,67],
      snow: [71,73,75,77],
      thunder: [95,96,99],
      fog: [45,48],
      sunny: [0,1]
    };
        // Determine weather condition
        let conditionAdvice = "";
        let condition = "";
    //enhanced rain conditions
    // Add to your existing rain conditions
if (condition === "rain") {
  // Light rain vs heavy rain
  if (weatherCode === 51 || weatherCode === 53) { // Light drizzle
    const lightRainAdvice = [
      "🌦️ Just a spritz! Light jacket will do.",
      "💦 Mist-erious weather—barely need an umbrella!",
      "☔ Light sprinkle: your hair's worst frienemy.",
      "👶 Rain so light, babies could use it as a bath."
    ];
    return lightRainAdvice[Math.floor(Math.random() * lightRainAdvice.length)];
  }
  
  if (weatherCode === 63 || weatherCode === 65) { // Moderate/heavy rain
    const heavyRainAdvice = [
      "🌧️ Proper rain! Your umbrella will earn its keep.",
      "💧 Dress like you're auditioning for a wet T-shirt contest (but don't).",
      "☔ Raincoat required unless you enjoy the drowned rat look.",
      "🚿 Nature's shower is set to 'full blast' today."
    ];
    return heavyRainAdvice[Math.floor(Math.random() * heavyRainAdvice.length)];
  }
  
  if (weatherCode >= 80 && weatherCode <= 82) { // Rain showers
    const showerAdvice = [
      "🌦️ Surprise showers! Waterproof layers recommended.",
      "🚿 On/off rain: nature can't make up its mind.",
      "💦 Intermittent drenching—carry that umbrella!",
      "🎲 Rain roulette: will you get wet? Probably!"
    ];
    return showerAdvice[Math.floor(Math.random() * showerAdvice.length)];
  }
}
  // enhanced snow conditions
  // Add to your existing snow conditions
if (condition === "snow") {
  // Light snow vs heavy snow
  if (weatherCode === 71 || weatherCode === 73) { // Light/moderate snow
    const lightSnowAdvice = [
      "❄️ Gentle snowflakes! Pretty but slippery.",
      "🌨️ Light dusting—winter's gentle reminder.",
      "⛄ Snow so light, snowmen might be disappointed.",
      "🎄 Hallmark movie weather activated!"
    ];
    return lightSnowAdvice[Math.floor(Math.random() * lightSnowAdvice.length)];
  }
  
  if (weatherCode === 75 || weatherCode === 85 || weatherCode === 86) { // Heavy snow/snow showers
    const heavySnowAdvice = [
      "❄️⛄ Serious snow! Boots with grip mandatory.",
      "🌨️ Winter wonderland or snowpocalypse? You decide!",
      "🚗 Snowplow driver's favorite kind of day!",
      "🏔️ Dress like you're summiting Everest (the sidewalk)."
    ];
    return heavySnowAdvice[Math.floor(Math.random() * heavySnowAdvice.length)];
  }
  
  if (weatherCode === 77) { // Snow grains
    const grainSnowAdvice = [
      "🧂 Snow grains! Like nature's tiny styrofoam.",
      "❄️ It's snowing... but in miniature!",
      "🌾 Snow so small, it's basically cold sand.",
      "⚪ Tiny snow: all the chill, half the fun."
    ];
    return grainSnowAdvice[Math.floor(Math.random() * grainSnowAdvice.length)];
  }
}

//special rain/snow combos

// Freezing rain (worst of both worlds)
if (weatherCode === 66 || weatherCode === 67) { // Freezing rain
  const freezingRainAdvice = [
    "🧊☔ Freezing rain! Nature's most treacherous creation.",
    "⚠️ Ice rink conditions—walk like a penguin!",
    "🚶‍♂️🤸‍♂️ Slippery when wet... and frozen!",
    "🎿 Who needs skates when sidewalks are this icy?"
  ];
  return freezingRainAdvice[Math.floor(Math.random() * freezingRainAdvice.length)];
}

// Rain with specific temperature ranges
if (condition === "rain" && temp > 25) {
  const warmRainAdvice = [
    "☔🌡️ Warm rain! Refreshing or just sweaty?",
    "💦🚿 Natural shower weather—embrace it!",
    "🥵🌧️ Like a steamy bathroom, but everywhere.",
    "🩳☔ Shorts and umbrella: the summer rain uniform."
  ];
  return warmRainAdvice[Math.floor(Math.random() * warmRainAdvice.length)];
}

// Snow with strong wind
if (condition === "snow" && windSpeed > 8) { // ~30 km/h
  const blowingSnowAdvice = [
    "🌬️❄️ Blowing snow! Horizontal winter is here.",
    "🚪🌨️ Going out? Hope you enjoy facial exfoliation!",
    "🥶💨 Snow + wind = nature's cold slap.",
    "🧊🌀 Snow blizzard: stay in and drink cocoa!"
  ];
  return blowingSnowAdvice[Math.floor(Math.random() * blowingSnowAdvice.length)];
}
    
    // Determine temperature category
    let tempAdvice = "";
    for (const category of tempCategories) {
      if (temp >= category.min && temp < category.max) {
        tempAdvice = category.advice[Math.floor(Math.random() * category.advice.length)];
        break;
      }
    }
    

    
    // Check weather code
    for (const [cond, codes] of Object.entries(codeToCondition)) {
      if (codes.includes(weatherCode)) {
        condition = cond;
        const options = weatherModifiers[cond];
        conditionAdvice = options[Math.floor(Math.random() * options.length)];
        break;
      }
    }
    
    // Check for wind/humidity if no condition from weather code
    if (!conditionAdvice) {
      if (windSpeed > 25) {
        conditionAdvice = weatherModifiers.wind[Math.floor(Math.random() * weatherModifiers.wind.length)];
      } else if (humidity > 75) {
        conditionAdvice = weatherModifiers.humid[Math.floor(Math.random() * weatherModifiers.humid.length)];
      }
    }
    
    // Special combinations (override for specific cases)
    if (temp < 10 && condition === "rain") {
        const coldRainAdvice = [
          "🧥☔ Waterproof warmth is essential today!",
          "❄️💧 Cold rain: nature's most unwelcome combo!",
          "🥶☔ Dress like you're defending a castle in Scotland!",
          "🚿🧊 Feels like a faulty shower—waterproof everything!"
        ];
        return coldRainAdvice[Math.floor(Math.random() * coldRainAdvice.length)];
      }
      if (temp > 28 && humidity > 70) {
        const hotHumidAdvice = [
          "💦 Light, breathable fabrics for this tropical feel!",
          "🥵🌴 You're not sweating, you're 'pre-marinating'!",
          "🌡️💧 Sauna mode: activated. Dress accordingly!",
          "🦟🍃 Welcome to the human greenhouse exhibit!"
        ];
        return hotHumidAdvice[Math.floor(Math.random() * hotHumidAdvice.length)];
      }

    if (temp < 5 && windSpeed > 20) {
  const windyColdAdvice = [
    "💨🧥 Windproof layers are your shield against the chill!",
    "🥶💨 The wind is personally offended by your warmth!",
    "🌬️❄️ Face-freezing winds detected! Battle armor needed!",
    "🚪🌪️ Going outside? Remember, doors work both ways!"
  ];
  return windyColdAdvice[Math.floor(Math.random() * windyColdAdvice.length)];
}
    
    // Combine advice (max 2 lines)
    if (conditionAdvice && tempAdvice) {
      // 50% chance of combining, 50% chance of just one
      if (Math.random() > 0.5) {
        return `${tempAdvice} ${conditionAdvice}`;
      } else {
        // Return the more critical one
        if (condition === "thunder" || condition === "snow" || temp < 0 || temp > 35) {
          return conditionAdvice;
        } else {
          return tempAdvice;
        }
      }
    }
    
    return tempAdvice || conditionAdvice || "Dress comfortably for today's weather!";
  }
  
export default generateWardrobeAdvice;