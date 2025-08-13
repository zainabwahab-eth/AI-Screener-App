const { cloudinary } = require("../config/cloudinary");

exports.getOptimizedImageUrl = (publicId, options = {}) => {
  return cloudinary.url(publicId, {
    transformation: [
      {
        width: options.width || 200,
        height: options.height || 200,
        crop: options.crop || "fill", // maintains aspect ratio
        gravity: "auto",
        fetch_format: "auto", // f_auto
        quality: "auto", // q_auto
      },
    ],
  });
};
