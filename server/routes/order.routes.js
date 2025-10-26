import express from "express";
// Controllers
import authorize from "../middlewares/authorize.js";
import authenticate from "../middlewares/authenticate.js";
import { deleteOrder, deliveryStatus, getAllOrders, getSingleOrder, orderStatus, paymentStatus, placeOrder } from "../controller/order.controller.js";
const router = express.Router();


router.post("/placeOrder", placeOrder);
router.get("/orders", authenticate,getAllOrders);
router.get("/get/:id", getSingleOrder);
router.patch("/edit/order_status/:id",authenticate,authorize('admin'), orderStatus )
router.patch("/edit/delivery_status/:id",authenticate,authorize('admin'), deliveryStatus )
router.patch("/edit/payment_status/:id",authenticate,authorize('admin'), paymentStatus )
router.delete("/delete/:id", authenticate,authorize('admin'),deleteOrder )

export default router;