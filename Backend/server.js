const express = require("express");
const { google } = require("googleapis");
const fs = require("fs");
const mysql = require("mysql");
const cors = require("cors");
const cron = require("node-cron");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const moment = require("moment");
const sgMail = require("@sendgrid/mail");
const schedule = require("node-schedule");
require("dotenv").config();
const folderId = "1JxQr5R94Cnf47S8xq0E6w5gQVpFnzMbF";

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

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

const drive = google.drive({ version: "v3", auth: oauth2Client });
const upload = multer({ dest: "temp/" });

// SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY); // Use the key from .env
const verificationCodes = new Map();
const otpStore = {};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

app.get("/admin", (req, res) => {
  const sql = "SELECT * FROM admin";
  db.query(sql, (err, data) => {
    if (err) {
      console.error("Error fetching admin data:", err);
      return res.status(500).json({ message: "Error fetching data" });
    }
    res.status(200).json(data);
  });
});

app.get("/admins/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM admin WHERE id = ?";
  db.query(sql, [id], (err, admin) => {
    if (err) {
      console.error("Error fetching admin details: ", err);
      return res
        .status(500)
        .json({ message: "Error retrieving admin details", error: err });
    }
    if (admin.length === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json(admin[0]);
  });
});

app.post("/admins/update", (req, res) => {
  const { id, username, email, password } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Admin ID is required." });
  }

  const updates = [];
  if (username) updates.push(`username = '${username}'`);
  if (email) updates.push(`email = '${email}'`);
  if (password) updates.push(`password = '${password}'`);

  if (updates.length === 0) {
    return res.status(400).json({ message: "No updates provided." });
  }

  const sql = `UPDATE admin SET ${updates.join(", ")} WHERE id = ${id}`;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    return res.json({ message: "Admin details updated successfully." });
  });
});

app.post("/Login", (req, res) => {
  const { username, password } = req.body;

  // Check the client table
  const sqlClient = `
          SELECT id, firstName, lastName, email_add, passwordChanged, status 
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
      if (client.status === "inactive") {
        return res.status(403).json({
          message: "Your account is inactive. Please contact the admin.",
        });
      }

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
    const sqlAdmin =
      "SELECT id, username FROM admin WHERE username = ? AND password = ?";
    db.query(sqlAdmin, [username, password], (err, adminResults) => {
      if (err) {
        return res.status(500).json({
          message: "An error occurred while checking the admin table",
        });
      }

      if (adminResults.length > 0) {
        const admin = adminResults[0];
        return res.status(200).json({
          message: "Login successful",
          role: "admin",
          username: admin.username,
          adminId: admin.id,
        });
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
app.post("/send-email", (req, res) => {
  const { to, from, subject, html } = req.body;

  const message = {
    to,
    from,
    subject,
    html,
  };

  sgMail
    .send(message)
    .then(() => res.status(200).json({ message: "Email sent successfully" }))
    .catch((error) => res.status(500).json({ error: error.message }));
});
//clientchange of password
app.post("/sendVerificationCode", (req, res) => {
  const { email } = req.body;
  const code = Math.floor(100000 + Math.random() * 900000);

  const message = {
    to: email,
    from: "ritchelle.rueras@tup.edu.ph",
    subject: "Your Verification Code",
    text: `Hey there,\n\nHere's the code to verify your email. The code is valid for 30 minutes. We recommend using the code now, as you will need to request a new one if it expires.\n\n${code}\n\nTo keep your account safe, please do not share this verification code. If you didn't try to sign in, you can safely ignore this email.\n\nCheers,\nYour Team`,
  };

  sgMail
    .send(message)
    .then(() => {
      storeCodeForEmail(email, code);
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

// Endpoint to insert a new notification
app.post("/notifications", (req, res) => {
  const { title, description, postedBy } = req.body;

  const query =
    "INSERT INTO notifications (title, description, timestamp, postedBy, isRead, isReadAdmin) VALUES (?, ?, NOW(), FALSE, FALSE)";
  db.query(query, [title, description, postedBy], (err, result) => {
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
// Endpoint to mark a notification as read by admin
app.put("/notificationsAdmin/:id", (req, res) => {
  const notificationId = req.params.id;

  const query = "UPDATE notifications SET isReadAdmin = TRUE WHERE id = ?";
  db.query(query, [notificationId], (err, result) => {
    if (err) {
      console.error("Error updating notification:", err.stack);
      res.status(500).send("Error updating notification");
    } else {
      res.status(200).send("Notification marked as read by admin");
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
    birthday,
    mobile_number,
    email_add,
    address,
    password,
    username,
    status,
    companyName,
    age,
    nationality,
    city,
    postalCode,
    gender,
    companyPosition,
    companyContact,
  } = req.body;

  const sql = `INSERT INTO client (
    firstName, lastName, birthday, mobile_number, email_add, address, password, 
    username, status, companyName, age, nationality, city, postalCode, gender, 
    companyPosition, companyContact
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;
  db.query(
    sql,
    [
      firstName,
      lastName,
      birthday,
      mobile_number,
      email_add,
      address,
      password,
      username,
      status,
      companyName,
      age,
      nationality,
      city,
      postalCode,
      gender,
      companyPosition,
      companyContact,
    ],
    (err, result) => {
      if (err) return res.status(500).json(err);
      return res.status(201).json({
        id: result.insertId,
        firstName,
        lastName,
        birthday,
        mobile_number,
        email_add,
        address,
        username,
        status,
        companyName,
        age,
        nationality,
        city,
        postalCode,
        gender,
        companyPosition,
        companyContact,
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
app.get("/client-transactions/:id", (req, res) => {
  const clientId = req.params.id;

  const sql = "SELECT firstName, lastName FROM client WHERE id = ?";
  db.query(sql, [clientId], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "An error occurred while fetching client details" });
    }

    if (result.length > 0) {
      return res.status(200).json({ client: result[0] }); // Wrap the response
    } else {
      return res.status(404).json({ message: "Client not found" });
    }
  });
});

app.get("/clients-account/:id", (req, res) => {
  const clientId = req.params.id;

  const sql = "SELECT * FROM client WHERE id = ?";
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
    mobile_number,
    email_add,
    companyName,
    address,
    companyContact,
    companyPosition,
  } = req.body;
  const sql = `UPDATE client SET firstName = ?, lastName = ?, mobile_number = ?, email_add = ?, companyName = ?, address = ?, companyContact = ?, companyPosition = ? WHERE id = ?`;

  db.query(
    sql,
    [
      firstName,
      lastName,
      mobile_number,
      email_add,
      companyName,
      address,
      companyContact,
      companyPosition,
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
    age,
    gender,
    role,
  } = req.body;

  const sql =
    "INSERT INTO employee (firstName, lastName, middleName, address, mobile_number, email_add, status, birthday, age, gender, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
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
      age,
      gender,
      role,
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
        age,
        gender,
        role,
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
// Fetch all employees with full name (GET request)
app.get("/employees/id", (req, res) => {
  const sql = `
    SELECT 
      id,
      CONCAT(firstName, ' ', middleName, ' ', lastName) AS fullName
    FROM employee
  `;
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
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
    age,
    gender,
    role,
  } = req.body;

  const sql =
    "UPDATE employee SET firstName = ?, lastName = ?, middleName = ?, address = ?, mobile_number = ?, email_add = ?, birthday = ?, age = ?, gender = ?, role = ? WHERE id = ?";
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
      age,
      gender,
      role,
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

// Add a new project (POST request)
app.post("/project", (req, res) => {
  const {
    clientId,
    clientName,
    projectName,
    description,
    startDate,
    endDate,
    status = "Pending",
    actualFinish = null,
  } = req.body;

  const sql =
    "INSERT INTO project (clientId, clientName, projectName, description, startDate, endDate, status, actualFinish) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
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
      actualFinish,
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
        actualFinish,
      });
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
app.patch("/projectStat/:id", (req, res) => {
  const { id } = req.params;
  const { progress } = req.body;

  let status = "Pending";
  let query = "UPDATE project SET status = ?, progress = ?";
  let params = [status, progress];

  if (progress > 0 && progress < 100) {
    status = "Ongoing";
  } else if (progress === 100) {
    status = "Completed";
    query += ", actualFinish = ?";
    params.push(new Date());
  }

  query += " WHERE id = ?";
  params.push(id);

  db.query(query, params, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error updating project status");
    }
    res.status(200).json({ id, status, progress });
  });
});
app.patch("/paymentStat/:projectId", (req, res) => {
  const { projectId } = req.params;
  const { paymentStatus, paymentDate } = req.body;

  if (!paymentStatus) {
    return res.status(400).json({ message: "Missing paymentStatus" });
  }

  // Query the current status
  db.query(
    "SELECT paymentStatus FROM project WHERE id = ?",
    [projectId],
    (err, rows) => {
      if (err) {
        console.error("Error querying payment status: ", err);
        return res.status(500).json({ message: "Server error" });
      }

      // Allow any valid payment status transition
      db.query(
        "UPDATE project SET paymentStatus = ?, paymentDate = ? WHERE id = ?",
        [paymentStatus, paymentDate, projectId], // Store the payment date in the database
        (updateErr) => {
          if (updateErr) {
            console.error("Error updating payment status: ", updateErr);
            return res.status(500).json({ message: "Error updating status" });
          }
          res
            .status(200)
            .json({ message: "Payment status updated successfully" });
        }
      );
    }
  );
});
app.put("/update-progress/:id", (req, res) => {
  const { id } = req.params;
  const { progress } = req.body;

  const updateProgressSql = `
    UPDATE project
    SET progress = ?
    WHERE id = ?`;

  db.query(updateProgressSql, [progress, id], (err, result) => {
    if (err) {
      console.error("Error updating project progress:", err);
      return res.status(500).json({
        message: "Error updating project progress",
        error: err.message,
      });
    }

    res.status(200).json({
      message: "Project progress updated successfully",
    });
  });
});
app.put("/update-paid-amount", (req, res) => {
  const { projectId, paidAmount } = req.body;

  db.query(
    "UPDATE project SET paid_amount = ? WHERE id = ?",
    [paidAmount, projectId],
    (error, results) => {
      if (error) {
        console.error("Error updating paid amount:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
      res.status(200).json({ message: "Paid amount updated successfully" });
    }
  );
});

// Get all active (noteleted) projects (GET request)
app.get("/project", (req, res) => {
  const sql = `SELECT id, status, progress FROM project WHERE isDeleted = 0`;

  db.query(sql, (err, projects) => {
    if (err) return res.json(err);

    let updates = [];

    projects.forEach(({ id, status, progress }) => {
      let newStatus =
        progress === 0
          ? "Pending"
          : progress > 0 && progress < 100
          ? "Ongoing"
          : progress === 100
          ? "Completed"
          : status;

      if (status !== newStatus) {
        updates.push({ id, newStatus });
      }
    });

    if (updates.length > 0) {
      const updateQueries = updates.map(
        ({ id, newStatus }) =>
          new Promise((resolve, reject) => {
            db.query(
              "UPDATE project SET status = ? WHERE id = ?",
              [newStatus, id],
              (err, result) => {
                if (err) reject(err);
                resolve(result);
              }
            );
          })
      );

      Promise.all(updateQueries)
        .then(() => {
          db.query(
            "SELECT * FROM project WHERE isDeleted = 0",
            (err, updatedData) => {
              if (err) return res.json(err);
              return res.json(updatedData);
            }
          );
        })
        .catch((err) => res.json(err));
    } else {
      db.query("SELECT * FROM project WHERE isDeleted = 0", (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
      });
    }
  });
});
app.get("/project/:id", (req, res) => {
  const projectId = req.params.id;

  const sql = "SELECT projectName FROM project WHERE id = ? AND isDeleted = 0";
  db.query(sql, [projectId], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "An error occurred while fetching project name" });
    }

    if (result.length > 0) {
      return res.status(200).json(result[0]);
    } else {
      return res.status(404).json({ message: "Project name not found" });
    }
  });
});
app.get("/project-client/:clientId", (req, res) => {
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
  const { clientName, projectName, description, startDate, endDate, clientId } =
    req.body;

  const sql =
    "UPDATE project SET clientName = ?, projectName = ?, description = ?, startDate = ?, endDate = ?, clientId = ? WHERE id = ?";
  db.query(
    sql,
    [
      clientName,
      projectName,
      description,
      startDate,
      endDate,
      clientId,
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
        clientId,
      });
    }
  );
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

app.put("/update-total-amount", (req, res) => {
  const { projectId, totalAmount } = req.body;

  db.query(
    "UPDATE project SET total_amount = ? WHERE id = ?",
    [totalAmount, projectId],
    (error, result) => {
      if (error) {
        console.error("Error updating total amount:", error);
        return res.status(500).json({ message: "Internal server error" });
      }

      if (result.affectedRows > 0) {
        res.status(200).json({ message: "Total amount updated successfully" });
      } else {
        res.status(400).json({ message: "Failed to update total amount" });
      }
    }
  );
});
app.post("/tasks", (req, res) => {
  const {
    taskName,
    taskFee,
    dueDate,
    employee,
    miscellaneous,
    projectId,
    transactionId,
    modeOfPayment,
    paidDate,
  } = req.body;

  console.log("Received project_id:", projectId);

  // Transform miscellaneous items to new format { expenses, amount }
  let formattedMiscellaneous = [];
  let miscellaneousTotal = 0;

  if (Array.isArray(miscellaneous)) {
    formattedMiscellaneous = miscellaneous.map((item) => ({
      expenses: item.expenses, // Rename 'name' to 'expenses'
      amount: parseFloat(item.amount || 0), // Rename 'fee' to 'amount'
    }));
    miscellaneousTotal = formattedMiscellaneous.reduce(
      (sum, item) => sum + item.amount,
      0
    );
  }

  const totalAmount = parseFloat(taskFee || 0) + miscellaneousTotal;

  const tasksSql = `INSERT INTO tasks (task_name, task_fee, due_date, employee, miscellaneous, amount, status, project_id, actual_finish, transaction_id, mode_of_payment, payment_status, date_paid)
                    VALUES (?, ?, ?, ?, ?, ?, 'Ongoing', ?, NULL, ?, ?, 'Not Paid', NULL)`;

  db.query(
    tasksSql,
    [
      taskName,
      taskFee,
      dueDate,
      employee,
      JSON.stringify(formattedMiscellaneous), // Save as JSON in DB
      totalAmount,
      projectId,
      transactionId,
      modeOfPayment,
      paidDate,
    ],
    (err, result) => {
      if (err) {
        console.error("Error inserting task: ", err);
        return res
          .status(500)
          .json({ message: "Error creating task", error: err.message });
      }

      res.status(201).json({
        message: "Task created successfully",
        taskId: result.insertId,
      });
    }
  );
});
app.put("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const {
    taskName,
    taskFee,
    dueDate,
    employee,
    miscellaneous,
    projectId,
    transactionId,
    modeOfPayment,
    paidDate,
  } = req.body;

  // Convert empty paidDate to null
  const formattedPaidDate = paidDate || null;

  let formattedMiscellaneous = [];
  if (Array.isArray(miscellaneous)) {
    formattedMiscellaneous = miscellaneous.map((item) => ({
      expenses: item.expenses,
      amount: parseFloat(item.amount || 0),
    }));
  }

  const miscellaneousTotal = formattedMiscellaneous.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const totalAmount = parseFloat(taskFee || 0) + miscellaneousTotal;

  const updateTaskSql = `
    UPDATE tasks 
    SET task_name = ?, task_fee = ?, due_date = ?, employee = ?, miscellaneous = ?, amount = ?, transaction_id = ?, mode_of_payment = ?, date_paid = ?
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
      transactionId,
      modeOfPayment,
      formattedPaidDate,
      id,
    ],
    (err, result) => {
      if (err) {
        console.error("Error updating task:", err);
        return res
          .status(500)
          .json({ message: "Error updating task", error: err.message });
      }

      res.status(200).json({
        message: "Task updated successfully",
      });
    }
  );
});
app.put("/tasksStatus/:id", (req, res) => {
  const { id } = req.params;
  const { status, payment_status } = req.body;

  const updateTaskSql = `
    UPDATE tasks 
    SET status = ?, payment_status = ?
    WHERE id = ?`;

  db.query(updateTaskSql, [status, payment_status, id], (err, result) => {
    if (err) {
      console.error("Error updating task status:", err);
      return res
        .status(500)
        .json({ message: "Error updating task status", error: err.message });
    }

    res.status(200).json({
      message: "Task status updated successfully",
    });
  });
});
app.put("/task/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  let query = "UPDATE tasks SET status = ?";
  const queryParams = [status, id];
  if (status === "Completed") {
    query += ", actual_finish = ?";
    queryParams.splice(1, 0, new Date()); // Insert the current date as the second parameter
  } else {
    query += ", actual_finish = NULL"; // Reset actual_finish for non-completed statuses
  }

  query += " WHERE id = ?";
  db.query(query, queryParams, (err, result) => {
    if (err) {
      console.error("Error updating task status:", err);
      return res.status(500).send("Failed to update task status");
    }

    if (result.affectedRows === 0) {
      return res.status(404).send("Task not found");
    }

    res.status(200).send("Task status updated successfully");
  });
});
app.delete("/tasks/:id", (req, res) => {
  const { id } = req.params;

  const deleteTaskSql = `DELETE FROM tasks WHERE id = ?`;

  db.query(deleteTaskSql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting task:", err);
      return res.status(500).json({ message: "Failed to delete task" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  });
});
//transaction
app.get("/admin/tasks", (req, res) => {
  console.log(req.query);
  const { projectId } = req.query;
  if (!projectId) {
    return res
      .status(400)
      .json({ message: "Missing projectId query parameter" });
  }
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

  const sql = `SELECT * FROM tasks WHERE project_id IN (${idsArray
    .map(() => "?")
    .join(",")})`;
  db.query(sql, idsArray, (err, tasks) => {
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
app.get("/task/:employee", (req, res) => {
  const { employee } = req.params;
  const sql = "SELECT * FROM tasks WHERE employee = ? ";
  db.query(sql, [employee], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json(data);
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
    postedBy,
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
      const formattedDate = moment(date, "YYYY-MM-DD").format("MMMM DD, YYYY");
      const formattedDateTime = moment(`${date} ${time}`, "YYYY-MM-DD hh:mm A");
      if (!formattedDateTime.isValid()) {
        return res.status(400).json({ message: "Invalid date or time format" });
      }

      let reminderDateTime;

      if (moment(reminder).isValid()) {
        // If reminder is a valid date-time string, use it directly
        reminderDateTime = moment(reminder);
      } else if (!isNaN(parseInt(reminder))) {
        // If reminder is a number of days, calculate reminderDateTime
        const reminderDays = parseInt(reminder);
        reminderDateTime = moment(
          `${date} ${time}`,
          "YYYY-MM-DD hh:mm A"
        ).subtract(reminderDays, "days");
      } else {
        return res.status(400).json({ message: "Invalid reminder format" });
      }
      const now = moment().utc();

      // Use UTC for comparison to avoid timezone issues
      if (reminderDateTime.isBefore(now)) {
        console.log(
          "Reminder time has already passed. Skipping reminder scheduling."
        );
      } else {
        schedule.scheduleJob(reminderDateTime.toDate(), () => {
          const subject = `Reminder: Appointment with ${companyName}`;
          const html = `
            <p>Hi ${name},</p>
            <p>This is a reminder for your upcoming appointment:</p>
            <ul>
              <li><strong>Date:</strong> ${moment(date).format(
                "MMMM DD, YYYY"
              )}</li>
              <li><strong>Time:</strong> ${time}</li>
              <li><strong>Consultation Type:</strong> ${consultationType}</li>
              <li><strong>Platform:</strong> ${platform}</li>
            </ul>
            <p>If you have any questions, feel free to reach out to us.</p>
          `;

          const message = {
            to: email,
            from: process.env.SENDER_EMAIL,
            subject,
            html,
          };

          sgMail
            .send(message)
            .then(() => console.log(`Reminder email sent to ${email}`))
            .catch((error) =>
              console.error("Failed to send reminder email:", error)
            );
        });

        console.log(
          `Reminder scheduled for ${reminderDateTime.format(
            "YYYY-MM-DD HH:mm"
          )}`
        );
      }

      const notificationSql = `
        INSERT INTO notifications (title, description, timestamp, isRead, postedBy, client_id)
        VALUES (?, ?, NOW(), 0, ?, ?)
      `;

      const notificationTitle = "Appointment Scheduled";
      const notificationDescription = `Consultation scheduled for ${name.toUpperCase()} on ${formattedDate} at ${time}.`;

      db.query(
        notificationSql,
        [notificationTitle, notificationDescription, postedBy, clientId],
        (notificationErr) => {
          if (notificationErr) {
            console.error("Error creating notification:", notificationErr);
            return res.status(500).json({
              message: "Failed to create notification",
              error: notificationErr.sqlMessage,
            });
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
// Add this to your server code
app.get("/appointments/client-check", (req, res) => {
  const { clientId, date } = req.query;

  const sql = `
    SELECT COUNT(*) as appointmentCount 
    FROM appointments 
    WHERE client_id = ? AND date = ?
  `;

  db.query(sql, [clientId, date], (err, results) => {
    if (err) {
      console.error("Error checking client appointments:", err);
      return res.status(500).json({ error: "Error checking appointments" });
    }
    
    res.json({ hasAppointment: results[0].appointmentCount > 0 });
  });
});
app.get("/appointments-details/:clientId", (req, res) => {
  const { clientId } = req.params;

  const sql = `SELECT * FROM appointments WHERE client_id = ?`;
  db.query(sql, [clientId], (err, results) => {
    if (err) {
      console.error("SQL Error:", err);
      return res.status(500).json({ message: "Failed to fetch appointments" });
    }
    return res.status(200).json(results);
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
app.get("/appointments-client/times", (req, res) => {
  const { date } = req.query;

  const bookedTimesSql = "SELECT time FROM appointments WHERE date = ?";
  const availabilitySql =
    "SELECT start_time, end_time FROM availability WHERE dates = ?";

  db.query(bookedTimesSql, [date], (err, bookedTimesResult) => {
    if (err) {
      console.error("Error fetching booked times:", err);
      return res.status(500).json({ message: "Error fetching booked times" });
    }

    db.query(availabilitySql, [date], (err, availabilityResult) => {
      if (err) {
        console.error("Error fetching availability:", err);
        return res
          .status(500)
          .json({ message: "Error fetching availability data" });
      }

      const bookedTimes = bookedTimesResult.map((row) => row.time);
      const availability = availabilityResult[0] || {};

      res.status(200).json({
        bookedTimes,
        start_time: availability.start_time || "07:00 AM",
        end_time: availability.end_time || "07:00 PM",
      });
    });
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

// Fetch all paid tasks
app.get("/paid-tasks", (req, res) => {
  const query = `
    SELECT 
      t.id AS task_id,
      t.transaction_id,
      t.amount,
      t.mode_of_payment,
      t.date_paid,
      p.clientId AS client_id,
      t.project_id,
      p.clientName AS payer_name,
      c.email_add AS payer_email,
      t.employee AS payee_name
    FROM tasks t
    JOIN project p ON t.project_id = p.id
    JOIN client c ON p.clientId = c.id 
    WHERE t.payment_status = 'Paid'
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching paid tasks:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
});
// Save payment details to the database (bulk insert)
app.post("/payments/bulk", (req, res) => {
  const payments = req.body; // Array of payment objects

  if (!Array.isArray(payments)) {
    return res.status(400).json({ error: "Payments must be an array" });
  }

  const queries = payments.map((payment) => {
    return new Promise((resolve, reject) => {
      const checkQuery = `SELECT id FROM payments WHERE task_id = ?`;
      db.query(checkQuery, [payment.task_id], (err, results) => {
        if (err) return reject(err);

        if (results.length > 0) {
          // Update existing record
          const updateQuery = `
            UPDATE payments 
            SET transaction_id = ?, payer_name = ?, payer_email = ?, amount = ?, 
                payed_to_email = ?, payee_merchant_id = ?, payee_name = ?, 
                client_id = ?, project_id = ?, mode_of_payment = ?, date_paid = ?
            WHERE task_id = ?
          `;
          db.query(
            updateQuery,
            [
              payment.transaction_id,
              payment.payer_name,
              payment.payer_email,
              payment.amount,
              payment.payed_to_email || "",
              payment.payee_merchant_id || null,
              payment.payee_name || "",
              payment.client_id,
              payment.project_id,
              payment.mode_of_payment,
              payment.date_paid,
              payment.task_id, // WHERE condition
            ],
            (err, result) => {
              if (err) return reject(err);
              resolve(result);
            }
          );
        } else {
          // Insert new record
          const insertQuery = `
            INSERT INTO payments (
              transaction_id, payer_name, payer_email, amount, currency, 
              payed_to_email, payee_merchant_id, payee_name, client_id, 
              project_id, task_id, mode_of_payment, date_paid
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;
          db.query(
            insertQuery,
            [
              payment.transaction_id,
              payment.payer_name,
              payment.payer_email,
              payment.amount,
              "PHP", // Currency is always PHP
              payment.payed_to_email || "",
              payment.payee_merchant_id || null,
              payment.payee_name || "",
              payment.client_id,
              payment.project_id,
              payment.task_id,
              payment.mode_of_payment,
              payment.date_paid,
            ],
            (err, result) => {
              if (err) return reject(err);
              resolve(result);
            }
          );
        }
      });
    });
  });

  Promise.all(queries)
    .then(() =>
      res.status(200).json({ message: "Payments saved/updated successfully" })
    )
    .catch((err) => {
      console.error("Error processing payments:", err);
      res.status(500).json({ error: "Error processing payments" });
    });
});
// Clean up duplicate payments (keep the most recent one)
app.post("/payments/clean-duplicates", (req, res) => {
  const query = `
    DELETE t1 FROM payments t1
    INNER JOIN payments t2 
    WHERE 
      t1.id < t2.id AND 
      t1.task_id = t2.task_id
  `;

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error cleaning duplicates:", err);
      return res.status(500).json({ error: "Error cleaning duplicates" });
    }
    res.status(200).json({
      message: "Duplicate payments cleaned successfully",
      affectedRows: result.affectedRows
    });
  });
});
// Fetch all payments sorted by date_paid
app.get("/paymentLedger", (req, res) => {
  const query = `
    SELECT 
      p.projectName,
      py.transaction_id,
      py.payer_name,
      t.task_name AS description,
      py.amount,
      py.mode_of_payment,
      py.date_paid
    FROM payments py
    JOIN project p ON py.project_id = p.id
    JOIN tasks t ON py.task_id = t.id
    ORDER BY py.date_paid DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching payments:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
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
    payeeMerchantId,
    payeeName,
    clientId,
    projectId,
    taskId,
    modeOfPayment,
    datePaid,
  } = req.body;

  const query = `
    INSERT INTO payments (transaction_id, payer_name, payer_email, amount, currency, payed_to_email, payee_merchant_id, payee_name, client_id, project_id, task_id, mode_of_payment, date_paid) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      payeeMerchantId,
      payeeName,
      clientId,
      projectId,
      taskId,
      modeOfPayment,
      datePaid,
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
      const notificationDescription = `Client ${payerName} paid ${amount} ${currency}. Transaction ID: ${transactionId}. Date Paid: ${new Date().toLocaleString()}`;
      const timestamp = new Date();

      db.query(
        notificationQuery,
        [notificationTitle, notificationDescription, timestamp, false],
        (err, notificationResult) => {
          if (err) {
            console.error("Error creating notification:", err);
            return res.status(500).send("Error saving notification.");
          }

          res
            .status(200)
            .send("Payment and admin notification saved successfully.");
        }
      );
    }
  );
});
app.put("/update-payment-status/:taskId", (req, res) => {
  const taskId = req.params.taskId;
  const {
    transaction_id,
    mode_of_payment,
    payment_status,
    status,
    date_paid,
    actual_finish,
  } = req.body;

  if (
    !transaction_id ||
    !mode_of_payment ||
    !payment_status ||
    !status ||
    !date_paid ||
    !actual_finish
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const sql = `
    UPDATE tasks 
    SET 
      transaction_id = ?, 
      mode_of_payment = ?, 
      payment_status = ?, 
      status = ?, 
      date_paid = ?,
      actual_finish = ?
    WHERE id = ?
  `;
  db.query(
    sql,
    [
      transaction_id,
      mode_of_payment,
      payment_status,
      status,
      date_paid,
      actual_finish,
      taskId,
    ],
    (err, result) => {
      if (err) {
        console.error("Error updating task payment status:", err);
        return res
          .status(500)
          .json({ error: "Failed to update task payment status" });
      }

      return res.json({
        taskId,
        transaction_id,
        mode_of_payment,
        payment_status,
        status,
        date_paid,
        actual_finish,
        message: "Task payment status updated successfully",
      });
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

app.post("/file", upload.single("file"), async (req, res) => {
  console.log("DRIVE_FOLDER_ID:", process.env.DRIVE_FOLDER_ID);
  try {
    const { project_id, uploaded_by } = req.body;
    const fileMetadata = {
      name: req.file.originalname,
      parents: [process.env.DRIVE_FOLDER_ID], // Replace with the ID of your desired folder
    };
    const media = {
      mimeType: req.file.mimetype,
      body: fs.createReadStream(req.file.path),
    };

    const driveResponse = await drive.files.create({
      requestBody: fileMetadata,
      media,
      fields: "id, name, webViewLink, webContentLink",
    });

    // Cleanup temporary file
    fs.unlinkSync(req.file.path);

    // Respond with file details
    res.status(201).json({
      id: driveResponse.data.id,
      name: driveResponse.data.name,
      link: driveResponse.data.webViewLink,
      downloadLink: driveResponse.data.webContentLink,
      project_id,
      uploaded_by,
      original_name: req.file.originalname || "Unknown File",
    });
  } catch (error) {
    console.error(
      "Error uploading file to Google Drive:",
      error.response?.data || error.message || error
    );
    res
      .status(500)
      .json({ message: "File upload failed", error: error.message });
  }
});
app.post("/upload", upload.single("file"), async (req, res) => {
  console.log("DRIVE_FOLDER_ID:", process.env.DRIVE_FOLDER_ID);
  try {
    const { project_id, uploaded_by } = req.body;
    const fileMetadata = {
      name: req.file.originalname,
      parents: [process.env.DRIVE_FOLDER_ID], // Replace with the ID of your desired folder
    };
    const media = {
      mimeType: req.file.mimetype,
      body: fs.createReadStream(req.file.path),
    };

    const driveResponse = await drive.files.create({
      requestBody: fileMetadata,
      media,
      fields: "id, name, webViewLink, webContentLink",
    });

    // Cleanup temporary file
    fs.unlinkSync(req.file.path);

    // Prepare the file metadata to be inserted into the database
    const fileId = driveResponse.data.id;
    const originalName = req.file.originalname;
    const uploadDate = moment().format("YYYY-MM-DD HH:mm:ss"); // Current timestamp
    const uploadedBy = uploaded_by || "Unknown"; // Use the uploaded_by value or default to "Unknown"

    // Insert file details into MySQL database
    const query = `
      INSERT INTO files (file_id, original_name, link, download_link, project_id, uploaded_by, upload_date) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      query,
      [
        fileId,
        originalName,
        driveResponse.data.webViewLink,
        driveResponse.data.webContentLink,
        project_id,
        uploadedBy,
        uploadDate,
      ],
      (err, results) => {
        if (err) {
          console.error("Error saving file to database:", err);
          return res.status(500).json({
            message: "Error saving file to database",
            error: err.message,
          });
        }

        // Respond with the file metadata
        res.status(201).json({
          id: fileId,
          name: driveResponse.data.name,
          link: driveResponse.data.webViewLink,
          downloadLink: driveResponse.data.webContentLink,
          project_id,
          uploaded_by: uploadedBy,
          original_name: originalName,
        });
      }
    );
  } catch (error) {
    console.error(
      "Error uploading file to Google Drive:",
      error.response?.data || error.message || error
    );
    res
      .status(500)
      .json({ message: "File upload failed", error: error.message });
  }
});
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
app.get("/files", async (req, res) => {
  const { project_id } = req.query;

  if (!project_id) {
    return res.status(400).json({ message: "Project ID is required" });
  }

  const query = `
    SELECT id, file_id, original_name, link, download_link, project_id, uploaded_by, upload_date
    FROM files
    WHERE project_id = ?
  `;

  db.query(query, [project_id], async (err, results) => {
    if (err) {
      console.error("Error fetching files from the database:", err);
      return res
        .status(500)
        .json({ message: "Error fetching files", error: err.message });
    }

    // For each file, generate the public links using Google Drive API
    for (let file of results) {
      try {
        const fileId = file.file_id;
        const fileLinks = await generatePublicUrl(fileId); // Assume this function is defined below

        // Attach the links to the file object
        file.webViewLink = fileLinks.webViewLink;
        file.webContentLink = fileLinks.webContentLink;
      } catch (error) {
        console.error(
          `Error generating links for file ${file.file_id}:`,
          error
        );
      }
    }

    res.status(200).json(results);
  });
});
// Helper function to generate public URL using Google Drive API
async function generatePublicUrl(fileId) {
  try {
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    const result = await drive.files.get({
      fileId: fileId,
      fields: "webViewLink, webContentLink",
    });

    return result.data;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
}
app.delete("/files/:fileId", async (req, res) => {
  const { fileId } = req.params;

  if (!fileId) {
    return res.status(400).json({ message: "File ID is required" });
  }

  console.log("Deleting file with ID:", fileId); // Add logging here

  const query = `
    DELETE FROM files WHERE id = ?
  `;

  db.query(query, [fileId], (err, results) => {
    if (err) {
      console.error("Error deleting file record:", err);
      return res
        .status(500)
        .json({ message: "Error deleting file record", error: err.message });
    }

    // If no rows were affected, file not found
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "File not found" });
    }

    // Successfully deleted the file record
    res.status(200).json({ message: "File record deleted successfully" });
  });
});
app.get("/upload/:clientId", (req, res) => {
  const { clientId } = req.params;
  const sql = "SELECT * FROM uploads WHERE uploaded_by = ?";
  db.query(sql, [clientId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json(data);
  });
});
app.delete("/upload/:fileId", (req, res) => {
  const { fileId } = req.params;

  // SQL to delete the file record from the database
  const deleteSql = "DELETE FROM uploads WHERE id = ?";
  db.query(deleteSql, [fileId], (err, result) => {
    if (err) {
      console.error("Error deleting file:", err);
      return res.status(500).json({ message: "Error deleting file" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "File not found" });
    }

    console.log("File deleted successfully.");
    res.status(200).json({ message: "File deleted successfully" });
  });
});
app.use("/uploads", express.static("uploads"));

app.post("/reviews", (req, res) => {
  const { projectId, clientId, rating, comment, status } = req.body;

  // Insert the review into the reviews table
  const insertReviewQuery =
    "INSERT INTO reviews (project_id, client_id, rating, comment, status) VALUES (?, ?, ?, ?, ?)";

  db.query(
    insertReviewQuery,
    [projectId, clientId, rating, comment, status],
    (err, result) => {
      if (err) {
        console.error("Error inserting review:", err);
        return res.status(500).json({ message: "Failed to submit review" });
      }

      // Update the isReview column in the project table
      const updateProjectQuery =
        "UPDATE project SET isReview = TRUE WHERE id = ?";

      db.query(updateProjectQuery, [projectId], (updateErr) => {
        if (updateErr) {
          console.error("Error updating project isReview:", updateErr);
          return res
            .status(500)
            .json({ message: "Failed to update project status" });
        }

        return res.status(200).json({
          message: "Review submitted successfully, and project updated",
        });
      });
    }
  );
});
app.get("/reviews", (req, res) => {
  const query = "SELECT * FROM reviews";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching reviews:", err);
      res.status(500).json({ message: "Error fetching reviews." });
    } else {
      res.status(200).json(results);
    }
  });
});
app.put("/reviews/:id", (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  const updateQuery = "UPDATE reviews SET rating = ?, comment = ? WHERE id = ?";
  db.query(updateQuery, [rating, comment, id], (err, result) => {
    if (err) {
      console.error("Error updating review:", err);
      return res.status(500).json({ message: "Failed to update review" });
    }
    res.status(200).json({ message: "Review updated successfully" });
  });
});

//for dashboard
// Fetch total client counts and breakdowns
app.get("/clients/stats", (req, res) => {
  const { filter } = req.query;
  let condition = "";

  switch (filter) {
    case "weekly":
      condition = "WEEK(created_at) = WEEK(CURDATE())";
      break;
    case "yearly":
      condition = "YEAR(created_at) = YEAR(CURDATE())";
      break;
    case "active":
      condition = "status = 'Active'";
      break;
    case "inactive":
      condition = "status = 'Inactive'";
      break;
    default:
      condition = "1=1"; // No filter, fetch all clients
  }

  const sql = `SELECT COUNT(*) AS totalClients FROM client WHERE ${condition}`;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.status(200).json(result[0]);
  });
});
app.get("/projectDashboard/stats", (req, res) => {
  const { filter } = req.query;
  let condition = "";

  switch (filter) {
    case "weekly":
      condition = "WEEK(created_at) = WEEK(CURDATE())";
      break;
    case "yearly":
      condition = "YEAR(created_at) = YEAR(CURDATE())";
      break;
    case "pending":
      condition = "status = 'Pending'";
      break;
    case "ongoing":
      condition = "status = 'Ongoing'";
      break;
    case "completed":
      condition = "status = 'Completed'";
      break;
    case "paid":
      condition = "paymentStatus = 'Paid'";
      break;
    case "not paid":
      condition = "paymentStatus = 'Not Paid'";
      break;
    case "partial payment":
      condition = "paymentStatus = 'Partial Payment'";
      break;
    default:
      condition = "1=1"; // No filter, fetch all projects
  }
  const sql = `SELECT COUNT(*) AS totalProjects FROM project WHERE ${condition} AND isDeleted = 0`;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.status(200).json(result[0]);
  });
});
app.get("/taskDashboard/stats", (req, res) => {
  const { filter } = req.query;
  let condition = "";

  switch (filter) {
    case "weekly":
      condition = "WEEK(created_at) = WEEK(CURDATE())";
      break;
    case "yearly":
      condition = "YEAR(created_at) = YEAR(CURDATE())";
      break;
    case "pending":
      condition = "status = 'Pending'";
      break;
    case "ongoing":
      condition = "status = 'Ongoing'";
      break;
    case "completed":
      condition = "status = 'Completed'";
      break;
    default:
      condition = "1=1"; // No filter, fetch all projects
  }
  const sql = `SELECT COUNT(*) AS totalTasks FROM tasks WHERE ${condition}`;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.status(200).json(result[0]);
  });
});
app.get("/appointmentsDashboard/stats", (req, res) => {
  const { filter } = req.query;
  let condition = "";

  switch (filter) {
    case "weekly":
      condition = "WEEK(STR_TO_DATE(date, '%Y-%m-%d')) = WEEK(CURDATE())";
      break;
    case "yearly":
      condition = "YEAR(STR_TO_DATE(date, '%Y-%m-%d')) = YEAR(CURDATE())";
      break;
    default:
      condition = "1=1";
  }
  const sql = `
    SELECT 
      COUNT(*) AS totalAppointments, 
      (SELECT COUNT(*) FROM appointments 
       WHERE STR_TO_DATE(date, '%Y-%m-%d') >= CURDATE()) AS totalUpcomingAppointments
    FROM appointments 
    WHERE ${condition}
  `;
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching appointment stats:", err);
      return res
        .status(500)
        .json({ message: "Failed to fetch stats", error: err });
    }
    res.status(200).json(result[0]);
  });
});
app.get("/appointmentsDashboard/upcoming", (req, res) => {
  const sql = `
    SELECT * 
    FROM appointments 
    WHERE STR_TO_DATE(date, '%Y-%m-%d') >= CURDATE()
    ORDER BY STR_TO_DATE(date, '%Y-%m-%d') ASC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching upcoming appointments:", err);
      return res
        .status(500)
        .json({ message: "Failed to fetch upcoming appointments", error: err });
    }
    res.status(200).json(result);
  });
});

app.get("/latest-activity", (req, res) => {
  const queries = {
    client: "SELECT * FROM client ORDER BY created_at DESC LIMIT 1",
    project: "SELECT * FROM project ORDER BY created_at DESC LIMIT 1",
    payment: "SELECT * FROM payments ORDER BY created_at DESC LIMIT 1",
    appointment: "SELECT * FROM appointments ORDER BY created_at DESC LIMIT 1",
    review: "SELECT * FROM reviews ORDER BY created_at DESC LIMIT 1",
  };

  const results = {};
  const errors = [];

  const keys = Object.keys(queries);
  let completedQueries = 0;

  keys.forEach((key) => {
    db.query(queries[key], (err, data) => {
      completedQueries++;
      if (err) {
        errors.push({ [key]: err.message });
      } else {
        results[key] = data[0] || null; // If no record exists, return null
      }

      // Send the response when all queries are complete
      if (completedQueries === keys.length) {
        if (errors.length > 0) {
          return res.status(500).json({ errors, results });
        }
        return res.status(200).json(results);
      }
    });
  });
});
app.get("/todaysAppointments", (req, res) => {
  const { date } = req.query;
  let sql = `SELECT * FROM appointments`;

  if (date) {
    sql += ` WHERE DATE(date) = ?`; // Filter by the given date
  }

  db.query(sql, [date], (err, data) => {
    if (err) {
      console.error("Error fetching appointments:", err);
      return res
        .status(500)
        .json({ message: "Failed to fetch appointments", error: err });
    }
    return res.json(data);
  });
});
app.get("/todaysTasks", (req, res) => {
  const { due_date } = req.query;
  let sql = `SELECT * FROM tasks`;

  if (due_date) {
    sql += ` WHERE DATE(due_date) = ?`; // Filter by the given date
  }

  db.query(sql, [due_date], (err, data) => {
    if (err) {
      console.error("Error fetching tasks:", err);
      return res
        .status(500)
        .json({ message: "Failed to fetch tasks", error: err });
    }
    return res.json(data);
  });
});

//REPORTS TAB
//apointments
app.get("/appointmentReports", (req, res) => {
  const { startDate, endDate, clientId } = req.query;

  let sql = "SELECT * FROM appointments WHERE 1=1";
  const params = [];

  if (startDate) {
    sql += " AND date >= ?";
    params.push(startDate);
  }
  if (endDate) {
    sql += " AND date <= ?";
    params.push(endDate);
  }
  if (clientId) {
    sql += " AND client_id = ?";
    params.push(clientId);
  }

  db.query(sql, params, (err, data) => {
    if (err) {
      console.error("Error fetching appointments:", err);
      return res
        .status(500)
        .json({ message: "Failed to fetch appointments", error: err });
    }
    return res.json(data);
  });
});
app.get("/appointmentYears", (req, res) => {
  const sql =
    "SELECT DISTINCT YEAR(STR_TO_DATE(date, '%Y-%m-%d')) AS year FROM appointments ORDER BY year DESC";

  db.query(sql, (err, data) => {
    if (err) {
      console.error("Error fetching appointment years:", err);
      return res
        .status(500)
        .json({ message: "Failed to fetch years", error: err });
    }
    res.json(data.map((row) => row.year)); // Send an array of years
  });
});
//clients
app.get("/clientsReports", (req, res) => {
  const sql = `
    SELECT c.id, c.firstName, c.lastName, p.id as projectId, p.projectName, p.status 
    FROM client c 
    LEFT JOIN project p ON c.id = p.clientId AND p.isDeleted = 0
    WHERE p.status != 'Completed' OR p.status IS NULL
  `;
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json(err);

    const clientsMap = new Map();
    data.forEach((row) => {
      if (!clientsMap.has(row.id)) {
        clientsMap.set(row.id, {
          id: row.id,
          firstName: row.firstName,
          lastName: row.lastName,
          projects: [],
        });
      }
      if (row.projectId) {
        clientsMap
          .get(row.id)
          .projects.push({ id: row.projectId, projectName: row.projectName });
      }
    });

    // Only return clients that have at least one active project
    const filteredClients = Array.from(clientsMap.values()).filter(
      (client) => client.projects.length > 0
    );

    return res.json(filteredClients);
  });
});
app.get("/projectReports", (req, res) => {
  const { startDate, endDate, clientId, year, viewMode } = req.query;

  let sql = `
    SELECT 
      id, clientId, projectName, clientName, description, status, startDate, endDate, created_at, actualFinish, 
      TIMESTAMPDIFF(DAY, startDate, IFNULL(actualFinish, CURDATE())) AS projectDuration,
      IF((status IN ('Ongoing', 'Pending') AND endDate < CURDATE()), 1, 0) AS isDelayed,
      IF((status IN ('Ongoing', 'Pending') AND endDate < CURDATE()), TIMESTAMPDIFF(DAY, endDate, CURDATE()), 0) AS delayedDays,
      IF(endDate < CURDATE(), 1, 0) AS isOverdue
    FROM project
    WHERE isDeleted = 0
  `;

  if (startDate) sql += ` AND startDate >= '${startDate}'`;
  if (endDate) sql += ` AND endDate <= '${endDate}'`;
  if (clientId) sql += ` AND clientId = '${clientId}'`;

  // Only apply the year filter if explicitly provided
  if (viewMode === "month" && year && year !== "") {
    sql += ` AND YEAR(startDate) = '${year}'`;
  }

  db.query(sql, (err, data) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    return res.json(data);
  });
});
app.get("/taskReports", (req, res) => {
  const sql = "SELECT * FROM tasks";
  db.query(sql, (err, result) => {
    if (err) return res.json({ error: "Error fetching tasks", details: err });
    res.json(result);
  });
});
app.get("/ETReports", (req, res) => {
  const sql = `
    SELECT e.firstName, e.lastName, t.created_at, t.status, t.amount, t.due_date, t.task_name, COUNT(t.id) AS task_count
    FROM employee e
    LEFT JOIN tasks t ON e.id = t.employee
    GROUP BY e.id
  `;

  db.query(sql, (err, result) => {
    if (err) return res.json({ error: "Error fetching tasks", details: err });
    res.json(result);
  });
});
// Add this new endpoint
app.get("/allEmployeeTasks", (req, res) => {
  const sql = `
    SELECT e.id as employeeId, e.firstName, e.lastName, 
           t.task_name, t.status, t.due_date
    FROM employee e
    LEFT JOIN tasks t ON e.id = t.employee
    ORDER BY e.id, t.due_date
  `;

  db.query(sql, (err, result) => {
    if (err) return res.json({ error: "Error fetching tasks", details: err });
    res.json(result);
  });
});
app.get("/employeeReports", (req, res) => {
  const sql = "SELECT * FROM employee";
  db.query(sql, (err, result) => {
    if (err)
      return res.json({ error: "Error fetching employee", details: err });
    res.json(result);
  });
});
app.get("/tasksForEmployee/:employeeId", (req, res) => {
  const { employeeId } = req.params;
  const sql = `
    SELECT t.task_name, t.due_date, t.status, t.amount
    FROM tasks t
    WHERE t.employee = ?
    ORDER BY t.due_date
  `;
  db.query(sql, [employeeId], (err, result) => {
    if (err) return res.json({ error: "Error fetching tasks", details: err });
    res.json(result);
  });
});
//financial reports
app.get("/payment-status", (req, res) => {
  const paidTasksQuery = `
    SELECT 
      t.id AS task_id,
      t.task_name,
      t.amount,
      t.transaction_id,
      t.mode_of_payment,
      t.date_paid
    FROM tasks t
    WHERE t.payment_status = 'Paid'
  `;

  const pendingTasksQuery = `
    SELECT 
      t.id AS task_id,
      t.task_name,
      t.amount,
      t.due_date
    FROM tasks t
    WHERE t.payment_status != 'Paid' OR t.payment_status IS NULL
  `;

  db.query(paidTasksQuery, (paidErr, paidResults) => {
    if (paidErr) {
      console.error("Error fetching paid tasks:", paidErr);
      return res.status(500).json({ message: "Error fetching paid tasks" });
    }

    db.query(pendingTasksQuery, (pendingErr, pendingResults) => {
      if (pendingErr) {
        console.error("Error fetching pending tasks:", pendingErr);
        return res.status(500).json({ message: "Error fetching pending tasks" });
      }

      // Calculate totals
      const receivedPayments = paidResults.reduce((sum, task) => sum + task.amount, 0);
      const pendingPayments = pendingResults.reduce((sum, task) => sum + task.amount, 0);

      res.status(200).json({
        paidTasks: paidResults,
        pendingTasks: pendingResults,
        receivedPayments,
        pendingPayments
      });
    });
  });
});
app.get("/overdue-payments", (req, res) => {
  const currentDate = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format

  const sql = `
    SELECT task_name AS name, due_date, amount
    FROM tasks
    WHERE payment_status = 'Not Paid' AND due_date < ?
    ORDER BY due_date
  `;

  db.query(sql, [currentDate], (err, results) => {
    if (err) {
      console.error("Error fetching overdue payments:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    res.status(200).json(results);
  });
});
app.get("/total-revenue-per-project", (req, res) => {
  const { paymentStatus } = req.query;

  let sql = `
    SELECT 
      p.projectName AS project_name, 
      SUM(t.amount) AS total_revenue 
    FROM tasks t
    JOIN project p ON t.project_id = p.id
  `;

  if (paymentStatus) {
    sql += ` WHERE t.payment_status = ?`;
  }

  sql += ` GROUP BY p.projectName`;

  db.query(sql, [paymentStatus], (err, results) => {
    if (err) {
      console.error("Error fetching total revenue per project:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    res.status(200).json(results);
  });
});
app.get("/projects", (req, res) => {
  const sql = `
    SELECT 
      id,
      projectName,
      total_amount,
      paid_amount,
      (total_amount - paid_amount) AS remaining
    FROM project
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching projects:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    res.status(200).json(results);
  });
});
app.get("/payment-received-vs-remaining", (req, res) => {
  const sql = `
    SELECT 
      p.projectName AS name,
      p.paid_amount AS received,
      (p.total_amount - p.paid_amount) AS remaining
    FROM project p
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching payment received vs remaining data:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    res.status(200).json(results);
  });
});
app.get("/payments-per-client", (req, res) => {
  const { year, month } = req.query;

  let sql = `
    SELECT 
      payer_name AS name,
      SUM(amount) AS total_amount
    FROM payments
  `;

  // Add filters for year and month
  if (year !== "All") {
    sql += ` WHERE YEAR(date_paid) = ${year}`;
  }
  if (month !== "All") {
    sql +=
      year !== "All"
        ? ` AND MONTH(date_paid) = ${months.indexOf(month) + 1}`
        : ` WHERE MONTH(date_paid) = ${months.indexOf(month) + 1}`;
  }

  sql += ` GROUP BY payer_name`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching payments per client:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    res.status(200).json(results);
  });
});

// Fetch client count per month
app.get("/clients/monthly", (req, res) => {
  const sql = `
    SELECT 
      MONTHNAME(created_at) AS month, 
      COUNT(*) AS client_count,
      WEEK(created_at, 1) AS week_of_year,
      YEAR(created_at) AS year
    FROM client
    WHERE YEAR(created_at) = YEAR(CURDATE())
    GROUP BY MONTH(created_at), WEEK(created_at, 1)
    ORDER BY MONTH(created_at), WEEK(created_at, 1);
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch client data" });
    }

    // Process results into monthly and weekly structure
    const monthlyData = Array(12).fill(0); // Initialize data for 12 months
    const weeklyData = {
      January: [],
      February: [],
      March: [],
      April: [],
      May: [],
      June: [],
      July: [],
      August: [],
      September: [],
      October: [],
      November: [],
      December: [],
    };

    results.forEach((item) => {
      const monthIndex = new Date(`${item.month} 1, ${item.year}`).getMonth();
      monthlyData[monthIndex] += item.client_count;

      const monthName = new Date(
        `${item.month} 1, ${item.year}`
      ).toLocaleString("default", { month: "long" });
      weeklyData[monthName].push(item.client_count);
    });

    res.json({ monthly: monthlyData, weekly: weeklyData });
  });
});
app.get("/projectsReports/monthly", (req, res) => {
  const sql = `
    SELECT 
      MONTHNAME(created_at) AS month, 
      COUNT(*) AS project_count,
      WEEK(created_at, 1) AS week_of_year,
      YEAR(created_at) AS year
    FROM project
    WHERE YEAR(created_at) = YEAR(CURDATE())
    GROUP BY MONTH(created_at), WEEK(created_at, 1)
    ORDER BY MONTH(created_at), WEEK(created_at, 1);
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch project data" });
    }

    // Process results into monthly and weekly structure
    const monthlyData = Array(12).fill(0); // Initialize data for 12 months
    const weeklyData = {
      January: [],
      February: [],
      March: [],
      April: [],
      May: [],
      June: [],
      July: [],
      August: [],
      September: [],
      October: [],
      November: [],
      December: [],
    };

    results.forEach((item) => {
      const monthIndex = new Date(`${item.month} 1, ${item.year}`).getMonth();
      monthlyData[monthIndex] += item.project_count;

      const monthName = new Date(
        `${item.month} 1, ${item.year}`
      ).toLocaleString("default", { month: "long" });
      weeklyData[monthName].push(item.project_count);
    });

    res.json({ monthly: monthlyData, weekly: weeklyData });
  });
});
app.listen(8081, () => {
  console.log("Server is listening on port 8081");
});
