import { Router } from "express";
import { asyncErrorHandler } from "../../utils/error-handling.js";
import { cloudUpload } from "../../utils/multer.js";
import { isValid } from "../../middlewares/validations.js";
import { checkDocument, updateConflict } from "../../middlewares/existence.js";
import {
  addSubCategoryValidation,
  deleteSubCategoryValidation,
  getSubCategoryValidation,
  updatesubCategoryValidation,
} from "./subcategory.validations.js";
import { Category, Subcategory } from "../../../db/index.models.js";
import {
  addSubCategory,
  updateSubCategory,
} from "./subcategory.controllers.js";
import { getCategoryValidation } from "../category/category.validation.js";
import {
  deleteDocument,
  getAllDocuments,
  getDocument,
} from "../../utils/RESTful_APIs.js";
import productRouter from "../product/product.routes.js";

const subCategoryRouter = Router({ mergeParams: true });

// get all subcategories
subCategoryRouter.get(
  "/subcategories",
  isValid(getCategoryValidation),
  checkDocument(Category, "slug", "notFound", "params", "categorySlug"),
  asyncErrorHandler(getAllDocuments(Subcategory))
);

// get subcategory
subCategoryRouter.get(
  "/:subcategorySlug",
  isValid(getSubCategoryValidation),
  checkDocument(Subcategory, "slug", "notFound", "params", "subcategorySlug"),
  asyncErrorHandler(getDocument(Subcategory, "subcategorySlug"))
);

// add subsubcategory
subCategoryRouter.post(
  "/",
  cloudUpload({}).single("file"),
  isValid(addSubCategoryValidation),
  checkDocument(Category, "slug", "notFound", "params", "categorySlug"),
  checkDocument(Subcategory, "name", "exists"),
  asyncErrorHandler(addSubCategory)
);

// update subcategory
subCategoryRouter.patch(
  "/:subcategorySlug",
  cloudUpload({}).single("file"),
  isValid(updatesubCategoryValidation),
  checkDocument(Subcategory, "slug", "notFound", "params", "subcategorySlug"),
  updateConflict(Subcategory, "name", "subcategorySlug"),
  asyncErrorHandler(updateSubCategory)
);

// delete subcategory
subCategoryRouter.delete(
  "/:subcategorySlug",
  isValid(deleteSubCategoryValidation),
  checkDocument(Subcategory, "slug", "notFound", "params", "subcategorySlug"),
  asyncErrorHandler(deleteDocument(Subcategory, "subcategorySlug"))
);

// Passing subcategory slug for sub-routes
subCategoryRouter.use("/:subcategorySlug", productRouter);
export default subCategoryRouter;
