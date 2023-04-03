import TaskBankModel from "../models/taskBankModel.js";
import patientModel from "../models/patientModel.js";

export const getAllTasksFromTaskBank = async (req, res) => {
  try {
    const tasksList = await TaskBankModel.find({});
    res.status(200).json({ data: tasksList });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

export const addNewTaskToTaskBank = async (req, res) => {
  const newTask = new TaskBankModel({
    ...req.body,
  });
  try {
    await newTask.save();
    res.status(200).json({ data: newTask });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};
