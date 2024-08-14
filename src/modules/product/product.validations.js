import Joi from "joi";
import { generalFields } from "../../utils/validation-helper.js";

export const getProductValidation = Joi.object({
  categorySlug: generalFields.name.required(),
  subcategorySlug: generalFields.name.required(),
  productSlug: generalFields.name.required(),
});

export const addProductValidation = Joi.object({
  name: generalFields.name.required(),
  description: Joi.string().max(500).required(),
  files: Joi.object({
    file: generalFields.files.required(),
    files: generalFields.files.required(),
  }),
  price: Joi.number().min(0).required(),
  discount: Joi.number().min(0).max(100).optional(),
  colors: generalFields.productOptions.optional(),
  sizes: generalFields.productOptions.optional(),
  stock: Joi.number().optional(),
  rate: Joi.number().min(0).max(5).optional(),
  categorySlug: generalFields.name.required(),
  subcategorySlug: generalFields.name.required(),
  brand: generalFields.id.required(),
}).required();

export const updateProductValidation = Joi.object({
  name: generalFields.name,
  description: Joi.string().max(500),
  files: Joi.object({
    file: generalFields.files,
    files: generalFields.files,
  }),
  price: Joi.number().min(0),
  discount: Joi.number().min(0).max(100).optional(),
  colors: generalFields.productOptions.optional(),
  sizes: generalFields.productOptions.optional(),
  stock: Joi.number().optional(),
  rate: Joi.number().min(0).max(5).optional(),
  categorySlug: generalFields.name,
  subcategorySlug: generalFields.name,
  brand: generalFields.id,
  productSlug: generalFields.name.required(),
});

export const deleteProductValidation = Joi.object({
  productSlug: generalFields.name.required(),
}).required();
