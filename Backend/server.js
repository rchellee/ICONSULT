const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const cron = require("node-cron");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const moment = require("moment");
require("dotenv").config();

const scheduledTasks = {};

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Create a MySQL connection pool
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "iconsult",
  timezone: "Z",
});

app.get("/", (req, res) => {
  return res.json("From Backend Side");
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Get admin data (existing route)
app.get("/admin", (req, res) => {
  const sql = "SELECT * FROM admin";
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/Login", (req, res) => {
  const { username, password } = req.body;

  // Check the client table
  const sqlClient = `
          SELECT id, firstName, lastName, email_add, passwordChanged 
          FROM client 
          WHERE username = ? AND password = ?
      `;

  db.query(sqlClient, [username, password], (err, clientResults) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "An error occurred while checking the client table" });
    }

    if (clientResults.length > 0) {
      const client = clientResults[0];
      if (!client.passwordChanged) {
        return res.status(200).json({
          message: "Password change required",
          role: "client",
          changePassword: true,
          clientId: client.id,
        });
      } else {
        return res.status(200).json({
          message: "Login successful",
          role: "client",
          firstName: client.firstName,
          lastName: client.lastName,
          clientId: client.id,
        });
      }
    }

    // If no match in client table, check admin table
    const sqlAdmin = "SELECT * FROM admin WHERE username = ? AND password = ?";
    db.query(sqlAdmin, [username, password], (err, adminResults) => {
      if (err) {
        return res.status(500).json({
          message: "An error occurred while checking the admin table",
        });
      }

      if (adminResults.length > 0) {
        return res
          .status(200)
          .json({ message: "Login successful", role: "admin" });
      }

      // If no match in both tables
      return res.status(401).json({ message: "Invalid username or password" });
    });
  });
});

app.post("/updatePassword", (req, res) => {
  const { clientId, newPassword } = req.body;

  const sqlUpdate = `
        UPDATE client 
        SET password = ?, passwordChanged = TRUE 
        WHERE id = ?
    `;
  db.query(sqlUpdate, [newPassword, clientId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error updating password" });
    }
    return res.status(200).json({ message: "Password updated successfully" });
  });
});

app.post("/identifyUser", (req, res) => {
  const { username } = req.body;

  // Check the admin table first
  const sqlAdmin = "SELECT email AS email FROM admin WHERE username = ?";
  db.query(sqlAdmin, [username], (err, adminResults) => {
    if (err) {
      return res.status(500).json({ message: "Error checking admin table" });
    }

    if (adminResults.length > 0) {
      return res
        .status(200)
        .json({ role: "admin", email: adminResults[0].email });
    }

    const sqlClient =
      "SELECT id AS clientId, email_add AS email FROM client WHERE username = ?";
    db.query(sqlClient, [username], (err, clientResults) => {
      if (err) {
        return res.status(500).json({ message: "Error checking client table" });
      }

      if (clientResults.length > 0) {
        return res.status(200).json({
          role: "client",
          email: clientResults[0].email,
          clientId: clientResults[0].clientId, // Include clientId here
        });
      }

      return res
        .status(404)
        .json({ message: "Email associated with this username not found." });
    });
  });
});

// SendGrid email example
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY); // Use the key from .env
const verificationCodes = new Map();
const otpStore = {};

// Save the code for an email
function storeCodeForEmail(email, code) {
  verificationCodes.set(email, code);
  console.log(`Code stored for ${email}: ${code}`);
  setTimeout(() => {
    verificationCodes.delete(email);
    console.log(`Code expired for ${email}`);
  }, 30 * 60 * 1000); // 30 minutes
}
function getStoredCodeForEmail(email) {
  console.log(`Fetching code for ${email}`);
  return verificationCodes.get(email);
}
//clientchange of password
app.post("/sendVerificationCode", (req, res) => {
  const { email } = req.body;
  const code = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit code

  const message = {
    to: email,
    from: "ritchelle.rueras@tup.edu.ph", // Verified sender email
    subject: "Your Verification Code",
    text: `Hey there,\n\nHere's the code to verify your email. The code is valid for 30 minutes. We recommend using the code now, as you will need to request a new one if it expires.\n\n${code}\n\nTo keep your account safe, please do not share this verification code. If you didn't try to sign in, you can safely ignore this email.\n\nCheers,\nYour Team`,
  };

  sgMail
    .send(message)
    .then(() => {
      storeCodeForEmail(email, code); // Store the code for later verification
      res.status(200).json({ message: "Code sent successfully" });
    })
    .catch((error) => res.status(500).json({ error: error.message }));
});
app.post("/verifyCode", (req, res) => {
  try {
    const { email, code } = req.body;

    // Logging for debugging
    console.log("Received email:", email);
    console.log("Received code:", code);

    const storedCode = getStoredCodeForEmail(email);
    console.log("Stored code:", storedCode);

    if (!storedCode) {
      return res.status(400).json({ message: "Code expired or not found." });
    }

    if (!email || !code) {
      return res.status(400).json({ message: "Email and code are required." });
    }

    if (String(storedCode) !== String(code)) {
      return res.status(400).json({ message: "Invalid verification code." });
    }

    // Code is valid
    return res.status(200).json({ message: "Verification successful." });
  } catch (error) {
    console.error("Error verifying code:", error);
    return res.status(500).json({ message: "An unexpected error occurred." });
  }
});
//forgot-password
app.post("/sendOTP", async (req, res) => {
  const { email } = req.body;
  const OTP = Math.floor(1000 + Math.random() * 9000); // Generate a 4-digit OTP

  otpStore[email] = { OTP, timestamp: Date.now() }; // Store OTP with timestamp

  const message = {
    to: email,
    from: "ritchelle.rueras@tup.edu.ph", // Replace with your verified sender email
    subject: "Your OTP Code",
    text: `Your OTP is ${OTP}. It is valid for 5 minutes.`,
  };

  try {
    await sgMail.send(message);
    console.log(`OTP sent to ${email}: ${OTP}`);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP email:", error);
    res.status(500).json({ message: "Failed to send OTP email" });
  }
});
app.post("/verifyOTP", (req, res) => {
  const { email, inputOTP } = req.body;

  const storedOtpData = otpStore[email];
  if (inputOTP.length !== 4) {
    return res.status(400).json({ message: "Invalid OTP format." });
  }

  if (!storedOtpData) {
    return res.status(404).json({ message: "OTP not found for this email" });
  }

  const { OTP, timestamp } = storedOtpData;
  const isExpired = Date.now() - timestamp > 5 * 60 * 1000; // OTP valid for 5 minutes

  if (isExpired) {
    delete otpStore[email];
    return res.status(400).json({ message: "OTP expired" });
  }

  if (parseInt(inputOTP) === OTP) {
    delete otpStore[email];
    return res.status(200).json({ message: "OTP verified successfully" });
  } else {
    return res.status(400).json({ message: "Incorrect OTP" });
  }
});

// Update password endpoint for clients
app.post("/updateclientPassword", (req, res) => {
  const { clientId, newPassword } = req.body;

  if (!clientId || !newPassword) {
    return res
      .status(400)
      .json({ message: "Client ID and new password are required" });
  }

  // Update client password in the database
  const sqlUpdate = "UPDATE client SET password = ? WHERE id = ?";
  db.query(sqlUpdate, [newPassword, clientId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database update failed" });
    }
    res.status(200).json({ message: "Password updated successfully" });
  });
});
// Update password endpoint for admin
app.post("/updateAdminPassword", (req, res) => {
  const { newPassword } = req.body;

  if (!newPassword) {
    return res.status(400).json({ message: "New password is required" });
  }

  // Update admin password in the database
  const sqlUpdate = "UPDATE admin SET password = ?";
  db.query(sqlUpdate, [newPassword], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database update failed" });
    }
    res.status(200).json({ message: "Password updated successfully" });
  });
});

// Save availability data to the database
app.post("/availability", (req, res) => {
  const availabilityData = req.body;

  const deleteSql = "DELETE FROM availability WHERE dates = ?";
  const insertSql =
    "INSERT INTO availability (start_time, end_time, dates) VALUES ?";

  // First, delete existing availability for the given dates
  const deletePromises = availabilityData.map((entry) => {
    return new Promise((resolve, reject) => {
      db.query(deleteSql, [entry.dates], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  });

  // Once deletions are complete, insert new data
  Promise.all(deletePromises)
    .then(() => {
      const values = availabilityData.map((entry) => [
        entry.start_time,
        entry.end_time,
        entry.dates,
      ]);
      db.query(insertSql, [values], (err, result) => {
        if (err) {
          console.error("Error saving data to the database:", err);
          return res.status(500).json({ message: "Error saving data" });
        }
        res.status(200).json({
          message: "Availability saved/updated successfully",
          data: result,
        });
      });
    })
    .catch((error) => {
      console.error("Error during update:", error);
      res.status(500).json({ message: "Error updating availability" });
    });
});
app.get("/availability", (req, res) => {
  const sql = "SELECT * FROM availability";
  db.query(sql, (err, data) => {
    if (err) {
      console.error("Error fetching availability data:", err);
      return res.status(500).json({ message: "Error fetching data" });
    }
    res.status(200).json(data);
  });
});
// Delete availability for a specific date
app.delete("/availability/:date", (req, res) => {
  const { date } = req.params;

  const sql = "DELETE FROM availability WHERE dates = ?";
  db.query(sql, [date], (err, result) => {
    if (err) {
      console.error("Error deleting availability:", err);
      return res.status(500).json({ message: "Error deleting data" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Date not found" });
    }
    res.status(200).json({ message: "Availability deleted successfully" });
  });
});

// Save availability data to the database
app.post("/availability", (req, res) => {
  const availabilityData = req.body;

  const deleteSql = "DELETE FROM availability WHERE dates = ?";
  const insertSql =
    "INSERT INTO availability (start_time, end_time, dates) VALUES ?";

  // First, delete existing availability for the given dates
  const deletePromises = availabilityData.map((entry) => {
    return new Promise((resolve, reject) => {
      db.query(deleteSql, [entry.dates], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  });

  // Once deletions are complete, insert new data
  Promise.all(deletePromises)
    .then(() => {
      const values = availabilityData.map((entry) => [
        entry.start_time,
        entry.end_time,
        entry.dates,
      ]);
      db.query(insertSql, [values], (err, result) => {
        if (err) {
          console.error("Error saving data to the database:", err);
          return res.status(500).json({ message: "Error saving data" });
        }
        res.status(200).json({
          message: "Availability saved/updated successfully",
          data: result,
        });
      });
    })
    .catch((error) => {
      console.error("Error during update:", error);
      res.status(500).json({ message: "Error updating availability" });
    });
});
app.get("/availability", (req, res) => {
  const sql = "SELECT * FROM availability";
  db.query(sql, (err, data) => {
    if (err) {
      console.error("Error fetching availability data:", err);
      return res.status(500).json({ message: "Error fetching data" });
    }
    res.status(200).json(data);
  });
});
// Delete availability for a specific date
app.delete("/availability/:date", (req, res) => {
  const { date } = req.params;

  const sql = "DELETE FROM availability WHERE dates = ?";
  db.query(sql, [date], (err, result) => {
    if (err) {
      console.error("Error deleting availability:", err);
      return res.status(500).json({ message: "Error deleting data" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Date not found" });
    }
    res.status(200).json({ message: "Availability deleted successfully" });
  });
});

// Save payment details to the database
app.post("/payments", (req, res) => {
  const {
    transactionId,
    payerName,
    payerEmail,
    amount,
    currency,
    payedToEmail,
    clientId,
    projectId,
  } = req.body;

  const query = `
    INSERT INTO payments (transaction_id, payer_name, payer_email, amount, currency, payed_to_email, client_id, project_id) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(
    query,
    [
      transactionId,
      payerName,
      payerEmail,
      amount,
      currency,
      payedToEmail,
      clientId,
      projectId,
    ],
    (err, result) => {
      if (err) {
        console.error("Error saving payment:", err);
        return res.status(500).send("Error saving payment.");
      }

      // Save notification for the admin
      const notificationQuery = `
      INSERT INTO notifications (title, description, timestamp, isRead) 
      VALUES (?, ?, ?, ?)
    `;

      const notificationTitle = "New Payment Received";
      const notificationDescription = `Client ${payerName} paid ${amount} ${currency}.`;
      const timestamp = new Date();

      db.query(
        notificationQuery,
        [notificationTitle, notificationDescription, timestamp, false],
        (err, notificationResult) => {
          if (err) {
            console.error("Error creating notification:", err);
            return res.status(500).send("Error saving notification.");
          }

          // Save client notification
          const clientNotificationQuery = `
            INSERT INTO client_notifications (client_id, title, description, timestamp, isRead)
            VALUES (?, ?, ?, NOW(), FALSE)
          `;

          const clientNotificationTitle = "Payment Received";
          const clientNotificationDescription = `Your payment of ${amount} ${currency} was successful.`;

          db.query(
            clientNotificationQuery,
            [clientId, clientNotificationTitle, clientNotificationDescription],
            (err) => {
              if (err) {
                console.error("Error saving client notification:", err);
                return res
                  .status(500)
                  .send("Error saving client notification.");
              }

              res
                .status(200)
                .send("Payment and client notification saved successfully.");
            }
          );
        }
      );
    }
  );
});

// Fetch all payments
app.get("/payments", (req, res) => {
  const query = "SELECT * FROM payments ORDER BY created_at DESC";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching payments:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
});
// Fetch payments for a specific client
app.get("/payments/:clientId", (req, res) => {
  const { clientId } = req.params;

  const query =
    "SELECT * FROM payments WHERE client_id = ? ORDER BY created_at DESC";
  db.query(query, [clientId], (err, results) => {
    if (err) {
      console.error("Error fetching payments:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
});

// Endpoint to insert a new notification
app.post("/notifications", (req, res) => {
  const { title, description } = req.body;

  const query =
    "INSERT INTO notifications (title, description, timestamp, isRead) VALUES (?, ?, NOW(), FALSE)";
  db.query(query, [title, description], (err, result) => {
    if (err) {
      console.error("Error inserting notification:", err.stack);
      res.status(500).send("Error inserting notification");
    } else {
      res.status(201).send("Notification created");
    }
  });
});
// Endpoint to get all notifications
app.get("/notifications", (req, res) => {
  const query = "SELECT * FROM notifications ORDER BY timestamp DESC";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching notifications:", err.stack);
      res.status(500).send("Error fetching notifications");
    } else {
      res.status(200).json(results);
    }
  });
});
// Endpoint to mark a notification as read
app.put("/notifications/:id", (req, res) => {
  const notificationId = req.params.id;
  const query = "UPDATE notifications SET isRead = TRUE WHERE id = ?";
  db.query(query, [notificationId], (err, result) => {
    if (err) {
      console.error("Error updating notification:", err.stack);
      res.status(500).send("Error updating notification");
    } else {
      res.status(200).send("Notification marked as read");
    }
  });
});
// Endpoint to get notifications for a specific client
app.get("/notifications/:clientId", (req, res) => {
  const { clientId } = req.params;

  const query = `
    SELECT * FROM notifications 
    WHERE client_id = ? 
    ORDER BY timestamp DESC
  `;
  db.query(query, [clientId], (err, results) => {
    if (err) {
      console.error("Error fetching notifications for client:", err.stack);
      res.status(500).send("Error fetching notifications");
    } else {
      res.status(200).json(results);
    }
  });
});

// Endpoint to get client notifications
app.get("/client-notifications/:clientId", (req, res) => {
  const { clientId } = req.params;

  const query = `
    SELECT * FROM client_notifications 
    WHERE client_id = ? 
    ORDER BY timestamp DESC
  `;
  db.query(query, [clientId], (err, results) => {
    if (err) {
      console.error("Error fetching client notifications:", err.stack);
      res.status(500).send("Error fetching client notifications");
    } else {
      res.status(200).json(results);
    }
  });
});

// Add a new endpoint to save a client
app.post("/client", (req, res) => {
  const {
    firstName,
    lastName,
    middleInitial,
    birthday,
    mobile_number,
    email_add,
    address,
    password,
    username,
    status,
    companyName,
  } = req.body;

  const sql =
    "INSERT INTO client (firstName, lastName, middleInitial, birthday, mobile_number, email_add, address, password, username, status, companyName) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  db.query(
    sql,
    [
      firstName,
      lastName,
      middleInitial,
      birthday,
      mobile_number,
      email_add,
      address,
      password,
      username,
      status,
      companyName,
    ],
    (err, result) => {
      if (err) return res.status(500).json(err);
      return res.status(201).json({
        id: result.insertId,
        firstName,
        lastName,
        middleInitial,
        birthday,
        mobile_number,
        email_add,
        address,
        username,
        status,
        companyName,
      });
    }
  );
});

// Add a new endpoint to fetch all clients
app.get("/clients", (req, res) => {
  const sql = "SELECT * FROM client";
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});
app.get("/client/:id", (req, res) => {
  const clientId = req.params.id;

  const sql = "SELECT firstName, lastName FROM client WHERE id = ?";
  db.query(sql, [clientId], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "An error occurred while fetching client details" });
    }

    if (result.length > 0) {
      return res.status(200).json(result[0]);
    } else {
      return res.status(404).json({ message: "Client not found" });
    }
  });
});

app.get("/clients/:id", (req, res) => {
  const clientId = req.params.id;

  const sql =
    "SELECT firstName, lastName, middleInitial, mobile_number, email_add, address, username, companyName FROM client WHERE id = ?";
  db.query(sql, [clientId], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "An error occurred while fetching client details" });
    }

    if (result.length > 0) {
      return res.status(200).json(result[0]); // Return the first result
    } else {
      return res.status(404).json({ message: "Client not found" });
    }
  });
});
// Update a client's status (PUT request)
app.put("/clients/:id", (req, res) => {
  const clientId = req.params.id;
  const { status } = req.body; // Status will be passed in the request body

  // Ensure the status is valid (e.g., 'active' or 'inactive')
  if (status !== "active" && status !== "inactive") {
    return res.status(400).json({ message: "Invalid status value" });
  }

  const sql = "UPDATE client SET status = ? WHERE id = ?";
  db.query(sql, [status, clientId], (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Error updating client status", error: err });

    // Check if any row was affected
    if (result.affectedRows > 0) {
      return res
        .status(200)
        .json({ message: `Client status updated to ${status}` });
    } else {
      return res.status(404).json({ message: "Client not found" });
    }
  });
});

// Endpoint to update client details
app.put("/client/:id", (req, res) => {
  const clientId = req.params.id;
  const {
    firstName,
    lastName,
    middleInitial,
    birthday,
    mobile_number,
    email_add,
    address,
  } = req.body;
  const sql = `UPDATE client SET firstName = ?, lastName = ?, middleInitial = ?, birthday = ?, mobile_number = ?, email_add = ?, address = ? WHERE id = ?`;

  db.query(
    sql,
    [
      firstName,
      lastName,
      middleInitial,
      birthday,
      mobile_number,
      email_add,
      address,
      clientId,
    ],
    (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ message: "Error updating client information", error: err });
      if (result.affectedRows > 0) {
        return res.status(200).json({ message: "Client updated successfully" });
      } else {
        return res.status(404).json({ message: "Client not found" });
      }
    }
  );
});

// Save a new employee (POST request)
app.post("/employee", (req, res) => {
  const {
    firstName,
    lastName,
    middleName,
    address,
    mobile_number,
    email_add,
    status,
    birthday,
  } = req.body;

  const sql =
    "INSERT INTO employee (firstName, lastName, middleName, address, mobile_number, email_add, status, birthday) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  db.query(
    sql,
    [
      firstName,
      lastName,
      middleName,
      address,
      mobile_number,
      email_add,
      status,
      birthday,
    ],
    (err, result) => {
      if (err) return res.status(500).json(err);
      return res.status(201).json({
        id: result.insertId,
        firstName,
        lastName,
        middleName,
        address,
        mobile_number,
        email_add,
        status,
        birthday,
      });
    }
  );
});

// Fetch all employees (GET request)
app.get("/employees", (req, res) => {
  const sql = "SELECT * FROM employee";
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// Update employee's status (PUT request)
app.put("/employees/:id", (req, res) => {
  const employeeId = req.params.id;
  const { status } = req.body; // Status will be passed in the request body

  // Ensure the status is valid (e.g., 'active' or 'inactive')
  if (status !== "active" && status !== "inactive") {
    return res.status(400).json({ message: "Invalid status value" });
  }

  const sql = "UPDATE employee SET status = ? WHERE id = ?";
  db.query(sql, [status, employeeId], (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Error updating employee status", error: err });

    // Check if any row was affected
    if (result.affectedRows > 0) {
      return res
        .status(200)
        .json({ message: `Employee status updated to ${status}` });
    } else {
      return res.status(404).json({ message: "Employee not found" });
    }
  });
});

// Update employee's information (PUT request)
app.put("/employee/:id", (req, res) => {
  const employeeId = req.params.id;
  const {
    firstName,
    lastName,
    middleName,
    address,
    mobile_number,
    email_add,
    birthday,
  } = req.body;

  const sql =
    "UPDATE employee SET firstName = ?, lastName = ?, middleName = ?, address = ?, mobile_number = ?, email_add = ?, birthday = ? WHERE id = ?";
  db.query(
    sql,
    [
      firstName,
      lastName,
      middleName,
      address,
      mobile_number,
      email_add,
      birthday,
      employeeId,
    ],
    (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ message: "Error updating employee information", error: err });

      // Check if any row was affected
      if (result.affectedRows > 0) {
        return res
          .status(200)
          .json({ message: "Employee information updated successfully" });
      } else {
        return res.status(404).json({ message: "Employee not found" });
      }
    }
  );
});

// Mark a project as deleted (PATCH request - Soft Delete)
app.patch("/project/:id", (req, res) => {
  const { id } = req.params;
  const { isDeleted } = req.body;

  const query = "UPDATE project SET isDeleted = ? WHERE id = ?";
  db.query(query, [isDeleted, id], (error, results) => {
    if (error) {
      console.error("Error updating project:", error);
      return res.status(500).json({ error: "Failed to update project" });
    }
    return res.status(200).json({ message: "Project deleted successfully" });
  });
});
// Add a new project (POST request)
app.post("/project", (req, res) => {
  const {
    clientId,
    clientName,
    projectName,
    description,
    startDate,
    endDate,
    status,
    contractPrice,
    downpayment = null, // Optional
    paymentStatus = "Not Paid", // Default to Not Paid
    totalPayment,
  } = req.body;

  const sql =
    "INSERT INTO project (clientId, clientName, projectName, description, startDate, endDate, status, contractPrice, downpayment, paymentStatus, totalPayment) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  db.query(
    sql,
    [
      clientId,
      clientName,
      projectName,
      description,
      startDate,
      endDate,
      status,
      contractPrice,
      downpayment,
      paymentStatus,
      totalPayment,
    ],
    (err, result) => {
      if (err) return res.status(500).json(err);
      return res.status(201).json({
        id: result.insertId,
        clientId,
        clientName,
        projectName,
        description,
        startDate,
        endDate,
        status,
        contractPrice,
        downpayment,
        paymentStatus,
        totalPayment,
      });
    }
  );
});
// Get all active (not deleted) projects (GET request)
app.get("/project", (req, res) => {
  const sql = "SELECT * FROM project WHERE isDeleted = 0";
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});
app.get("/project/:clientId", (req, res) => {
  const { clientId } = req.params;
  const sql = "SELECT * FROM project WHERE clientId = ? AND isDeleted = 0";
  db.query(sql, [clientId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json(data);
  });
});
app.get("/projects/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM project WHERE id = ? AND isDeleted = 0";
  db.query(sql, [id], (err, data) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (data.length > 0) {
      const project = data[0];
      if (project.endDate) {
        project.endDate = new Date(project.endDate).toISOString().split("T")[0];
      }
      return res.status(200).json({ project });
    } else {
      return res.status(404).json({ message: "Project not found" });
    }
  });
});
app.put("/project/:id", (req, res) => {
  const projectId = req.params.id;
  const {
    clientName,
    projectName,
    description,
    startDate,
    endDate,
    status,
    contractPrice,
    downpayment,
    paymentStatus,
    totalPayment,
  } = req.body;

  const sql =
    "UPDATE project SET clientName = ?, projectName = ?, description = ?, startDate = ?, endDate = ?, status = ?, contractPrice = ?, downpayment = ?, paymentStatus = ?, totalPayment = ? WHERE id = ?";
  db.query(
    sql,
    [
      clientName,
      projectName,
      description,
      startDate,
      endDate,
      status,
      contractPrice,
      downpayment,
      paymentStatus,
      totalPayment,
      projectId,
    ],
    (err, result) => {
      if (err) return res.status(500).json(err);

      return res.json({
        id: projectId,
        clientName,
        projectName,
        description,
        startDate,
        endDate,
        status,
        contractPrice,
        downpayment,
        paymentStatus,
        totalPayment,
      });
    }
  );
});
app.put("/project/update-payment-status/:id", (req, res) => {
  const projectId = req.params.id;
  const { paymentStatus } = req.body;

  if (!paymentStatus) {
    return res.status(400).json({ error: "Payment status is required" });
  }

  const sql = "UPDATE project SET paymentStatus = ? WHERE id = ?";
  db.query(sql, [paymentStatus, projectId], (err, result) => {
    if (err) return res.status(500).json(err);

    return res.json({
      id: projectId,
      paymentStatus,
      message: "Payment status updated successfully",
    });
  });
});

app.delete("/project/:id", (req, res) => {
  const projectId = req.params.id;

  const sql = "DELETE FROM project WHERE id = ?";
  db.query(sql, [projectId], (err, result) => {
    if (err) return res.status(500).json(err);

    // Check if any row was affected (deleted)
    if (result.affectedRows > 0) {
      return res.status(200).json({ message: "Project deleted successfully" });
    } else {
      return res.status(404).json({ message: "Project not found" });
    }
  });
});
app.patch("/project/recalculate-total/:id", (req, res) => {
  const { id } = req.params;

  const recalculateSql = `
    UPDATE project 
    SET totalPayment = (
      SELECT COALESCE(SUM(amount), 0) + contractPrice 
      FROM tasks 
      WHERE project_id = ?
    ) 
    WHERE id = ?`;

  db.query(recalculateSql, [id, id], (err, result) => {
    if (err) {
      console.error("Error recalculating totalPayment: ", err);
      return res.status(500).json({
        message: "Error recalculating totalPayment",
        error: err.message,
      });
    }

    res
      .status(200)
      .json({ message: "Total payment recalculated successfully" });
  });
});

// const backfillTotalPayment = () => {
//   const updateTotalPaymentSql = `
//     UPDATE project p
//     SET p.totalPayment = (
//       SELECT COALESCE(SUM(t.amount), 0) + p.contractPrice
//       FROM tasks t
//       WHERE t.project_id = p.id
//     )
//   `;

//   db.query(updateTotalPaymentSql, (err, result) => {
//     if (err) {
//       console.error("Error updating totalPayment:", err);
//       db.end();
//       return;
//     }

//     console.log(
//       `TotalPayment backfilled successfully for ${result.affectedRows} projects`
//     );
//     db.end();
//   });
// };
// backfillTotalPayment();

app.post("/tasks", (req, res) => {
  const { taskName, taskFee, dueDate, employee, miscellaneous, projectId } =
    req.body;

  console.log("Received project_id:", projectId);

  // Calculate the total miscellaneous fee
  let miscellaneousTotal = 0;
  if (Array.isArray(miscellaneous)) {
    miscellaneousTotal = miscellaneous.reduce((sum, item) => {
      return sum + parseFloat(item.fee || 0);
    }, 0);
  }
  const totalAmount = parseFloat(taskFee || 0) + miscellaneousTotal;
  const tasksSql = `INSERT INTO tasks (task_name, task_fee, due_date, employee, miscellaneous, amount, status, project_id)
             VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)`;

  db.query(
    tasksSql,
    [
      taskName,
      taskFee,
      dueDate,
      employee,
      JSON.stringify(miscellaneous),
      totalAmount,
      projectId,
    ],
    (err, result) => {
      if (err) {
        console.error("Error inserting task: ", err);
        return res
          .status(500)
          .json({ message: "Error creating task", error: err.message });
      }

      // Update totalPayment in the project table
      const updateProjectSql = `
        UPDATE project 
        SET totalPayment = (
          SELECT COALESCE(SUM(amount), 0) + contractPrice 
          FROM tasks 
          WHERE project_id = ?
        ) 
        WHERE id = ?`;

      db.query(updateProjectSql, [projectId, projectId], (updateErr) => {
        if (updateErr) {
          console.error("Error updating totalPayment: ", updateErr);
          return res.status(500).json({
            message: "Error updating totalPayment",
            error: updateErr.message,
          });
        }

        res.status(201).json({
          message: "Task created successfully and totalPayment updated",
          taskId: result.insertId,
        });
      });
    }
  );
});
app.put("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const { taskName, taskFee, dueDate, employee, miscellaneous, projectId } =
    req.body;

  // Calculate the total miscellaneous fee
  let miscellaneousTotal = 0;
  if (Array.isArray(miscellaneous)) {
    miscellaneousTotal = miscellaneous.reduce((sum, item) => {
      return sum + parseFloat(item.fee || 0);
    }, 0);
  }

  const totalAmount = parseFloat(taskFee || 0) + miscellaneousTotal;

  // SQL query to update the task
  const updateTaskSql = `
    UPDATE tasks 
    SET task_name = ?, task_fee = ?, due_date = ?, employee = ?, miscellaneous = ?, amount = ? 
    WHERE id = ?`;

  db.query(
    updateTaskSql,
    [
      taskName,
      taskFee,
      dueDate,
      employee,
      JSON.stringify(miscellaneous),
      totalAmount,
      id,
    ],
    (err, result) => {
      if (err) {
        console.error("Error updating task: ", err);
        return res
          .status(500)
          .json({ message: "Error updating task", error: err.message });
      }

      // Update totalPayment in the project table
      const updateProjectSql = `
        UPDATE project 
        SET totalPayment = (
          SELECT COALESCE(SUM(amount), 0) + contractPrice 
          FROM tasks 
          WHERE project_id = ?
        ) 
        WHERE id = ?`;

      db.query(updateProjectSql, [projectId, projectId], (updateErr) => {
        if (updateErr) {
          console.error("Error updating totalPayment: ", updateErr);
          return res.status(500).json({
            message: "Error updating totalPayment",
            error: updateErr.message,
          });
        }

        res.status(200).json({
          message: "Task updated successfully and totalPayment updated",
        });
      });
    }
  );
});
app.get("/admin/tasks", (req, res) => {
  const { projectId } = req.query;
  const sql = "SELECT * FROM tasks WHERE project_id = ?";

  db.query(sql, [projectId], (err, tasks) => {
    if (err) {
      console.error("Error fetching tasks: ", err);
      return res
        .status(500)
        .json({ message: "Error retrieving tasks", error: err });
    }
    res.status(200).json({ tasks });
  });
});
app.get("/tasks", (req, res) => {
  const projectIds = req.query.projectIds;

  // Ensure projectIds is an array
  const idsArray = Array.isArray(projectIds) ? projectIds : [projectIds];

  const sql = "SELECT * FROM tasks WHERE project_id IN (?)";

  db.query(sql, [idsArray], (err, tasks) => {
    if (err) {
      console.error("Error fetching tasks: ", err);
      return res
        .status(500)
        .json({ message: "Error retrieving tasks", error: err });
    }
    res.status(200).json({ tasks });
  });
});
app.get("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM tasks WHERE id = ?";
  db.query(sql, [id], (err, tasks) => {
    if (err) {
      console.error("Error fetching task details: ", err);
      return res
        .status(500)
        .json({ message: "Error retrieving task details", error: err });
    }
    if (tasks.length === 0) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(tasks[0]);
  });
});

app.post("/appointments", (req, res) => {
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
    [
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
    ],
    (err, result) => {
      if (err) {
        console.error("SQL Error:", err.sqlMessage);
        return res.status(500).json({
          message: "Failed to save appointment",
          error: err.sqlMessage,
        });
      }

      const appointmentId = result.insertId;
      // Parse date and time
      const formattedDateTime = moment(`${date} ${time}`, "YYYY-MM-DD hh:mm A");
      if (!formattedDateTime.isValid()) {
        return res.status(400).json({ message: "Invalid date or time format" });
      }

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
            return res.status(500).json({
              message: "Failed to create notification",
              error: notificationErr,
            });
          }

          // Save notification for the client
          const clientNotificationQuery = `
      INSERT INTO client_notifications (client_id, title, description, timestamp, isRead)
      VALUES (?, ?, ?, NOW(), 0)
      `;

          const clientNotificationTitle = "Appointment Scheduled";
          const clientNotificationDescription = `Your appointment on ${date} at ${time} has been confirmed.`;

          db.query(
            clientNotificationQuery,
            [clientId, clientNotificationTitle, clientNotificationDescription],
            (err, clientNotificationResult) => {
              if (err) {
                console.error("Error saving client notification:", err);
                return res
                  .status(500)
                  .json({ message: "Failed to save client notification" });
              }

              // Send the final response after both operations (appointment and notification) are complete
              return res.status(201).json({
                message: "Appointment saved successfully, notification created",
                appointmentId: appointmentId,
                id: result.insertId,
              });
            }
          );
        }
      );
    }
  );
});
//Fetch appointments
app.get("/appointments", (req, res) => {
  const sql = `
        SELECT * FROM appointments
    `;

  db.query(sql, (err, data) => {
    if (err) {
      console.error("Error fetching appointments:", err);
      return res
        .status(500)
        .json({ message: "Failed to fetch appointments", error: err });
    }
    return res.json(data);
  });
});
app.get("/appointments/count", (req, res) => {
  const sql = `
    SELECT date, COUNT(*) as appointmentCount
    FROM appointments
    GROUP BY date
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching appointment counts:", err);
      return res
        .status(500)
        .json({ message: "Failed to fetch data", error: err });
    }

    const formattedData = results.reduce((acc, { date, appointmentCount }) => {
      acc[date] = appointmentCount;
      return acc;
    }, {});

    res.json(formattedData);
  });
});
app.get("/appointments/times", (req, res) => {
  const { date } = req.query;

  const sql = `
    SELECT time
    FROM appointments
    WHERE date = ?
  `;

  db.query(sql, [date], (err, results) => {
    if (err) {
      console.error("Error fetching times for date:", err);
      return res
        .status(500)
        .json({ message: "Failed to fetch data", error: err });
    }

    const bookedTimes = results.map((row) => row.time);
    console.log(bookedTimes);
    res.json({ bookedTimes });
  });
});
app.delete("/appointments/:id", (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Invalid appointment ID" });
  }

  const deleteSql = `
        DELETE FROM appointments WHERE id = ?
    `;

  db.query(deleteSql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting appointment:", err);
      return res.status(500).json({ message: "Failed to delete appointment" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    return res
      .status(200)
      .json({ message: "Appointment deleted successfully" });
  });
});

// const backfillTimeFormat = () => {
//   const updateTimeFormatSql = `
//     UPDATE appointments
//     SET time = DATE_FORMAT(STR_TO_DATE(time, '%H:%i:%s'), '%h:%i %p');
//   `;

//   db.query(updateTimeFormatSql, (err, result) => {
//     if (err) {
//       console.error("Error updating time format:", err);
//       db.end();
//       return;
//     }

//     console.log(
//       `Time format updated successfully for ${result.affectedRows} rows`
//     );
//     db.end();
//   });
// };

// backfillTimeFormat();

// Endpoint to upload a file
app.post("/upload", (req, res) => {
  upload.single("file")(req, res, (err) => {
    if (err) {
      return res.status(500).json({ message: "File upload error" });
    }

    const { project_id, uploaded_by } = req.body;
    const originalName = req.file.originalname;
    const fileName = req.file.filename;
    const file_type = req.file.mimetype;

    const insertSql = `
      INSERT INTO uploads 
      (project_id, original_name, file_name, file_type, uploaded_by) 
      VALUES (?, ?, ?, ?, ?)
    `;
    db.query(
      insertSql,
      [project_id, originalName, fileName, file_type, uploaded_by],
      (err, result) => {
        if (err) {
          console.error("Error inserting file info:", err);
          return res.status(500).json({ message: "Error uploading file" });
        }

        const fetchSql = `
          SELECT 
            uploads.*,
            CASE 
              WHEN uploads.uploaded_by = 'admin' THEN 'admin'
              ELSE CONCAT(client.firstName, ' ', client.lastName)
            END AS uploaded_by_name
          FROM uploads
          LEFT JOIN client ON uploads.uploaded_by = client.id
          WHERE uploads.id = ?
        `;

        db.query(fetchSql, [result.insertId], (err, results) => {
          if (err) {
            console.error("Error fetching uploaded file info:", err);
            return res
              .status(500)
              .json({ message: "Error fetching file data" });
          }
          res.status(201).json(results[0]);
        });
      }
    );
  });
});
// Endpoint to fetch files by project ID
app.get("/upload", (req, res) => {
  const { project_id } = req.query;
  const sql = `
    SELECT 
      uploads.*,
      CASE 
        WHEN uploads.uploaded_by = 'admin' THEN 'admin'
        ELSE CONCAT(client.firstName, ' ', client.lastName)
      END AS uploaded_by_name
    FROM uploads
    LEFT JOIN client ON uploads.uploaded_by = client.id
    WHERE uploads.project_id = ?
  `;

  db.query(sql, [project_id], (err, results) => {
    if (err) {
      console.error("Error fetching files:", err);
      return res.status(500).json({ message: "Error fetching files" });
    }
    res.json(results);
  });
});
// Serve uploaded files
app.use("/uploads", express.static("uploads"));

app.post("/reviews", (req, res) => {
  const { clientId, projectId, rating, comment, status } = req.body;

  const query = `
      INSERT INTO reviews (client_id, project_id, rating, comment, status)
      VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [clientId, projectId, rating, comment, status],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to submit the review." });
      } else {
        res.status(201).json({ message: "Review submitted successfully." });
      }
    }
  );
});

// Start the server
app.listen(8081, () => {
  console.log("Server is listening on port 8081");
});
