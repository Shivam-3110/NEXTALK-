import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const AiChatButton = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [response, setResponse] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { axios } = useContext(AuthContext);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim() || isLoading) return;

        setIsLoading(true);
        try {
            const { data } = await axios.post("/api/ai-chat/send", { message });
            if (data.success) {
                setResponse(data.message);
                setMessage("");
            } else {
                toast.error(data.message || "Failed to get response");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Failed to send message");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isChatOpen) {
        return (
            <button
                onClick={() => setIsChatOpen(true)}
                className="fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg z-40"
            >
                🤖
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 bg-white rounded-lg w-80 h-96 shadow-lg z-40 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-semibold text-gray-800">MR.NEX AI</h3>
                <button onClick={() => setIsChatOpen(false)} className="text-gray-500">✕</button>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto">
                {response && (
                    <div className="bg-gray-100 p-3 rounded-lg mb-4">
                        <p className="text-sm text-gray-800">{response}</p>
                    </div>
                )}
            </div>

            <form onSubmit={sendMessage} className="p-4 border-t">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Ask MR.NEX..."
                        className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !message.trim()}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                    >
                        {isLoading ? "..." : "Send"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AiChatButton;