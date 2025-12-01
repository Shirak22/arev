import fetchLocationByIP from "./fetch-location-by-ip.js";

 // get location from cache or fetch from API
 const getLocation = async () => {
            console.log("location from API");
            const fetchLocation = await fetchLocationByIP();
            const location = {
                city: fetchLocation?.city,
                country: fetchLocation?.country,
                latitude: fetchLocation?.lat,
                longitude: fetchLocation?.lon,
            }
        if(!fetchLocation) return null; 
        return location;
}

export default getLocation;