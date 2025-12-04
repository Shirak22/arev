import getWeatherBackground from "../weather/weather-background.js";
import getWeatherDescription from "../weather/weather-description.js";
import getWeatherIcon from "../weather/weather-icon.js";
import generateWardrobeAdvice from "../weather/weather-advice.js";
import renderLoader from "./loader.js";

const render = (position, weather) => {
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
    const background = getWeatherBackground(weather.current.weathercode);
    
    city.textContent = position.city + ", " + position.country;
    time.textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }); //
    icon.src = `assets/icons/svg/${getWeatherIcon(weather.current.weathercode)}`;
     description.textContent = getWeatherDescription(weather.current.weathercode);
     temperature.textContent = Math.round(weather.current.temperature_2m);
     feelsLike.textContent =  Math.round(weather.current.apparent_temperature);
     windSpeedValue.textContent = Math.round(weather.current.wind_speed_10m);
     humidityValue.textContent = Math.round(weather.current.relative_humidity_2m);
     mainContainer.style.backgroundImage = `url(${background.src})`;
    credits.textContent = background.photographer;
    link.href = background.url;
    
    recommendation.textContent = generateWardrobeAdvice(weather);
}

export default render;