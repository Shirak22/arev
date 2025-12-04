import getWeatherIcon from "../weather/weather-icon.js";
import getWeatherDescription from "../weather/weather-description.js";

export const renderPopup = (weather) => {
    const popupWeatherDescription = document.querySelector('#popup-weather-description');
    const popupWeatherTemperature = document.querySelector('#popup-weather-temperature');


    console.log(weather);
    popupWeatherDescription.innerHTML = `
    <img src="assets/icons/svg/${getWeatherIcon(weather.current.weathercode)}" alt="Weather Icon">
    <p>${getWeatherDescription(weather.current.weathercode)}</p>
    `;
    popupWeatherTemperature.innerHTML = `
    <h2>${Math.round(weather.current.temperature_2m)}°C</h2>
    <p>Feels like ${Math.round(weather.current.apparent_temperature)}°C</p>
    <p>WS ${Math.round(weather.current.wind_speed_10m)} m/s</p>
    <p>H ${Math.round(weather.current.relative_humidity_2m)}%</p>
`;
}