import multer from "multer";

// Store the file temporarily in memory
const storage = multer.memoryStorage();

const uploadMultar = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
});

export default uploadMultar;
