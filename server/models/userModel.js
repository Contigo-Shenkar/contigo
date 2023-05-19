import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  imageUrl: { type: String, required: true },
  userType: {
    type: String,
    required: true,
    default: "staff",
    enum: ["master", "doctor", "staff", "parent"],
  },
});
const userModel = mongoose.model("users", userSchema);

export default userModel;
