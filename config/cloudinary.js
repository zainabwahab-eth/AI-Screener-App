const dotenv = require("dotenv");
const cloudinary = require("cloudinary").v2;

dotenv.config({ path: "./config.env" });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadToCloudinary(file) {
  const extension = file.originalname.split(".").pop().toLowerCase();
  const publicId = `${file.originalname.split(".")[0]}_${Date.now()}.${extension}`;

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "resumes",
        resource_type: "raw",
        access_mode: "public",
        public_id: publicId,
      },
      (error, result) => {
        if (error) {
          reject(new AppError(`Failed to upload resume: ${error.message}`, 400));
        } else {
          resolve(result);
        }
      }
    );
    uploadStream.end(file.buffer);
  });
}


async function cleanupCloudinaryFile(publicId) {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
    console.log("Cleaned up uploaded file from Cloudinary");
  } catch (err) {
    console.error("Failed to cleanup file:", err.message);
  }
}

module.exports = { cloudinary, uploadToCloudinary, cleanupCloudinaryFile };
