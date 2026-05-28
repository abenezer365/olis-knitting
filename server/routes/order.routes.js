import express from "express";
// Controllers
import authorize from "../middlewares/authorize.js";
import authenticate from "../middlewares/authenticate.js";
import { writeLimiter } from "../middlewares/rateLimiter.js";
import { deleteOrder, deliveryStatus, getAllOrders, getSingleOrder, getSingleOrderByUuid, orderStatus, paymentStatus, placeOrder } from "../controller/order.controller.js";
const router = express.Router();

router.post("/placeOrder", writeLimiter, placeOrder);
router.get("/orders", authenticate,getAllOrders);
// Internal lookup by sequential id is staff-only (prevents IDOR);
// public order tracking uses the unguessable uuid below.
router.get("/get_by_id/:id", authenticate, getSingleOrder);
router.get("/get_by_uuid/:uuid", getSingleOrderByUuid);
router.patch("/edit/order_status/:id",authenticate, orderStatus )
router.patch("/edit/delivery_status/:id",authenticate, deliveryStatus )
router.patch("/edit/payment_status/:id",authenticate, paymentStatus )
router.delete("/delete/:id", authenticate,authorize('admin'),deleteOrder )

export default router;