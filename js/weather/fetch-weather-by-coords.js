// https://api.open-meteo.com/v1/forecast?latitude=58.37&longitude=16.19&current=weathercode,temperature_2m,apparent_temperature,relative_humidity_2m&daily=weathercode,temperature_2m_max,temperature_2m_min&forecast_days=3&timezone=auto
const fetchWeatherByCoords = async (latitude, longitude) => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=weathercode,temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,wind_speed_10m_max&forecast_days=3&timezone=auto`;
    try {
        const fetchWeather = await fetch(url); 
        const data = await fetchWeather.json();
        return data ; 

    } catch (error) {
        console.error("couldn't fetch weather ",error)
    }
}

export default fetchWeatherByCoords;