import TaskBank from "../models/taskBankModel.js";

export const addTaskToTaskBank = async (task) => {
  try {
    let taskBank = await TaskBank.findOne();

    if (!taskBank) {
      taskBank = new TaskBank({ tasks: [] });
    }

    taskBank.tasks.push(task);
    await taskBank.save();
    console.log("Task added to task bank:", taskBank);
  } catch (error) {
    console.error("Error adding task to task bank:", error.message);
  }
};

// Usage: addTaskToTaskBank({ description: 'Drink water', type: 'routine' });
