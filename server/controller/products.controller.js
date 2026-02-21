import connection from "../config/database.config.js";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";

// Add product controller
export async function addProduct(req, res) {
  console.log(req.body)
  const { name, description, price, rating, category_id, available_sizes, available_colors } = req.body;
  const imageUrl = req.body.image_url;
  const otherImagesUrls = req.body.other_images_urls || [];

  if (!name || !price || !category_id || !imageUrl || !available_sizes || !available_colors) {
    return res.status(400).json({
      success: false,
      message: "Please provide name, price, category, and image",
    });
  }

  try {
    const productUuid = uuidv4();

    // Helper to parse comma-separated or JSON strings
    const parseField = (field) => {
      if (!field) return [];
      try {
        // If it's already an array (shouldn't happen with FormData but good for safety)
        if (Array.isArray(field)) return field;
        // Try parsing as JSON (e.g. '["XL", "L"]')
        const parsed = JSON.parse(field);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch (e) {
        // Fallback to comma-separated string (e.g. 'XL, L')
        return typeof field === 'string'
          ? field.split(',').map(item => item.trim()).filter(item => item !== '')
          : [];
      }
    };

    const colorsArray = parseField(available_colors);
    const sizesArray = parseField(available_sizes);

    // Insert product with other_images as JSON
    await connection.execute(
      `INSERT INTO products (uuid, category_id, name, description, price, rating, image, other_images, available_colors, available_sizes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        productUuid,
        category_id,
        name,
        description || null,
        price,
        rating,
        imageUrl,
        JSON.stringify(otherImagesUrls),
        JSON.stringify(colorsArray),
        JSON.stringify(sizesArray)
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Product added successfully ✅",
      product_uuid: productUuid,
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "Error adding product",
      error: error.message,
    });
  }
}

// Edit product controller
export async function editProduct(req, res) {
  const { id } = req.params;
  const { name, description, price, category_id, available_sizes, available_colors } = req.body;
  try {
    const [existing] = await connection.execute(
      "SELECT * FROM products WHERE id = ?",
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Convert comma-separated strings to arrays and then to JSON
    const colorsArray = available_colors.split(',').map(color => color.trim());
    const sizesArray = available_sizes.split(',').map(size => size.trim());

    await connection.execute(
      `UPDATE products 
       SET name = ?, description = ?, price = ?, category_id = ?, updated_at = NOW(), available_sizes = ?, available_colors = ? 
       WHERE id = ?`,
      [
        name || existing[0].name,
        description || existing[0].description,
        price || existing[0].price,
        category_id || existing[0].category_id,
        JSON.stringify(sizesArray),
        JSON.stringify(colorsArray),
        id
      ]
    );

    return res.status(200).json({
      success: true,
      message: "Product updated successfully ✅",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating product",
      error: error.message,
    });
  }
}

// Get all products controller
export async function getAllProducts(req, res) {
  try {
    const [rows] = await connection.execute(
      `SELECT p.*, c.name AS category_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       ORDER BY p.created_at DESC`
    );

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully ✅",
      products: rows,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
}

// Get single product
export async function getSingleProduct(req, res) {
  const { id } = req.params;

  try {
    const [rows] = await connection.execute(
      `SELECT p.*, c.name AS category_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }


    return res.status(200).json({
      success: true,
      product: rows,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching product",
      error: error.message,
    });
  }
}

// Delete product controller
export async function deleteProduct(req, res) {
  const { id } = req.params;

  try {
    // 1. Get product from database
    const [existing] = await connection.execute(
      "SELECT * FROM products WHERE id = ?",
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const product = existing[0];

    // 2. Extract folder name from image URL and delete folder
    await deleteProductFolder(product);

    // 3. Delete from database
    await connection.execute("DELETE FROM products WHERE id = ?", [id]);

    return res.status(200).json({
      success: true,
      message: "Product and all images deleted successfully ✅",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting product",
      error: error.message,
    });
  }
}

// Helper function to delete product folder
async function deleteProductFolder(product) {
  try {
    // Method 1: Extract from image URL (most reliable)
    let folderName = null;

    if (product.image) {
      // Extract folder name from image URL: "/upload/products/winter-wool-sweater/main.jpg"
      const urlParts = product.image.split('/');
      if (urlParts.length >= 4) {
        folderName = urlParts[3]; // "winter-wool-sweater"
      }
    }

    // Method 2: If URL extraction fails, create slug from product name
    if (!folderName && product.name) {
      folderName = createSlug(product.name);
    }

    if (folderName) {
      const productFolder = path.join(process.cwd(), "upload", "products", folderName);

      // Check if folder exists and delete it
      if (fs.existsSync(productFolder)) {
        fs.rmSync(productFolder, { recursive: true, force: true });
        console.log(`🗑️ Deleted product folder: ${productFolder}`);
        return true;
      } else {
        console.log(`ℹ️ Product folder not found: ${productFolder}`);
        return false;
      }
    } else {
      console.log("⚠️ Could not determine product folder name");
      return false;
    }
  } catch (error) {
    console.error("Error deleting product folder:", error);
    return false;
  }
}

// Reuse the same slug function from your upload middleware
const createSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};