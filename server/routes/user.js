import express from "express";
const router = express.Router();

import { signUp, signIn, tokenLogin } from "../controllers/user.js";

router.post("/register", signUp);
router.post("/signin", signIn);
router.get("/tokenLogin/:token", tokenLogin);

export default router;
