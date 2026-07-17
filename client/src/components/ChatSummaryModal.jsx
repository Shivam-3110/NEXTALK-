import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const ChatSummaryModal = ({ isOpen, onClose, messages, selectedUser }) => {
    const [summary, setSummary] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { axios, authUser } = useContext(AuthContext);

    const generateSummary = async () => {
        if (!messages || messages.length === 0) {
            toast.error("No messages to summarize");
            return;
        }

        setIsLoading(true);
        try {
            const last50Messages = messages.slice(-50).map(msg => ({
                text: msg.text,
                senderName: msg.senderId === authUser._id ? authUser.fullName : selectedUser.fullName
            }));

            const { data } = await axios.post("/api/ai-chat/summarize", {
                messages: last50Messages
            });

            if (data.success) {
                setSummary(data.summary);
            } else {
                toast.error("Failed to generate summary");
            }
        } catch (error) {
            console.error("Summary error:", error);
            toast.error("Failed to generate summary");
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setSummary("");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[500px] max-w-[90vw] max-h-[80vh] overflow-hidden flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Chat Summary</h3>
                    <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">✕</button>
                </div>

                {!summary && !isLoading && (
                    <div className="text-center py-8">
                        <p className="text-gray-600 mb-4">Generate AI summary of the last 50 messages</p>
                        <button
                            onClick={generateSummary}
                            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            Generate Summary
                        </button>
                    </div>
                )}

                {isLoading && (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">Generating summary...</p>
                    </div>
                )}

                {summary && (
                    <div className="flex-1 overflow-y-auto">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium text-gray-800 mb-2">Key Updates:</h4>
                            <div className="text-gray-700 whitespace-pre-wrap">{summary}</div>
                        </div>
                        <div className="mt-4 text-center">
                            <button
                                onClick={generateSummary}
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 mr-2"
                            >
                                Regenerate
                            </button>
                            <button
                                onClick={handleClose}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatSummaryModal;