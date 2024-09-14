require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
app.use(cors());
app.use(express.json());

// Set up your MySQL connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to the database.');
});

// Get admin data
app.get('/admin', (req, res) => {
  const sql = "SELECT * FROM admin";
  connection.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// Login route to check user credentials
app.post('/api/Login', (req, res) => {
  const { username, password } = req.body;

  // Check admin table
  const sqlAdmin = "SELECT * FROM admin WHERE username = ? AND password = ?";
  connection.query(sqlAdmin, [username, password], (err, adminResults) => {
    if (err) {
      return res.status(500).json({ message: 'An error occurred checking the admin table' });
    }

    if (adminResults.length > 0) {
      return res.status(200).json({ message: 'Login successful', role: 'admin' });
    } else {
      // Check employees table
      const sqlEmployee = "SELECT * FROM employees WHERE email_add = ? AND password = ?";
      connection.query(sqlEmployee, [username, password], (err, employeeResults) => {
        if (err) {
          return res.status(500).json({ message: 'An error occurred checking the employees table' });
        }

        if (employeeResults.length > 0) {
          return res.status(200).json({ message: 'Login successful', role: 'employee' });
        } else {
          // Check client table
          const sqlClient = "SELECT * FROM client WHERE email_add = ? AND password = ?";
          connection.query(sqlClient, [username, password], (err, clientResults) => {
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
    }
  });
});

// Start the server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});