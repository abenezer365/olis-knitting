import express from "express";
// Controllers
import authorize from "../middlewares/authorize.js";
import authenticate from "../middlewares/authenticate.js";
import { getCurrentRate, getRateHistory, updateRate } from "../controller/currency.controller.js";
const router = express.Router();

router.get("/rate", getCurrentRate);
router.patch("/updateRate/", updateRate)
router.get("/getRateHistory/", getRateHistory);

export default router;