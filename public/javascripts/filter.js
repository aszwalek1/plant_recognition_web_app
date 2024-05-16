let plantDistances = [];

function resetForm() {
    var radioButtons = document.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(function(button) {
        button.checked = false;
    });
}

function resetFilters() {
    // Reset radio buttons to their default state
    document.querySelectorAll('input[type="radio"]').forEach(function(radio) {
        radio.checked = false; // Uncheck the radio button
    });

    // Reset checkboxes to their default state
    document.querySelectorAll('input[type="checkbox"]').forEach(function(checkbox) {
        checkbox.checked = false; // Uncheck the checkbox
    });

    // Reset select dropdowns to their default state
    document.querySelectorAll('select').forEach(function(select) {
        select.selectedIndex = 0; // Reset to the first option
    });

    document.getElementById('filterForm').submit(); // Submit the form to apply the reset filters
}

// Get user's current location
function updateUserLocation() {
    navigator.geolocation.getCurrentPosition(
        async position => {
            const {latitude, longitude} = position.coords;
            const userLocation = `${latitude},${longitude}`;
            document.getElementById('userLocation').value = userLocation; // Update the hidden input field value

        },
        error => {
            console.error('Error getting user location:', error);
        }
    );
}

window.addEventListener('load', updateUserLocation);
