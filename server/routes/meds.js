import express from "express";
import { getMedication } from "../controllers/meds.js";
const router = express.Router();

router.get("/:medicationName", getMedication);

export default router;
