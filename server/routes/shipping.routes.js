import express from "express";
import { addShipping, getShippingByUuid } from "../controller/shipping.controller.js";

const router = express.Router();

router.post("/addShipping", addShipping);
router.get("/getShipping/:uuid", getShippingByUuid);

export default router;
