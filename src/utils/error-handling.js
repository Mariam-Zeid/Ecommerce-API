import { deleteFile } from "./file-helper.js";

// Handling Errors
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Handling Async Errors
export const asyncErrorHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((error) =>
      next(new AppError(error.message, error.statusCode || 500))
    );
  };
};

// Handling Global Errors
export const globalErrorHandler = async (error, req, res, next) => {
  if (req.file) {
    await deleteFile(req.failImg);
  }

  if (req.files) {
    console.log(req.files);
  }

  const { statusCode, message } = error;
  return res
    .status(statusCode || 500)
    .json({ message: message || "Internal Server Error", success: false });
};
