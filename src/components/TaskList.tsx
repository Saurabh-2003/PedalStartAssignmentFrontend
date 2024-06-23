import React, { useEffect, useLayoutEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CreateTask from './CreateTask';
import UpdateTask from './UpdateTask';
import DeleteTask from './DeleteTask';
import { MdLogout } from 'react-icons/md';
import { CgAdd } from 'react-icons/cg';
import { useUserStore } from '../store';

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string; // Keep it as string
}

const TasksList: React.FC = () => {
  const { tasks, setTasks } = useUserStore();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    // Initialize dark mode from local storage or default to false
    const savedDarkMode = localStorage.getItem('darkMode');
    return savedDarkMode ? JSON.parse(savedDarkMode) : false;
  });
  const navigate = useNavigate();
  const { userId, setUserId } = useUserStore((state) => state);

  // Function to toggle dark mode
  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    // Save to local storage
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
  }


  useEffect(() => {
    const htmlElement = document.documentElement;
    if (darkMode) {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
  }, [darkMode]);


  // Function to fetch tasks from the API
  const fetchTasks = async () => {
    try {
      const config = {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const response = await axios.post(`${import.meta.env.VITE_BACKEND}/api/task/getall`, { userId }, config);
      // Ensure dueDate is converted to string when storing in state
      const tasksWithStringDates = response.data.map((task: any) => ({
        ...task,
        dueDate: new Date(task.dueDate).toISOString(), // Convert to ISO string
      }));
      setTasks(tasksWithStringDates);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // Effect to fetch tasks on component mount
  useLayoutEffect(() => {
    fetchTasks();
  }, []);

  // Function to handle user logout
  const handleLogout = async () => {
    try {
      const config = {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      await axios.post(`${import.meta.env.VITE_BACKEND}/api/user/logout`, {}, config);
      setUserId('');
      setTasks([]);
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className={`p-8 dark:bg-slate-950`}> {/* Apply dark mode class */}
      <header className="flex bg-gray-100 dark:bg-gray-800 p-4 shadow-xl rounded-xl justify-between items-center mb-8">
        <div className="text-2xl font-bold text-slate-700 dark:text-slate-200">Task Manager</div>
        <div className="flex items-center gap-4">
          <button
            className="hover:bg-emerald-500 text-slate-700 hover:text-white dark:hover:text-white p-2 rounded-full dark:text-slate-500 dark:hover:bg-emerald-600"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <CgAdd size={25} />
          </button>
          <button
            className="text-slate-700 px-4 py-2 rounded-xl dark:text-slate-500 hover:bg-slate-200 "
            onClick={handleLogout}
          >
            <MdLogout size={25} />
          </button>
          {/* Theme toggle button */}
          <button
            className="text-slate-700 px-4 py-2 rounded-xl hover:bg-slate-200 dark:text-white dark:hover:bg-slate-600"
            onClick={toggleTheme}
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </header>

      <div className="grid gap-6 mt-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {tasks.map((task) => (
          <div key={task.id} className="bg-white dark:border-slate-500 border dark:bg-gray-800 w-full rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">{task.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{task.description}</p>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>
            </div>

            <div className="flex justify-end p-4 bg-gray-100 dark:bg-gray-700">
              <button
                className="bg-emerald-600 text-white px-6 py-2 rounded-xl hover:bg-emerald-500 mr-2 "
                onClick={() => {
                  setSelectedTask({ ...task, dueDate: new Date(task.dueDate).toISOString() }); // Ensure dueDate is converted
                  setIsUpdateModalOpen(true);
                }}
              >
                Edit
              </button>
              <button
                className="text-white px-6 py-2 bg-gray-600 hover:bg-gray-500 border rounded-xl border-gray-400"
                onClick={() => {
                  setSelectedTask({ ...task, dueDate: new Date(task.dueDate).toISOString() }); // Ensure dueDate is converted
                  setIsDeleteModalOpen(true);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {isCreateModalOpen && <CreateTask onClose={() => setIsCreateModalOpen(false)} onCreate={fetchTasks} />}
      {isUpdateModalOpen && selectedTask && (
        <UpdateTask task={selectedTask} onClose={() => setIsUpdateModalOpen(false)} onUpdate={fetchTasks} />
      )}
      {isDeleteModalOpen && selectedTask && (
        <DeleteTask taskId={selectedTask.id} onClose={() => setIsDeleteModalOpen(false)} onDelete={fetchTasks} />
      )}
    </div>
  );
};

export default TasksList;