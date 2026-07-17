import { GoogleGenerativeAI } from "@google/generative-ai";
import User from "../models/User.js";
import Message from "../models/Message.js";
import bcrypt from "bcryptjs";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

let mrNexUser = null;

const getMrNexUser = async () => {
    if (!mrNexUser) {
        mrNexUser = await User.findOne({ email: "mrnex@system.ai" });
        if (!mrNexUser) {
            const hashedPassword = await bcrypt.hash("system_ai_bot_2024", 10);
            mrNexUser = await User.create({
                email: "mrnex@system.ai",
                fullName: "MR.NEX",
                password: hashedPassword,
                profilePic: "https://res.cloudinary.com/djbn1efow/image/upload/v1/ai-avatar",
                bio: "AI Assistant powered by Google Gemini"
            });
        }
    }
    return mrNexUser;
};

export const sendMessageToAI = async (req, res) => {
    try {
        console.log("Received AI chat request:", req.body);
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({
                success: false,
                message: "Message is required"
            });
        }
        
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        console.log("Sending to Gemini:", message);
        
        const result = await model.generateContent(`You are MR.NEX, an ultra-modern AI assistant. Respond helpfully and professionally to: ${message}`);
        const response = await result.response;
        const aiReply = response.text();
        
        console.log("Gemini response:", aiReply);

        res.status(200).json({
            success: true,
            message: aiReply
        });
    } catch (error) {
        console.error("AI Chat Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get AI response: " + error.message
        });
    }
};

export const getChatHistory = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            messages: []
        });
    } catch (error) {
        console.error("Get Chat History Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get chat history"
        });
    }
};

export const getMrNexUserInfo = async (req, res) => {
    try {
        const mrNex = await getMrNexUser();
        res.status(200).json({
            success: true,
            user: {
                _id: mrNex._id,
                fullName: mrNex.fullName,
                email: mrNex.email,
                profilePic: mrNex.profilePic,
                bio: mrNex.bio
            }
        });
    } catch (error) {
        console.error("Get MR.NEX User Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get MR.NEX user info"
        });
    }
};

export const summarizeChat = async (req, res) => {
    try {
        const { messages } = req.body;
        
        if (!messages || messages.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No messages to summarize"
            });
        }

        const messageText = messages.map(msg => 
            `${msg.senderName}: ${msg.text || '[Image]'}`
        ).join('\n');

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = `Summarize the key updates and important points from this chat conversation. Focus on decisions, action items, important information, and main topics discussed:\n\n${messageText}`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const summary = response.text();

        res.status(200).json({
            success: true,
            summary
        });
    } catch (error) {
        console.error("Chat Summary Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to generate chat summary"
        });
    }
};