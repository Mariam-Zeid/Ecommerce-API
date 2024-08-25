import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.js";
import { roles } from "../../utils/constants/enums.js";
import { asyncErrorHandler } from "../../utils/error-handling.js";
import { couponControllers } from "./coupon.controllers.js";
import { checkDocument } from "../../middlewares/existence.js";
import { Coupon } from "../../../db/index.models.js";
import { isValid } from "../../middlewares/validations.js";
import { couponValidations } from "./coupon.validations.js";

const couponRouter = Router();

couponRouter.post(
  "/",
  authMiddleware.isAuthenticated,
  authMiddleware.isAuthorized([roles.ADMIN]),
  isValid(couponValidations.createCouponValidation),
  checkDocument(Coupon, "code", "exists"),
  asyncErrorHandler(couponControllers.createCoupon)
);

export default couponRouter;
