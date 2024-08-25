import Joi from "joi";
import { generalFields } from "../../utils/validation-helper.js";

const addToWishlistValidation = Joi.object({
  productId: generalFields.id.required(),
}).required();

const removeFromWishlistValidation = Joi.object({
  productId: generalFields.id.required(),
}).required();

export const wishlistValidations = {
  addToWishlistValidation,
  removeFromWishlistValidation,
};
