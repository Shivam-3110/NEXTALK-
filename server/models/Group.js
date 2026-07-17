import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String},
    profilePic: {type: String, default: ""},
    admin: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    members: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    lastMessage: {type: mongoose.Schema.Types.ObjectId, ref: "GroupMessage"}
}, {timestamps: true});

const Group = mongoose.model("Group", groupSchema);

export default Group;