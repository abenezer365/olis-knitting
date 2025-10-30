import express from "express";
import authenticate from "../middlewares/authenticate.js";
import authorize from "../middlewares/authorize.js";
import { getRevenue, updateRevenue } from "../controller/revenue.controller.js";

const router = express.Router();

router.post("/revenue", updateRevenue);
router.get("/revenue", getRevenue);

export default router;
