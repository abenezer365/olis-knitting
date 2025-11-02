// routes/auth.routes.js
import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get("/validate-token", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ valid: false });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true, user: decoded });
  } catch {
    res.status(401).json({ valid: false });
  }
});

export default router;
