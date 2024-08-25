import { Router } from "express";
import { asyncErrorHandler } from "../../utils/error-handling.js";
import { cloudUpload } from "../../utils/multer.js";
import { isValid } from "../../middlewares/validations.js";
import { checkDocument, updateConflict } from "../../middlewares/existence.js";
import { subcategoryValidations } from "./subcategory.validations.js";
import { Category, Subcategory } from "../../../db/index.models.js";
import { subcategoryControllers } from "./subcategory.controllers.js";
import { categoryValidations } from "../category/category.validation.js";
import { generalCRUD } from "../../utils/RESTful_APIs.js";
import productRouter from "../product/product.routes.js";
import { authMiddleware } from "../../middlewares/auth.js";
import { roles } from "../../utils/constants/enums.js";

const subCategoryRouter = Router({ mergeParams: true });

// get all subcategories
subCategoryRouter.get(
  "/subcategories",
  isValid(categoryValidations.getCategoryValidation),
  checkDocument(Category, "slug", "notFound", "params", "categorySlug"),
  asyncErrorHandler(generalCRUD.getAllDocuments(Subcategory))
);

// get subcategory
subCategoryRouter.get(
  "/:subcategorySlug",
  isValid(subcategoryValidations.getSubCategoryValidation),
  checkDocument(Subcategory, "slug", "notFound", "params", "subcategorySlug"),
  asyncErrorHandler(generalCRUD.getDocument(Subcategory, "subcategorySlug"))
);

// add subsubcategory
subCategoryRouter.post(
  "/",
  authMiddleware.isAuthenticated,
  authMiddleware.isAuthorized([roles.ADMIN, roles.SELLER]),
  cloudUpload({}).single("file"),
  isValid(subcategoryValidations.addSubCategoryValidation),
  checkDocument(Category, "slug", "notFound", "params", "categorySlug"),
  checkDocument(Subcategory, "name", "exists"),
  asyncErrorHandler(subcategoryControllers.addSubCategory)
);

// update subcategory
subCategoryRouter.patch(
  "/:subcategorySlug",
  authMiddleware.isAuthenticated,
  authMiddleware.isAuthorized([roles.ADMIN, roles.SELLER]),
  cloudUpload({}).single("file"),
  isValid(subcategoryValidations.updatesubCategoryValidation),
  checkDocument(Subcategory, "slug", "notFound", "params", "subcategorySlug"),
  updateConflict(Subcategory, "name", "subcategorySlug"),
  asyncErrorHandler(subcategoryControllers.updateSubCategory)
);

// delete subcategory
subCategoryRouter.delete(
  "/:subcategorySlug",
  authMiddleware.isAuthenticated,
  authMiddleware.isAuthorized([roles.ADMIN, roles.SELLER]),
  isValid(subcategoryValidations.deleteSubCategoryValidation),
  checkDocument(Subcategory, "slug", "notFound", "params", "subcategorySlug"),
  asyncErrorHandler(generalCRUD.deleteDocument(Subcategory, "subcategorySlug"))
);

// Passing subcategory slug for sub-routes
subCategoryRouter.use("/:subcategorySlug", productRouter);
export default subCategoryRouter;
