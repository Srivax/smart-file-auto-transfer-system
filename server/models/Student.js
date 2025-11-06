import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    roll: { type: String, required: true, index: true },
    subject: { type: String, required: true },
    marks: { type: Number, required: true, min: 0, max: 100 }
  },
  { timestamps: true }
);
studentSchema.index({ roll: 1 });
studentSchema.index({ subject: 1 });

export default mongoose.model("Student", studentSchema);
