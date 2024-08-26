import { model, Schema } from "mongoose";
import {
  discountTypes,
  orderStatuses,
  paymentMethods,
} from "../../src/utils/constants/enums.js";
import Coupon from "./coupon.model.js";

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    address: {
      city: String,
      street: String,
      phone: String,
    },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        discountedPrice: { type: Number, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    totalPrice: {
      type: Number,
    },
    priceAfterDiscount: {
      type: Number,
    },
    shippingAddress: {
      city: String,
      street: String,
      phone: String,
    },
    paymentMethod: {
      type: String,
      enum: Object.values(paymentMethods),
      default: paymentMethods.CASH,
    },
    status: {
      type: String,
      enum: Object.values(orderStatuses),
      default: orderStatuses.PENDING,
    },
    coupon: {
      couponId: {
        type: Schema.Types.ObjectId,
        ref: "Coupon",
      },
      code: {
        type: String,
      },
      discount: {
        type: Number,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Order = model("Order", orderSchema);
export default Order;
