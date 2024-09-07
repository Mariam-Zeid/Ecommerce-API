import cloudinary from "./cloudinary.js";
import { AppError } from "./error-handling.js";

export const uploadFile = async (file, options = {}) => {
  const result = await cloudinary.uploader.upload(file, options);

  return {
    publicId: result.public_id,
    secureUrl: result.secure_url,
  };
};
export const deleteFile = async (filePublicId) => {
  try {
    const result = await cloudinary.uploader.destroy(filePublicId);
    if (result.result !== "ok") {
      throw new AppError(`Failed to delete file with ID ${filePublicId}`, 400);
    }
  } catch (error) {
    throw new AppError(error.message, error.statusCode || 500);
  }
};

export const deleteFiles = async (filePublicIds) => {
  try {
    const result = await cloudinary.api.delete_resources(filePublicIds);
    if (result.result !== "ok") {
      throw new AppError(
        `Failed to delete files with IDs ${filePublicIds}`,
        400
      );
    }
  } catch (error) {
    throw new AppError(error.message, error.statusCode || 500);
  }
};
