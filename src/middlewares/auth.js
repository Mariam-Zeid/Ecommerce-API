import { User } from "../../db/index.models.js";
import { roles, statuses } from "../utils/constants/enums.js";
import { AppError, asyncErrorHandler } from "../utils/error-handling.js";
import { tokenHelper } from "../utils/token-helper.js";

const isAuthenticated = asyncErrorHandler(async (req, res, next) => {
  const { token } = req.headers;
  // Check if token exists
  if (!token) throw new AppError("Token must be provided", 404);

  // Check if token is valid
  if (!token.startsWith(process.env.BEARER_KEY))
    throw new AppError("Invalid token", 498);

  // Extract the actual token after the bearer key
  const baseToken = token.split(" ")[1];

  // Verify the token using the secret key
  const decodedUser = tokenHelper.verifyToken(baseToken);

  // Check if the decoded token's payload contains a user ID
  if (!decodedUser.id) throw new AppError("Invalid token payload", 400);

  // Check if the user specified in the token exists and is verified
  const tokenUser = await User.findOne({
    _id: decodedUser.id,
    status: statuses.VERIFIED,
  });

  if (!tokenUser) throw new AppError("User not found", 404);

  // Set the user in the request object
  req.user = decodedUser;
  next();
});

const isAuthorized = (roles) =>
  asyncErrorHandler(async (req, res, next) => {
    const { user } = req;
    const { role } = user;
    if (!roles.includes(role)) throw new AppError("Unauthorized", 403);
    next();
  });

export const authMiddleware = { isAuthenticated, isAuthorized };
