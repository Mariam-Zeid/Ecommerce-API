import path from "path";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// Load environment variables from the config folder
dotenv.config({ path: path.resolve("./config/.env") });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
