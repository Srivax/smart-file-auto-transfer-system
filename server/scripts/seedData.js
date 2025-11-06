import mongoose from "mongoose";
import dotenv from "dotenv";
import Student from "../models/Student.js";

dotenv.config();

const subjects = ["Maths", "Science", "English", "History", "Geography"];
const names = ["Ravi", "Priya", "Ananya", "Karan", "Manoj", "Divya"];

const generateData = () => {
  const data = [];
  for (let i = 1; i <= 10000; i++) {
    const name = names[Math.floor(Math.random() * names.length)];
    const roll = "R" + String(i).padStart(5, "0");
    const subject = subjects[Math.floor(Math.random() * subjects.length)];
    const marks = Math.floor(Math.random() * 101);
    data.push({ name, roll, subject, marks });
  }
  return data;
};

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Student.deleteMany({});
    await Student.insertMany(generateData());
    console.log("✅ 10K records inserted successfully!");
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding data:", err);
    process.exit(1);
  }
};

seedData();
