import express from "express";
import { getAnalytics, updateAnalytics } from "../controller/analytics.controller.js";
import authenticate from './../middlewares/authenticate.js';

const router = express.Router();

router.get("/analytics", authenticate ,getAnalytics);
router.post("/analytics", authenticate,updateAnalytics);

export default router;
