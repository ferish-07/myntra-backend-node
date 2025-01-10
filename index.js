const express = require("express");
const sql = require("mssql");

const app = express();
app.use(express.json());
// SQL Server configuration
// var config = {
//   user: "ferish.modi", // Database username
//   password: "Ferish@123", // Database password
//   server: "localhost\\SQLEXPRESS", // Server IP address
//   database: "Myntra", // Database name
//   options: {
//     encrypt: false, // Disable encryption
//   },
// };
const config = {
  user: "sa",
  password: "Ferish123",
  host: "localhost",
  server: "localhost",
  port: 1433,
  database: "Myntra",
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};
// Connect to SQL Server
sql.connect(config, (err) => {
  if (err) {
    throw err;
  }
  console.log("Connection Successful!");
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api", require("./routes/category"));

// Define route for fetching data from SQL Server

// Start the server on port 3000
app.listen(3000, () => {
  console.log("Listening on port 3000...");
});
