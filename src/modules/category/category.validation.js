import Joi from "joi";
import { generalFields } from "../../utils/validation-helper.js";

const getCategoryValidation = Joi.object({
  categorySlug: generalFields.name.required(),
});

const addCategoryValidation = Joi.object({
  name: generalFields.name.required(),
  file: generalFields.file.required(),
}).required();

const updateCategoryValidation = Joi.object({
  name: generalFields.name,
  file: generalFields.file,
  categorySlug: generalFields.name.required(),
}).required();

const deleteCategoryValidation = Joi.object({
  categorySlug: generalFields.name.required(),
}).required();

export const categoryValidations = {
  getCategoryValidation,
  addCategoryValidation,
  updateCategoryValidation,
  deleteCategoryValidation,
};
