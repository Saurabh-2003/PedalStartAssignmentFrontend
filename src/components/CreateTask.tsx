import React, { useState } from 'react';
import { useUserStore } from '../store';

interface CreateTaskProps {
  onClose: () => void;
  onCreate: () => void;
}

const CreateTask: React.FC<CreateTaskProps> = ({ onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const userId = useUserStore((state) => state.userId);
  const setTasks = useUserStore((state) => state.setTasks);
  const tasks = useUserStore((state) => state.tasks);

  const handleCreate = async () => {
    try {
      const requestOptions: any = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description, dueDate: new Date(dueDate), userId: userId }),
        credentials: 'include', // Ensures cookies are sent with the request
      };

      const response = await fetch(`${import.meta.env.VITE_BACKEND}/api/task/create`, requestOptions);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log('Response Data:', responseData);

      if (response.status === 201) {
        const {newTask} = responseData; // Assuming responseData.task contains the newly created task
        console.log('New Task:', newTask);
        setTasks([...tasks, newTask]); // Add the new task to the current tasks list
        onCreate();
        onClose();
      } else {
        console.error('Unexpected response status:', responseData.status);
      }
    } catch (error) {
      console.error('Error creating task:', error);
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
          <button className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-500" onClick={handleCreate}>
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTask;
