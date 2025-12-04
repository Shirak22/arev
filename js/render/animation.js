const weatherForecastWindow = document.querySelector('.weather-forecast');
const weatherForecastDays = document.querySelector('.weather-forecast-days');
const weatherForecastTitle = document.querySelector('.weather-forecast-title');


const animateWeatherForecast = () => {
    weatherForecastWindow.classList.add('slide-right');
    weatherForecastDays.classList.add('visible');
}
const hideWeatherForecast = () => {
    weatherForecastWindow.classList.remove('slide-right');
    weatherForecastDays.classList.remove('visible');
}



export { animateWeatherForecast, hideWeatherForecast };