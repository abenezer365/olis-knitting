import cloudinary from "../config/cloudinary.config.js";

const uploadCloudinary = async (req, res, next) => {
  try {
    if (!req.file) return next();

    const fileBuffer = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(fileBuffer, {
      folder: "olis",
      resource_type: "image",
    });

    req.body.image_url = result.secure_url;
    next();

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error uploading to Cloudinary",
      error: error.message,
    });
  }
};

export default uploadCloudinary