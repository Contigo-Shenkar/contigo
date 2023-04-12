import mongoose from "mongoose";
import { STATUSES } from "../helpers/tasks.js";

const taskSchema = new mongoose.Schema({
  task: { type: String, required: true },
  tokenType: {
    type: String,
    enum: ["bonus", "regular"],
    default: "regular",
    required: true,
  },
  taskType: {
    // diagnosis
    type: String,
    required: true,
  },
  status: {
    type: String,
    // enum: Object.values(STATUSES),
    default: STATUSES.IN_PROGRESS,
  },
  createdAt: { type: Date, default: new Date() },
  completedAt: { type: Date },
  tokens: { type: Number },
});

const medicationSchema = new mongoose.Schema({
  medication: { type: String },
  condition: { type: String },
});

const reviewsSchema = new mongoose.Schema({
  content: { type: String, required: true },
  date: { type: Date, default: new Date() },
  recognizedSymptoms: {
    type: [{ med: String, diagnosis: String, symptom: String }],
    default: [],
    required: true,
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
  medication: { type: [medicationSchema] },
  reviews: { type: [reviewsSchema] },
  causeOfAdmitting: { type: String },
  diagnosis: { type: [String] },
  createdAt: { type: Date, default: new Date() },
  tasks: { type: [taskSchema] },
});
const patientModel = mongoose.model("patient", patientSchema);

export default patientModel;

// (async function () {
// const patients = await patientModel.find();
// for (const patient of patients) {
// for (const task of patient.tasks) {
//   if (task.status === STATUSES.NOT_STARTED) {
//     task.status = STATUSES.IN_PROGRESS;
//   }
// if (task.status === `completed`) {
//   task.status = STATUSES.NOT_STARTED;
// }
// if (task.status === `run`) {
//   task.status = STATUSES.IN_PROGRESS;
// }
// if (!task.tokenType) {
//   task.remove();
//   continue;
// }
// if (!task.taskType || task.taskType === `type1`) {
//   task.taskType = "ODD";
// }
// }
//   if (patient.diagnosis.length === 0) {
//     patient.diagnosis.push("ADHD");
//   }
//   await patient.save();
// }
// })();
