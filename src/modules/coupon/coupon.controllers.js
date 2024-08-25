import { Coupon } from "../../../db/index.models.js";
import { discountTypes } from "../../utils/constants/enums.js";
import { messages } from "../../utils/constants/messages.js";
import { AppError } from "../../utils/error-handling.js";

const createCoupon = async (req, res) => {
  const { code, discount, couponType, startDate, expiryDate } = req.body;

  // check type of coupon
  if (couponType === discountTypes.PERCENTAGE && discount > 100) {
    throw new AppError("Discount cannot be greater than 100", 400);
  }

  // create coupon
  const coupon = await Coupon.create({
    code,
    discount,
    couponType,
    startDate,
    expiryDate,
    assignedTo: [],
    createdBy: req.user.id,
  });

  return res.status(201).json({
    status: "success",
    message: messages("Coupon").success.create,
    coupon,
  });
};

export const couponControllers = { createCoupon };
