import jwt from "jsonwebtoken";

const generateToken = (payload, secretKey = process.env.JWT_SECRET) => {
  return jwt.sign(payload, secretKey);
};

const verifyToken = (token, secretKey = process.env.JWT_SECRET) => {
  return jwt.verify(token, secretKey);
};

export const tokenHelper = { generateToken, verifyToken };
