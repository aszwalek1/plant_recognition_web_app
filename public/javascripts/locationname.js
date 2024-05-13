// Assume plant.location is in the format "latitude, longitude"
const locationString = document.getElementById("location");


const [latitude, longitude] = locationString.value.split(',').map(parseFloat);


fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyDViXsX4aGMzQA-2X5J9gj8Gt_LD__RcVU
`)
    .then(response => response.json())
    .then(data => {
                // Get the formatted address from the API response
        const formattedAddress = data.results[0].formatted_address;

        // Update the UI directly with the address
        const plantLocationElement = document.getElementById("plant-location");
        plantLocationElement.textContent = formattedAddress;
    })
    .catch(error => {
        console.error('Error:', error);
    });

