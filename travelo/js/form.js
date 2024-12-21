// Bootstrap validation logic
(function () {
    'use strict';

    const forms = document.querySelectorAll('.needs-validation');

    Array.from(forms).forEach(function (form) {
        form.addEventListener('submit', function (event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    });
})();

// Date Range Picker Initialization
$(function () {
    $('#travel-date').daterangepicker({
        locale: {
            format: 'D MMM YYYY', // Display format
        },
        autoApply: true, // Automatically apply the selected range
        opens: 'center', // Open the calendar in the center
    });
});

// Add a new activity
function addRow() {
    const tableBody = document.getElementById('activityTableBody');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>
            <input class="form-control" type="date" name="activity_date[]" required>
            <div class="invalid-feedback">Please select a date for the activity.</div>
        </td>
        <td>
            <input class="form-control" type="text" name="activity_desc[]" placeholder="Enter activity" required>
            <div class="invalid-feedback">Please describe the activity.</div>
        </td>
        <td>
            <button type="button" class="btn btn-danger btn-sm" onclick="deleteRow(this)">Delete</button>
        </td>
    `;
    tableBody.appendChild(newRow);
}

// Add a new packing list item
function addPackingItem() {
    const packingList = document.getElementById('packingList');
    const newItem = document.createElement('li');
    newItem.className = 'list-group-item d-flex align-items-center';
    newItem.innerHTML = `
        <input type="checkbox" name="packing_checked[]" class="form-check-input me-2">
        <input type="text" name="packing_item[]" class="form-control me-2" placeholder="Enter item" required>
        <div class="invalid-feedback">Please enter an item for the packing list.</div>
        <button type="button" class="btn btn-danger btn-sm" onclick="deletePackingItem(this)">Delete</button>
    `;
    packingList.appendChild(newItem);
}

// Delete a row or item
function deleteRow(button) {
    button.closest('tr').remove();
}

function deletePackingItem(button) {
    button.closest('li').remove();
}

// Convert file to Base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
}

// Handle Form Submission
document.getElementById('travelForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(this);

    // Process uploaded files
    const files = formData.getAll('uploaded_files[]');
    const uploadedFilesBase64 = await Promise.all(files.map(file => fileToBase64(file)));

    // Gather form data
    const itinerary = {
        location: document.getElementById('location').value,
        purpose: document.getElementById('purpose').value,
        travel_date: document.getElementById('travel-date').value,
        departure_date: document.getElementById('departure-date').value,
        return_date: document.getElementById('return-date').value,
        accommodation: document.querySelector('input[name="accommodation"]:checked').value,
        accommodation_name: document.getElementById('accommodation-name').value,
        activities: Array.from(document.querySelectorAll('#activityTableBody tr')).map(row => ({
            date: row.querySelector('input[name="activity_date[]"]').value,
            description: row.querySelector('input[name="activity_desc[]"]').value,
        })),
        todo: Array.from(document.querySelectorAll('#packingList li input[type="text"]')).map(input => input.value),
        uploaded_files: uploadedFilesBase64, // Save Base64 representation of files
    };

    // Save to localStorage
    const itineraries = JSON.parse(localStorage.getItem('itineraries')) || [];
    itineraries.push(itinerary);
    localStorage.setItem('itineraries', JSON.stringify(itineraries));

    // Redirect to result.html after saving
    alert('Itinerary saved!');
    window.location.href = 'result.html'; // Redirect to the result.html page
});
