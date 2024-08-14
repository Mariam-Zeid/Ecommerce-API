import Joi from "joi";
import { Types } from "mongoose";

const objectIdValidation = (value, helper) => {
  return Types.ObjectId.isValid(value) ? true : helper.message("invalid id");
};

// Define the schema for a single file
const fileSchema = Joi.object({
  fieldname: Joi.string(),
  originalname: Joi.string(),
  encoding: Joi.string(),
  mimetype: Joi.string().valid("image/jpeg", "image/png"),
  destination: Joi.string(),
  filename: Joi.string(),
  path: Joi.string(),
  size: Joi.number(),
});

// parsing data from array validation
const parsingData = (data, helper) => {
  const parsedData = JSON.parse(data);
  let schema = Joi.array().items(Joi.string());
  const { error } = schema.validate(parsedData, { abortEarly: false });

  if (error) {
    return helper("data must be an array of strings", 400);
  }

  return true;
};
export const generalFields = {
  id: Joi.string().custom(objectIdValidation),
  name: Joi.string(),
  file: fileSchema,
  files: Joi.array().items(fileSchema),
  productOptions: Joi.custom(parsingData),
};
