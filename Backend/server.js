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

    // Check admin table
    const sqlAdmin = "SELECT * FROM admin WHERE username = ? AND password = ?";
    db.query(sqlAdmin, [username, password], (err, adminResults) => {
        if (err) {
            return res.status(500).json({ message: 'An error occurred checking the admin table' });
        }

        if (adminResults.length > 0) {
            return res.status(200).json({ message: 'Login successful', role: 'admin' });
        } else {
            // Check client table
            const sqlClient = "SELECT * FROM client WHERE username = ? AND password = ?";
            db.query(sqlClient, [username, password], (err, clientResults) => {
                if (err) {
                    return res.status(500).json({ message: 'An error occurred checking the client table' });
                }

                if (clientResults.length > 0) {
                    return res.status(200).json({ message: 'Login successful', role: 'client' });
                } else {
                    return res.status(401).json({ message: 'Invalid username or password' });
                }
            });
        }
    });
});

// Add a new endpoint to save a client
app.post('/client', (req, res) => {
    const { firstName, lastName, middleInitial, birthday, mobile_number, email_add, address, password, username, status } = req.body;

    const sql = "INSERT INTO client (firstName, lastName, middleInitial, birthday, mobile_number, email_add, address, password, username, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(sql, [firstName, lastName, middleInitial, birthday, mobile_number, email_add, address, password, username, status], (err, result) => {
        if (err) return res.status(500).json(err);
        return res.status(201).json({ id: result.insertId, firstName, lastName, middleInitial, birthday, mobile_number, email_add, address, username, status });
    });
});

// Add a new endpoint to fetch all clients
app.get('/clients', (req, res) => {
    const sql = "SELECT * FROM client";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

// Add a new project (POST request)
app.post('/projects', (req, res) => {
    const { clientname, projectname, description, start_date, end_date, status } = req.body;

    const sql = "INSERT INTO project (clientname, projectname, description, start_date, end_date, status) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(sql, [clientname, projectname, description, start_date, end_date, status], (err, result) => {
        if (err) return res.status(500).json(err);
        return res.status(201).json({ id: result.insertId, clientname, projectname, description, start_date, end_date, status });
    });
});


// Get all projects (GET request)
app.get('/projects', (req, res) => {
    const sql = "SELECT * FROM project";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});



// Start the server
app.listen(8081, () => {
    console.log("Server is listening on port 8081");
});