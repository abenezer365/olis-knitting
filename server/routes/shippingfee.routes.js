import express from "express";
import { getAllShippingFees, addShippingFee, updateShippingFee, deleteShippingFee } from "../controller/shippingfee.controller.js";
import authenticate from "../middlewares/authenticate.js";

const router = express.Router();

router.get("/all", getAllShippingFees);
router.post("/add",authenticate, addShippingFee);
router.patch("/:id", authenticate,updateShippingFee);
router.delete("/:id", authenticate,deleteShippingFee);

export default router;
