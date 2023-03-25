import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  task: { type: String, required: true },
  type: { type: String, enum: ["bonus", "regular"], required: true },
});

const taskBankSchema = new mongoose.Schema({
  tasks: [taskSchema],
});

const TaskBank = mongoose.model("TaskBank", taskBankSchema);

export default TaskBank;
