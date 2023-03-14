import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  name: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
  },
  tokens: {
    amount: { type: Number, default: 0 },
    description: { type: String },
  },
  createdAt: { type: Date, default: new Date() },
});
const patientModal = mongoose.model("patient", patientSchema);

export default patientModal;
