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
            const sqlClient = "SELECT id, firstName, lastName FROM client WHERE username = ? AND password = ?";
            db.query(sqlClient, [username, password], (err, clientResults) => {
                if (err) {
                    return res.status(500).json({ message: 'An error occurred checking the client table' });
                }

                if (clientResults.length > 0) {
                    const { id: clientId, firstName, lastName } = clientResults[0];
                    return res.status(200).json({ 
                        message: 'Login successful', 
                        role: 'client', 
                        clientId, 
                        firstName, 
                        lastName 
                    });
                }else {
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

// Update a client's status (PUT request)
app.put('/clients/:id', (req, res) => {
    const clientId = req.params.id;
    const { status } = req.body; // Status will be passed in the request body

    // Ensure the status is valid (e.g., 'active' or 'inactive')
    if (status !== 'active' && status !== 'inactive') {
        return res.status(400).json({ message: "Invalid status value" });
    }

    const sql = "UPDATE client SET status = ? WHERE id = ?";
    db.query(sql, [status, clientId], (err, result) => {
        if (err) return res.status(500).json({ message: "Error updating client status", error: err });

        // Check if any row was affected
        if (result.affectedRows > 0) {
            return res.status(200).json({ message: `Client status updated to ${status}` });
        } else {
            return res.status(404).json({ message: "Client not found" });
        }
    });
});

// Endpoint to update client details
app.put('/client/:id', (req, res) => {
    const clientId = req.params.id;
    const { firstName, lastName, middleInitial, birthday, mobile_number, email_add, address } = req.body;
    const sql = `UPDATE client SET firstName = ?, lastName = ?, middleInitial = ?, birthday = ?, mobile_number = ?, email_add = ?, address = ? WHERE id = ?`;

    db.query(sql, [firstName, lastName, middleInitial, birthday, mobile_number, email_add, address, clientId], (err, result) => {
        if (err) return res.status(500).json({ message: "Error updating client information", error: err });
        if (result.affectedRows > 0) {
            return res.status(200).json({ message: "Client updated successfully" });
        } else {
            return res.status(404).json({ message: "Client not found" });
        }
    });
});

// Save a new employee (POST request)
app.post('/employee', (req, res) => {
    const { firstName, lastName, middleName, address, mobile_number, email_add, status, birthday } = req.body;

    const sql = "INSERT INTO employee (firstName, lastName, middleName, address, mobile_number, email_add, status, birthday) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(sql, [firstName, lastName, middleName, address, mobile_number, email_add, status, birthday], (err, result) => {
        if (err) return res.status(500).json(err);
        return res.status(201).json({ id: result.insertId, firstName, lastName, middleName, address, mobile_number, email_add, status, birthday });
    });
});

// Fetch all employees (GET request)
app.get('/employees', (req, res) => {
    const sql = "SELECT * FROM employee";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

// Update employee's status (PUT request)
app.put('/employees/:id', (req, res) => {
    const employeeId = req.params.id;
    const { status } = req.body; // Status will be passed in the request body

    // Ensure the status is valid (e.g., 'active' or 'inactive')
    if (status !== 'active' && status !== 'inactive') {
        return res.status(400).json({ message: "Invalid status value" });
    }

    const sql = "UPDATE employee SET status = ? WHERE id = ?";
    db.query(sql, [status, employeeId], (err, result) => {
        if (err) return res.status(500).json({ message: "Error updating employee status", error: err });

        // Check if any row was affected
        if (result.affectedRows > 0) {
            return res.status(200).json({ message: `Employee status updated to ${status}` });
        } else {
            return res.status(404).json({ message: "Employee not found" });
        }
    });
});

// Update employee's information (PUT request)
app.put('/employee/:id', (req, res) => {
    const employeeId = req.params.id;
    const { firstName, lastName, middleName, address, mobile_number, email_add, birthday } = req.body;

    const sql = "UPDATE employee SET firstName = ?, lastName = ?, middleName = ?, address = ?, mobile_number = ?, email_add = ?, birthday = ? WHERE id = ?";
    db.query(sql, [firstName, lastName, middleName, address, mobile_number, email_add, birthday, employeeId], (err, result) => {
        if (err) return res.status(500).json({ message: "Error updating employee information", error: err });

        // Check if any row was affected
        if (result.affectedRows > 0) {
            return res.status(200).json({ message: "Employee information updated successfully" });
        } else {
            return res.status(404).json({ message: "Employee not found" });
        }
    });
});

// Mark a project as deleted (PATCH request - Soft Delete)
app.patch("/projects/:id", (req, res) => {
    const { id } = req.params;
    const { isDeleted } = req.body;

    const query = "UPDATE project SET isDeleted = ? WHERE id = ?";
    db.query(query, [isDeleted, id], (error, results) => { // using db.query for consistency
      if (error) {
        console.error("Error updating project:", error);
        return res.status(500).json({ error: "Failed to update project" });
      }
      return res.status(200).json({ message: "Project deleted successfully" });
    });
});
 
// Add a new project (POST request)
app.post('/projects', (req, res) => {
    const { clientName, projectName, description, startDate, endDate, status } = req.body;

    const sql = "INSERT INTO project (clientName, projectName, description, startDate, endDate, status) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(sql, [clientName, projectName, description, startDate, endDate, status], (err, result) => {
        if (err) return res.status(500).json(err);
        return res.status(201).json({ id: result.insertId, clientName, projectName, description, startDate, endDate, status });
    });
});
// Get all active (not deleted) projects (GET request)
app.get('/projects', (req, res) => {
    const sql = "SELECT * FROM project WHERE isDeleted = 0"; // Exclude deleted projects
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});
// Update an existing project (PUT request)
app.put('/projects/:id', (req, res) => {
    const projectId = req.params.id;
    const { clientName, projectName, description, startDate, endDate, status } = req.body;

    const sql = "UPDATE project SET clientName = ?, projectName = ?, description = ?, startDate = ?, endDate = ?, status = ? WHERE id = ?";
    db.query(sql, [clientName, projectName, description, startDate, endDate, status, projectId], (err, result) => {
        if (err) return res.status(500).json(err);

        // Respond with the updated project details
        return res.json({ id: projectId, clientName, projectName, description, startDate, endDate, status });
    });
});
// Delete a project (DELETE request)
app.delete('/projects/:id', (req, res) => {
    const projectId = req.params.id;

    const sql = "DELETE FROM project WHERE id = ?";
    db.query(sql, [projectId], (err, result) => {
        if (err) return res.status(500).json(err);
        
        // Check if any row was affected (deleted)
        if (result.affectedRows > 0) {
            return res.status(200).json({ message: 'Project deleted successfully' });
        } else {
            return res.status(404).json({ message: 'Project not found' });
        }
    });
});
// Add a new appointment (POST request)
app.post('/appointments', (req, res) => {
    const {
        date,
        time,
        name,
        email,
        contact, // Add contact here
        consultationType,
        additionalInfo,
        platform,
        clientId,
    } = req.body;

    if (!clientId || clientId === 0) {
        return res.status(400).json({ message: "Invalid client ID" });
    }

    const sql = `
        INSERT INTO appointments (date, time, name, email, contact, consultationType, additionalInfo, platform, client_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [date, time, name, email, contact, consultationType, additionalInfo, platform, clientId], (err, result) => {
        if (err) {
            console.error("Error inserting appointment:", err);
            return res.status(500).json({ message: "Failed to save appointment", error: err });
        }
        return res.status(201).json({ message: "Appointment saved successfully", appointmentId: result.insertId });
    });
});
// Fetch appointments for a specific client
app.get('/appointments/client/:clientId', (req, res) => {
    const { clientId } = req.params;

    const sql = `
        SELECT * FROM appointments WHERE client_id = ?
    `;

    db.query(sql, [clientId], (err, data) => {
        if (err) {
            console.error("Error fetching appointments:", err);
            return res.status(500).json({ message: "Failed to fetch appointments", error: err });
        }
        return res.status(200).json(data);
    });
});


// Start the server
app.listen(8081, () => {
    console.log("Server is listening on port 8081");
});