import connection from "../config/database.config.js";
import { v4 as uuidv4 } from "uuid";

// Add new category controller
export const addCategory = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Category name is required" });
  }

  try {
    const uuid = uuidv4();

    const [exists] = await connection.execute(
      "SELECT id FROM categories WHERE name = ?",
      [name]
    );

    if (exists.length > 0) {
      return res.status(409).json({ message: "Category already exists" });
    }

    await connection.execute("INSERT INTO categories (uuid, name) VALUES (?, ?)", [
      uuid,
      name,
    ]);

    res.status(201).json({
      message: "Category added successfully",
      data: { uuid, name },
    });
  } catch (error) {
    console.error("Error adding category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all categories controller
export const getAllCategory = async (req, res) => {
  try {
    const [rows] = await connection.query(
      "SELECT id, uuid, name, created_at, updated_at FROM categories ORDER BY id DESC"
    );

    res.status(200).json({
      message: "Categories fetched successfully",
      total: rows.length,
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// Get all categories fast controller
export const getAllCategoryFast = async (req, res) => {
  try {
    const [rows] = await connection.query(
      "SELECT name FROM categories ORDER BY id DESC"
    );

    // Extract only category names into an array
    const categoryNames = rows.map((cat) => cat.name);

    res.status(200).json({
      message: "Categories fetched successfully",
      categories: categoryNames,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get single category controller
export const getSingleCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await connection.execute(
      "SELECT * FROM categories WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({
      message: "Category fetched successfully",
      data: rows[0],
    });
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Edit category controller
export const editCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Category name is required" });
  }

  try {
    const [exists] = await connection.execute(
      "SELECT id FROM categories WHERE id = ?",
      [id]
    );

    if (exists.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    await connection.execute(
      "UPDATE categories SET name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [name, id]
    );

    res.status(200).json({ message: "Category updated successfully" });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete category controller
export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const [exists] = await connection.execute(
      "SELECT id FROM categories WHERE id = ? ",
      [id]
    );

    if (exists.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    await connection.execute("DELETE FROM categories WHERE id = ?", 
        [id]
    );

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
