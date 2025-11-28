import fetchLocationByIP from "./fetch-location-by-ip.js";
 // get location from cache or fetch from API
 const getLocation = async () => {
    const cachedLocation = await chrome.storage.local.get(['location', 'timestamp']);
    if(cachedLocation &&
        cachedLocation.timestamp &&
        Date.now() - cachedLocation.timestamp < 1000 * 60 * 60  // 1 hour
    ) {
        console.log("location from cache:");
        return {
            city: cachedLocation.location.city,
            country: cachedLocation.location.country,
            latitude: cachedLocation.location.lat,
            longitude: cachedLocation.location.lon,
            timestamp: cachedLocation.timestamp,
            isCached: true
        };
    }else {
        const location = await fetchLocationByIP();
        console.log("location from API");
        if(location) {
            await chrome.storage.local.set({ location: location, timestamp: Date.now() });
            return {
                city: location.city,
                country: location.country,
                latitude: location.lat,
                longitude: location.lon,
                timestamp: Date.now(),
                isCached: false
            };
        }
    }
    return null;
}

export default getLocation;