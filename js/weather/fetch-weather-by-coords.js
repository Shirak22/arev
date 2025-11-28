// https://api.open-meteo.com/v1/forecast?latitude=58.37&longitude=16.19&current=weathercode,temperature_2m,apparent_temperature,relative_humidity_2m&daily=weathercode,temperature_2m_max,temperature_2m_min&forecast_days=3&timezone=auto
const fetchWeatherByCoords = async (latitude, longitude) => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=weathercode,temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,wind_speed_10m_max&forecast_days=3&timezone=auto`;
    return new Promise(async (resolve, reject) => {
        try {
            chrome.storage.local.get(['weather', 'timestamp'], async (result) => {
                if (
                    result.weather &&
                    result.timestamp &&
                    Date.now() - result.timestamp < 1000 * 60 * 60
                ) {
                    console.log('Weather from cache');
                    resolve(result.weather);
                } else {
                    console.log('Fetching weather from API');
                    const response = await fetch(url);
                    const data = await response.json();
                    chrome.storage.local.set({ weather: data, timestamp: Date.now() });
                    resolve(data);
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}

export default fetchWeatherByCoords;