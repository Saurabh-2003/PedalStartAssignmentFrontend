import React from 'react';
import axios from 'axios';
import { useUserStore } from '../store';

interface DeleteTaskProps {
  taskId: string;
  onClose: () => void;
  onDelete: () => void;
}

const DeleteTask: React.FC<DeleteTaskProps> = ({ taskId, onClose, onDelete }) => {
  const userId = useUserStore((state) => state.userId);
  const handleDelete = async () => {
    try {
      const config = {
        
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      };

      const response = await axios.post(`${import.meta.env.VITE_BACKEND}/api/task/remove/${taskId}`,{userId}, config);

      if (response.status === 200) {
        onDelete();
        onClose();
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl dark:text-white font-bold mb-4">Confirm Deletion</h2>
        <p className="text-gray-700 dark:text-slate-400 mb-4">Are you sure you want to delete this task?</p>
        <div className="flex justify-end">
          <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mr-2" onClick={onClose}>
            Cancel
          </button>
          <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteTask;
