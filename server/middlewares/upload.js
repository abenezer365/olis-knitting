import multer from "multer";
import createSlug from "../utils/slug.js";
import {
  uploadBuffer,
  productFolder,
  isCloudinaryConfigured,
} from "../utils/cloudinaryUpload.js";

// Files are held in memory then streamed to Cloudinary — no disk writes, so the
// container stays stateless and image storage survives redeploys.
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"), false);
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

const parseFields = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "other_images", maxCount: 3 },
]);

const handleProductUpload = (req, res, next) => {
  parseFields(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    if (!isCloudinaryConfigured) {
      return res.status(503).json({
        success: false,
        message: "Image storage (Cloudinary) is not configured on the server.",
      });
    }

    const productName = req.body.name;
    if (!productName) {
      return res.status(400).json({
        success: false,
        message: "Product name is required to upload images.",
      });
    }

    try {
      const slug = createSlug(productName);
      const folder = productFolder(slug);

      const mainFile = req.files?.image?.[0];
      if (mainFile) {
        const result = await uploadBuffer(mainFile.buffer, {
          publicId: `${folder}/main`,
        });
        req.body.image_url = result.secure_url;
      }

      const others = req.files?.other_images || [];
      if (others.length > 0) {
        const results = await Promise.all(
          others.map((file, index) =>
            uploadBuffer(file.buffer, { publicId: `${folder}/sub-${index + 1}` })
          )
        );
        req.body.other_images_urls = results.map((r) => r.secure_url);
      }

      next();
    } catch (error) {
      console.error("Image upload failed:", error.message);
      return res.status(502).json({
        success: false,
        message: "Failed to upload product images. Please try again.",
      });
    }
  });
};

export default handleProductUpload;
