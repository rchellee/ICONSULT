const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser'); // Import bodyParser to parse JSON bodies

const app = express();
app.use(cors());
app.use(bodyParser.json()); // Add this to parse incoming request bodies

// Create a MySQL connection pool
const db = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: '',
    database: 'iconsult'
});

app.get('/', (req, res) => {
    return res.json("From Backend Side");
});

// Get admin data (existing route)
app.get('/admin', (req, res) => {
    const sql = "SELECT * FROM admin";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

// Login route to check user credentials
app.post('/Login', (req, res) => {
    const { username, password } = req.body;

    // First, check the admin table
    const sqlAdmin = "SELECT * FROM admin WHERE username = ? AND password = ?";
    db.query(sqlAdmin, [username, password], (err, adminResults) => {
        if (err) {
            return res.status(500).json({ message: 'An error occurred checking the admin table' });
        }

        if (adminResults.length > 0) {
            // Admin login successful
            return res.status(200).json({ message: 'Login successful', role: 'admin' });
        } else {
            // Check the employees table
            const sqlEmployee = "SELECT * FROM employees WHERE email_add = ? AND password = ?";
            db.query(sqlEmployee, [username, password], (err, employeeResults) => {
                if (err) {
                    return res.status(500).json({ message: 'An error occurred checking the employees table' });
                }

                if (employeeResults.length > 0) {
                    // Employee login successful
                    return res.status(200).json({ message: 'Login successful', role: 'employee' });
                } else {
                    // Check the client table
                    const sqlClient = "SELECT * FROM client WHERE email_add = ? AND password = ?";
                    db.query(sqlClient, [username, password], (err, clientResults) => {
                        if (err) {
                            return res.status(500).json({ message: 'An error occurred checking the client table' });
                        }

                        if (clientResults.length > 0) {
                            // Client login successful
                            return res.status(200).json({ message: 'Login successful', role: 'client' });
                        } else {
                            // No match found in any table
                            return res.status(401).json({ message: 'Invalid username or password' });
                        }
                    });
                }
            });
        }
    });
});

// Start the server
app.listen(8081, () => {
    console.log("Server is listening on port 8081");
});