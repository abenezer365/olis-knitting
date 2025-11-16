import express from "express";
import { addProduct, deleteProduct, editProduct, getAllProducts, getSingleProduct } from "../controller/products.controller.js";
import authorize from "../middlewares/authorize.js";
import authenticate from "../middlewares/authenticate.js";
import handleFileUpload from "../middlewares/upload.js";

const router = express.Router();

router.post("/addProduct",authenticate, authorize("admin"), handleFileUpload, addProduct);
router.get("/getProducts", getAllProducts);
router.get("/get/:id", getSingleProduct);
router.patch("/edit/:id", authenticate, authorize("admin"), editProduct)
router.delete("/delete/:id", authenticate, authorize("admin"), deleteProduct)

export default router;