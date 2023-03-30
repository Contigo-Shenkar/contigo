import patientModel from "../models/patientModel.js";
import mongoose from "mongoose";

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
      return res.status(404).json({ message: `No patient exists with id:${id}` });
    }

    const patient = await patientModel.findById(id);

    if (!patient) {
      return res.status(404).json({ message: `No patient exists with id:${id}` });
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

export const updatePatient = async (req, res) => {
  const { id } = req.params;
  const { name, tokens } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(404)
        .json({ message: `No patient exist with id:${id}` });
    }
    const updatedPatient = {
      name,
      tokens,
    };
    await patientModel.findByIdAndUpdate(id, updatedPatient, { new: true });
    res.json(updatedPatient);
  } catch (error) {
    res.status(404).json({ message: "Something went wrong" });
  }
};
export const addTask = async (req, res) => {
  const { id } = req.params;
  const { task, type } = req.body;
  if (!task || !type) {
    return res.status(400).json({ message: "task and type are required." });
  }
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(404)
        .json({ message: `No patient exist with id:${id}` });
    }
    const patient = await patientModel.findById(id);
    patient.tasks.push({ task, type });
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
  if (!status || !["completed", "not-completed", "run"].includes(status)) {
    return res.status(400).json({
      message: "Valid status is required (completed, not-completed, or run).",
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
    patient.markModified("tasks");
    await patient.save();

    return res.status(200).json({ message: "Task status updated.", task });
  } catch (error) {
    console.error("Error updating task status:", error.message);
    return res.status(500).json({ message: "Error updating task status." });
  }
};
