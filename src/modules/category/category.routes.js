import { Router } from "express";
import { asyncErrorHandler } from "../../utils/error-handling.js";
import { isValid } from "../../middlewares/validations.js";
import { categoryValidations } from "./category.validation.js";
import { checkDocument, updateConflict } from "../../middlewares/existence.js";
import { Category } from "../../../db/index.models.js";
import { cloudUpload } from "../../utils/multer.js";
import { categoryControllers } from "./category.controllers.js";
import subCategoryRouter from "../subcategory/subcategory.routes.js";
import { generalCRUD } from "../../utils/RESTful_APIs.js";
import { authMiddleware } from "../../middlewares/auth.js";
import { roles } from "../../utils/constants/enums.js";

const categoryRouter = Router();

// get all categories
categoryRouter.get(
  "/",
  asyncErrorHandler(generalCRUD.getAllDocuments(Category))
);

// get category
categoryRouter.get(
  "/:categorySlug",
  isValid(categoryValidations.getCategoryValidation),
  checkDocument(Category, "slug", "notFound", "params", "categorySlug"),
  asyncErrorHandler(generalCRUD.getDocument(Category, "categorySlug"))
);

// add category
categoryRouter.post(
  "/",
  authMiddleware.isAuthenticated,
  authMiddleware.isAuthorized([roles.ADMIN, roles.SELLER]),
  cloudUpload({}).single("file"),
  isValid(categoryValidations.addCategoryValidation),
  checkDocument(Category, "name", "exists"),
  asyncErrorHandler(categoryControllers.addCategory)
);

// update category
categoryRouter.patch(
  "/:categorySlug",
  authMiddleware.isAuthenticated,
  authMiddleware.isAuthorized([roles.ADMIN, roles.SELLER]),
  cloudUpload({}).single("file"),
  isValid(categoryValidations.updateCategoryValidation),
  checkDocument(Category, "slug", "notFound", "params", "categorySlug"),
  updateConflict(Category, "name", "categorySlug"),
  asyncErrorHandler(categoryControllers.updateCategory)
);

// delete category
categoryRouter.delete(
  "/:categorySlug",
  authMiddleware.isAuthenticated,
  authMiddleware.isAuthorized([roles.ADMIN]),
  isValid(categoryValidations.deleteCategoryValidation),
  checkDocument(Category, "slug", "notFound", "params", "categorySlug"),
  asyncErrorHandler(generalCRUD.deleteDocument(Category, "categorySlug"))
);

// Passing category slug for sub-routes
categoryRouter.use("/:categorySlug", subCategoryRouter);
export default categoryRouter;
