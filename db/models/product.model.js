import { model, Schema } from "mongoose";
import slugify from "slugify";

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
      required: true,
      min: 0,
      max: 100,
    },
    colors: {
      type: [String],
      // required: true,
    },
    sizes: {
      type: [String],
    },
    stock: {
      type: Number,
      // required: true,
      default: 1,
      min: 0,
    },
    rate: {
      type: Number,
      // required: true,
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
      required: false, // todo true
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false, // todo true
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// virtuals
productSchema.virtual("priceAfterDiscount").get(function () {
  return this.price - (this.price * (this.discount || 0)) / 100;
});

// generate slug
productSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// model
const Product = model("Product", productSchema);
export default Product;
