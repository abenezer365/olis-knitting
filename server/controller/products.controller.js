import connection from "../config/database.config.js";
import { v4 as uuidv4 } from "uuid";

// Add product controller
export async function addProduct(req, res) {
  const { name, description, price, rating,category_id } = req.body;
  const imageUrl = req.body.image_url;

  if (!name || !price || !category_id || !imageUrl) {
    return res.status(400).json({
      success: false,
      message: "Please provide name, price, category, and image",
    });
  }

  try {
    const productUuid = uuidv4();

    await connection.execute(
      `INSERT INTO products (uuid, category_id, name, description, price, rating,image)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [productUuid, category_id, name, description || null, price, rating,imageUrl]
    );

    return res.status(201).json({
      success: true,
      message: "Product added successfully ✅",
      product_uuid: productUuid,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error adding product",
      error: error.message,
    });
  }
}

//Change image controller
export async function changeImage(req, res) {
  const { id } = req.body;
  const imageUrl = req.body.image_url;
  console.log(id)
  if (!imageUrl) {
    return res.status(400).json({
      success: false,
      message: "No image provided",
    });
  }

  try {
    const [product] = await connection.execute(
      "SELECT * FROM products WHERE id = ?",
      [id]
    );

    if (product.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await connection.execute(
      "UPDATE products SET image = ?, updated_at = NOW() WHERE id = ?",
      [imageUrl, id]
    );

    return res.status(200).json({
      success: true,
      message: "Product image updated successfully ✅",
      image_url: imageUrl,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating image",
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

// Get single products
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
      product: rows[0],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching product",
      error: error.message,
    });
  }
}

// Edit product controller
export async function editProduct(req, res) {
  const { id } = req.params;
  const { name, description, price, category_id } = req.body;

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

    await connection.execute(
      `UPDATE products 
       SET name = ?, description = ?, price = ?, category_id = ?, updated_at = NOW()
       WHERE id = ?`,
      [name || existing[0].name, description || existing[0].description, price || existing[0].price, category_id || existing[0].category_id, id]
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

// Delete prodcut controller
export async function deleteProduct(req, res) {
  const { id } = req.params;

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

    await connection.execute("DELETE FROM products WHERE id = ?", [id]);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully ✅",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting product",
      error: error.message,
    });
  }
}
