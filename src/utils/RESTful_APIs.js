import { ApiFeatures } from "./api-features.js";
import { messages } from "./constants/messages.js";
import { AppError } from "./error-handling.js";

// export const getAllDocuments = (model) => async (req, res) => {
//   const documents = await model.find();
//   return res.status(200).json({
//     status: "success",
//     message: messages(model.modelName).success.notFound,
//     data: documents,
//   });
// };
export const getAllDocuments = (model) => async (req, res) => {
  let {
    page = 1,
    limit = 5,
    sort = "createdAt",
    select = "-__v",
    ...filter
  } = req.query;

  const apiFeatures = new ApiFeatures(model.find(), req.query)
    .paginate()
    .sort()
    .select()
    .filter();

  const documents = await apiFeatures.mongooseQuery;
  return res.status(200).json({
    status: "success",
    message: messages(model.modelName).success.notFound,
    data: documents,
  });
};
export const getDocument = (model, slug) => async (req, res) => {
  const value = req.params[slug];
  const document = await model.findOne({ slug: value });
  return res.status(200).json({
    status: "success",
    message: messages(model.modelName).success.notFound,
    data: document,
  });
};
export const deleteDocument = (model, slug) => async (req, res) => {
  const value = req.params[slug];
  const deletedCategory = await model.findOneAndDelete({
    slug: value,
  });
  if (!deletedCategory) {
    throw new AppError(messages(model.modelName).failure.delete, 500);
  }
  if (req.failImg) {
    await deleteFile(req.failImg);
  }
  return res.status(200).json({
    status: "success",
    message: messages(model.modelName).success.delete,
    data: deletedCategory,
  });
};
