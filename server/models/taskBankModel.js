import mongoose from "mongoose";

const taskBankSchema = new mongoose.Schema({
  task: { type: String, required: true },
  tokenType: { type: String, enum: ["bonus", "regular"], required: true },
  taskType: {
    type: String,
    enum: ["draw", "dance", "sing", "run"],
    required: true,
  },
});

const TaskBankModel = mongoose.model("TaskBank", taskBankSchema);

export default TaskBankModel;
