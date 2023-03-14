import mongoose from "mongoose";

const goalSchema = new mongoose.Schema({
  description: { type: String, required: true },
  goalType: { type: String, enum: ["regular", "bonus"] },
});

const patientSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  id: { type: Number, required: true },
  age: { type: Number, required: true },
  tokens: { type: Number, default: 0 },
  goals: { type: [goalSchema] },
  createdAt: { type: Date, default: new Date() },
});
const patientModal = mongoose.model("patient", patientSchema);

export default patientModal;
