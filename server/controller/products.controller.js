import connection from "../config/database.config.js";
import { v4 as uuidv4 } from "uuid";

// Add product controller
export async function addProduct(req, res) {
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

    // Convert comma-separated strings to arrays and then to JSON
    const colorsArray = available_colors.split(',').map(color => color.trim());
    const sizesArray = available_sizes.split(',').map(size => size.trim());

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
// Change image controller
export async function changeImage(req, res) {
  const { id } = req.body;
  const imageUrl = req.body.image_url;

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