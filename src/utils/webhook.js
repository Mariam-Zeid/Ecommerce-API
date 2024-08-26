import Stripe from "stripe";
import { asyncErrorHandler } from "./error-handling.js";
import { Cart, Coupon, Order } from "../../db/index.models.js";
import { orderStatuses } from "./constants/enums.js";

export const webhook = asyncErrorHandler(async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event = Stripe.webhooks.constructEvent(
    req.body,
    sig,
    `${process.env.STRIPE_WEBHOOK_SECRET}`
  );

  if (event.type == "checkout.session.completed") {
    const checkout = event.data.object;
    const { orderId } = checkout.metadata;

    // Clear the user's cart
    await Cart.updateOne({ user: orderExist.user }, { $set: { products: [] } });

    // Update product stock using bulkWrite
    const bulkOps = orderExist.products.map((product) => ({
      updateOne: {
        filter: { _id: product.product },
        update: { $inc: { stock: -product.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOps);

    // update order status to PROCESSING
    const orderExist = await Order.findByIdAndUpdate(
      orderId,
      { status: orderStatuses.PROCESSING },
      { new: true }
    );

    // update coupon usage count
    const couponCode = orderExist.coupon.code;
    const couponExists = await Coupon.findOne({
      code: couponCode,
    });
    if (couponExists) {
      // increment coupon use count
      await Coupon.updateOne(
        { code: couponCode, "assignedTo.userId": userId },
        { $inc: { "assignedTo.$.useCount": 1 } }
      );
    }
  }
  return res.status(200).json({ status: "success", message: "received" });
});
