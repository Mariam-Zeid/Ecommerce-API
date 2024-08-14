import Joi from "joi";
import { generalFields } from "../../utils/validation-helper.js";

export const getSubCategoryValidation = Joi.object({
  categorySlug: generalFields.name.required(),
  subcategorySlug: generalFields.name.required(),
});
export const addSubCategoryValidation = Joi.object({
  name: generalFields.name.required(),
  file: generalFields.file.required(),
  categorySlug: generalFields.name.required(),
}).required();

export const updatesubCategoryValidation = Joi.object({
  name: generalFields.name,
  file: generalFields.file,
  categorySlug: generalFields.name.required(),
  subcategorySlug: generalFields.name.required(),
}).required();

export const deleteSubCategoryValidation = Joi.object({
  categorySlug: generalFields.name.required(),
  subcategorySlug: generalFields.name.required(),
}).required();
