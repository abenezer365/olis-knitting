import express from "express";
import { addProduct, changeImage, deleteProduct, editProduct, getAllProducts, getSingleProduct } from "../controller/products.controller.js";
import authorize from "../middlewares/authorize.js";
import uploadMultar from "../middlewares/uploadMultar.js";
import uploadCloudinary from "../middlewares/uploadCloudinary.js";
import authenticate from "../middlewares/authenticate.js";

const router = express.Router();

router.post("/addProduct", authenticate, authorize("admin"),uploadMultar.fields([
  { name: "image", maxCount: 1 },
  { name: "other_images", maxCount: 3 }
]), uploadCloudinary, addProduct);

router.post("/changeImage/", authenticate, authorize("admin"),uploadMultar.fields([
  { name: "image", maxCount: 1 }
]), uploadCloudinary, changeImage);

router.get("/getProducts", getAllProducts);
router.get("/get/:id", getSingleProduct);
router.patch("/edit/:id", authenticate, authorize("admin"), uploadMultar.single("image"), uploadCloudinary, editProduct)
router.delete("/delete/:id", authenticate, authorize('admin'), deleteProduct)

export default router;