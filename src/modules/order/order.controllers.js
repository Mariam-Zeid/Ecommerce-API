import Stripe from "stripe";
import { Cart, Coupon, Order, Product } from "../../../db/index.models.js";
import { messages } from "../../utils/constants/messages.js";
import { AppError } from "../../utils/error-handling.js";
import {
  discountTypes,
  orderStatuses,
  paymentMethods,
} from "../../utils/constants/enums.js";

const addOrder = async (req, res) => {
  const { city, street, phone, paymentMethod, couponCode } = req.body;

  const { id: userId } = req.user;

  // Check if the user's cart exists
  const cart = await Cart.findOne({ user: userId })
    .populate("products.product")
    .lean();

  if (!cart) {
    throw new AppError(messages("Cart").failure.notFound, 400);
  }

  // Initialize coupon if applicable
  let couponExists = null;
  let discount = 0;
  if (couponCode) {
    couponExists = await Coupon.findOne({ code: couponCode }).lean();
    if (!couponExists)
      throw new AppError(messages("Coupon").failure.notFound, 400);

    if (couponExists.expiryDate < Date.now())
      throw new AppError("Coupon expired", 400);

    let userAssignment = couponExists.assignedTo.find(
      (assignment) => assignment.userId.toString() === userId
    );

    if (!userAssignment) {
      await Coupon.updateOne(
        { code: couponCode },
        { $push: { assignedTo: { userId, useCount: 0 } } }
      );
      userAssignment = { userId, useCount: 0 };
    }

    if (userAssignment.useCount >= 5) {
      throw new AppError("Coupon reached max usage for this user", 400);
    }

    discount = couponExists.discount;
  }

  // Prepare order products from cart items
  let totalPrice = 0;
  const orderProducts = cart.products.map((cartItem) => {
    const { _id, name, price, priceAfterDiscount, stock } = cartItem.product;

    // Ensure stock is sufficient
    if (stock < cartItem.quantity) {
      throw new AppError(`Not enough stock for product: ${name}`, 400);
    }

    // Ensure that discountedPrice is set
    const discountedPrice = priceAfterDiscount || price;

    totalPrice += discountedPrice * cartItem.quantity;

    // array of order products
    return {
      product: _id,
      name: name,
      price: price,
      discountedPrice: discountedPrice, // Ensure this is always set
      quantity: cartItem.quantity,
    };
  });

  // Calculate priceAfterDiscount based on coupon
  let priceAfterDiscount = totalPrice;
  if (couponExists) {
    if (couponExists.couponType === discountTypes.FIXED) {
      priceAfterDiscount = totalPrice - discount;
    } else {
      priceAfterDiscount = totalPrice - (totalPrice * discount) / 100;
    }
  }

  // Create a new order
  const order = new Order({
    user: req.user.id,
    address: { city, street, phone },
    products: orderProducts,
    totalPrice,
    priceAfterDiscount,
    paymentMethod,
    coupon: couponExists
      ? {
          couponId: couponExists._id,
          code: couponCode,
          discount: discount,
        }
      : null,
  });

  const createdOrder = await order.save();

  if (createdOrder.paymentMethod === paymentMethods.CASH) {
    // Clear the user's cart
    await Cart.updateOne({ user: req.user.id }, { $set: { products: [] } });

    // Update product stock using bulkWrite
    const bulkOps = orderProducts.map((product) => ({
      updateOne: {
        filter: { _id: product.product },
        update: { $inc: { stock: -product.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOps);

    // update order status to PROCESSING
    await Order.updateOne(
      { _id: createdOrder._id },
      { $set: { status: orderStatuses.PROCESSING } }
    );

    if (couponExists) {
      // increment coupon use count
      await Coupon.updateOne(
        { code: couponCode, "assignedTo.userId": userId },
        { $inc: { "assignedTo.$.useCount": 1 } }
      );
    }
  }

  if (createdOrder.paymentMethod === paymentMethods.CARD) {
    // integrate with stripe
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const checkout = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      metadata: {
        orderId: createdOrder._id.toString(),
      },
      line_items: orderProducts.map((product) => {
        return {
          price_data: {
            currency: "egp",
            product_data: {
              name: product.name,
            },
            unit_amount: product.discountedPrice * 100, // for decimals
          },
          quantity: product.quantity,
        };
      }),
      success_url: `${process.env.CLIENT_SUCCESS_URL}`,
      cancel_url: `${process.env.CLIENT_CANCELED_URL}`,
    });

    return res.status(200).json({
      status: "success",
      message: messages("Order").success.create,
      url: checkout.url,
      data: {
        order,
      },
    });
  }

  // Send response
  return res.status(200).json({
    status: "success",
    data: { order },
  });
};

// ! DEPRECATED
/*
const addOrder = async (req, res) => {
  const { city, street, phone, paymentMethod, couponCode } = req.body;

  let couponExists;
  // check coupon
  if (couponCode) {
    couponExists = await Coupon.findOne({ code: couponCode });
    if (!couponExists) {
      throw new AppError(messages("Coupon").failure.notFound, 400);
    }
  }

  // check on cart
  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    throw new AppError(messages("Cart").failure.notFound, 400);
  }

  let orderPrice = 0;
  let finalPrice = 0;
  let orderProducts = [];
  // check if product still exists
  const cartProducts = cart.products;
  for (const product of cartProducts) {
    const productExists = await Product.findById(product.product);
    if (!productExists) {
      throw new AppError(messages("Product").failure.notFound, 400);
    }

    orderPrice += product.quantity * productExists.priceAfterDiscount;

    orderProducts.push({
      product: productExists._id,
      name: productExists.name,
      price: productExists.price,
      discountedPrice: productExists.priceAfterDiscount,
      quantity: product.quantity,
    });
  }

  // check discount type
  couponExists?.discountType === discountTypes.FIXED
    ? (finalPrice = orderPrice - couponExists?.discount)
    : (finalPrice = orderPrice - (orderPrice * couponExists?.discount) / 100);

  // create order
  const order = new Order({
    user: req.user.id,
    address: {
      city,
      street,
      phone,
    },
    products: orderProducts,
    paymentMethod,
    coupon:
      {
        couponId: couponExists?._id,
        code: couponCode,
        discount: couponExists?.discount,
      } || null,
    totalPrice: orderPrice,
    priceAfterDiscount: finalPrice,
  });

  await order.save();

  // delete cart
  await Cart.findOneAndUpdate(
    { user: req.user.id },
    { $set: { products: [] } },
    { new: true }
  );

  // update product stock
  for (const product of order.products) {
    await Product.findOneAndUpdate(
      { _id: product.product },
      { $inc: { stock: -product.quantity } },
      { new: true }
    );
  }

  return res.status(200).json({
    status: "success",
    data: {
      order,
    },
  });
};*/

export const orderControllers = { addOrder };
