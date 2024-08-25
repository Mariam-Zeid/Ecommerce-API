import { Brand } from "../../../db/index.models.js";
import { messages } from "../../utils/constants/messages.js";
import { AppError } from "../../utils/error-handling.js";
import { uploadFile } from "../../utils/file-helper.js";

const addBrand = async (req, res) => {
  const { name } = req.body;

  // Upload file and get publicId and secureUrl
  const { publicId, secureUrl } = await uploadFile(req.file.path, {
    folder: "Ecommerce/brands",
  });
  const newBrand = new Brand({
    name,
    logo: {
      publicId,
      secureUrl,
    },
    createdBy: req.user.id,
  });
  const createdBrand = await newBrand.save();
  if (!createdBrand) {
    req.failImg = publicId;
    throw new AppError(messages("Brand").failure.create, 500);
  }
  return res.status(201).json({
    status: "success",
    message: messages("Brand").success.create,
    data: createdBrand,
  });
};
const updateBrand = async (req, res) => {
  const { brandSlug } = req.params;
  const { name } = req.body;

  const brand = await Brand.findOne({ slug: brandSlug });

  name && (brand.name = name);
  if (req.file) {
    const { publicId, secureUrl } = await uploadFile(req.file.path, {
      public_id: brand.logo.publicId,
    });
    brand.logo = { publicId, secureUrl };
  }

  const updatedBrand = await brand.save();
  if (!updatedBrand) {
    req.failImg = brand.logo.publicId;
    throw new AppError(messages("Brand").failure.update, 500);
  }

  return res.status(200).json({
    status: "success",
    message: messages("Brand").success.update,
    data: updatedBrand,
  });
};

export const brandControllers = { addBrand, updateBrand };
