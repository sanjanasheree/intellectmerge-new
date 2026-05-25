const express = require("express");

const router = express.Router();

const Employee = require("../models/Employee");

router.post("/", async (req, res) => {
  try {
    const employee = new Employee(req.body);

    await employee.save();

    res.status(201).json(employee);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
});


router.get("/", async (req, res) => {
  try {

    const employees = await Employee.find();

    res.json(employees);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {

    await Employee.findByIdAndDelete(req.params.id);

    res.json({
      message: "Employee deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
});


router.put("/:id", async (req, res) => {

  try {

    const updatedEmployee =
      await Employee.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

    res.json(updatedEmployee);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;