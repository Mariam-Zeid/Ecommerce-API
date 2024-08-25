import bcrypt from "bcrypt";

const hashingPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

const comparePassword = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
};

export const passwordHelper = { hashingPassword, comparePassword };
