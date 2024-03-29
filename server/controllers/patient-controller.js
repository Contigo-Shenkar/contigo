import { STATUSES } from "../helpers/tasks.js";
import patientModel from "../models/patientModel.js";
import mongoose from "mongoose";
import DiagnosesAndMeds from "../helpers/diagnoses-and-meds.json" assert { type: "json" };
import { checkPatientStage } from "./helpers/check-stage.js";
import fetch from "node-fetch";
import {
  SIDE_EFFECT as SIDE_EFFECTS,
  SIDE_EFFECTS_PERCENT,
} from "./helpers/side-effects.js";

export const getPatientsList = async (req, res) => {
  try {
    const todoList = await patientModel.find({});
    res.status(200).json({ data: todoList });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

export const getPatientById = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(404)
        .json({ message: `No patient exists with id:${id}` });
    }

    const patient = await patientModel.findById(id);

    if (!patient) {
      return res
        .status(404)
        .json({ message: `No patient exists with id:${id}` });
    }

    res.status(200).json({ data: patient });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addNewPatient = async (req, res) => {
  const newPatient = new patientModel({
    ...req.body,
  });
  try {
    await newPatient.save();
    res.status(200).json({ data: newPatient });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

export const deletePatient = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(404)
        .json({ message: `No patient exist with id:${id}` });
    }
    await patientModel.findByIdAndRemove(id);
    res.status(200).json({ message: "Patient deleted successfully" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const medKey = "Medication/drug name";
const diagnosisKey = "Diagnosis/Condition";
export const addReview = async (req, res) => {
  const { id } = req.params;
  const content = req.body.content.toLowerCase();
  let detectedSideEffect = null;
  for (const sideEffect of SIDE_EFFECTS) {
    if (content.includes(sideEffect)) {
      detectedSideEffect = sideEffect;
      break;
    }
  }

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: `Invalid id: ${id}` });
    }
    const patient = await patientModel.findById(id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    if (patient.medication.length > 0) {
      const reviewData = {
        review: content,
        medication: patient.medication[0].medication,
        condition: patient.medication[0].condition,
      };
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: JSON.stringify(reviewData),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch from algorithm." + (await res.text()));
      }
      const algoData = await response.json();
      const alternativeMedications = [];
      for (const [medicationName, data] of Object.entries(algoData)) {
        const se = SIDE_EFFECTS_PERCENT.find(
          (sideEffect) => sideEffect.drugName === medicationName
        );

        const sePercent =
          se && detectedSideEffect ? se[detectedSideEffect] : "";

        alternativeMedications.push({
          medication: medicationName,
          reviewCount: data["amount of reviews"],
          score: data.score,
          sideEffectPercent: sePercent,
          detectedSideEffect,
        });
      }
      alternativeMedications.sort((a, b) => b.score - a.score);
      res.json({ alternativeMedications });
      patient.reviews.push({ content });
      await patient.save();
      return;
    }

    patient.reviews.push({ content });
    await patient.save();
    res.json(patient);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: error.message });
  }
};

export const updatePatient = async (req, res) => {
  const { id } = req.params;
  const { name, tokens, stage, type, medication } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: `Invalid id: ${id}` });
    }
    const update = { name, tokens, stage };
    const patient = await patientModel.findById(id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    if (patient.stage < stage) {
      patient.stage = Math.min(stage, 5); // max stage is 5
      patient.tasks.forEach((task) => {
        task.hidden = true;
      });
      await patient.save();
      return res.status(200).json({ data: patient });
    }

    if (type === "replace-med") {
      console.log("medication", medication);
      patient.medication = medication;
      await patient.save();
      return res.status(200).json({ data: patient });
    }

    const updatedPatient = await patientModel.findByIdAndUpdate(id, update, {
      new: true,
    });
    res.json(updatedPatient);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
export const addTask = async (req, res) => {
  const { id } = req.params;
  const { task, tokenType, taskType } = req.body;
  if (!task || !tokenType || !taskType) {
    return res.status(400).json({ message: "task and type are required." });
  }
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(404)
        .json({ message: `No patient exist with id:${id}` });
    }
    const patient = await patientModel.findById(id);
    patient.tasks.push({ task, tokenType, taskType });
    await patient.save();
    res.status(200).json({ data: patient });
  } catch (error) {
    res.status(404).json({ message: "Something went wrong" });
  }
};
export const deleteTask = async (req, res) => {
  const { patientId, taskId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      return res
        .status(404)
        .json({ message: `No patient exist with id:${patientId}` });
    }

    const patient = await patientModel.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    const task = patient.tasks.id(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    task.remove();
    await patient.save();
    res.status(200).json({ data: patient });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const addMedication = async (req, res) => {
  const { id } = req.params;
  const { medication, condition } = req.body;
  if (!medication || !condition) {
    return res
      .status(400)
      .json({ message: "medication and condition are required." });
  }
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(404)
        .json({ message: `No patient exist with id:${id}` });
    }
    const patient = await patientModel.findById(id);
    patient.medication.push({ medication, condition });
    await patient.save();
    res.status(200).json({ data: patient });
  } catch (error) {
    res.status(404).json({ message: "Something went wrong" });
  }
};
export const getPatientTasks = async (req, res) => {
  const patientId = req.params.id;

  try {
    const patient = await patientModel.findOne({ _id: patientId });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json(patient.tasks);
  } catch (error) {
    console.error("Error fetching patient tasks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateTaskStatus = async (req, res) => {
  const { patientId, taskId } = req.params;
  const { status } = req.body;
  if (!status || !Object.values(STATUSES).includes(status)) {
    return res.status(400).json({
      message: `Valid status is required (${Object.values(STATUSES).join(
        ", "
      )}).`,
    });
  }
  try {
    const patient = await patientModel.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    const task = patient.tasks.id(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    task.status = status;
    if (status === STATUSES.COMPLETED) {
      task.completedAt = new Date();
    } else {
      task.completedAt = null;
    }
    patient.markModified("tasks");
    await patient.save();

    return res.status(200).json({ message: "Task status updated.", task });
  } catch (error) {
    console.error("Error updating task status:", error.message);
    return res
      .status(500)
      .json({ message: "Error updating task status: " + error.message });
  }
};

export const checkStage = async (req, res) => {
  const { patientId } = req.params;

  try {
    const patient = await patientModel.findById(patientId);
    const { isSuccessful, reason } = checkPatientStage(patient);
    console.log("reason", reason);
    console.log("isSuccessful", isSuccessful);

    res.json({ isSuccessful, reason });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
