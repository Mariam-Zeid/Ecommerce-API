import { Cart, Coupon, Order, Product } from "../../../db/index.models.js";
import { messages } from "../../utils/constants/messages.js";
import { AppError } from "../../utils/error-handling.js";

const addOrder = async (req, res) => {
  const { city, street, phone, paymentMethod, couponCode } = req.body;

  // Check if the user's cart exists
  const cart = await Cart.findOne({ user: req.user.id })
    .populate("products.product")
    .lean();
  if (!cart || cart.products.length === 0) {
    throw new AppError(messages("Cart").failure.notFound, 400);
  }

  // Initialize coupon if applicable
  let couponExists = null;
  if (couponCode) {
    couponExists = await Coupon.findOne({ code: couponCode }).lean();
    if (!couponExists) {
      throw new AppError(messages("Coupon").failure.notFound, 400);
    }
  }

  // Prepare order products from cart items
  const orderProducts = cart.products.map((cartItem) => {
    const { _id, name, price, priceAfterDiscount } = cartItem.product;

    // Ensure that discountedPrice is set
    const discountedPrice = priceAfterDiscount || price;

    // array of order products
    return {
      product: _id,
      name: name,
      price: price,
      discountedPrice: discountedPrice, // Ensure this is always set
      quantity: cartItem.quantity,
    };
  });

  // Create a new order
  const order = new Order({
    user: req.user.id,
    address: { city, street, phone },
    products: orderProducts,
    paymentMethod,
    coupon: couponExists
      ? {
          couponId: couponExists._id,
          code: couponCode,
          discount: couponExists.discount,
          discountType: couponExists.discountType, // Ensure that discountType is included in the coupon
        }
      : null,
  });

  await order.save();

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
