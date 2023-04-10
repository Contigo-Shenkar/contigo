import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import patientRouter from "./routes/patient.js";
import userRouter from "./routes/user.js";
import taskBankRouter from "./routes/taskBank.js";
const app = express();
const port = process.env.PORT || 3001;

dotenv.config();
app.use(express.json());
app.use(cors());


// localhost:3001/api/patients
app.use("/api/patients", patientRouter);
app.use("/api/users", userRouter);
app.use("/api/taskBank", taskBankRouter);

mongoose
  .set("strictQuery", false)
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("connected to MongoDB...");
  })
  .catch((err) => console.log(`${err} did not connect`));

app.listen(port, () => console.log(`Listening on port ${port}`));
