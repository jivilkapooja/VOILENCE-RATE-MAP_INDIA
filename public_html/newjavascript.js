const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors()); // Enable CORS to allow requests from the frontend

// Create a connection to MySQL
const connection = mysql.createConnection({
    host: 'localhost',  // MySQL host (usually localhost)
    user: 'root',       // MySQL username
    password: 'root',   // MySQL password
    database: 'womens'  // Your MySQL database
});

// Connect to MySQL
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database successfully');
});

// Endpoint to fetch marker data from MySQL
app.get('/womens_data', (req, res) => {
     console.log('Request to /womens_data received');
    const query = 'SELECT Latitude, Longitude, DD FROM womens_data'; // Customize your query here
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching data from MySQL:', err);
            return res.status(500).send('Error fetching data');
        }

        // Add color based on violence rate (for example, based on 'DD')
        results.forEach(marker => {
            if (marker.DD > 300) {
                marker.color = 'green';  // Low violence rate
            } else if (marker.DD < 300) {
                marker.color = 'yellow'; // Moderate violence rate
            } else {
                marker.color = 'red';    // High violence rate
            }
        });

        // Send the results as JSON response
        res.json(results);
    });
});

// Start the server
const PORT = 3005;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});




