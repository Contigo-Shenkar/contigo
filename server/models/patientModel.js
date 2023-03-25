import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  task: { type: String, required: true },
  type: { type: String, enum: ["regular", "bonus"] },
  status: {
    type: String,
    enum: ["completed", "not-completed", "run"],
    default: "run",
  },
});

const patientSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  id: { type: Number, required: true, unique: true },
  age: { type: Number, required: true },
  email: { type: String, required: true },
  contactNumber: { type: String, required: true },
  tokens: { type: Number, default: 0 },
  stage: { type: Number, default: 1 },
  tasks: { type: [taskSchema] },
  createdAt: { type: Date, default: new Date() },
});
const patientModel = mongoose.model("patient", patientSchema);

export default patientModel;
