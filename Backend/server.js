const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const cron = require("node-cron");
const bodyParser = require('body-parser');
require('dotenv').config();

const scheduledTasks = {};

const app = express();
app.use(cors());
app.use(bodyParser.json());


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

// SendGrid email example
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY); // Use the key from .env

app.post('/send-email', (req, res) => {
    const { to, subject, text, html } = req.body;

    const message = {
        to,
        from: "ritchelle.rueras@tup.edu.ph", // Use a verified sender email from SendGrid
        subject,
        text,
        html,
    };

    sgMail
        .send(message)
        .then(() => res.status(200).json({ message: 'Email sent successfully' }))
        .catch((error) => res.status(500).json({ error: error.message }));
});

// Endpoint to insert a new notification
app.post('/notifications', (req, res) => {
    const { title, description } = req.body;
  
    const query = 'INSERT INTO notifications (title, description, timestamp, isRead) VALUES (?, ?, NOW(), FALSE)';
    db.query(query, [title, description], (err, result) => {
      if (err) {
        console.error('Error inserting notification:', err.stack);
        res.status(500).send('Error inserting notification');
      } else {
        res.status(201).send('Notification created');
      }
    });
  });

  // Endpoint to get all notifications
app.get('/notifications', (req, res) => {
    const query = 'SELECT * FROM notifications ORDER BY timestamp DESC';
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching notifications:', err.stack);
        res.status(500).send('Error fetching notifications');
      } else {
        res.status(200).json(results);
      }
    });
  });

// Endpoint to mark a notification as read
app.put('/notifications/:id', (req, res) => {
    const notificationId = req.params.id;
    const query = 'UPDATE notifications SET isRead = TRUE WHERE id = ?';
    db.query(query, [notificationId], (err, result) => {
      if (err) {
        console.error('Error updating notification:', err.stack);
        res.status(500).send('Error updating notification');
      } else {
        res.status(200).send('Notification marked as read');
      }
    });
  });  

// Add a new endpoint to save a client
app.post('/client', (req, res) => {
    const { firstName, lastName, middleInitial, birthday, mobile_number, email_add, address, password, username, status, companyName } = req.body;

    const sql = "INSERT INTO client (firstName, lastName, middleInitial, birthday, mobile_number, email_add, address, password, username, status, companyName) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(sql, [firstName, lastName, middleInitial, birthday, mobile_number, email_add, address, password, username, status, companyName], (err, result) => {
        if (err) return res.status(500).json(err);
        return res.status(201).json({ id: result.insertId, firstName, lastName, middleInitial, birthday, mobile_number, email_add, address, username, status, companyName });
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
    const { clientId, clientName, projectName, description, startDate, endDate, status } = req.body;

    const sql = "INSERT INTO project (clientId, clientName, projectName, description, startDate, endDate, status) VALUES (?, ?, ?, ?, ?, ?, ?)";
    db.query(sql, [clientId, clientName, projectName, description, startDate, endDate, status], (err, result) => {
        if (err) return res.status(500).json(err);
        return res.status(201).json({ id: result.insertId, clientId, clientName, projectName, description, startDate, endDate, status });
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

app.post('/appointments', (req, res) => {
    const {
        date,
        time,
        name,
        email,
        contact,
        consultationType,
        additionalInfo,
        platform,
        clientId,
        companyName,
        reminder,
    } = req.body;

    if (!clientId || clientId === 0) {
        return res.status(400).json({ message: "Invalid client ID" });
    }

    const appointmentSql = `
        INSERT INTO appointments (date, time, name, email, contact, consultationType, additionalInfo, platform, client_id, companyName, reminder)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        appointmentSql,
        [date, time, name, email, contact, consultationType, additionalInfo, platform, clientId, companyName, reminder],
        (err, result) => {
            if (err) {
                console.error("Error inserting appointment:", err);
                return res.status(500).json({ message: "Failed to save appointment", error: err });
            }

            const appointmentId = result.insertId;
            const appointmentDateTime = new Date(`${date}T${time}`);
            let reminderTime = new Date(appointmentDateTime);

            // Adjust reminderTime based on the reminder value
            if (reminder === "5 minutes before") reminderTime.setMinutes(reminderTime.getMinutes() - 5);
            else if (reminder === "10 minutes before") reminderTime.setMinutes(reminderTime.getMinutes() - 10);
            else if (reminder === "15 minutes before") reminderTime.setMinutes(reminderTime.getMinutes() - 15);
            else if (reminder === "30 minutes before") reminderTime.setMinutes(reminderTime.getMinutes() - 30);
            else if (reminder === "1 hour before") reminderTime.setHours(reminderTime.getHours() - 1);
            else if (reminder === "1 day before") reminderTime.setDate(reminderTime.getDate() - 1);
            else if (reminder === "2 days before") reminderTime.setDate(reminderTime.getDate() - 2);
            else if (reminder === "1 week before") reminderTime.setDate(reminderTime.getDate() - 7);

            // Log the reminder time and cron expression for debugging
            console.log("Reminder Time:", reminderTime);
            console.log("Cron Expression:", `${reminderTime.getMinutes()} ${reminderTime.getHours()} ${reminderTime.getDate()} ${reminderTime.getMonth() + 1} *`);

            const notificationSql = `
                INSERT INTO notifications (title, description, timestamp, isRead)
                VALUES (?, ?, NOW(), 0)
            `;

            const notificationTitle = "Appointment";
            const notificationDescription = `Appointment with ${name} (${email}) on ${date} at ${time}.`;

            db.query(
                notificationSql,
                [notificationTitle, notificationDescription],
                (notificationErr) => {
                    if (notificationErr) {
                        console.error("Error creating notification:", notificationErr);
                        return res.status(500).json({ message: "Failed to create notification", error: notificationErr });
                    }

                    // Schedule email reminder
                    const jobId = `${appointmentId}-reminder`;

                    scheduledTasks[jobId] = cron.schedule(
                        `${reminderTime.getMinutes()} ${reminderTime.getHours()} ${reminderTime.getDate()} ${reminderTime.getMonth() + 1} *`,
                        () => {
                            const message = {
                                to: [email, "ritchelle.rueras@tup.edu.ph"], // Client and admin emails
                                from: "ritchelle.rueras@tup.edu.ph",
                                subject: `Reminder: Upcoming Appointment on ${date} at ${time}`,
                                text: `Hello ${name},\n\nThis is a reminder for your upcoming appointment scheduled on ${date} at ${time}.\n\nConsultation Type: ${consultationType}\nPlatform: ${platform}\nAdditional Info: ${additionalInfo}\n\nThank you!`,
                                html: `
                                    <p>Hello ${name},</p>
                                    <p>This is a reminder for your upcoming appointment:</p>
                                    <ul>
                                        <li><strong>Date:</strong> ${date}</li>
                                        <li><strong>Time:</strong> ${time}</li>
                                        <li><strong>Consultation Type:</strong> ${consultationType}</li>
                                        <li><strong>Platform:</strong> ${platform}</li>
                                        <li><strong>Additional Info:</strong> ${additionalInfo}</li>
                                    </ul>
                                    <p>Thank you!</p>
                                `,
                            };

                            sgMail
                                .send(message)
                                .then(() => console.log(`Reminder email sent for appointment ID: ${appointmentId}`))
                                .catch((error) => console.error("Error sending reminder email:", error));
                        },
                        {
                            scheduled: true,
                            timezone: "Asia/Manila", // Adjust to your timezone
                        }
                    );

                    // Log the cron job ID for debugging
                    console.log(`Scheduled cron job for appointment ID: ${appointmentId}, Job ID: ${jobId}`);

                    // Send the final response after both operations (appointment and notification) are complete
                    return res.status(201).json({
                        message: "Appointment saved successfully, notification created, and reminder scheduled",
                        appointmentId: appointmentId,
                    });
                }
            );
        }
    );
});

//Fetch appointments
app.get('/appointments', (req, res) => {
    
    const sql = `
        SELECT * FROM appointments
    `;
    
    db.query(sql, (err, data) => {
        if (err) {
            console.error("Error fetching appointments:", err);
            return res.status(500).json({ message: "Failed to fetch appointments", error: err });
        }
        return res.json(data);
    });
});

app.delete('/appointments/:id', (req, res) => {
    const appointmentId = req.params.id;
    const deleteSql = `DELETE FROM appointments WHERE id = ?`;

    db.query(deleteSql, [appointmentId], (err, result) => {
        if (err) {
            console.error("Error deleting appointment:", err);
            return res.status(500).json({ message: "Failed to delete appointment", error: err });
        }

        const jobId = `${appointmentId}-reminder`;
        if (scheduledTasks[jobId]) {
            scheduledTasks[jobId].stop();
            delete scheduledTasks[jobId];
        }

        return res.status(200).json({ message: "Appointment and reminder deleted successfully" });
    });
});


// Start the server
app.listen(8081, () => {
    console.log("Server is listening on port 8081");
});