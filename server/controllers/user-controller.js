import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js";
import patientModel from "../models/patientModel.js";

const secret = "test";

export const signIn = async (req, res) => {
  const { email, password } = req.body;
  console.log("signIn - req.body", req.body);

  try {
    const user = await UserModel.findOne({ email });
    console.log("oldUser", user);
    if (!user) return res.status(400).json({ message: "User not found" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Something went wrong" });

    const token = jwt.sign({ email: user.email, id: user._id }, secret, {
      expiresIn: "1D",
    });
    res.status(200).json({ result: user, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
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
  const { fName, lName, email, pass: password, imageUrl, childId } = req.body;
  console.log("req.body", req.body);

  try {
    const oldUser = await UserModel.findOne({ email });

    if (oldUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exist" });
    }

    if (childId) {
      const child = await patientModel.findOne({ id: Number(childId) });
      if (!child) {
        return res.status(400).json({ message: "Child ID not found" });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await UserModel.create({
      email,
      password: hashedPassword,
      fullName: `${fName} ${lName}`,
      imageUrl,
      childId: childId || "",
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

