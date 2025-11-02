import express from "express";
// Middlewares
import authorize from "../middlewares/authorize.js";
import authenticate from "../middlewares/authenticate.js";
import { addCategory, deleteCategory, editCategory, getAllCategory, getAllCategoryFast, getSingleCategory } from "../controller/category.controller.js";


const router = express.Router();

router.post("/addCategory", authenticate, authorize("admin"), addCategory);
router.get("/categories",getAllCategory);
router.get("/categoriesFast",getAllCategoryFast);
router.get("/get/:id", getSingleCategory);
router.patch("/edit/:id", authenticate,authorize("admin"),editCategory)
router.delete("/delete/:id", authenticate,authorize('admin'),deleteCategory )

export default router;
