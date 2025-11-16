import multer from "multer";
import path from "path";
import fs from "fs";

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

// Configure storage with dynamic folder creation
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      const productName = req.body.name;
      if (!productName) {
        return cb(new Error("Product name is required to create folder"), null);
      }

      const productSlug = createSlug(productName);
      
      const PUBLIC_HTML_PATH = "/home/olisknns/public_html";

      const productFolder = path.join(
        PUBLIC_HTML_PATH,
        "uploads",
        "products",
        productSlug
      );
      ensureUploadDir(productFolder);
      cb(null, productFolder);
    } catch (error) {
      cb(error, null);
    }
  },
  filename: (req, file, cb) => {
    try {
      const productName = req.body.name;
      const productSlug = createSlug(productName);

      let filename;

      if (file.fieldname === "image") {
        const fileExtension = path.extname(file.originalname);
        filename = `main${fileExtension}`;
      } else if (file.fieldname === "other_images") {
        const fileCount = req.fileCount || { other_images: 0 };
        const fileExtension = path.extname(file.originalname);
        req.fileCount = {
          ...req.fileCount,
          other_images: (fileCount.other_images || 0) + 1
        };
        filename = `sub-${req.fileCount.other_images}${fileExtension}`;
      } else {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const fileExtension = path.extname(file.originalname);
        filename = file.fieldname + "-" + uniqueSuffix + fileExtension;
      }

      cb(null, filename);
    } catch (error) {
      cb(error, null);
    }
  },
});

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

// Custom middleware to handle both files and fields
const handleProductUpload = (req, res, next) => {
  req.fileCount = { other_images: 0 };

  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "other_images", maxCount: 3 }
  ])(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    try {
      const productName = req.body.name;
      const productSlug = createSlug(productName);

      if (req.files?.image?.[0]) {
        req.body.image_url = `/upload/products/${productSlug}/main${path.extname(req.files.image[0].originalname)}`;
      }

      if (req.files?.other_images) {
        req.body.other_images_urls = req.files.other_images.map((file, index) => {
          const fileNumber = index + 1;
          return `/upload/products/${productSlug}/sub-${fileNumber}${path.extname(file.originalname)}`;
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error processing uploaded files",
      });
    }
  });
};

export default handleProductUpload;
