import mongoose from "mongoose";
import { STATUSES } from "../helpers/tasks.js";
import { checkStage } from "../controllers/patient-controller.js";
import * as stages from "../../client/src/helpers/stages.mjs";
import { checkPatientStage } from "../controllers/helpers/check-stage.js";
const { daysPerStage } = stages;

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

const reviewsSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    recognizedSymptoms: {
      type: [{ med: String, diagnosis: String, symptom: String }],
      default: [],
    },
  },
  { timestamps: true }
);

const patientSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  id: { type: Number, required: true, unique: true },
  age: { type: Number, required: true },
  email: { type: String, required: true },
  imageUrl: { type: String },
  contactNumber: { type: String, required: true },
  tokens: { type: Number, default: 0 },
  stage: { type: Number, default: 1 },
  stageStartDate: { type: Date, default: new Date() },
  tasks: { type: [taskSchema] },
  medication: { type: [medicationSchema] },
  reviews: { type: [reviewsSchema] },
  causeOfAdmitting: { type: String },
  diagnosis: { type: [String] },
  reasons: {
    type: [
      {
        diagnosis: String,
        reason: [String],
      },
    ],
    default: [],
  },
  createdAt: { type: Date, default: new Date() },
  tasks: { type: [taskSchema] },
});
const patientModel = mongoose.model("patient", patientSchema);

export default patientModel;

// const files = fs.readdirSync("../client/public/assets/avatars");

(async function () {
  // return;
  const patients = await patientModel.find();
  // patients[0].stageStartDate = new Date("2021-06-01T00:00:00.000Z");
  for (let index = 0; index < patients.length; index++) {
    const patient = patients[index];

    // patient.imageUrl = "/assets/avatars/" + files[index];

    // for (const med of patient.medication) {
    //   if (!med.medication) {
    //     med.remove();
    //   }
    // }

    // if (!patient.patientStartDate) {
    //   patient.stageStartDate = new Date();
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

// interval for checking the ability to level up
setInterval(async () => {
  const patients = await patientModel.find();
  for (const patient of patients) {
    const minimumDays = daysPerStage[patient.stage];
    const daysOnStage = Math.floor(
      (new Date() - new Date(patient.stageStartDate)) / (1000 * 60 * 60 * 24)
    );

    if (daysOnStage < minimumDays) {
      console.log("not enough days on stage", patient.fullName);
      continue;
    } else {
      console.log("enough days on stage", patient.fullName);
    }
    const { isSuccessful } = checkPatientStage(patient);
    console.log(patient.fullName, "isSuccessful", isSuccessful);

    if (isSuccessful) {
      console.log("level up", patient.fullName);
      const nextStage = patient.stage + 1;
      patient.stage = Math.min(nextStage, 5); // max stage is 5
      patient.tasks.forEach((task) => {
        task.hidden = true;
      });
      await patient.save();
    }
  }
}, 1000 * 60 * 60 * 24);
