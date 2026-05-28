import jwt from "jsonwebtoken";
import env from "../config/env.js";

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authentication required. No token provided.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const { id, email, first_name, last_name, role, status } = jwt.verify(
      token,
      env.jwtSecret
    );

    if (status && status !== "active") {
      return res.status(403).json({
        success: false,
        message: "Your account is not active. Contact an administrator.",
      });
    }

    req.user = { id, email, first_name, last_name, role, status };
    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
}

export default authenticate;
