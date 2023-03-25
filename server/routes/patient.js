import express from "express";
import {
  getPatientsList,
  addNewPatient,
  updatePatient,
  deletePatient,
  addTask,
  updateTaskStatus,
  getPatientTasks,
} from "../controllers/patient.js";
const router = express.Router();

router.get("/", getPatientsList);
router.post("/", addNewPatient);
router.post("/:id/tasks", addTask);
router.patch("/:patientId/tasks/:taskId", updateTaskStatus);
router.get("/:id/tasks", getPatientTasks);
router.patch("/:id", updatePatient);
router.delete("/:id", deletePatient);

export default router;
