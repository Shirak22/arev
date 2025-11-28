const fetchLocationByIP = async () => {

    try {
        const response = await fetch('http://ip-api.com/json/');
        const data = await response.json();
        return data || null;    
    } catch (error) {
        console.error("Error fetching location by IP:", error);
        return null;
    }
}   

export default fetchLocationByIP;