import { Router } from "express";
import { generalCRUD } from "../../utils/RESTful_APIs.js";
import { Product, Review } from "../../../db/index.models.js";
import { asyncErrorHandler } from "../../utils/error-handling.js";
import { reviewControllers } from "./review.controllers.js";
import { roles } from "../../utils/constants/enums.js";
import { authMiddleware } from "../../middlewares/auth.js";
import { isValid } from "../../middlewares/validations.js";
import { reviewValidations } from "./review.validations.js";
import { checkDocument } from "../../middlewares/existence.js";

const reviewRouter = Router({ mergeParams: true });

reviewRouter.get(
  "/reviews",
  asyncErrorHandler(generalCRUD.getAllDocuments(Review))
);

reviewRouter.post(
  "/",
  authMiddleware.isAuthenticated,
  authMiddleware.isAuthorized([roles.USER]),
  isValid(reviewValidations.addReviewValidation),
  checkDocument(Product, "slug", "notFound", "params", "productSlug"),
  asyncErrorHandler(reviewControllers.addReview)
);

reviewRouter.delete(
  "/:reviewId",
  authMiddleware.isAuthenticated,
  authMiddleware.isAuthorized([roles.USER]),
  isValid(reviewValidations.deleteReviewValidation),
  checkDocument(Review, "_id", "notFound", "params", "reviewId"),
  asyncErrorHandler(reviewControllers.deleteReview)
);

export default reviewRouter;
