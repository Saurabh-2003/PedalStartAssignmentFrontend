import React, { useState } from 'react';
import axios from 'axios';
import { useUserStore } from '../store';
import toast from 'react-hot-toast'; // Assuming you are using react-hot-toast for notifications

interface UpdateTaskProps {
  task: {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    createdAt:string;
  };
  onClose: () => void;
  onUpdate: () => void;
}

const UpdateTask: React.FC<UpdateTaskProps> = ({ task, onClose, onUpdate }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [dueDate, setDueDate] = useState(task.dueDate);
  const [loading, setLoading] = useState(false);

  const userId = useUserStore((state) => state.userId);
  
  const handleUpdate = async () => {
    if (!title || !description || !dueDate) {
      toast.error('Please fill out all fields');
      return;
    }

    setLoading(true);
    
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND}/api/task/update/${task.id}`,
        { title, description, dueDate, userId },
        { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
      );

      if (response.status === 200) {
        onUpdate();
        onClose();
        toast.success('Task updated successfully');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Internal server error');
      console.error('Error updating task:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl dark:text-white font-bold mb-4">Update Task</h2>
        <input
          type="text"
          placeholder="Title"
          className="w-full disabled:cursor-not-allowed dark:bg-slate-600 dark:text-white p-2 mb-4 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
        />
        <textarea
          placeholder="Description"
          className="w-full disabled:cursor-not-allowed dark:bg-slate-600 dark:text-white p-2 mb-4 border rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
        />
        <input
          type="date"
          className="w-full disabled:cursor-not-allowed dark:bg-slate-600 dark:text-white p-2 mb-4 border rounded"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          disabled={loading}
        />
        <div className="flex justify-end">
          <button className="bg-gray-500 disabled:cursor-not-allowed text-white px-4 py-2 rounded hover:bg-gray-600 mr-2" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button className="bg-emerald-600 disabled:cursor-wait text-white px-4 py-2 rounded hover:bg-emerald-500" onClick={handleUpdate} disabled={loading}>
            {loading ? 'Updating...' : 'Update'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateTask;
