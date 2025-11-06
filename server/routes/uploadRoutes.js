
import express from "express";
import multer from "multer";
import { handleFileUpload } from "../controllers/uploadController.js";

const router = express.Router();

// simple disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "server/uploads"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});

// allow only .xlsx
const fileFilter = (req, file, cb) => {
  const type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  if (file.mimetype === type) return cb(null, true);
  cb(new Error("Only .xlsx files are allowed"));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 2 * 1024 * 1024 } }); // 2 MB

router.post("/", upload.single("file"), handleFileUpload);

export default router;
