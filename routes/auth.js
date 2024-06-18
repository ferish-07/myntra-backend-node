const express = require("express");
const sql = require("mssql");
const bcrypt = require("bcryptjs");

const router = express.Router();

router.post("/register/v1", async (request, response) => {
  const { last_name, first_name, email, mobile_number, password } =
    request.body;
  const salt = await bcrypt.genSalt(10);
  const securePassword = await bcrypt.hash(password, salt);

  console.log("----PARAMS-", last_name, first_name, email);
  // Execute a SELECT query
  const sqlRequest = new sql.Request();
  sqlRequest.input("last_name", sql.VarChar, last_name);
  sqlRequest.input("first_name", sql.VarChar, first_name);
  sqlRequest.input("email", sql.VarChar, email);
  sqlRequest.input("mobile_number", sql.VarChar, mobile_number);
  sqlRequest.input("password", sql.VarChar, securePassword);
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
        message:
          result.recordset && result.recordset[0].validation_status == 500
            ? result.recordset[0].validation_msg
            : "User Registered Successfully",
      }); // Send query result as response
      //   console.dir(result.recordset);
    }
  });
});

router.post("/login/v1", async (request, response) => {
  const { email, password } = request.body;

  const sqlRequest = new sql.Request();
  sqlRequest.input("email", sql.VarChar, email);
  sqlRequest.execute("usp_get_customer_by_email", async (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      response.send({
        error_status: true,
        message: err.message,
      });
    } else if (!result.recordset.length) {
      response.send({
        error_status: true,
        message: "User not found",
      });
    } else {
      const user = result.recordset[0];

      console.log("----USERRR--", user);
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        response.send({
          error_status: false,
          message: "Login successfull",
        });
      } else {
        response.send({
          error_status: true,
          message: "Invalid credentials",
        });
      }
    }
  });
});

module.exports = router;
