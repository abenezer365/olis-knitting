import express from "express";
import authenticate from "../middlewares/authenticate.js";
import authorize from "../middlewares/authorize.js";
import { deleteMessage, getAllMessages, getSingleMessage, replyMessage, writeMessage } from "../controller/messages.controller.js";

const router = express.Router();

router.post("/writeMessage", writeMessage);
router.post("/replyMessage/:id",  authenticate,replyMessage);
router.get("/get/:id", getSingleMessage);
router.get("/messages", getAllMessages);
router.delete("/delete/:id",  deleteMessage);

export default router;
