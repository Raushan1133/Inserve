export const getAddressFromCoordinates = async (latitude, longitude) => {
    const accessToken = import.meta.env.VITE_MAPBOX_TOKEN; // Replace with your Mapbox API key
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${accessToken}`;


    try {
        const response = await fetch(url);
        const data = await response.json();
     
        if (data.features.length > 0) {
            const address = data.features[0].place_name; // Full address or place name
            console.log("Address:", address);
            return address;
        } else {
            console.log("No address found for these coordinates.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching address:", error);
    }
};

//