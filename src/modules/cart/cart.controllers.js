import { Cart, Product } from "../../../db/index.models.js";
import { messages } from "../../utils/constants/messages.js";
import { AppError } from "../../utils/error-handling.js";

const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  let message = messages("Cart").success.update;

  // for stock check
  const productExists = await Product.findById(productId);
  if (productExists.stock < quantity) {
    throw new AppError("Not enough stock", 400);
  }

  // for cart check
  const porductInCart = await Cart.findOneAndUpdate(
    {
      user: req.user.id,
      "products.product": productId,
    },
    {
      $set: { "products.$.quantity": quantity },
    },
    {
      new: true,
    }
  );

  let newProductInCart;
  if (!porductInCart) {
    newProductInCart = await Cart.findOneAndUpdate(
      {
        user: req.user.id,
      },
      {
        $push: {
          products: {
            product: productId,
            quantity,
          },
        },
      },
      {
        new: true,
      }
    );
    message = "Product added to cart";
  }

  return res.status(200).json({
    status: "success",
    message,
    data: porductInCart || newProductInCart,
  });
};

const getCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id })
    .populate("products.product")
    .lean(); // Use lean to return plain JavaScript objects

  // Merge quantity into the populated product object
  const productsWithQuantity = cart.products.map((item) => ({
    ...item.product,
    quantity: item.quantity,
  }));

  return res.status(200).json({
    status: "success",
    data: {
      products: productsWithQuantity,
    },
  });
};

const removeFromCart = async (req, res) => {
  const { productId } = req.params;
  const cart = await Cart.findOneAndUpdate(
    {
      user: req.user.id,
      "products.product": productId,
    },
    {
      $pull: { products: { product: productId } },
    },
    {
      new: true,
    }
  );
  return res.status(200).json({
    status: "success",
    message: "Product removed from cart",
    data: cart,
  });
};

export const cartControllers = { addToCart, getCart, removeFromCart };
