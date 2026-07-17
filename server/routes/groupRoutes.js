import express from "express";
import { protectRoute } from "../middleware/auth.js";
import { createGroup, getUserGroups, sendGroupMessage, getGroupMessages, updateGroupProfile } from "../controllers/groupController.js";

const groupRouter = express.Router();

groupRouter.post("/create", protectRoute, createGroup);
groupRouter.get("/", protectRoute, getUserGroups);
groupRouter.post("/:groupId/send", protectRoute, sendGroupMessage);
groupRouter.get("/:groupId/messages", protectRoute, getGroupMessages);
groupRouter.put("/:groupId/profile", protectRoute, updateGroupProfile);

export default groupRouter;