import { useContext, useEffect } from "react";
import { TaskContext } from "../../context/TaskContext";

const TaskSection = () => {
    const { tasks, getTasks, updateTaskStatus, deleteTask } = useContext(TaskContext);

    useEffect(() => {
        getTasks();
    }, []);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString();
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'text-red-500';
            case 'medium': return 'text-yellow-500';
            case 'low': return 'text-green-500';
            default: return 'text-gray-500';
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b border-gray-300">
                <h2 className="text-lg font-semibold text-gray-800">Tasks</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {tasks.length === 0 ? (
                    <div className="text-center text-gray-500 mt-8">
                        <p>No tasks yet</p>
                        <p className="text-sm">Convert messages to tasks to get started</p>
                    </div>
                ) : (
                    tasks.map((task) => (
                        <div key={task._id} className="bg-white rounded-lg p-3 shadow-sm border">
                            <div className="flex items-start justify-between mb-2">
                                <h3 className="font-medium text-gray-800 text-sm">{task.title}</h3>
                                <button
                                    onClick={() => deleteTask(task._id)}
                                    className="text-gray-400 hover:text-red-500 text-xs"
                                >
                                    ✕
                                </button>
                            </div>
                            
                            {task.description && (
                                <p className="text-gray-600 text-xs mb-2 line-clamp-2">{task.description}</p>
                            )}
                            
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                        {task.priority.toUpperCase()}
                                    </span>
                                    {task.dueDate && (
                                        <span className="text-xs text-gray-500">
                                            Due: {formatDate(task.dueDate)}
                                        </span>
                                    )}
                                </div>
                                
                                <button
                                    onClick={() => updateTaskStatus(task._id, task.status === 'pending' ? 'completed' : 'pending')}
                                    className={`text-xs px-2 py-1 rounded ${
                                        task.status === 'completed' 
                                            ? 'bg-green-100 text-green-700' 
                                            : 'bg-gray-100 text-gray-700'
                                    }`}
                                >
                                    {task.status === 'completed' ? '✓ Done' : 'Mark Done'}
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TaskSection;