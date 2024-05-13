
async function initMap() {
    console.log("Initializing map...");
    // Request needed libraries.
    const { Map, InfoWindow } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    const map = new Map(document.getElementById("map"), {
        center: { lat: 55.3781, lng: -3.4360 },
        zoom: 4,
        mapId: "4504f8b37365c3d0",
    });
    const infoWindow = new InfoWindow();
    const draggableMarker = new AdvancedMarkerElement({
        map,
        position: { lat: 55.3781, lng: -3.4360},
        gmpDraggable: true,
        title: "This marker is draggable.",
    });

    const locationInput = document.getElementById("location");

    draggableMarker.addListener("dragend", (event) => {
        const position = event.latLng; // Use event.latLng to get the position
        const lat = position.lat(); // Access the lat property using lat() function
        const lng = position.lng(); // Access the lng property using lng() function

        infoWindow.close();
        infoWindow.setContent(`Pin dropped at: ${lat}, ${lng}`);
        infoWindow.open(draggableMarker.map, draggableMarker);

        locationInput.value = `${position.lat()}, ${position.lng()}`;
    });
}

initMap()


