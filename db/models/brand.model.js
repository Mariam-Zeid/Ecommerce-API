import { model, Schema } from "mongoose";
import slugify from "slugify";

// schema
const brandSchema = new Schema(
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
    logo: {
      type: Object,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: false, // todo true
      ref: "User",
    },
  },
  { timestamps: true }
);

// generate slug
brandSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// model
const Brand = model("Brand", brandSchema);

export default Brand;
