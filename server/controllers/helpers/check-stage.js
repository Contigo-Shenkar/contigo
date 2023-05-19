export const STATUSES = {
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
};
export function checkPatientStage(patient) {
  let openTasksCount = 0;
  let completedTasks = 0;
  let completedRegularTasks = 0;
  let completedBonusTasks = 0;
  let totalRegularTasks = 0;
  let totalBonusTasks = 0;
  let inProgressRegularCount = 0;
  let inProgressBonusCount = 0;
  const today = new Date().toLocaleDateString();
  for (const task of patient.tasks) {
    if (task.tokenType === "regular") {
      totalRegularTasks++;
    } else if (task.tokenType === "bonus") {
      totalBonusTasks++;
    }

    if (task.status === STATUSES.IN_PROGRESS) {
      openTasksCount++;
      if (task.tokenType === "regular") {
        inProgressRegularCount++;
      } else if (task.tokenType === "bonus") {
        inProgressBonusCount++;
      }
    } else if (task.status === STATUSES.COMPLETED) {
      completedTasks++;
      if (task.tokenType === "regular") {
        completedRegularTasks++;
      } else if (task.tokenType === "bonus") {
        completedBonusTasks++;
      }
    }
  }

  const completedTasksPercent =
    patient.tasks.length > 0
      ? (completedTasks / patient.tasks.length) * 100
      : 0;
  const completedRegularTasksPercent =
    totalRegularTasks > 0
      ? (completedRegularTasks / totalRegularTasks) * 100
      : 0;
  const completedBonusTasksPercent =
    totalBonusTasks > 0 ? (completedBonusTasks / totalBonusTasks) * 100 : 0;

  let reason = "";

  const isSuccessful =
    completedRegularTasksPercent >= 80 &&
    completedBonusTasksPercent >= 20 &&
    completedRegularTasks >= 4 &&
    completedBonusTasks >= 1;

  if (!isSuccessful) {
    if (completedRegularTasksPercent < 80) {
      reason = `You have not completed enough regular tasks (${completedRegularTasksPercent}%) `;
    } else if (completedBonusTasksPercent < 20) {
      reason = `You have not completed enough bonus tasks (${completedBonusTasksPercent}%) `;
    } else if (completedRegularTasks < 4) {
      reason = `You have not completed enough regular tasks (${completedRegularTasks} tasks)`;
    } else if (completedBonusTasks < 1) {
      reason = `You have not completed enough bonus tasks (${completedBonusTasks} tasks)`;
    }
  }

  return { isSuccessful, reason };
}
