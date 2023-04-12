import { STATUSES } from "../components/patientTasks/tasks";

export function analyzeTasksCompletion(patients, date = "all") {
  const analyzePatient = (patient) => {
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
      if (
        date === "day" &&
        new Date(task.createdAt).toLocaleDateString() !== today
      ) {
        continue;
      }
      if (date === "week" && !isPast7days(task.createdAt)) {
        continue;
      }

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

    const isSuccessful =
      completedRegularTasksPercent >= 80 && completedBonusTasksPercent >= 20;
    console.log("completedBonusTasksPercent", completedBonusTasksPercent);
    console.log("completedRegularTasksPercent", completedRegularTasksPercent);

    const canReach80percentRegularTasks =
      (completedRegularTasks + inProgressRegularCount) / totalRegularTasks >=
      0.8;

    const canReach20percentBonusTasks =
      (completedBonusTasks + inProgressBonusCount) / totalBonusTasks >= 0.2;

    let successStatus;
    if (isSuccessful) {
      successStatus = "Yes";
    } else if (totalBonusTasks === 0) {
      successStatus = "Missing bonus tasks";
    } else if (totalRegularTasks === 0) {
      successStatus = "Missing regular tasks";
    } else if (!canReach80percentRegularTasks || !canReach20percentBonusTasks) {
      successStatus = "Cannot succeed";
    } else {
      successStatus = "in progress";
    }

    return {
      ...patient,
      completedTasks,
      completedTasksPercent,
      completedRegularTasksPercent,
      completedBonusTasksPercent,
      successStatus,
      openTasksCount,
      isSuccessful,
    };
  };
  return patients?.map(analyzePatient);
}
const weekInMs = 7 * 24 * 60 * 60 * 1000;

export function isPast7days(date) {
  return new Date(date).getTime() > new Date().getTime() - weekInMs;
}
