import { Category, Subcategory } from "../../../db/index.models.js";
import { messages } from "../../utils/constants/messages.js";
import { AppError } from "../../utils/error-handling.js";
import { uploadFile } from "../../utils/file-helper.js";

export const addSubCategory = async (req, res) => {
  const { name } = req.body;
  const { categorySlug } = req.params;

  // find category
  const category = await Category.findOne({ slug: categorySlug });

  // Upload file and get publicId and secureUrl
  const { publicId, secureUrl } = await uploadFile(req.file.path, {
    folder: "Ecommerce/subcategories",
  });
  const newSubCategory = new Subcategory({
    name,
    image: {
      publicId,
      secureUrl,
    },
    category: category._id,
  });
  const createdSubCategory = await newSubCategory.save();
  if (!createdSubCategory) {
    req.failImg = publicId;
    throw new AppError(messages("SubCategory").failure.create, 500);
  }
  return res.status(201).json({
    status: "success",
    message: messages("SubCategory").success.create,
    data: createdSubCategory,
  });
};
export const updateSubCategory = async (req, res) => {
  const { subcategorySlug } = req.params;
  const { name } = req.body;

  const subcategory = await Subcategory.findOne({ slug: subcategorySlug });

  name && (subcategory.name = name);

  if (req.file) {
    const { publicId, secureUrl } = await uploadFile(req.file.path, {
      public_id: subcategory.image.publicId,
    });
    subcategory.image = { publicId, secureUrl };
  }

  const updatedCategory = await subcategory.save();
  if (!updatedCategory) {
    req.failImg = subcategory.image.publicId;
    throw new AppError(messages("SubCategory").failure.update, 500);
  }

  return res.status(200).json({
    status: "success",
    message: messages("SubCategory").success.update,
    data: updatedCategory,
  });
};