import express from "express";
import { addTaskToTaskBank } from "../controllers/taskBank.js";
const router = express.Router();

router.post("/", addTaskToTaskBank);

export default router;
