import { discountTypes } from "../../src/utils/constants/enums.js";

import { Schema, model } from "mongoose";

const couponSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    couponType: {
      type: String,
      enum: Object.values(discountTypes),
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    assignedTo: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        useCount: {
          type: Number,
          default: 0,
        },
        maxUsage: {
          type: Number,
          required: true,
        },
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Coupon = model("Coupon", couponSchema);
export default Coupon;
