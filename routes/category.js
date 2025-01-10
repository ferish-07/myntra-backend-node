const express = require("express");
const sql = require("mssql");
const router = express.Router();

router.post("/add/maincategory/v1", async (req, res) => {
  const { category_name } = req.body;
  const sqlRequest = new sql.Request();
  sqlRequest.input("category_name", sql.VarChar, category_name);
  sqlRequest.execute("upsert_Category_master", (err, result) => {
    if (err) {
    } else {
      return res.send({
        error_status: false,
        message: "data inserted Successfully",
      });
    }
  });
});

router.post("/add/section/v1", async (req, res) => {
  const { section_name, column_no, category_id, section_id } = req.body;
  const sqlRequest = new sql.Request();
  if (!section_name || section_name.lenght == 0) {
    return res.send({
      error_status: false,
      messgae: "Please Enter Proper Section Name",
    });
  }
  if (!column_no) {
    return res.send({
      error_status: false,
      messgae: "Please Enter Proper Column No.",
    });
  }
  if (!category_id) {
    return res.send({
      error_status: false,
      messgae: "Please Enter Proper Category Id",
    });
  }

  sqlRequest.input("section_name", sql.VarChar, section_name);
  sqlRequest.input("column_no", sql.Int, column_no);
  sqlRequest.input("category_id", sql.Int, category_id);

  section_id ? sqlRequest.input("section_id", sql.Int, section_id) : null;
  sqlRequest.execute("insert_section", (err, result) => {
    if (err) {
      return res.send({
        error_status: true,
        message: err.message,
      });
    } else {
      return res.send({
        error_status: false,
        message: "Data inserted Successfully",
      });
    }
  });
});

router.post("/add/subSection/v1", async (req, res) => {
  const { sub_section_name, section_id, sub_section_id } = req.body;
  if (!sub_section_name || sub_section_name.lenght == 0) {
    return res.send({
      error_status: false,
      messgae: "Please Enter Proper Sub Section Name",
    });
  }

  if (!section_id) {
    return res.send({
      error_status: false,
      messgae: "Please Enter Proper Section Id",
    });
  }
  const sqlRequest = new sql.Request();
  sqlRequest.input("sub_section_name", sql.VarChar, sub_section_name);
  sqlRequest.input("section_id", sql.Int, section_id);

  sub_section_id
    ? sqlRequest.input("sub_section_id", sql.Int, sub_section_id)
    : null;

  sqlRequest.execute("insert_sub_section", async (err, result) => {
    if (err) {
      return res.send({
        error_status: true,
        message: err.message,
      });
    } else {
      return res.send({
        error_status: false,
        message: "Data inserted Successfully",
      });
    }
  });
});

router.get("/getSectionData/v1", async (req, res) => {
  const sqlRequest = new sql.Request();
  sqlRequest.execute("get_Section_Data", async (err, result) => {
    if (err) {
      return res.send({
        error_status: true,
        message: err.message,
      });
    } else {
      return res.send({
        error_status: false,
        message: "Data recieved Succesfully",
        data: JSON.parse(result.recordset[0].details),
      });
    }
  });
});

router.post("/delete/category", async (req, res) => {
  const { category_id } = req.body;
  const sqlRequest = new sql.Request();
  sqlRequest.input("category_id", sql.Int, category_id);
  sqlRequest.execute("delete_Category", async (err, result) => {
    if (err) {
      return res.send({
        error_status: true,
        message: err.message,
      });
    } else {
      // if(result.recordset)
      if (result.recordset[0].validation_status == 500) {
        res.send({
          error_status: false,
          message: result.recordset[0].validation_msg,
        });
      } else {
        res.send({
          error_status: false,
          message: result.recordset[0].validation_msg,
        });
      }
    }
  });
});
module.exports = router;
