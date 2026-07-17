import Group from "../models/Group.js";
import GroupMessage from "../models/GroupMessage.js";
import User from "../models/User.js";
import { io, userSocketMap } from "../server.js";

// Create new group
export const createGroup = async (req, res) => {
    try {
        const { name, description, members, profilePic } = req.body;
        const adminId = req.user._id;

        const group = await Group.create({
            name,
            description,
            profilePic: profilePic || "",
            admin: adminId,
            members: [adminId, ...members]
        });

        await group.populate('members', 'fullName profilePic');
        res.json({ success: true, group });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get user's groups
export const getUserGroups = async (req, res) => {
    try {
        const userId = req.user._id;
        const groups = await Group.find({ members: userId })
            .populate('members', 'fullName profilePic')
            .populate('lastMessage')
            .sort({ updatedAt: -1 });

        res.json({ success: true, groups });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Send group message
export const sendGroupMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { groupId } = req.params;
        const senderId = req.user._id;

        const group = await Group.findById(groupId);
        if (!group || !group.members.includes(senderId)) {
            return res.json({ success: false, message: "Not authorized" });
        }

        const message = await GroupMessage.create({
            groupId,
            senderId,
            text,
            image,
            seenBy: [{ userId: senderId }]
        });

        await Group.findByIdAndUpdate(groupId, { lastMessage: message._id });

        const populatedMessage = await GroupMessage.findById(message._id)
            .populate('senderId', 'fullName profilePic');

        // Emit to all group members
        group.members.forEach(memberId => {
            const socketId = userSocketMap[memberId.toString()];
            if (socketId) {
                io.to(socketId).emit("newGroupMessage", populatedMessage);
            }
        });

        res.json({ success: true, message: populatedMessage });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get group messages
export const getGroupMessages = async (req, res) => {
    try {
        const { groupId } = req.params;
        const userId = req.user._id;

        const group = await Group.findById(groupId);
        if (!group || !group.members.includes(userId)) {
            return res.json({ success: false, message: "Not authorized" });
        }

        const messages = await GroupMessage.find({ groupId })
            .populate('senderId', 'fullName profilePic')
            .sort({ createdAt: 1 });

        res.json({ success: true, messages });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Update group profile picture
export const updateGroupProfile = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { profilePic } = req.body;
        const userId = req.user._id;

        const group = await Group.findById(groupId);
        if (!group || group.admin.toString() !== userId.toString()) {
            return res.json({ success: false, message: "Only admin can update group profile" });
        }

        await Group.findByIdAndUpdate(groupId, { profilePic });
        res.json({ success: true, message: "Group profile updated successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};