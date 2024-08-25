import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.js";
import { roles } from "../../utils/constants/enums.js";
import { isValid } from "../../middlewares/validations.js";
import { asyncErrorHandler } from "../../utils/error-handling.js";
import { orderValidations } from "./order.validations.js";
import { orderControllers } from "./order.controllers.js";

const orderRouter = Router();

orderRouter.post(
  "/",
  authMiddleware.isAuthenticated,
  authMiddleware.isAuthorized([roles.USER]),
  isValid(orderValidations.addOrderValidation),
  asyncErrorHandler(orderControllers.addOrder)
);

export default orderRouter;
