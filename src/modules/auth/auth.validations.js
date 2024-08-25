import Joi from "joi";

const loginValidation = Joi.object({
  email: Joi.string().email(),
  phone: Joi.string(),
  password: Joi.string().required(),
})
  .or("email", "phone") // Ensure at least one of email or phone is present
  .required();

export const authValidations = {
  loginValidation,
};
