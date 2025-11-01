import express from "express";
import authenticate from "../middlewares/authenticate.js";
import authorize from "../middlewares/authorize.js";
import { addOrderedItem, getAllOrderedItems, getOrderedItemsByOrderId, editOrderedItem, deleteOrderedItem,} from "../controller/orderedItems.controller.js";

const router = express.Router();

router.post("/add", addOrderedItem);
router.get("/all", authenticate, authorize("admin"), getAllOrderedItems);
router.get("/order/:order_id", getOrderedItemsByOrderId);
router.patch("/edit/:id", authenticate, editOrderedItem);
router.delete("/delete/:id", authenticate, authorize("admin"), deleteOrderedItem);

export default router;
