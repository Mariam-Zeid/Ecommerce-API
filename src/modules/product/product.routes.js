import { Router } from "express";
import { asyncErrorHandler } from "../../utils/error-handling.js";
import { generalCRUD } from "../../utils/RESTful_APIs.js";
import {
  Brand,
  Category,
  Product,
  Subcategory,
} from "../../../db/index.models.js";
import { isValid } from "../../middlewares/validations.js";
import { checkDocument, updateConflict } from "../../middlewares/existence.js";
import { productValidations } from "./product.validations.js";
import { cloudUpload } from "../../utils/multer.js";
import { productControllers } from "./product.controllers.js";

const productRouter = Router({ mergeParams: true });

// get all products
productRouter.get(
  "/products",
  asyncErrorHandler(generalCRUD.getAllDocuments(Product))
);

// get product
productRouter.get(
  "/:productSlug",
  isValid(productValidations.getProductValidation),
  checkDocument(Product, "slug", "notFound", "params", "productSlug"),
  asyncErrorHandler(generalCRUD.getDocument(Product, "productSlug"))
);

// add product
productRouter.post(
  "/",
  cloudUpload({}).fields([
    { name: "file", maxCount: 1 },
    { name: "files", maxCount: 5 },
  ]),
  isValid(productValidations.addProductValidation),
  checkDocument(Brand, "_id", "notFound", "body", "brand"),
  checkDocument(Subcategory, "slug", "notFound", "params", "subcategorySlug"),
  checkDocument(Category, "slug", "notFound", "params", "categorySlug"),
  checkDocument(Product, "name", "exists"),
  asyncErrorHandler(productControllers.addProduct)
);

//update product
productRouter.patch(
  "/:productSlug",
  cloudUpload({}).fields([
    { name: "file", maxCount: 1 },
    { name: "files", maxCount: 5 },
  ]),
  isValid(productValidations.updateProductValidation),
  checkDocument(Product, "slug", "notFound", "params", "productSlug"),
  updateConflict(Product, "name", "productSlug"),
  asyncErrorHandler(productControllers.updateProduct)
);

// delete product
productRouter.delete(
  "/:productSlug",
  isValid(productValidations.deleteProductValidation),
  checkDocument(Product, "slug", "notFound", "params", "productSlug"),
  asyncErrorHandler(generalCRUD.deleteDocument(Product, "productSlug"))
);

export default productRouter;
