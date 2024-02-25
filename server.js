const express = require('express');
const csv = require('csv-parser');
const fs = require('fs');

const app = express();

// Define the path to the CSV file
const csvFilePath = 'certificates.csv';

// Serve static files (HTML, CSS, JS)
app.use(express.static('public'));

// Endpoint to fetch data from CSV
app.get('/lookup/:certificateNumber', (req, res) => {
    const certificateNumber = req.params.certificateNumber;
    const results = [];

    fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (data) => {
            if (data.CNUM === certificateNumber) {
                results.push({
                    'CNUM': data.CNUM,
                    'Timestamp': data.Timestamp,
                    'Name': data.Name,
                    'Email': data.Email,
                    'Phone number': data['Phone number'],
                    'Merged Doc URL - Certificate': data['Merged Doc URL - Certificate']
                });
            }
        })
        .on('end', () => {
            if (results.length > 0) {
                res.json(results[0]);
            } else {
                res.status(404).json({ error: 'Certificate not found' });
            }
        });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
