<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $errors = [];

    // Validate and sanitize each field
    $location = htmlspecialchars($_POST['location'] ?? '');
    $purpose = htmlspecialchars($_POST['purpose'] ?? '');
    $travel_date = htmlspecialchars($_POST['travel_date'] ?? '');
    $departure_date = htmlspecialchars($_POST['departure_date'] ?? '');
    $return_date = htmlspecialchars($_POST['return_date'] ?? '');
    $accommodation = htmlspecialchars($_POST['accommodation'] ?? '');
    $accommodation_name = htmlspecialchars($_POST['accommodation_name'] ?? '');

    // Validate activities
    $activities = [];
    if (!empty($_POST['activity_date']) && !empty($_POST['activity_desc'])) {
        foreach ($_POST['activity_date'] as $key => $activity_date) {
            $activity_desc = $_POST['activity_desc'][$key] ?? '';
            if (!empty($activity_date) && !empty($activity_desc)) {
                $activities[] = [
                    'date' => htmlspecialchars($activity_date),
                    'description' => htmlspecialchars($activity_desc),
                ];
            }
        }
    }

    // Format departure and return dates
    if (!empty($departure_date)) {
        $departure_date = (new DateTime($departure_date))->format('d M Y H:i');
    }
    if (!empty($return_date)) {
        $return_date = (new DateTime($return_date))->format('d M Y H:i');
    }

    // Validate packing list
    $packing_list = [];
    if (!empty($_POST['packing_item'])) {
        foreach ($_POST['packing_item'] as $key => $item) {
            $item = trim($item); // Trim whitespace
            if (!empty($item)) { // Only include non-empty items
                $is_checked = $_POST['packing_checked'][$key] ?? "No";
                $packing_list[] = [
                    'item' => htmlspecialchars($item),
                    'packed' => $is_checked === "Yes" ? "Yes" : "No",
                ];
            }
        }
    }

    // Output formatted details
    echo "<div style='font-family: Arial, sans-serif; line-height: 1.6;'>";
    echo "<h2 style='text-align: center;'>Travel Itinerary</h2>";

    // Trip details table
    echo "<h4 style='text-align: left; margin-left: 10%;'>Trip Details</h4>
    <table border='1' cellspacing='10' cellpadding='8' style='width: 80%; border-collapse: collapse; margin: 0 auto; text-align: left;'>
        <tr><td style='width: 30%;'><strong>Country:</strong></td><td style='width: 70%;'>$location</td></tr>
        <tr><td style='width: 30%;'><strong>Travel Notes:</strong></td><td style='width: 70%;'>$purpose</td></tr>
        <tr><td style='width: 30%;'><strong>Travel Date:</strong></td><td style='width: 70%;'>$travel_date</td></tr>
        <tr><td style='width: 30%;'><strong>Departure Flight:</strong></td><td style='width: 70%;'>$departure_date</td></tr>
        <tr><td style='width: 30%;'><strong>Return Flight:</strong></td><td style='width: 70%;'>$return_date</td></tr>
        <tr><td style='width: 30%;'><strong>Accommodation Type:</strong></td><td style='width: 70%;'>$accommodation</td></tr>
        <tr><td style='width: 30%;'><strong>Accommodation Name:</strong></td><td style='width: 70%;'>$accommodation_name</td></tr>
    </table>";

    // Activities table
    if (!empty($activities)) {
        echo "<h4 style='text-align: left; margin-left: 10%;'>Activities</h4>
        <table border='1' cellspacing='0' cellpadding='8' style='width: 80%; border-collapse: collapse; margin: 0 auto; text-align: left;'>
            <thead>
                <tr>
                    <th style='width: 30%;'>Date</th>
                    <th style='width: 70%;'>Activity</th>
                </tr>
            </thead>
            <tbody>";
        foreach ($activities as $activity) {
            echo "<tr><td>{$activity['date']}</td><td>{$activity['description']}</td></tr>";
        }
        echo "</tbody>
        </table>";
    }

    // Packing list table
    if (!empty($packing_list)) {
        echo "<h4 style='text-align: left; margin-left: 10%;'>To-Do List</h4>
        <table border='1' cellspacing='0' cellpadding='8' style='width: 80%; border-collapse: collapse; margin: 0 auto; text-align: left;'>
            <thead>
                <tr><th style='width: 30%;'>Item</th><th style='width: 70%;'>Checklist</th></tr>
            </thead>
            <tbody>";
        foreach ($packing_list as $item) {
            echo "<tr><td>{$item['item']}</td><td>{$item['packed']}</td></tr>";
        }
        echo "</tbody>
        </table>";
    }

    echo "</div>";
    
    // Add buttons
    echo "<div style='text-align: center; margin-top: 20px;'>
        <button onclick='window.print()' style='padding: 10px 20px; font-size: 16px;'>Print PDF</button>
        <button onclick='window.location.href=\"../html/result.html\"' style='padding: 10px 20px; font-size: 16px;'>Back</button>
    </div>";
} else {
    echo "<p style='text-align: center; color: red;'>Invalid request method. Please go back to the form.</p>";
}
?>
