import connection from "../config/database.config.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
// .env support
import dotenv from "dotenv";
dotenv.config();

// Sign In Controller
export async function signin(req, res) {
  const { email: inputEmail, password } = req.body;

  if (!inputEmail || !password) {
    return res.status(400).json({
      message: "Please enter all required fields",
      success: false,
    });
  }

  try {
    const [rows] = await connection.execute(
      "SELECT * from users where email = ? ",
      [inputEmail]
    );

    if (rows.length == 0) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Invalid credential", success: false });
    }

    //JWT
    const { id, email, first_name, last_name, role, status } = user;

    const token = jwt.sign(
      { id, email, first_name, last_name, role, status },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    return res.status(200).json({
      message: "User logged in successfully",
      success: true,
      user: { id, email, first_name, last_name, role, status },
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Unable to sign in the user, try again later!",
      success: false,
      error: error.message,
    });
  }
}

// Sign Up Controller
export async function signup(req, res) {
  const { first_name, last_name, email, password, phone, role } = req.body;

  if (!email || !password || !first_name || !last_name || !phone || !role) {
    return res.status(400).json({
      message: "Please enter all required fields",
      success: false,
    });
  }

  if (password.trim().length < 8) {
    return res.status(400).json({
      message: "Password must be at least 8 characters",
      success: false,
    });
  }

  try {
    //check if user email already exists(row, field)
    const [user] = await connection.execute(
      "SELECT * FROM users where email = ?",
      [email]
    );
    if (user.length > 0) {
      if (user[0].email === email) {
        return res.status(409).json({
          message: "User Already exist",
          success: false,
        });
      }
    }
    //encrypt the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // generate uuid
    const uuid = uuidv4();

    await connection.execute(
      "INSERT INTO users (uuid, first_name, last_name, email, password_hash, phone, role) VALUES (?, ?,?,?,?,?,?)",
      [uuid, first_name, last_name, email, hashedPassword, phone, role]
    );

    return res.status(201).json({
      message: "User account created",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error, something went wrong!",
      success: false,
      error: error.message,
    });
  }
}

// Update user info Controller
export async function editProfile(req, res) {
  try {
    const { first_name, last_name, email, phone, password } = req.body;
    const userId = req.user?.id;

    // ✅ Validation
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access — user not found in request.",
      });
    }

    if (!first_name || !last_name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields.",
      });
    }

    // ✅ Check for duplicate email (excluding current user)
    const [existingUser] = await connection.execute(
      "SELECT id FROM users WHERE email = ? AND id != ?",
      [email, userId]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email already in use by another account.",
      });
    }

    // ✅ Prepare update query
    let query = `
      UPDATE users 
      SET first_name = ?, last_name = ?, email = ?, phone = ?
    `;
    const values = [first_name, last_name, email, phone];

    // ✅ Optional password update - FIXED: use password_hash instead of password
    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      query += `, password_hash = ?`; // CHANGED: password → password_hash
      values.push(hashedPassword);
    }

    query += ` WHERE id = ?`;
    values.push(userId);

    // ✅ Execute update
    await connection.execute(query, values);

    // ✅ Send success response
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully!",
    });
  } catch (error) {
    console.error("Error editing profile:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
}

// Update staff member (Admin only) - Separate from profile editing
export async function updateStaff(req, res) {
  try {
    const { id, first_name, last_name, email, phone, role } = req.body;

    // ✅ Validation
    if (!id || !first_name || !last_name || !email || !phone || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required for staff update.",
      });
    }

    // ✅ Check for duplicate email (excluding current staff member)
    const [existingUser] = await connection.execute(
      "SELECT id FROM users WHERE email = ? AND id != ?",
      [email, id]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email already in use by another staff member.",
      });
    }

    // ✅ Update staff member (don't update password here)
    await connection.execute(
      `UPDATE users 
       SET first_name = ?, last_name = ?, email = ?, phone = ?, role = ?
       WHERE id = ?`,
      [first_name, last_name, email, phone, role, id]
    );

    return res.status(200).json({
      success: true,
      message: "Staff member updated successfully!",
    });
  } catch (error) {
    console.error("Error updating staff:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
}

//Check User
export async function checkUser(req, res) {
  const userId = req.user.id;

  try {
    const [user] = await connection.execute(
      "SELECT * FROM users WHERE id = ? ORDER BY created_at DESC",
      [userId]
    );

    if (user.length === 0) {
      return res.status(404).json({
        error: "User not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "User profile retrieved successfully",
      success: true,
      user: user[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get user profile",
      success: false,
      error: error.message,
    });
  }
}

//Get all users info Controller
export async function getAllUsers(req, res) {
  try {
    const [users] = await connection.execute("SELECT * FROM users LIMIT 10");

    if (users.length === 0) {
      return res.status(200).json({
        error: "No employees yet!",
        success: true,
      });
    }

    res.status(200).json({
      message: "Employees data retrieved successfully",
      success: true,
      users: users,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to qeury employees! Internal server error!",
      success: false,
      error: error.message,
    });
  }
}

//Get single user info Controller
export async function getSingleUser(req, res) {
  const { id } = req.params;

  try {
    const [user] = await connection.execute(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );

    if (user.length === 0) {
      return res.status(200).json({
        error: "No employee yet!",
        success: true,
      });
    }

    res.status(200).json({
      message: "Employee data retrieved successfully",
      success: true,
      user: user[0],
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to qeury employee! Internal server error!",
      success: false,
      error: error.message,
    });
  }
}

// Deactivate user Controller
export async function deactivate(req, res) {
  const { id } = req.params;

  try {
    const [user] = await connection.execute(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );

    if (user.length === 0) {
      return res.status(200).json({
        error: "No employee yet!",
        success: true,
      });
    }

    await connection.execute(
      "UPDATE users SET status = 'inactive' WHERE id = ?",
      [id]
    );

    res.status(200).json({
      message: "Employee Deactivated",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to deactivate employee! Internal server error!",
      success: false,
      error: error.message,
    });
  }
}

// Ativate user Controller
export async function activate(req, res) {
  const { id } = req.params;

  try {
    const [user] = await connection.execute(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );

    if (user.length === 0) {
      return res.status(200).json({
        error: "No employee yet!",
        success: true,
      });
    }

    await connection.execute(
      "UPDATE users SET status = 'active' WHERE id = ?",
      [id]
    );

    res.status(200).json({
      message: "Employee Activated",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to Activate employee! Internal server error!",
      success: false,
      error: error.message,
    });
  }
}

// Suspend user Controller
export async function suspend(req, res) {
  const { id } = req.params;

  try {
    const [user] = await connection.execute(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );

    if (user.length === 0) {
      return res.status(200).json({
        error: "No employee yet!",
        success: true,
      });
    }

    await connection.execute(
      "UPDATE users SET status = 'suspended' WHERE id = ?",
      [id]
    );

    res.status(200).json({
      message: "Employee suspended",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to Suspend employee! Internal server error!",
      success: false,
      error: error.message,
    });
  }
}

//Delete User
export async function deleteUser(req, res) {
  const { id } = req.params;

  try {
    const [user] = await connection.execute(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );

    if (user.length === 0) {
      return res.status(200).json({
        message: "User not found",
        success: false,
      });
    }
    // Perform deletion
    await connection.execute("DELETE FROM users WHERE id = ?", [id]);

    res.status(200).json({
      message: "Employee Deleted ✅",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to Delete employee! Internal server error!",
      success: false,
      error: error.message,
    });
  }
}
