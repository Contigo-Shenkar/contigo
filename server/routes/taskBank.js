import express from "express";
import {
  addNewTaskToTaskBank,
  getAllTasksFromTaskBank,
} from "../controllers/taskBank.js";
const router = express.Router();

router.post("/", addNewTaskToTaskBank);
router.get("/", getAllTasksFromTaskBank);

export default router;
