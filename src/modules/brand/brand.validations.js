import Joi from "joi";
import { generalFields } from "../../utils/validation-helper.js";

export const getBrandValidation = Joi.object({
  brandSlug: generalFields.name.required(),
});
export const addBrandValidation = Joi.object({
  name: generalFields.name.required(),
  file: generalFields.file.required(),
}).required();

export const updateBrandValidation = Joi.object({
  name: generalFields.name,
  file: generalFields.file,
  brandSlug: generalFields.name.required(),
}).required();

export const deleteBrandValidation = Joi.object({
  brandSlug: generalFields.name.required(),
}).required();
