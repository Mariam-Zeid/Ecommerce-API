import { model, Schema } from "mongoose";
import slugify from "slugify";
import Review from "./review.model.js";
import { deleteFile } from "../../src/utils/file-helper.js";
import { discountTypes } from "../../src/utils/constants/enums.js";

// schema
const productSchema = new Schema(
  {
    // ======== NAME SECTION ========
    name: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    slug: {
      type: String,
      // required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    // ======== IMAGE SECTION ========
    coverImage: {
      type: Object,
      required: true,
    },
    images: {
      type: [Object],
      required: true,
    },
    // ======== DETAILS SECTION ========
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    discountType: {
      type: String,
      enum: Object.values(discountTypes),
      default: discountTypes.NONE,
    },
    colors: {
      type: [String],
    },
    sizes: {
      type: [String],
    },
    stock: {
      type: Number,
      default: 1,
      min: 0,
    },
    rate: {
      type: Number,
      default: 5,
      min: 0,
      max: 5,
    },
    // ======== IDs SECTION ========
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subcategory: {
      type: Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true,
    },
    brand: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// virtuals
productSchema.virtual("priceAfterDiscount").get(function () {
  return this.price - (this.price * (this.discount || 0)) / 100;
});

// Delete all reviews associated with the products
productSchema.pre("findOneAndDelete", async function (next) {
  // extract the _id of the subcategory that is being queried for deletion
  const productSlug = this.getQuery().slug;

  // Find the category to get its image path
  const product = await this.model.findOne({ slug: productSlug });

  // Delete the product's image if it exists
  if (product.coverImage && product.coverImage.publicId) {
    await deleteFile(product.coverImage.publicId);
  }

  // Delete the product's images if it exists
  if (product.images && product.images.length > 0) {
    product.images.forEach(async (image) => {
      await deleteFile(image.publicId);
    });
  }

  // Delete products from the database
  await Review.deleteMany({
    product: product._id,
  });

  next();
});

// generate slug
productSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// model
const Product = model("Product", productSchema);
export default Product;
