import Joi from "joi";
import { generalFields } from "../../utils/validation-helper.js";

const addReviewValidation = Joi.object({
  categorySlug: generalFields.name.required(),
  subcategorySlug: generalFields.name.required(),
  productSlug: generalFields.name.required(),
  comment: Joi.string(),
  rating: Joi.number().min(0).max(5).required(),
}).required();

const deleteReviewValidation = Joi.object({
  categorySlug: generalFields.name.required(),
  subcategorySlug: generalFields.name.required(),
  productSlug: generalFields.name.required(),
  reviewId: generalFields.id.required(),
});
export const reviewValidations = {
  addReviewValidation,
  deleteReviewValidation,
};
