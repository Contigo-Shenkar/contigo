import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js";

const secret = "test";

export const signIn = async (req, res) => {
  const { email, password } = req.body;
  console.log("req.body", req.body);

  try {
    const oldUser = await UserModel.findOne({ email });
    if (!oldUser)
      return res.status(404).json({ message: "Something went wrong" });

    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Something wentttt wrong" });

    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
      expiresIn: "1D",
    });
    res.status(200).json({ result: oldUser, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(error);
  }
};
export const tokenLogin = async (req, res) => {
  const { token } = req.params;

  try {
    const decodedData = jwt.verify(token, secret);
    const { email } = decodedData;
    const user = await UserModel.findOne({ email });
    console.log("user", user);

    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(error);
  }
};

export const signUp = async (req, res) => {
  const { fName, lName, email, pass: password, imageUrl } = req.body;
  console.log("req.body", req.body);

  try {
    const oldUser = await UserModel.findOne({ email });

    if (oldUser) {
      return res.status(400).json({ message: "User already exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await UserModel.create({
      email,
      password: hashedPassword,
      fullName: `${fName} ${lName}`,
      imageUrl,
    });

    const token = jwt.sign({ email: result.email, id: result._id }, secret, {
      expiresIn: "1d",
    });
    res.status(201).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(error);
  }
};
