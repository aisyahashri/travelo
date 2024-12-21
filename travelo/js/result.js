// Fetch and display itineraries
document.addEventListener('DOMContentLoaded', function () {
    const itineraries = JSON.parse(localStorage.getItem('itineraries')) || [];
    const itineraryContainer = document.getElementById('itineraryContainer');

    if (itineraries.length === 0) {
        itineraryContainer.innerHTML = '<p class="text-center">No itineraries found.</p>';
        return;
    }

    itineraries.forEach((itinerary, index) => {
        const card = document.createElement('div');
        card.className = 'col-md-4 mb-4';

        // Format departure and return dates
        const formattedDeparture = itinerary.departure_date ? itinerary.departure_date.replace("T", " ") : "";
        const formattedReturn = itinerary.return_date ? itinerary.return_date.replace("T", " ") : "";

        // Use the first uploaded file as the image if available
        const uploadedImage = itinerary.uploaded_files?.length
            ? itinerary.uploaded_files[0] // Base64-encoded image
            : 'https://via.placeholder.com/200';

        card.innerHTML = `
            <div class="card shadow-sm">
                <img src="${uploadedImage}" alt="Uploaded Document" class="card-img-top">
                <div class="card-body">
                    <h5 class="card-title"><b>Trip to ${itinerary.location}</b></h5><p></p>
                    <p class="card-text">
                        <b>Purpose:</b> ${itinerary.purpose}<br>
                        <b>Travel Date:</b> ${itinerary.travel_date}<br>
                        <b>Departure:</b> ${formattedDeparture}<br>
                        <b>Return:</b> ${formattedReturn}<br>
                        <b>Accommodation:</b> ${itinerary.accommodation} (${itinerary.accommodation_name})
                    </p>
                </div>
                <div class="card-footer text-center">
                    <button class="btn btn-primary btn-sm" onclick="viewDetails(${index})">View Full Details</button>
                </div>
            </div>
        `;
        itineraryContainer.appendChild(card);
    });
});

function viewDetails(index) {
    const itineraries = JSON.parse(localStorage.getItem('itineraries')) || [];
    const itinerary = itineraries[index];

    const form = document.getElementById('hiddenForm');

    form.elements["location"].value = itinerary.location;
    form.elements["purpose"].value = itinerary.purpose;
    form.elements["travel_date"].value = itinerary.travel_date;
    form.elements["departure_date"].value = itinerary.departure_date;
    form.elements["return_date"].value = itinerary.return_date;
    form.elements["accommodation"].value = itinerary.accommodation;
    form.elements["accommodation_name"].value = itinerary.accommodation_name;

    // Populate dynamic fields (activities)
    itinerary.activities.forEach((activity, i) => {
        const dateField = document.createElement("input");
        dateField.type = "hidden";
        dateField.name = "activity_date[]";
        dateField.value = activity.date;

        const descField = document.createElement("input");
        descField.type = "hidden";
        descField.name = "activity_desc[]";
        descField.value = activity.description;

        form.appendChild(dateField);
        form.appendChild(descField);
    });

    // Populate dynamic fields (packing list)
    itinerary.todo.forEach((item, i) => {
        const itemField = document.createElement("input");
        itemField.type = "hidden";
        itemField.name = "packing_item[]";
        itemField.value = item;

        const checkedField = document.createElement("input");
        checkedField.type = "hidden";
        checkedField.name = "packing_checked[]";
        checkedField.value = itinerary.packing_checked ? "Yes" : "No";

        form.appendChild(itemField);
        form.appendChild(checkedField);
    });

    // Submit the form
    form.submit();
}
