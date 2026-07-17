import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";


export const ChatContext = createContext();

export const ChatProvider = ({ children })=>{

    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null)
    const [unseenMessages, setUnseenMessages] = useState({})
    const [unseenGroupMessages, setUnseenGroupMessages] = useState({})

    const {socket, axios, authUser} = useContext(AuthContext);

    // function to get all users for sidebar
    const getUsers = async () =>{
        try {
            const { data } = await axios.get("/api/messages/users");
            if (data.success) {
                setUsers(data.users)
                setUnseenMessages(data.unseenMessages)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // function to get messages for selected user or group
    const getMessages = async (userId)=>{
        try {
            const endpoint = selectedUser?.isGroup ? `/api/groups/${userId}/messages` : `/api/messages/${userId}`;
            const { data } = await axios.get(endpoint);
            if (data.success){
                setMessages(data.messages)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // function to send message to selected user or group
    const sendMessage = async (messageData)=>{
        try {
            const endpoint = selectedUser?.isGroup ? `/api/groups/${selectedUser._id}/send` : `/api/messages/send/${selectedUser._id}`;
            const {data} = await axios.post(endpoint, messageData);
            if(data.success){
                setMessages((prevMessages)=>[...prevMessages, data.message || data.newMessage])
            }else{
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    // function to delete message
    const deleteMessage = async (messageId) => {
        try {
            const { data } = await axios.delete(`/api/messages/delete/${messageId}`);
            if (data.success) {
                setMessages(prev => prev.filter(msg => msg._id !== messageId));
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    // function to subscribe to messages for selected user
    const subscribeToMessages = async () =>{
        if(!socket) return;

        socket.on("newMessage", (newMessage)=>{
            if(selectedUser && !selectedUser.isGroup && newMessage.senderId === selectedUser._id){
                newMessage.seen = true;
                setMessages((prevMessages)=> [...prevMessages, newMessage]);
                axios.put(`/api/messages/mark/${newMessage._id}`);
            }else{
                setUnseenMessages((prevUnseenMessages)=>({
                    ...prevUnseenMessages, [newMessage.senderId] : prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages[newMessage.senderId] + 1 : 1
                }))
            }
            getUsers();
        })
        
        socket.on("newGroupMessage", (newMessage)=>{
            if(selectedUser && selectedUser.isGroup && newMessage.groupId === selectedUser._id){
                // Only add message if it's not from current user (to avoid duplicates)
                if(newMessage.senderId._id !== authUser._id){
                    setMessages((prevMessages)=> [...prevMessages, newMessage]);
                }
            } else if(newMessage.senderId._id !== authUser._id) {
                // Increment unseen count for groups not currently selected
                setUnseenGroupMessages((prev) => ({
                    ...prev,
                    [newMessage.groupId]: (prev[newMessage.groupId] || 0) + 1
                }));
            }
        })
        
        socket.on("messageDeleted", (messageId) => {
            setMessages(prev => prev.filter(msg => msg._id !== messageId));
        })
    }

    // function to unsubscribe from messages
    const unsubscribeFromMessages = ()=>{
        if(socket) {
            socket.off("newMessage");
            socket.off("newGroupMessage");
            socket.off("messageDeleted");
        }
    }

    useEffect(()=>{
        subscribeToMessages();
        return ()=> unsubscribeFromMessages();
    },[socket, selectedUser])

    const value = {
        messages, users, selectedUser, getUsers, getMessages, sendMessage, deleteMessage, setSelectedUser, unseenMessages, setUnseenMessages, unseenGroupMessages, setUnseenGroupMessages
    }

    return (
    <ChatContext.Provider value={value}>
            { children }
    </ChatContext.Provider>
    )
}