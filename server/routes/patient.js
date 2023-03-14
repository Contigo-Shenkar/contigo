import express from "express";
import {
  getPatientsList,
  addNewPatient,
  updatePatient,
  deletePatient, addGoal,
} from "../controllers/patient.js";
const router = express.Router();

router.get("/", getPatientsList);
router.post("/", addNewPatient);
router.post("/:id", addGoal);
router.patch("/:id", updatePatient);
router.delete("/:id", deletePatient);

export default router;
