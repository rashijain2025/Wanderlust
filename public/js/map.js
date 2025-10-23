document.addEventListener("DOMContentLoaded", function () {
   
    if (typeof listing === 'undefined' || !listing || !listing.location || !listing.country) {
        console.error("Listing data is missing or incomplete.");
        
        L.map("map").setView([20.5937, 78.9629], 5); 
        return; 
    }

    const map = L.map("map").setView([20.5937, 78.9629], 5);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const customIcon = L.icon({
        iconUrl:
            "https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png",
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -38],
        className: "airbnb-marker",
    });

    function geocodeLocation() {
        
        const location = `${listing.location}, ${listing.country}`;

        if (location) {
            fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                    location
                )}`
            )
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then((data) => {
                    if (data && data.length > 0) {
                        const lat = parseFloat(data[0].lat);
                        const lon = parseFloat(data[0].lon);
                        map.setView([lat, lon], 13);

                        const marker = L.marker([lat, lon], {
                            icon: customIcon,
                        }).addTo(map);

                        
                        marker
                            .bindPopup(
                                `
                                <h5 style="margin: 0; color: #ff385c;">${listing.title}</h5>
                                <p style="margin: 5px 0 0 0;">${listing.location}, ${listing.country}</p>
                                `
                            )
                            .openPopup();
                    } else {
                        console.warn(
                            "Specific location not found, using default view"
                        );
                        map.setView([28.6139, 77.2088], 5);
                    }
                })
                .catch((error) => {
                    console.error("Error geocoding location:", error);
                    map.setView([20.5937, 78.9629], 5);
                });
        } else {
            map.setView([20.5937, 78.9629], 5);
        }
    }
    geocodeLocation();
});