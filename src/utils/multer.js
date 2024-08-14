import multer, { diskStorage } from "multer";

export const cloudUpload = ({
  allowedFileTypes = ["image/png", "image/jpg", "image/jpeg"],
}) => {
  const storage = diskStorage({});

  return multer({ storage });
};
