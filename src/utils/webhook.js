import Stripe from "stripe";
import { asyncErrorHandler } from "./error-handling.js";
import { Cart, Order } from "../../db/index.models.js";
import { orderStatuses } from "./constants/enums.js";
// import { Cart, Order, Product } from "../../db/index.js";

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
  }
  return res.status(200).json({ status: "success", message: "received" });
});
