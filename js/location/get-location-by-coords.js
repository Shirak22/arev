import fetchLocationReverseGeocoding from "./fetch-location-reverse-geocoding.js";

const getLocationByCoords = async (latitude, longitude) => {
        const location = await fetchLocationReverseGeocoding(latitude, longitude);
        console.log("location from API");
        if(location) {
            return {
                city: location?.city,
                country: location?.country,
                latitude: location?.lat, 
                longitude: location?.lon,
            };
        }
    return null;
}

export default getLocationByCoords;