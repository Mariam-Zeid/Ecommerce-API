import { model, Schema } from "mongoose";
import {
  discountTypes,
  orderStatuses,
  paymentMethods,
} from "../../src/utils/constants/enums.js";

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

// to calculate totalPrice and priceAfterDiscount
orderSchema.pre("save", function (next) {
  const order = this;

  // Calculate totalPrice based on products
  order.totalPrice = order.products.reduce((acc, product) => {
    return acc + product.discountedPrice * product.quantity;
  }, 0);

  // Calculate priceAfterDiscount based on coupon
  if (order.coupon && order.coupon.discount) {
    if (order.coupon.discountType === discountTypes.FIXED) {
      order.priceAfterDiscount = order.totalPrice - order.coupon.discount;
    } else {
      order.priceAfterDiscount =
        order.totalPrice - (order.totalPrice * order.coupon.discount) / 100;
    }
  } else {
    order.priceAfterDiscount = order.totalPrice;
  }

  next();
});

const Order = model("Order", orderSchema);
export default Order;
