import express from "express";
import { getAnalytics, updateAnalytics } from "../controller/analytics.controller.js";

const router = express.Router();

router.get("/analytics", getAnalytics);
router.post("/analytics", updateAnalytics);

export default router;
