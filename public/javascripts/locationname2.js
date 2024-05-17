/**
 * Get a formatted address from a string of a location's co-ordinates
 * @param location the location
 * @return Promise<string>
 */
async function getFormattedAddress(location) {
    const [latitude, longitude] = location.split(",").map(parseFloat);

    // Fetch geocode data from Google Maps API
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyDViXsX4aGMzQA-2X5J9gj8Gt_LD__RcVU`)
    const result = await response.json()
    return result.results[0].formatted_address;
}
