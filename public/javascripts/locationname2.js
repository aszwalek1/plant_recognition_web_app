document.addEventListener("DOMContentLoaded", function () {
    // Select all hidden location inputs
    const locationInputs = document.querySelectorAll('[id^="location_"]');

    // Iterate over each location input
    locationInputs.forEach(function (locationInput) {
        // Extract the plant ID from the location input's ID
        const plantId = locationInput.id.split("_")[1];

        // Split the location string into latitude and longitude
        const [latitude, longitude] = locationInput.value.split(",").map(parseFloat);

        // Fetch geocode data from Google Maps API
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyDViXsX4aGMzQA-2X5J9gj8Gt_LD__RcVU`)
            .then(response => response.json())
            .then(data => {
                // Get the formatted address from the API response
                const formattedAddress = data.results[0].formatted_address;

                // Update the UI directly with the address
                const plantLocationElement = document.getElementById(`plant-location_${plantId}`);
                if (plantLocationElement) {
                    plantLocationElement.textContent = formattedAddress;
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });
});