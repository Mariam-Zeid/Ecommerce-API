import { Router } from "express";
import { asyncErrorHandler } from "../../utils/error-handling.js";
import { authControllers } from "./auth.controllers.js";
import { checkDocument } from "../../middlewares/existence.js";
import { User } from "../../../db/index.models.js";
import { isValid } from "../../middlewares/validations.js";
import { authValidations } from "./auth.validations.js";

const authRouter = Router();

authRouter.post(
  "/signup",
  checkDocument(User, "email", "exists"),
  checkDocument(User, "phone", "exists"),
  asyncErrorHandler(authControllers.signup)
);

authRouter.get("/verify-email", asyncErrorHandler(authControllers.verifyEmail));

authRouter.post(
  "/login",
  isValid(authValidations.loginValidation),
  asyncErrorHandler(authControllers.login)
);

export default authRouter;
