import patientModal from "../models/patientModal.js";
import mongoose from "mongoose";

export const getPatientsList = async (req, res) => {
  try {
    const todoList = await patientModal.find({});
    res.status(200).json({ data: todoList });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

export const addNewPatient = async (req, res) => {
  const newPatient = new patientModal({
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
    await patientModal.findByIdAndRemove(id);
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
    await patientModal.findByIdAndUpdate(id, updatedPatient, { new: true });
    res.json(updatedPatient);
  } catch (error) {
    res.status(404).json({ message: "Something went wrong" });
  }
};
