import getLocation from "./location/get-location.js";
import getLocationByCoords from "./location/get-location-by-coords.js";
import fetchWeatherByCoords from "./weather/fetch-weather-by-coords.js";




async function setup() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if(message.type === 'getLocationByCoords') {
           (async() => {
            const getLocation = await getLocationByCoords(message.latitude, message.longitude);
            if(getLocation) {
                sendResponse(getLocation);
            }else {
                sendResponse({ error: 'No location found' });
            }
            })();
            return true;
        }else if(message.type === 'getLocation') {
        (async ()=> {
            const getLocation__response = await getLocation();
            if(getLocation__response) {
                sendResponse(getLocation__response);
            }else {
                sendResponse({ error: 'No location found' });
            }
            })();
            return true;
        }else if (message.type === 'getWeatherByCoords') {
            (async() => {
                const getWeather = await fetchWeatherByCoords(message.latitude, message.longitude);
                if(getWeather) {
                    sendResponse(getWeather);
                }else {
                    sendResponse({ error: 'No weather found' });
                }
            })();
            return true;
        }
    });
}   
setup();
