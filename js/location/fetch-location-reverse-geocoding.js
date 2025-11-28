//https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=37.42159&longitude=-122.0837&localityLanguage=en
const fetchLocationReverseGeocoding = async (latitude, longitude) => {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        const location = {
            city: data.city,
            country: data.countryName,
            lat: data.latitude  ,
            lon: data.longitude,        
        }
        return location || null;
    } catch (error) {
        console.error("Error fetching location reverse geocoding:", error);
        return null;
    }
}

export default fetchLocationReverseGeocoding;