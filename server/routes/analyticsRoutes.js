import express from "express";
import Student from "../models/Student.js";
const router = express.Router();

router.get("/subject-average", async (req, res) => {
  const result = await Student.aggregate([
    { $group: { _id: "$subject", avgMarks: { $avg: "$marks" } } },
    { $sort: { avgMarks: -1 } }
  ]);
  res.json(result);
});

export default router;
