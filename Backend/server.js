// server.js
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
// app.use(express.json());
app.use(cors());

// // Create a MySQL connection pool
// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'your-username',
//   password: 'your-password',
//   database: 'your-database'
// });

const db = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: '',
    database: 'iConsult'
})

// Define a route to get data
// app.get('/api/data', (req, res) => {
//   pool.query('SELECT * FROM your_table', (err, results) => {
//     if (err) {
//       return res.status(500).json({ error: err.message });
//     }
//     res.json(results);
//   });
// });

app.get('/', (re, res)=> {
    return res.json("From Backend Side");
})

// Start the server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
app.listen(8081, ()=> {
    console.log("listening");
})