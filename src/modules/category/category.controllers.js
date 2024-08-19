import { Category } from "../../../db/index.models.js";
import { messages } from "../../utils/constants/messages.js";
import { uploadFile } from "../../utils/file-helper.js";

const addCategory = async (req, res) => {
  const { name } = req.body;
  // Upload file and get publicId and secureUrl
  const { publicId, secureUrl } = await uploadFile(req.file.path, {
    folder: "Ecommerce/categories",
  });

  const newCategory = new Category({
    name,
    image: {
      publicId,
      secureUrl,
    },
  });

  // save category in db
  const createdCategory = await newCategory.save();

  // check if category is not created
  if (!createdCategory) {
    req.failImg = publicId;
    throw new AppError(messages("Category").failure.create, 500);
  }
  // send response
  return res.status(201).json({
    status: "success",
    message: messages("Category").success.create,
    data: createdCategory,
  });
};
const updateCategory = async (req, res) => {
  const { categorySlug } = req.params;
  const { name } = req.body;

  const category = await Category.findOne({ slug: categorySlug });

  name && (category.name = name);

  if (req.file) {
    const { publicId, secureUrl } = await uploadFile(req.file.path, {
      public_id: category.image.publicId,
    });
    category.image = { publicId, secureUrl };
  }

  const updatedCategory = await category.save();
  if (!updatedCategory) {
    req.failImg = category.image.publicId;
    throw new AppError(messages("Category").failure.update, 500);
  }

  return res.status(200).json({
    status: "success",
    message: messages("Category").success.update,
    data: updatedCategory,
  });
};

export const categoryControllers = { addCategory, updateCategory };
