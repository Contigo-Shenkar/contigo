import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

const app = express();
const port = process.env.PORT || 3001;

dotenv.config();
app.use(express.json());
app.use(cors());


mongoose
  .set("strictQuery", false)
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("connected to MongoDB...");
    app.listen(port, () => console.log(`Listening on port ${port}`));
  })
  .catch((err) => console.log(`${err} did not connect`));
