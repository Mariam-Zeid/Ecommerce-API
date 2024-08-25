import { model, Schema } from "mongoose";
import slugify from "slugify";
import Product from "./product.model.js";
import { deleteFile } from "../../src/utils/file-helper.js";

// schema
const subcategorySchema = new Schema(
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
      required: true,
      ref: "User",
    },
    category: {
      type: Schema.Types.ObjectId,
      // required: true,
      ref: "Category",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// generate slug
subcategorySchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Delete all products associated with the subcategory
subcategorySchema.pre("findOneAndDelete", async function (next) {
  // extract the _id of the subcategory that is being queried for deletion
  const subcategorySlug = this.getQuery().slug;

  // Find the category to get its image path
  const subcategory = await this.model.findOne({ slug: subcategorySlug });

  // Find products belonging to the subcategories
  const products = await Product.find({
    subcategory: subcategory._id,
  });

  // Delete the subcategory's image if it exists
  if (subcategory.image && subcategory.image.publicId) {
    await deleteFile(subcategory.image.publicId);
  }

  // Delete files associated with products
  products.forEach(async (product) => {
    await deleteFile(product.coverImage.publicId);

    product.images.forEach(async (image) => {
      await deleteFile(image.publicId);
    });
  });

  // Delete products from the database
  await Product.deleteMany({
    subcategory: subcategory._id,
  });

  next();
});

// model
const Subcategory = model("Subcategory", subcategorySchema);
export default Subcategory;
