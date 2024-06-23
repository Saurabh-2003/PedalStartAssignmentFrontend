import React, { useState } from 'react';
import axios from 'axios';
import { useUserStore } from '../store';

interface UpdateTaskProps {
  task: {
    id: string;
    title: string;
    description: string;
    dueDate: string;
  };
  onClose: () => void;
  onUpdate: () => void;
}

const UpdateTask: React.FC<UpdateTaskProps> = ({ task, onClose, onUpdate }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [dueDate, setDueDate] = useState(task.dueDate);

  const userId = useUserStore((state) => state.userId);
  const handleUpdate = async () => {
    try {
      const config = {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND}/api/task/update/${task.id}`,
        { title, description, dueDate , userId},
        config
      );

      if (response.status === 200) {
        onUpdate();
        onClose();
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl dark:text-white font-bold mb-4">Update Task</h2>
        <input
          type="text"
          placeholder="Title"
          className="w-full dark:bg-slate-600 dark:text-white p-2 mb-4 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Description"
          className="w-full dark:bg-slate-600 dark:text-white p-2 mb-4 border rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="date"
          className="w-full dark:bg-slate-600 dark:text-white p-2 mb-4 border rounded"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <div className="flex justify-end">
          <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mr-2" onClick={onClose}>
            Cancel
          </button>
          <button className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-500" onClick={handleUpdate}>
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateTask;
