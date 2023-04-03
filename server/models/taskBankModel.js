import mongoose from "mongoose";

const taskBankSchema = new mongoose.Schema({
  task: { type: String, required: true },
  tokenType: { type: String, enum: ["bonus", "regular"], required: true },
  taskType: {
    type: String,
    enum: ["type1", "type2", "type3", "type4"],
    required: true,
  },
});

const TaskBankModel = mongoose.model("TaskBank", taskBankSchema);

export default TaskBankModel;
