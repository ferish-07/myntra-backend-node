const express = require("express");
const sql = require("mssql");
const router = express.Router();

router.post("/register/v1", (request, response) => {
  const { last_name, first_name, email, mobile_number } = request.body;

  console.log("----PARAMS-", last_name, first_name, email);
  // Execute a SELECT query
  const sqlRequest = new sql.Request();
  sqlRequest.input("last_name", sql.VarChar, last_name);
  sqlRequest.input("first_name", sql.VarChar, first_name);
  sqlRequest.input("email", sql.VarChar, email);
  sqlRequest.input("mobile_number", sql.VarChar, mobile_number);
  sqlRequest.execute("usp_insert_customer", (err, result) => {
    console.log("rrrrrrrrrrrr", result);
    if (err) {
      console.error("Error executing query:", err);
      response.send({
        error_status: true,
        message: err.message,
      });
    } else {
      response.send({
        error_status: false,
        message: "DATA INSERTED SUCCESSFULLY",
      }); // Send query result as response
      //   console.dir(result.recordset);
    }
  });
});

module.exports = router;
