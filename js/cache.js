let CACHE_EXPIRATION_TIME_POSITION = 1000 * 60 * 60 * 24 ; // 24 hours
let CACHE_EXPIRATION_TIME_WEATHER = 1000 * 60 * 60 ; // 1 hour

export const storeToCache = async (key, value) => {
    try {
        await chrome.storage.local.set({
            [key]: value, 
            [`timestamp_${key}`]: Date.now()
        });
        console.log(key + " stored to cache....");
        return true;
    } catch (error) {
        console.error("Error storing to cache:", error);
        return false;
    }
}



export const getFromCache = async (key) => {
        const CACHE_EXPIRATION_TIME = key === "position" ? CACHE_EXPIRATION_TIME_POSITION : CACHE_EXPIRATION_TIME_WEATHER; // 24 hours for position, 1 hour for weather
        try {
            const value = await chrome.storage.local.get([key , `timestamp_${key}`]);
            const timestamp = value[`timestamp_${key}`]
            if(value && timestamp && Date.now() - timestamp < CACHE_EXPIRATION_TIME) {
                console.log(key + " from cache", value);
                return value;
            }else {
                console.log(key + " not found in cache...");
                return null;
            }
        } catch (error) {
            console.error("Error getting from cache:", error);
            return null;
        }

}

export const cachePurge = async () => {
    await chrome.storage.local.clear();
    console.log('Cache purged');
}