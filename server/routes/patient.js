import express from "express";
import {
  getPatientsList,
  getPatientByIdMinimal,
  addNewPatient,
  updatePatient,
  deletePatient,
  addTask,
  updateTaskStatus,
  getPatientTasks,
  getPatientById,
  deleteTask,
  addMedication,
  addReview,
  checkStage,
} from "../controllers/patient-controller.js";
const router = express.Router();

// localhost:3001/api/patients

// localhost:3001/api/patients/121212

// localhost:3001/api/patients/1212121/tasks

router.get("/", getPatientsList);
router.get("/:id", getPatientById);
router.get("/minimal/:id", getPatientByIdMinimal);
router.post("/", addNewPatient);
router.post("/:id/reviews", addReview);
router.post("/:id/tasks", addTask);
router.post("/:id/medication", addMedication);
router.patch("/:patientId/tasks/:taskId", updateTaskStatus);
router.delete("/:patientId/tasks/:taskId", deleteTask);
router.get("/:id/tasks", getPatientTasks);
router.get("/checkStage/:patientId", checkStage);
router.patch("/:id", updatePatient);
router.delete("/:id", deletePatient);

export default router;
