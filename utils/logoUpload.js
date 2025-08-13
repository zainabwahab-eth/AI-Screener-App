const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { cloudinary } = require("./../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "company_logos",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const logoFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new AppError("Only image files are allowed", 400), false);
  }
};

const logoUpload = multer({
  storage,
  fileFilter: logoFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, //2mb
  },
});

module.exports = logoUpload;
