import Joi from "joi";
import { generalFields } from "../../utils/validation-helper.js";

const getBrandValidation = Joi.object({
  brandSlug: generalFields.name.required(),
});
const addBrandValidation = Joi.object({
  name: generalFields.name.required(),
  file: generalFields.file.required(),
}).required();

const updateBrandValidation = Joi.object({
  name: generalFields.name,
  file: generalFields.file,
  brandSlug: generalFields.name.required(),
}).required();

const deleteBrandValidation = Joi.object({
  brandSlug: generalFields.name.required(),
}).required();

export const brandValidations = {
  getBrandValidation,
  addBrandValidation,
  updateBrandValidation,
  deleteBrandValidation,
};
