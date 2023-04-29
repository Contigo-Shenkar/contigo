import mongoose from "mongoose";
import { STATUSES } from "../helpers/tasks.js";
import fs from "fs";
import path from "path";

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
  // Complete at a previous stage
  hidden: { type: Boolean, default: false },
});

const medicationSchema = new mongoose.Schema({
  medication: { type: String, required: true },
  condition: { type: String, required: true },
  // future
  dosage: { type: String },
  startedAt: { type: Date, default: new Date() },
  endedAt: { type: Date },
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
  imageUrl: { type: String },
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

// const files = fs.readdirSync("../client/public/assets/avatars");

(async function () {
  return;
  const patients = await patientModel.find();
  for (let index = 0; index < patients.length; index++) {
    const patient = patients[index];

    // patient.imageUrl = "/assets/avatars/" + files[index];

    // for (const med of patient.medication) {
    //   if (!med.medication) {
    //     med.remove();
    //   }
    // }

    await patient.save();
  }
  // for (const patient of patients) {
  // for (const task of patient.tasks) {
  // if (task.status === STATUSES.NOT_STARTED) {
  //   task.status = STATUSES.IN_PROGRESS;
  // }
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
  // if (patient.diagnosis.length === 0) {
  //   patient.diagnosis.push("ADHD");
  // }
  // }
})();
