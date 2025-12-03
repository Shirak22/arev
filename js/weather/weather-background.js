let weatherBackgroundsMapping = null;
let loadingPromise = null;

const loadWeatherBackgroundsMapping = async () => {
    if (weatherBackgroundsMapping) return weatherBackgroundsMapping;
    if (loadingPromise) return loadingPromise;
    loadingPromise = (async () => {
        try {
            const response = await fetch('assets/backgrounds/weather-images.json');
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            weatherBackgroundsMapping = await response.json();
            return weatherBackgroundsMapping;
        } catch (error) {
            console.error('Failed to load weather backgrounds mapping:', error);
            return null;
        }
    })();
    return loadingPromise;  
}
loadWeatherBackgroundsMapping();
const getWeatherBackground = (weathercode) => {
    // check if weatherBackgroundsMapping is loaded
    if(!weatherBackgroundsMapping) {
        console.warn('Weather backgrounds mapping not loaded yet, using fallback');
        return 'clear-day.jpg'; // fallback
    }
    //get the right group of photos 
     const folder = weatherBackgroundsMapping.find(item => item.codes.includes(weathercode));
     const randomPhoto = folder?.photos[Math.floor(Math.random() * folder?.photos.length)];
     console.log(randomPhoto);
     return {
        src: folder.folder + '/' + randomPhoto.filename,
        photographer: randomPhoto.photographer,
        url: randomPhoto.url
     }
}
export { loadWeatherBackgroundsMapping };
export default getWeatherBackground;