import express from "express";
import { protectRoute } from "../middleware/auth.js";
import { convertMessageToTask, getTasks, updateTaskStatus, deleteTask } from "../controllers/taskController.js";

const router = express.Router();

router.post("/convert", protectRoute, convertMessageToTask);
router.get("/", protectRoute, getTasks);
router.put("/:taskId/status", protectRoute, updateTaskStatus);
router.delete("/:taskId", protectRoute, deleteTask);

export default router;