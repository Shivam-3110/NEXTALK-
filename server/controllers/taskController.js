import Task from "../models/Task.js";
import Message from "../models/Message.js";

export const convertMessageToTask = async (req, res) => {
    try {
        const { messageId, title, description, priority, dueDate } = req.body;
        const userId = req.user._id;

        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({ success: false, message: "Message not found" });
        }

        const task = await Task.create({
            userId,
            messageId,
            title: title || message.text?.substring(0, 50) || "Task from message",
            description: description || message.text,
            priority: priority || "medium",
            dueDate: dueDate ? new Date(dueDate) : null
        });

        await task.populate("messageId");

        res.status(201).json({
            success: true,
            message: "Message converted to task successfully",
            task
        });
    } catch (error) {
        console.error("Convert message to task error:", error);
        res.status(500).json({ success: false, message: "Failed to convert message to task" });
    }
};

export const getTasks = async (req, res) => {
    try {
        const userId = req.user._id;
        const tasks = await Task.find({ userId }).populate("messageId").sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            tasks
        });
    } catch (error) {
        console.error("Get tasks error:", error);
        res.status(500).json({ success: false, message: "Failed to get tasks" });
    }
};

export const updateTaskStatus = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { status } = req.body;
        const userId = req.user._id;

        const task = await Task.findOneAndUpdate(
            { _id: taskId, userId },
            { status },
            { new: true }
        ).populate("messageId");

        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        res.status(200).json({
            success: true,
            message: "Task status updated successfully",
            task
        });
    } catch (error) {
        console.error("Update task status error:", error);
        res.status(500).json({ success: false, message: "Failed to update task status" });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const userId = req.user._id;

        const task = await Task.findOneAndDelete({ _id: taskId, userId });
        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        res.status(200).json({
            success: true,
            message: "Task deleted successfully"
        });
    } catch (error) {
        console.error("Delete task error:", error);
        res.status(500).json({ success: false, message: "Failed to delete task" });
    }
};