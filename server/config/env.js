import dotenv from "dotenv";

dotenv.config();

const NODE_ENV = process.env.NODE_ENV || "development";
const isProd = NODE_ENV === "production";

const missing = [];
const require = (key, fallback) => {
  const value = process.env[key] ?? fallback;
  if (value === undefined || value === "") missing.push(key);
  return value;
};

const env = {
  nodeEnv: NODE_ENV,
  isProd,
  isDev: NODE_ENV === "development",
  port: parseInt(process.env.PORT || "5000", 10),

  jwtSecret: require("JWT_SECRET"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",

  db: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306", 10),
    user: require("DB_USER"),
    password: process.env.DB_PASSWORD || "",
    database: require("DB_NAME"),
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || "10", 10),
  },

  // Comma-separated list of allowed browser origins. Empty list = allow all (dev only).
  corsOrigins: (process.env.CORS_ORIGINS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),

  mail: {
    user: process.env.EMAIL || "",
    pass: process.env.PASSWORD || "",
    from: process.env.MAIL_FROM || `"Oli's Knitwear" <${process.env.EMAIL || "no-reply@olisknitwear.com"}>`,
  },

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
    apiKey: process.env.CLOUDINARY_API_KEY || "",
    apiSecret: process.env.CLOUDINARY_API_SECRET || "",
    folder: process.env.CLOUDINARY_FOLDER || "olis-knitwear/products",
  },

  appUrl: process.env.APP_URL || "https://olisknitwear.com",
};

// Fail fast: required secrets/credentials must be present before the app boots.
if (missing.length > 0) {
  const message = `Missing required environment variables: ${missing.join(", ")}`;
  if (isProd) {
    throw new Error(message);
  } else {
    console.warn(`⚠️  ${message} (continuing in ${NODE_ENV})`);
  }
}

export default env;
