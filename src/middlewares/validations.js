import { AppError } from "../utils/error-handling.js";

export const isValid = (schema) => (req, res, next) => {
  let data = {
    ...req.body,
    ...req.params,
    ...req.query,
    ...(req.file ? { file: req.file } : {}), // Add req.file if it exists
    ...(req.files ? { files: req.files } : {}), // Add req.files if it exists
  };
  const { error } = schema.validate(data, { abortEarly: false });

  if (error) {
    const errorMssages = error.details
      .map(({ message }) => message.replace(/['"]/g, "")) // Remove single and double quotes from messages
      .join(", "); // Concatenate messages with a comma and space
    throw new AppError(errorMssages, 400);
  }
  next();
};
