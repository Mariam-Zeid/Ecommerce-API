import { Router } from "express";
import { asyncErrorHandler } from "../../utils/error-handling.js";
import {
  deleteDocument,
  getAllDocuments,
  getDocument,
} from "../../utils/RESTful_APIs.js";
import {
  Brand,
  Category,
  Product,
  Subcategory,
} from "../../../db/index.models.js";
import { isValid } from "../../middlewares/validations.js";
import { checkDocument, updateConflict } from "../../middlewares/existence.js";
import {
  addProductValidation,
  deleteProductValidation,
  getProductValidation,
  updateProductValidation,
} from "./product.validations.js";
import { cloudUpload } from "../../utils/multer.js";
import { addProduct, updateProduct } from "./product.controllers.js";

const productRouter = Router({ mergeParams: true });

// get all products
productRouter.get("/products", asyncErrorHandler(getAllDocuments(Product)));

// get product
productRouter.get(
  "/:productSlug",
  isValid(getProductValidation),
  checkDocument(Product, "slug", "notFound", "params", "productSlug"),
  asyncErrorHandler(getDocument(Product, "productSlug"))
);

// add product
productRouter.post(
  "/",
  cloudUpload({}).fields([
    { name: "file", maxCount: 1 },
    { name: "files", maxCount: 5 },
  ]),
  isValid(addProductValidation),
  checkDocument(Brand, "_id", "notFound", "body", "brand"),
  checkDocument(Subcategory, "slug", "notFound", "params", "subcategorySlug"),
  checkDocument(Category, "slug", "notFound", "params", "categorySlug"),
  checkDocument(Product, "name", "exists"),
  asyncErrorHandler(addProduct)
);

//update product
productRouter.patch(
  "/:productSlug",
  cloudUpload({}).fields([
    { name: "file", maxCount: 1 },
    { name: "files", maxCount: 5 },
  ]),
  isValid(updateProductValidation),
  checkDocument(Product, "slug", "notFound", "params", "productSlug"),
  updateConflict(Product, "name", "productSlug"),
  asyncErrorHandler(updateProduct)
);

// delete product
productRouter.delete(
  "/:productSlug",
  isValid(deleteProductValidation),
  checkDocument(Product, "slug", "notFound", "params", "productSlug"),
  asyncErrorHandler(deleteDocument(Product, "productSlug"))
);

export default productRouter;
