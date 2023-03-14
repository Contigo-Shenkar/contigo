import express from "express";
import {
  getPatientsList,
  addNewPatient,
  updatePatient,
  deletePatient,
} from "../controllers/patient.js";
const router = express.Router();

router.get("/", getPatientsList);
router.post("/", addNewPatient);
router.patch("/:id", updatePatient);
router.delete("/:id", deletePatient);

export default router;
