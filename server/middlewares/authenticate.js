import jwt from "jsonwebtoken";

async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
         message: "Authentication invalid!! Access Denied. No Token Provided",
         success: false
         });
      }
  const token = authHeader.split(" ")[1];
    try {
        const {id, email, first_name, last_name, role, status } = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {id, email, first_name, last_name, role, status }; 
        next();
    } catch (error) {
        return res.status(500).json({
            message: "Invalid Token",
            success: false,
            error: error.message,
        });
    }
}

export default authenticate;

