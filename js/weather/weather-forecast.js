import getWeatherDescription from "./weather-description.js";
import getWeatherIcon from "./weather-icon.js";

const getDayOfWeek = (time) => {
    const day = new Date(time).toLocaleDateString('en-US', { weekday: 'long' });
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    if(day === today) {
        return 'Tomorrow';
    } else {
        return day;
    }
}
const renderForecast = (weather) => {
    const forecast = weather.daily;
    const forecastDays = document.querySelector('.weather-forecast-days');
    const forecastDay = document.querySelector('.weather-forecast-day');
    const forecastDayDescription = document.querySelector('.weather-forecast-day-description');
    const forecastDayTemperature = document.querySelector('.weather-forecast-day-temperature');
    const forecastDayTemperatureMinMax = document.querySelector('.weather-forecast-day-temperature-min-max');
    const forecastDayDate = document.querySelector('.weather-forecast-day-date');


    forecast.time.forEach((time, index) => {
        const icon = getWeatherIcon(forecast.weathercode[index]);
        const description = getWeatherDescription(forecast.weathercode[index]);
        const maxTemp = Math.round(forecast.temperature_2m_max[index]);
        const minTemp = Math.round(forecast.temperature_2m_min[index]);
       // check if time is tomorrow to right the word tomorrow in the forecastDayDate
        let tomorrow = getDayOfWeek(time);
       
        forecastDays.innerHTML += `
        <section class="weather-forecast-day">
            <img src="assets/icons/svg/${icon}" alt="${description}" class="weather-forecast-icon">
            <p class="weather-forecast-day-description">${description}</p>
            <p class="weather-forecast-day-temperature-min-max">${maxTemp}°/${minTemp}°</p>
            <p class="weather-forecast-day-date">${tomorrow}</p>
        </section>
    `;
    });

}

export default renderForecast;