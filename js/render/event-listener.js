import { animateWeatherForecast, hideWeatherForecast } from "./animation.js";

const weatherForecastTitle = document.querySelector('.weather-forecast-title');
let isVisible = false;
const toggleWeatherForecast = () => {

    if(isVisible) {
        hideWeatherForecast();
        isVisible = false;
    } else {
        animateWeatherForecast();
        isVisible = true;
    }
}

weatherForecastTitle.addEventListener('click', toggleWeatherForecast);

