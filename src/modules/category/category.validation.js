import Joi from "joi";
import { generalFields } from "../../utils/validation-helper.js";

export const getCategoryValidation = Joi.object({
  categorySlug: generalFields.name.required(),
});

export const addCategoryValidation = Joi.object({
  name: generalFields.name.required(),
  file: generalFields.file.required(),
}).required();

export const updateCategoryValidation = Joi.object({
  name: generalFields.name,
  file: generalFields.file,
  categorySlug: generalFields.name.required(),
}).required();

export const deleteCategoryValidation = Joi.object({
  categorySlug: generalFields.name.required(),
}).required();
