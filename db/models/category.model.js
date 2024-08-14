import { model, Schema } from "mongoose";
import slugify from "slugify";
import Subcategory from "./subcategory.model.js";
import { deleteFile } from "../../src/utils/file-helper.js";
import Product from "./product.model.js";

// schema
const categorySchema = new Schema(
  {
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
    image: {
      type: Object,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: false, // todo true
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// virtuals
categorySchema.virtual("subcategories", {
  ref: "Subcategory",
  localField: "_id",
  foreignField: "category",
});

// generate slug
categorySchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Delete all subcategories and products associated with the category
categorySchema.pre("findOneAndDelete", async function (next) {
  // extract the _id of the category that is being queried for deletion
  const categorySlug = this.getQuery().slug;

  // Find the category to get its image path
  const category = await this.model.findOne({ slug: categorySlug });

  // Find subcategories belonging to the category
  const subcategories = await Subcategory.find({ category });

  // Find products belonging to the subcategories
  const products = await Product.find({
    subcategory: { $in: subcategories.map((subcategory) => subcategory._id) },
  });

  // Delete the category's image if it exists
  if (category.image && category.image.publicId) {
    await deleteFile(category.image.publicId);
  }

  // Delete files associated with subcategories
  subcategories.forEach(async (subCategory) => {
    await deleteFile(subCategory.image.publicId);
  });

  // Delete files associated with products
  products.forEach(async (product) => {
    await deleteFile(product.coverImage.publicId);

    product.images.forEach(async (image) => {
      await deleteFile(image.publicId);
    });
  });

  // Delete products from the database
  await Product.deleteMany({
    subcategory: { $in: subcategories.map((subcategory) => subcategory._id) },
  });

  // Delete subcategories from the database
  await Subcategory.deleteMany({ category });

  next();
});

// model
const Category = model("Category", categorySchema);
export default Category;
