let weatherIconsMapping = null;
let loadingPromise = null;

// Load JSON at module initialization
const loadWeatherIconsMapping = async () => {
    if (weatherIconsMapping) return weatherIconsMapping;
    if (loadingPromise) return loadingPromise;
    
    loadingPromise = (async () => {
        try {
            const response = await fetch('assets/icons/weather-icons-mapping.json');
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            weatherIconsMapping = await response.json();
            return weatherIconsMapping;
        } catch (error) {
            console.error('Failed to load weather icons mapping:', error);
            return null;
        }
    })();
    
    return loadingPromise;
};

// Start loading immediately
loadWeatherIconsMapping();
// need to check if night or day


const getWeatherIcon = (weathercode) => {
    let icon = '';

    if (!weatherIconsMapping) {
        console.warn('Weather icons mapping not loaded yet, using fallback');
        return 'clear-day.svg'; // fallback
    }
    // check if night or day
    const isNight = new Date().getHours() > 18 || new Date().getHours() < 6;
    if (isNight) {
        icon = weatherIconsMapping[weathercode]?.night || 'clear-night.svg';	
    } else {
        icon = weatherIconsMapping[weathercode]?.day || 'clear-day.svg';   
    }
    
    return icon;
}

export default getWeatherIcon;
export { loadWeatherIconsMapping };