import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  imageUrl: { type: String },
  // if exist, this is a parent user
  childId: { type: String, default: "" },
  userType: {
    type: String,
    required: true,
    default: "staff",
    enum: ["master", "doctor", "staff", "parent"],
  },
});
const userModel = mongoose.model("users", userSchema);

export default userModel;
