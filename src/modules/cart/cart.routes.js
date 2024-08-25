import { Router } from "express";
import { asyncErrorHandler } from "../../utils/error-handling.js";
import { cartControllers } from "./cart.controllers.js";
import { authMiddleware } from "../../middlewares/auth.js";
import { roles } from "../../utils/constants/enums.js";
import { Product } from "../../../db/index.models.js";
import { checkDocument } from "../../middlewares/existence.js";

const cartRouter = Router();

cartRouter.get(
  "/",
  authMiddleware.isAuthenticated,
  authMiddleware.isAuthorized([roles.USER]),
  asyncErrorHandler(cartControllers.getCart)
);
cartRouter.post(
  "/",
  authMiddleware.isAuthenticated,
  authMiddleware.isAuthorized([roles.USER]),
  checkDocument(Product, "_id", "notFound", "body", "productId"),
  asyncErrorHandler(cartControllers.addToCart)
);

cartRouter.patch(
  "/:productId",
  authMiddleware.isAuthenticated,
  authMiddleware.isAuthorized([roles.USER]),
  asyncErrorHandler(cartControllers.removeFromCart)
);

export default cartRouter;
