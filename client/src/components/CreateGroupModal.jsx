import { useState, useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const CreateGroupModal = ({ isOpen, onClose }) => {
    const [groupName, setGroupName] = useState("");
    const [groupDescription, setGroupDescription] = useState("");
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [profilePic, setProfilePic] = useState("");
    const { users } = useContext(ChatContext);
    const { axios, authUser } = useContext(AuthContext);

    const handleMemberToggle = (userId) => {
        setSelectedMembers(prev => 
            prev.includes(userId) 
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const createGroup = async (e) => {
        e.preventDefault();
        if (!groupName.trim() || selectedMembers.length === 0) {
            toast.error("Group name and at least one member required");
            return;
        }

        try {
            const { data } = await axios.post("/api/groups/create", {
                name: groupName,
                description: groupDescription,
                members: selectedMembers,
                profilePic
            });

            if (data.success) {
                toast.success("Group created successfully!");
                onClose();
                setGroupName("");
                setGroupDescription("");
                setSelectedMembers([]);
                setProfilePic("");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Failed to create group");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 border border-gray-600 rounded-lg w-96 max-h-[80vh] overflow-y-auto shadow-xl">
                <div className="p-4 border-b border-gray-600 relative">
                    <h2 className="text-lg font-semibold text-white">Create Group</h2>
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
                </div>

                <form onSubmit={createGroup} className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-violet-500 rounded-full flex items-center justify-center text-white font-bold">
                            {profilePic ? (
                                <img src={profilePic} alt="" className="w-12 h-12 rounded-full object-cover" />
                            ) : (
                                groupName.charAt(0).toUpperCase() || "G"
                            )}
                        </div>
                        <label className="cursor-pointer text-xs text-blue-400 hover:text-blue-300">
                            📷 Upload Photo
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => setProfilePic(reader.result);
                                        reader.readAsDataURL(file);
                                    }
                                }}
                                className="hidden"
                            />
                        </label>
                    </div>
                    
                    <input
                        type="text"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        placeholder="Group Name"
                        className="w-full p-2 bg-gray-800 border border-gray-600 text-white placeholder-gray-400 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    
                    <textarea
                        value={groupDescription}
                        onChange={(e) => setGroupDescription(e.target.value)}
                        placeholder="Group Description (optional)"
                        className="w-full p-2 bg-gray-800 border border-gray-600 text-white placeholder-gray-400 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="2"
                    />

                    <div className="mb-4">
                        <p className="text-sm font-medium text-white mb-2">Select Members:</p>
                        <div className="max-h-40 overflow-y-auto bg-gray-800 rounded border border-gray-600">
                            {users.filter(user => user._id !== authUser._id).map(user => (
                                <label key={user._id} className="flex items-center p-2 hover:bg-gray-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedMembers.includes(user._id)}
                                        onChange={() => handleMemberToggle(user._id)}
                                        className="mr-3 accent-blue-500"
                                    />
                                    <img src={user.profilePic} alt="" className="w-8 h-8 rounded-full mr-3" />
                                    <span className="text-sm text-white">{user.fullName}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2 px-4 border border-gray-600 text-gray-300 rounded hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Create Group
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateGroupModal;