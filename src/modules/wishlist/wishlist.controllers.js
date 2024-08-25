import { User } from "../../../db/index.models.js";

const addToWishlist = async (req, res) => {
  const { productId } = req.body;
  const wishlist = await User.findByIdAndUpdate(
    req.user.id,
    { $addToSet: { wishlist: productId } },
    {
      new: true,
    }
  ).select("wishlist -_id");

  return res.status(200).json({
    status: "success",
    message: "Product added to wishlist",
    data: wishlist,
  });
};

const getWishlist = async (req, res) => {
  const wishlist = await User.findById(req.user.id)
    .select("wishlist -_id")
    .populate("wishlist");
  return res.status(200).json({
    status: "success",
    message: "Wishlist fetched successfully",
    data: wishlist,
  });
};

const removeFromWishlist = async (req, res) => {
  const { productId } = req.params;
  const wishlist = await User.findByIdAndUpdate(
    req.user.id,
    { $pull: { wishlist: productId } },
    {
      new: true,
    }
  ).select("wishlist -_id");
  return res.status(200).json({
    status: "success",
    message: "Product removed from wishlist",
    data: wishlist,
  });
};
export const wishlistControllers = {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
};
