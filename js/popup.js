const renderPopup = (weather) => {
    const popupContainer = document.querySelector('#popup-container');
    const popupWeatherDescription = document.querySelector('#popup-weather-description');
    const popupWeatherTemperature = document.querySelector('#popup-weather-temperature');
    const popupWeatherTemperatureValue = document.querySelector('.weather-temperature-value');
    const popupWeatherTemperatureFeelsLike = document.querySelector('.weather-temperature-feels-like');
    const popupWeatherTemperatureWindSpeed = document.querySelector('.weather-temperature-wind-speed');
    const popupWeatherTemperatureHumidity = document.querySelector('.weather-temperature-humidity');

    popupWeatherDescription.innerHTML = `
    <img src="assets/icons/svg/star.svg" alt="Weather Icon">
    <p>${weather.current.weathercode}</p>
    `;
    popupWeatherTemperature.innerHTML = `
    <h2>${weather.current.temperature_2m}°</h2>
    <p>Feels like ${weather.current.apparent_temperature}°C</p>
    <p>WS ${weather.current.wind_speed_10m} m/s</p>
    <p>H ${weather.current.relative_humidity_2m}%</p>
    `;  
}

export default renderPopup;
