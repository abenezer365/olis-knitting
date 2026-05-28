import express from "express";
// Controllers
import authenticate from "../middlewares/authenticate.js";
import authorize from "../middlewares/authorize.js";
import { authLimiter } from "../middlewares/rateLimiter.js";
import {
  activate,
  checkUser,
  deactivate,
  deleteUser,
  editProfile,
  getAllUsers,
  getSingleUser,
  signin,
  signup,
  suspend,
  updateStaff,
} from "../controller/user.controller.js";
const router = express.Router();

router.post("/signin", authLimiter, signin);
// Staff accounts (with roles) may only be created by an admin — the first admin
// is provisioned by the seeder. This closes the public privilege-escalation hole.
router.post("/signup", authenticate, authorize("admin"), signup);
router.patch("/edit", authenticate, editProfile);
router.patch("/edit-staff", authenticate, authorize("admin"), updateStaff);
router.get("/check", authenticate, checkUser);
router.get("/get/:id", authenticate, getSingleUser);
router.get("/getUsers", authenticate, authorize("admin"), getAllUsers);
router.patch("/deactivate/:id", authenticate, authorize("admin"), deactivate);
router.patch("/activate/:id", authenticate, authorize("admin"), activate);
router.patch("/suspend/:id", authenticate, authorize("admin"), suspend);
router.delete("/delete/:id", authenticate, authorize("admin"), deleteUser);

export default router;
