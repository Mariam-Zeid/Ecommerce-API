import { messages } from "../utils/constants/messages.js";
import { AppError, asyncErrorHandler } from "../utils/error-handling.js";

export const checkDocument = (
  model,
  field,
  checkType,
  reqField = "body",
  idField = null
) =>
  asyncErrorHandler(async (req, res, next) => {
    const value = req[reqField][idField || field];
    const { modelName } = model;

    // Find the document based on the provided field and value
    const doc = await model.findOne({ [field]: value });

    // Check the type of validation
    if (checkType === "exists") {
      // If the check type is 'exists', throw an error if the document exists
      if (doc) {
        throw new AppError(messages(modelName).failure.alreadyExists, 409);
      }
    } else if (checkType === "notFound") {
      // If the check type is 'notFound', throw an error if the document does not exist
      if (!doc) {
        throw new AppError(messages(modelName).failure.notFound, 404);
      }
    }

    next();
  });

export const updateConflict = (model, field, fieldSlug) =>
  asyncErrorHandler(async (req, res, next) => {
    const value = req.body[field];
    const idToExclude = req.params[fieldSlug];

    // Find the conflicting document excluding the one with the specified ID
    const conflictDoc = await model.findOne({
      [field]: value,
      slug: { $ne: idToExclude },
    });

    // Throw an error if a conflict is found
    if (conflictDoc) {
      throw new AppError(messages(model.modelName).failure.alreadyExists, 409);
    }

    next();
  });
