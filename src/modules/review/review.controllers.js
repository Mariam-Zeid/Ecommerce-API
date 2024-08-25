import { Product, Review } from "../../../db/index.models.js";
import { messages } from "../../utils/constants/messages.js";

const addReview = async (req, res) => {
  const { comment, rating } = req.body;
  const { productSlug } = req.params;
  const product = await Product.findOne({ slug: productSlug });
  const review = new Review({
    user: req.user.id,
    product: product._id,
    comment,
    rating,
  });

  const createdReview = await review.save();

  // update product rating
  const productRatings = await Review.find({ product: product._id }).select(
    "rating -_id"
  );
  console.log(productRatings);

  const avgRating =
    productRatings.reduce((acc, curr) => acc + curr.rating, 0) /
    productRatings.length;

  await Product.findByIdAndUpdate({ _id: product._id }, { rate: avgRating });

  return res.status(201).json({
    status: "success",
    message: messages("Review").success.create,
    data: createdReview,
  });
};
const deleteReview = async (req, res) => {
  const { reviewId } = req.params;
  await Review.findOne({ _id: reviewId, user: req.user.id }).deleteOne();

  return res.status(200).json({
    status: "success",
    message: messages("Review").success.delete,
  });
};
export const reviewControllers = { addReview, deleteReview };
