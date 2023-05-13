import express from "express";
const router = express.Router();

import { signUp, signIn } from "../controllers/user.js";

router.post("/register", signUp);
router.post("/signin", signIn);

export default router;
