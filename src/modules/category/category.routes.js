import { Router } from "express";
import { asyncErrorHandler } from "../../utils/error-handling.js";
import { isValid } from "../../middlewares/validations.js";
import {
  addCategoryValidation,
  deleteCategoryValidation,
  getCategoryValidation,
  updateCategoryValidation,
} from "./category.validation.js";
import { checkDocument, updateConflict } from "../../middlewares/existence.js";
import { Category } from "../../../db/index.models.js";
import { cloudUpload } from "../../utils/multer.js";
import { addCategory, updateCategory } from "./category.controllers.js";
import subCategoryRouter from "../subcategory/subcategory.routes.js";
import {
  deleteDocument,
  getAllDocuments,
  getDocument,
} from "../../utils/RESTful_APIs.js";

const categoryRouter = Router();

// get all categories
categoryRouter.get("/", asyncErrorHandler(getAllDocuments(Category)));

// get category
categoryRouter.get(
  "/:categorySlug",
  isValid(getCategoryValidation),
  checkDocument(Category, "slug", "notFound", "params", "categorySlug"),
  asyncErrorHandler(getDocument(Category, "categorySlug"))
);

// add category
categoryRouter.post(
  "/",
  cloudUpload({}).single("file"),
  isValid(addCategoryValidation),
  checkDocument(Category, "name", "exists"),
  asyncErrorHandler(addCategory)
);

// update category
categoryRouter.patch(
  "/:categorySlug",
  cloudUpload({}).single("file"),
  isValid(updateCategoryValidation),
  checkDocument(Category, "slug", "notFound", "params", "categorySlug"),
  updateConflict(Category, "name", "categorySlug"),
  asyncErrorHandler(updateCategory)
);

// delete category
categoryRouter.delete(
  "/:categorySlug",
  isValid(deleteCategoryValidation),
  checkDocument(Category, "slug", "notFound", "params", "categorySlug"),
  asyncErrorHandler(deleteDocument(Category, "categorySlug"))
);

// Passing category slug for sub-routes
categoryRouter.use("/:categorySlug", subCategoryRouter);
export default categoryRouter;
