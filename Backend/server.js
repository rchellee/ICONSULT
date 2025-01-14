const express = require("express");
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

// SendGrid email example
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

const upload = multer({ storage });

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
    status,
    contractPrice,
    downpayment = null,
    paymentStatus = "Not Paid",
    actualStart = null,
    actualFinish = null,
  } = req.body;

  const sql =
    "INSERT INTO project (clientId, clientName, projectName, description, startDate, endDate, status, contractPrice, downpayment, paymentStatus, actualStart, actualFinish) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
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
      actualStart,
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
        contractPrice,
        downpayment,
        paymentStatus,
        actualStart,
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
  const { status } = req.body;

  let query = "UPDATE project SET status = ?";
  let params = [status, id];

  if (status === "Ongoing") {
    query += ", actualStart = ?";
    params = [status, new Date(), id];
  } else if (status === "Completed") {
    query += ", actualFinish = ?";
    params = [status, new Date(), id];
  }

  query += " WHERE id = ?";

  db.query(query, params, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error updating project status");
    }
    res.status(200).json({ id, status });
  });
});
app.patch("/paymentStat/:projectId", (req, res) => {
  const { projectId } = req.params;
  const { paymentStatus } = req.body;

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

      const currentStatus = rows[0]?.paymentStatus;
      if (
        currentStatus === "Paid" ||
        (currentStatus === "Partial Payment" && paymentStatus === "Not Paid")
      ) {
        return res
          .status(400)
          .json({ message: "Invalid payment status transition" });
      }
      db.query(
        "UPDATE project SET paymentStatus = ? WHERE id = ?",
        [paymentStatus, projectId],
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
// Get all active (noteleted) projects (GET request)
app.get("/project", (req, res) => {
  const sql = "SELECT * FROM project WHERE isDeleted = 0";
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
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
  const {
    clientName,
    projectName,
    description,
    startDate,
    endDate,
    status,
    clientId,
    contractPrice,
    downpayment,
    paymentStatus,
  } = req.body;

  const sql =
    "UPDATE project SET clientName = ?, projectName = ?, description = ?, startDate = ?, endDate = ?, status = ?, clientId = ?,contractPrice = ?, downpayment = ?, paymentStatus = ? WHERE id = ?";
  db.query(
    sql,
    [
      clientName,
      projectName,
      description,
      startDate,
      endDate,
      status,
      clientId,
      contractPrice,
      downpayment,
      paymentStatus,
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
        clientId,
        contractPrice,
        downpayment,
        paymentStatus,
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
  const tasksSql = `INSERT INTO tasks (task_name, task_fee, due_date, employee, miscellaneous, amount, status, project_id, actual_finish)
                    VALUES (?, ?, ?, ?, ?, ?, 'Pending', ?, NULL)`;

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

      res.status(201).json({
        message: "Task created successfully",
        taskId: result.insertId,
      });
    }
  );
});
app.put("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const { taskName, taskFee, dueDate, employee, miscellaneous, projectId } =
    req.body;

  // Calculate total miscellaneous fees
  let miscellaneousTotal = 0;
  if (Array.isArray(miscellaneous)) {
    miscellaneousTotal = miscellaneous.reduce((sum, item) => {
      return sum + parseFloat(item.fee || 0);
    }, 0);
  }

  const totalAmount = parseFloat(taskFee || 0) + miscellaneousTotal;

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

// const backfillTim  eFormat = () => {
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
  } = req.body;

  const query = `
    INSERT INTO payments (transaction_id, payer_name, payer_email, amount, currency, payed_to_email, payee_merchant_id, payee_name, client_id, project_id) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
app.put("/project/update-downpayment/:id", (req, res) => {
  const projectId = req.params.id;
  const { amount } = req.body;

  const query = `
    UPDATE project
    SET downpayment = downpayment + ?
    WHERE id = ?
  `;

  db.query(query, [amount, projectId], (err, result) => {
    if (err) {
      console.error("Error updating downpayment:", err);
      return res.status(500).send("Error updating downpayment.");
    }

    res.status(200).send("Downpayment updated successfully.");
  });
});

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

//for dashboard
app.get("/clientsDashboard/count", (req, res) => {
  const { filter } = req.query; // e.g., 'weekly', 'monthly', 'yearly'

  let dateCondition = "";
  if (filter === "weekly") {
    dateCondition = "WHERE DATE(created_at) >= DATE(NOW() - INTERVAL 7 DAY)";
  } else if (filter === "monthly") {
    dateCondition = "WHERE DATE(created_at) >= DATE(NOW() - INTERVAL 1 MONTH)";
  } else if (filter === "yearly") {
    dateCondition = "WHERE DATE(created_at) >= DATE(NOW() - INTERVAL 1 YEAR)";
  }

  const sql = `SELECT COUNT(*) AS total FROM client ${dateCondition}`;
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json(data[0]); // Respond with the count
  });
});
app.get("/projectsDashboard/count", (req, res) => {
  const { filter, status } = req.query;

  let dateCondition = "";
  if (filter === "weekly") {
    dateCondition = "AND DATE(created_at) >= DATE(NOW() - INTERVAL 7 DAY)";
  } else if (filter === "monthly") {
    dateCondition = "AND DATE(created_at) >= DATE(NOW() - INTERVAL 1 MONTH)";
  } else if (filter === "yearly") {
    dateCondition = "AND DATE(created_at) >= DATE(NOW() - INTERVAL 1 YEAR)";
  }

  let statusCondition = "";
  if (status) {
    statusCondition = `AND status = '${status}'`;
  }

  const sql = `SELECT COUNT(*) AS total FROM project WHERE isDeleted = 0 ${dateCondition} ${statusCondition}`;
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json(data[0]);
  });
});
app.get("/tasksDashboard/count", (req, res) => {
  const { filter, status } = req.query;

  let timeCondition = "";
  if (filter === "weekly") {
    timeCondition = "YEARWEEK(due_date, 1) = YEARWEEK(CURDATE(), 1)";
  } else if (filter === "monthly") {
    timeCondition =
      "MONTH(due_date) = MONTH(CURDATE()) AND YEAR(due_date) = YEAR(CURDATE())";
  } else if (filter === "yearly") {
    timeCondition = "YEAR(due_date) = YEAR(CURDATE())";
  }

  const statusCondition = status ? `AND status = '${status}'` : "";
  const sql = `SELECT COUNT(*) AS total FROM tasks WHERE ${timeCondition} ${statusCondition}`;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching tasks count:", err);
      return res
        .status(500)
        .json({ message: "Error retrieving tasks count", error: err });
    }
    res.status(200).json({ total: result[0].total });
  });
});

app.get("/appointmentsDashboard/count", (req, res) => {
  const { filter, status } = req.query;

  let dateCondition = "";
  if (filter === "weekly") {
    dateCondition = "AND DATE(date) >= DATE(NOW() - INTERVAL 7 DAY)";
  } else if (filter === "monthly") {
    dateCondition = "AND DATE(date) >= DATE(NOW() - INTERVAL 1 MONTH)";
  } else if (filter === "yearly") {
    dateCondition = "AND DATE(date) >= DATE(NOW() - INTERVAL 1 YEAR)";
  }

  let statusCondition = "";
  if (status === "upcoming") {
    statusCondition = "AND DATE(date) >= CURDATE()";
  }
  const sql = `
  SELECT COUNT(*) AS total 
  FROM appointments 
  WHERE 1=1 ${dateCondition} ${statusCondition}
`;

  db.query(sql, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json(data[0]); // Respond with the count
  });
});

app.listen(8081, () => {
  console.log("Server is listening on port 8081");
});
