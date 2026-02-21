import multer from "multer";
import path from "path";
import fs from "fs";
import sharp from "sharp";

// Ensure upload directory exists
const ensureUploadDir = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

// Function to create slug from product name
const createSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Use memory storage to process images with sharp before saving
const storage = multer.memoryStorage();

// Create multer instance
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// Helper to compress and save image
const compressAndSaveImage = async (buffer, folderPath, filename) => {
  const filePath = path.join(folderPath, filename);

  // Ultra high compression: Quality 50 and resize to max 1000px width/height.
  // This aims for ~100KB per image to drastically improve page load speed and UX.
  await sharp(buffer)
    .resize(1000, 1000, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 50, progressive: true, force: false })
    .png({ quality: 50, compressionLevel: 9, palette: true, force: false })
    .webp({ quality: 50, force: false })
    .toFile(filePath);

  return filePath;
};

// Custom middleware to handle both files and fields
const handleProductUpload = (req, res, next) => {
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "other_images", maxCount: 3 }
  ])(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    try {
      if (process.env.NODE_ENV === "development") {
        console.log("Multer processing - Files:", Object.keys(req.files || {}));
      }

      const productName = req.body.name;
      if (!productName) {
        console.log("Missing product name in body");
        return res.status(400).json({
          success: false,
          message: "Product name is required to process images",
        });
      }

      const productSlug = createSlug(productName);

      // Determine base path based on environment
      let productFolder;
      if (process.env.NODE_ENV === "development") {
        // Locally, save inside the 'upload' folder in the project directory
        productFolder = path.join(process.cwd(), "upload", "products", productSlug);
      } else {
        // On cloud servers, use the path from environment variable
        const BASE_PATH = process.env.UPLOAD_BASE_PATH || "/home/olisknns/public_html";
        productFolder = path.join(
          BASE_PATH,
          "uploads",
          "products",
          productSlug
        );
      }

      console.log("Resolved target folder:", productFolder);
      ensureUploadDir(productFolder);

      // Process main image
      if (req.files?.image?.[0]) {
        console.log("Processing 'image' field...");
        const file = req.files.image[0];
        const fileExtension = path.extname(file.originalname);
        const filename = `main${fileExtension}`;

        await compressAndSaveImage(file.buffer, productFolder, filename);

        req.body.image_url = `/upload/products/${productSlug}/${filename}`;
        console.log("Set image_url:", req.body.image_url);
      } else {
        console.log("No file found for field 'image'");
      }

      // Process other images
      if (req.files?.other_images) {
        console.log(`Processing ${req.files.other_images.length} 'other_images'...`);
        req.body.other_images_urls = await Promise.all(
          req.files.other_images.map(async (file, index) => {
            const fileNumber = index + 1;
            const fileExtension = path.extname(file.originalname);
            const filename = `sub-${fileNumber}${fileExtension}`;

            await compressAndSaveImage(file.buffer, productFolder, filename);

            return `/upload/products/${productSlug}/${filename}`;
          })
        );
      }

      next();
    } catch (error) {
      console.error("Image processing error:", error);
      return res.status(500).json({
        success: false,
        message: "Error processing and compressing uploaded images",
        error: error.message
      });
    }
  });
};

export default handleProductUpload;

