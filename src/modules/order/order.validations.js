import Joi from "joi";
import { paymentMethods } from "../../utils/constants/enums.js";
import { generalFields } from "../../utils/validation-helper.js";

const addOrderValidation = Joi.object({
  city: Joi.string().required(),
  street: Joi.string().required(),
  phone: Joi.string().required(),
  paymentMethod: Joi.string().valid(...Object.values(paymentMethods)),
  couponCode: Joi.string().required(),
});
export const orderValidations = { addOrderValidation };
