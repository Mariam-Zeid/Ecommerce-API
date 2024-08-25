import { Cart, User } from "../../../db/index.models.js";
import { statuses } from "../../utils/constants/enums.js";
import { messages } from "../../utils/constants/messages.js";
import { AppError } from "../../utils/error-handling.js";
import { passwordHelper } from "../../utils/password-helper.js";
import { sendEmail } from "../../utils/send-email.js";
import { tokenHelper } from "../../utils/token-helper.js";

const signup = async (req, res) => {
  const { name, email, password, phone, DOB } = req.body;
  const hashedPassword = passwordHelper.hashingPassword(password);
  const user = new User({
    name,
    email,
    password: hashedPassword,
    phone,
    DOB,
  });

  const token = tokenHelper.generateToken({ email: user.email });

  await sendEmail(
    email,
    "Verify Email",
    `<p>Hello ${name}, please verify your email</p>
    <p>Click this link to verify your email</p>
    <a href='${req.protocol}://${req.headers.host}/auth/verify-email?token=${token}'>Verify Email</a>`
  );

  const createdUser = await user.save();

  if (!createdUser) {
    throw new AppError(messages("User").failure.create, 500);
  }

  return res.status(201).json({
    status: "success",
    message: messages("User").success.create,
    token,
    data: createdUser,
  });
};
const verifyEmail = async (req, res) => {
  const { token } = req.query;

  const decodedUser = tokenHelper.verifyToken(token);
  if (!decodedUser) {
    throw new AppError(
      "Invalid or expired verification token. Please request a new verification email.",
      400
    );
  }

  const updatedUser = await User.findOneAndUpdate(
    { email: decodedUser.email, status: statuses.PENDING },
    { status: statuses.VERIFIED },
    { new: true }
  );

  if (!updatedUser) {
    throw new AppError(messages("User").failure.verify, 500);
  }

  // Creating user cart
  await Cart.create({ user: updatedUser._id, products: [] });

  return res.status(200).json({
    status: "success",
    message: messages("User").success.verify,
    data: updatedUser,
  });
};
const login = async (req, res) => {
  const { email, phone, password } = req.body;

  const user = await User.findOne({
    $or: [{ email }, { phone }],
    status: statuses.VERIFIED,
  });

  if (!user) {
    throw new AppError(messages("User").failure.notFound, 404);
  }

  const isMatch = passwordHelper.comparePassword(password, user.password);
  if (!isMatch) {
    throw new AppError("Failed to login", 401);
  }

  const token = tokenHelper.generateToken({
    id: user._id,
    role: user.role,
    email: user.email,
  });

  return res.status(200).json({
    status: "success",
    message: "Logged in successfully",
    token,
  });
};

export const authControllers = { signup, verifyEmail, login };
