import { Router } from "express";
import { cloudUpload } from "../../utils/multer.js";
import { isValid } from "../../middlewares/validations.js";
import { checkDocument, updateConflict } from "../../middlewares/existence.js";
import { asyncErrorHandler } from "../../utils/error-handling.js";
import {
  addBrandValidation,
  deleteBrandValidation,
  getBrandValidation,
  updateBrandValidation,
} from "./brand.validations.js";
import { Brand } from "../../../db/index.models.js";
import { addBrand, updateBrand } from "./brand.controllers.js";
import {
  deleteDocument,
  getAllDocuments,
  getDocument,
} from "../../utils/RESTful_APIs.js";

const brandRouter = Router();

// get all brands
brandRouter.get("/", asyncErrorHandler(getAllDocuments(Brand)));

// get brand
brandRouter.get(
  "/:brandSlug",
  isValid(getBrandValidation),
  checkDocument(Brand, "slug", "notFound", "params", "brandSlug"),
  asyncErrorHandler(getDocument(Brand, "brandSlug"))
);

// add brand
brandRouter.post(
  "/",
  cloudUpload({}).single("file"),
  isValid(addBrandValidation),
  checkDocument(Brand, "name", "exists"),
  asyncErrorHandler(addBrand)
);

// update brand
brandRouter.patch(
  "/:brandSlug",
  cloudUpload({}).single("file"),
  isValid(updateBrandValidation),
  checkDocument(Brand, "slug", "notFound", "params", "brandSlug"),
  updateConflict(Brand, "name", "brandSlug"),
  asyncErrorHandler(updateBrand)
);

// delete brand
brandRouter.delete(
  "/:brandSlug",
  isValid(deleteBrandValidation),
  checkDocument(Brand, "slug", "notFound", "params", "brandSlug"),
  asyncErrorHandler(deleteDocument(Brand, "brandSlug"))
);

export default brandRouter;
