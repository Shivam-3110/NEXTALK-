import { createContext, useContext, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);
    const { axios } = useContext(AuthContext);

    const convertMessageToTask = async (messageId, taskData) => {
        try {
            const { data } = await axios.post("/api/tasks/convert", {
                messageId,
                ...taskData
            });
            if (data.success) {
                setTasks(prev => [data.task, ...prev]);
                toast.success("Message converted to task successfully");
                return true;
            }
        } catch (error) {
            toast.error("Failed to convert message to task");
            return false;
        }
    };

    const getTasks = async () => {
        try {
            const { data } = await axios.get("/api/tasks");
            if (data.success) {
                setTasks(data.tasks);
            }
        } catch (error) {
            toast.error("Failed to load tasks");
        }
    };

    const updateTaskStatus = async (taskId, status) => {
        try {
            const { data } = await axios.put(`/api/tasks/${taskId}/status`, { status });
            if (data.success) {
                setTasks(prev => prev.map(task => 
                    task._id === taskId ? { ...task, status } : task
                ));
                toast.success("Task status updated");
            }
        } catch (error) {
            toast.error("Failed to update task status");
        }
    };

    const deleteTask = async (taskId) => {
        try {
            const { data } = await axios.delete(`/api/tasks/${taskId}`);
            if (data.success) {
                setTasks(prev => prev.filter(task => task._id !== taskId));
                toast.success("Task deleted");
            }
        } catch (error) {
            toast.error("Failed to delete task");
        }
    };

    const value = {
        tasks,
        convertMessageToTask,
        getTasks,
        updateTaskStatus,
        deleteTask
    };

    return (
        <TaskContext.Provider value={value}>
            {children}
        </TaskContext.Provider>
    );
};