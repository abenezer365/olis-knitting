import cloudinary from "../config/cloudinary.config.js";

const uploadCloudinary = async (req, res, next) => {
  try {
    // Handle main image from fields
    if (req.files && req.files.image) {
      const file = req.files.image[0];
      const fileBuffer = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
      const result = await cloudinary.uploader.upload(fileBuffer, {
        folder: "olis",
        resource_type: "image",
      });
      req.body.image_url = result.secure_url;
    }

    // Handle multiple other images
    if (req.files && req.files.other_images) {
      const otherImagesUrls = [];
      
      for (const file of req.files.other_images) {
        const fileBuffer = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
        const result = await cloudinary.uploader.upload(fileBuffer, {
          folder: "olis",
          resource_type: "image",
        });
        otherImagesUrls.push(result.secure_url);
      }
      
      req.body.other_images_urls = otherImagesUrls;
    }

    next();

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error uploading to Cloudinary",
      error: error.message,
    });
  }
};

export default uploadCloudinary;