import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const GroupProfileModal = ({ isOpen, onClose, group, onUpdate }) => {
    const [profilePic, setProfilePic] = useState(group?.profilePic || "");
    const { axios, authUser } = useContext(AuthContext);

    const updateGroupProfile = async (e) => {
        e.preventDefault();
        
        if (group.admin !== authUser._id) {
            toast.error("Only group admin can update profile");
            return;
        }

        try {
            const { data } = await axios.put(`/api/groups/${group._id}/profile`, {
                profilePic
            });

            if (data.success) {
                toast.success("Group profile updated successfully");
                onUpdate();
                onClose();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Failed to update group profile");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 border border-gray-600 rounded-lg w-80 shadow-xl">
                <div className="p-4 border-b border-gray-600 relative">
                    <h2 className="text-lg font-semibold text-white">Update Group Profile</h2>
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
                </div>

                <form onSubmit={updateGroupProfile} className="p-4">
                    <div className="flex flex-col items-center gap-3 mb-4">
                        <div className="w-20 h-20 rounded-full overflow-hidden">
                            {profilePic ? (
                                <img src={profilePic} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-violet-500 flex items-center justify-center text-white font-bold text-2xl">
                                    {group?.name?.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        
                        <label className="cursor-pointer text-blue-400 hover:text-blue-300 text-sm">
                            📷 Change Photo
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
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GroupProfileModal;