import React, { useState } from 'react';
import { useUserStore } from '../store';
import toast from 'react-hot-toast'; // Assuming you are using react-hot-toast for notifications

interface CreateTaskProps {
  onClose: () => void;
  onCreate: () => void;
}

const CreateTask: React.FC<CreateTaskProps> = ({ onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);

  const userId = useUserStore((state) => state.userId);
  const setTasks = useUserStore((state) => state.setTasks);
  const tasks = useUserStore((state) => state.tasks);

  const handleCreate = async () => {
    if (!title || !description || !dueDate) {
      toast.error('Please fill out all fields');
      return;
    }

    setLoading(true);

    try {
      const requestOptions: any = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description, dueDate, userId }),
        credentials: 'include', // Ensures cookies are sent with the request
      };

      const response = await fetch(`${import.meta.env.VITE_BACKEND}/api/task/create`, requestOptions);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();

      if (response.status === 201) {
        const { newTask } = responseData; // Assuming responseData contains the newly created task
        setTasks([...tasks, newTask]); // Add the new task to the current tasks list
        onCreate();
        onClose();
      } else {
        toast.error(responseData.error || 'Unexpected error occurred');
      }
    } catch (error: any) {
      toast.error(error.message || 'Internal server error');
      console.error('Error creating task:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl dark:text-white font-bold mb-4">Create Task</h2>
        <input
          type="text"
          placeholder="Title"
          className="w-full dark:bg-slate-600 dark:text-white p-2 mb-4 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
        />
        <textarea
          placeholder="Description"
          className="w-full dark:bg-slate-600 dark:text-white p-2 mb-4 border rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
        />
        <input
          type="date"
          className="w-full dark:bg-slate-600 dark:text-white p-2 mb-4 border rounded"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          disabled={loading}
        />
        <div className="flex justify-end">
          <button className="bg-gray-500 text-white px-4 py-2 disabled:cursor-not-allowed rounded hover:bg-gray-600 mr-2" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button className="bg-emerald-600 text-white px-4 py-2 disabled:cursor-wait rounded hover:bg-emerald-500" onClick={handleCreate} disabled={loading}>
            {loading ? 'Creating...' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTask;
