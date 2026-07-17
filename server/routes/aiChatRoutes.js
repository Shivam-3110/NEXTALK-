import express from "express";
import { protectRoute } from "../middleware/auth.js";
import { sendMessageToAI, getChatHistory, getMrNexUserInfo, summarizeChat } from "../controllers/aiChatController.js";

const router = express.Router();

router.post("/send", protectRoute, sendMessageToAI);
router.get("/history", protectRoute, getChatHistory);
router.get("/user", protectRoute, getMrNexUserInfo);
router.post("/summarize", protectRoute, summarizeChat);

export default router;