import { model, Schema } from "mongoose";
import { roles, statuses } from "../../src/utils/constants/enums.js";
import slugify from "slugify";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(roles),
      default: roles.USER,
    },
    status: {
      type: String,
      enum: Object.values(statuses),
      default: statuses.PENDING,
    },
    active: {
      type: Boolean,
      default: false,
    },
    DOB: {
      type: Date,
    },
    image: {
      publicId: {
        type: String,
        default: "blank-profile-picture-973460_1280_tebh1y.webp",
      },
      secureUrl: {
        type: String,
        default:
          "https://res.cloudinary.com/ddrrl0swv/image/upload/v1724057789/blank-profile-picture-973460_1280_tebh1y.webp",
      },
    },
    wishlist: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// generate slug
userSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const User = model("User", userSchema);
export default User;
