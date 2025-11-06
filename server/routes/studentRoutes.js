import express from "express";
import Student from "../models/Student.js";
const router = express.Router();

router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 100;
  const skip = (page - 1) * limit;

  const total = await Student.countDocuments();
  const students = await Student.find().skip(skip).limit(limit).select("roll name subject marks");

  res.json({
    total,
    page,
    totalPages: Math.ceil(total / limit),
    count: students.length,
    data: students,
  });
});

export default router;
