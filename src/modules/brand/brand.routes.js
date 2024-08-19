import { Router } from "express";
import { cloudUpload } from "../../utils/multer.js";
import { isValid } from "../../middlewares/validations.js";
import { checkDocument, updateConflict } from "../../middlewares/existence.js";
import { asyncErrorHandler } from "../../utils/error-handling.js";
import { brandValidations } from "./brand.validations.js";
import { Brand } from "../../../db/index.models.js";
import { brandControllers } from "./brand.controllers.js";
import { generalCRUD } from "../../utils/RESTful_APIs.js";

const brandRouter = Router();

// get all brands
brandRouter.get("/", asyncErrorHandler(generalCRUD.getAllDocuments(Brand)));

// get brand
brandRouter.get(
  "/:brandSlug",
  isValid(brandValidations.getBrandValidation),
  checkDocument(Brand, "slug", "notFound", "params", "brandSlug"),
  asyncErrorHandler(generalCRUD.getDocument(Brand, "brandSlug"))
);

// add brand
brandRouter.post(
  "/",
  cloudUpload({}).single("file"),
  isValid(brandValidations.addBrandValidation),
  checkDocument(Brand, "name", "exists"),
  asyncErrorHandler(brandControllers.addBrand)
);

// update brand
brandRouter.patch(
  "/:brandSlug",
  cloudUpload({}).single("file"),
  isValid(brandValidations.updateBrandValidation),
  checkDocument(Brand, "slug", "notFound", "params", "brandSlug"),
  updateConflict(Brand, "name", "brandSlug"),
  asyncErrorHandler(brandControllers.updateBrand)
);

// delete brand
brandRouter.delete(
  "/:brandSlug",
  isValid(brandValidations.deleteBrandValidation),
  checkDocument(Brand, "slug", "notFound", "params", "brandSlug"),
  asyncErrorHandler(generalCRUD.deleteDocument(Brand, "brandSlug"))
);

export default brandRouter;
