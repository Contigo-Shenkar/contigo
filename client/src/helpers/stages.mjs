import { getDateDiffInDays } from "./dates.mjs";

export const daysPerStage = {
  1: 16,
  2: 20,
  3: 22,
  4: 27,
  5: 34,
};

export const getDaysAtStage = (stageStartDate) =>
  getDateDiffInDays(new Date(stageStartDate).getTime(), Date.now());
