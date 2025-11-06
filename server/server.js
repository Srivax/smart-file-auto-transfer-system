import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import uploadRoutes from "./routes/uploadRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();
const app = express();

// core middlewares
app.use(cors());
app.use(express.json());

// api routes
app.use("/api/upload", uploadRoutes);

app.use(notFound);
app.use(errorHandler);

// db connect
const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "smart_file_autotransfer"
    });
    console.log("✅ MongoDB connected");
    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(`🚀 Server running on ${port}`));
  } catch (err) {
    console.error("❌ DB connection error:", err.message);
    process.exit(1);
  }
};

start();
