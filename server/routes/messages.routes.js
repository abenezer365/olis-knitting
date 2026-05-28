import express from "express";
import authenticate from "../middlewares/authenticate.js";
import { writeLimiter } from "../middlewares/rateLimiter.js";
import { deleteMessage, getAllMessages, getSingleMessage, replyMessage, writeMessage } from "../controller/messages.controller.js";

const router = express.Router();

router.post("/writeMessage", writeLimiter, writeMessage);
router.post("/replyMessage/:id",  authenticate,replyMessage);
router.get("/get/:id", authenticate, getSingleMessage);
router.get("/messages", authenticate, getAllMessages);
router.delete("/delete/:id", authenticate, deleteMessage);

export default router;
