import { Router } from "express";
import { wishlistControllers } from "./wishlist.controllers.js";
import { authMiddleware } from "../../middlewares/auth.js";
import { roles } from "../../utils/constants/enums.js";
import { asyncErrorHandler } from "../../utils/error-handling.js";
import { isValid } from "../../middlewares/validations.js";
import { wishlistValidations } from "./wishlist.validations.js";

const wishlistRouter = Router();

wishlistRouter.get(
  "/",
  authMiddleware.isAuthenticated,
  authMiddleware.isAuthorized([roles.USER]),
  asyncErrorHandler(wishlistControllers.getWishlist)
);

wishlistRouter.post(
  "/",
  authMiddleware.isAuthenticated,
  authMiddleware.isAuthorized([roles.USER]),
  isValid(wishlistValidations.addToWishlistValidation),
  asyncErrorHandler(wishlistControllers.addToWishlist)
);

wishlistRouter.patch(
  "/:productId",
  authMiddleware.isAuthenticated,
  authMiddleware.isAuthorized([roles.USER]),
  isValid(wishlistValidations.removeFromWishlistValidation),
  asyncErrorHandler(wishlistControllers.removeFromWishlist)
);

export default wishlistRouter;
