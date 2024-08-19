import { Category, Product, Subcategory } from "../../../db/index.models.js";
import { messages } from "../../utils/constants/messages.js";
import { AppError } from "../../utils/error-handling.js";
import { uploadFile } from "../../utils/file-helper.js";

const addProduct = async (req, res) => {
  let { name, description, price, discount, colors, sizes, stock, brand } =
    req.body;

  const failImgs = [];

  // prepare data
  if (colors) colors = JSON.parse(colors);
  if (sizes) sizes = JSON.parse(sizes);

  // cover image
  const { publicId: coverImagePublicId, secureUrl: coverImageUrl } =
    await uploadFile(req.files.file[0].path, {
      folder: "Ecommerce/products/coverImages",
    });
  failImgs.push(coverImagePublicId);
  req.body.coverImage = {
    publicId: coverImagePublicId,
    secureUrl: coverImageUrl,
  };

  // images
  const imageUploadPromises = req.files.files.map(async (file) => {
    const { publicId, secureUrl } = await uploadFile(file.path, {
      folder: "Ecommerce/products/images",
    });

    failImgs.push(publicId);
    return { secureUrl, publicId };
  });

  req.body.images = await Promise.all(imageUploadPromises);

  const category = await Category.findOne({ slug: req.params.categorySlug });
  const subcategory = await Subcategory.findOne({
    slug: req.params.subcategorySlug,
  });

  const newProduct = new Product({
    name,
    description,
    coverImage: req.body.coverImage,
    images: req.body.images,
    price,
    discount,
    colors,
    sizes,
    stock,
    category: category._id,
    subcategory: subcategory._id,
    brand,
  });

  const createdProduct = await newProduct.save();

  if (!createdProduct) {
    req.failImgs = failImgs;
    throw new AppError(messages("Product").failure.create, 500);
  }

  // send response
  return res.status(201).json({
    status: "success",
    message: messages("Product").success.create,
    data: createdProduct,
  });
};

const updateProduct = async (req, res) => {
  const { name, description, price, discount, colors, sizes, stock, brand } =
    req.body;

  const product = await Product.findOne({ slug: req.params.productSlug });

  // prepare data
  if (colors) colors = JSON.parse(colors);
  if (sizes) sizes = JSON.parse(sizes);
  // if (name) product.name = name;
  // if (description) product.description = description;
  // if (price) product.price = price;
  // if (discount) product.discount = discount;
  // if (colors) product.colors = colors;
  // if (sizes) product.sizes = sizes;
  // if (stock) product.stock = stock;
  // if (brand) product.brand = brand;
  // prepare data
  const updates = {
    name,
    description,
    price,
    discount,
    colors,
    sizes,
    stock,
    brand,
  };
  Object.keys(updates).forEach((key) => {
    if (updates[key] !== undefined) {
      product[key] = updates[key];
    }
  });

  // cover image
  if (req.files.file) {
    const { publicId: coverImagePublicId, secureUrl: coverImageUrl } =
      await uploadFile(req.files?.file[0].path, {
        public_id: product.coverImage.publicId,
      });
    product.coverImage = {
      publicId: coverImagePublicId,
      secureUrl: coverImageUrl,
    };
  }

  // images
  const failImgs = [];
  if (req.files.files) {
    const imageUploadPromises = req.files.files.map(async (file, indx) => {
      const { publicId, secureUrl } = await uploadFile(file.path, {
        public_id: product.images[indx].publicId,
      });
      failImgs.push(publicId);
      return { secureUrl, publicId };
    });
    req.body.images = await Promise.all(imageUploadPromises);
  }

  const updatedProduct = await product.save();
  if (!updatedProduct) {
    req.failImgs = [coverImagePublicId, ...req.failImgs];
    throw new AppError(messages("Product").failure.update, 500);
  }

  // send response
  return res.status(200).json({
    status: "success",
    message: messages("Product").success.update,
    data: updatedProduct,
  });
};

export const productControllers = {
  addProduct,
  updateProduct,
};
