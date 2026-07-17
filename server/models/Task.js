import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    messageId: {type: mongoose.Schema.Types.ObjectId, ref: "Message", required: true},
    title: {type: String, required: true},
    description: {type: String},
    status: {type: String, enum: ["pending", "completed"], default: "pending"},
    priority: {type: String, enum: ["low", "medium", "high"], default: "medium"},
    dueDate: {type: Date}
}, {timestamps: true});

const Task = mongoose.model("Task", taskSchema);

export default Task;