import Joi from "joi";
import { discountTypes } from "../../utils/constants/enums.js";

const createCouponValidation = Joi.object({
  code: Joi.string().alphanum().required(),
  discount: Joi.number().positive().required(),
  couponType: Joi.string()
    .valid(...Object.values(discountTypes))
    .required(),
  startDate: Joi.date().required(),
  expiryDate: Joi.date().greater(Joi.ref("startDate")).required(),
});

export const couponValidations = {
  createCouponValidation,
};
