import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CreateTask from './CreateTask';
import UpdateTask from './UpdateTask';
import DeleteTask from './DeleteTask';
import { MdDarkMode, MdLogout } from 'react-icons/md';
import { useUserStore } from '../store';
import toast from 'react-hot-toast';
import { BiLoader } from 'react-icons/bi';
import { LuSun } from 'react-icons/lu';

type Task =  {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  dueDate: string; 
}

const TasksList: React.FC = () => {
  const { tasks, setTasks } = useUserStore();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
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
  };

  useEffect(() => {
    const htmlElement = document.documentElement;
    if (darkMode) {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    if (!userId) {
      navigate('/');
    }
  }, [userId, navigate]);

  // Function to fetch tasks from the API
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const config = {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const response = await axios.post(`${import.meta.env.VITE_BACKEND}/api/task/getall`, { userId }, config);
      // Ensure dueDate and createdAt are converted to string when storing in state
      const tasksWithStringDates = response.data.map((task: Task) => ({
        ...task,
        createdAt: new Date(task.createdAt).toISOString(),
        dueDate: new Date(task.dueDate).toISOString(),
      }));
      setTasks(tasksWithStringDates);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch tasks on component mount
  useEffect(() => {
    if (userId) {
      fetchTasks();
    }
  }, [userId]);

  if (loading) {
    return <div className='h-dvh w-dvw bg-white dark:bg-slate-950 grid place-items-center'> <BiLoader size={25} className='text-black dark:text-emerald-500 animate-spin'/></div>;
  }

  // Function to handle user logout
  const handleLogout = async () => {
    try {
      setUserId('');
      setTasks([]);
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className={`p-8 min-h-dvh dark:bg-slate-950`}> {/* Apply dark mode class */}
      <header className="flex bg-gray-100 dark:bg-gray-800 p-4 shadow-xl rounded-xl justify-between items-center mb-8">
        <div className="text-2xl font-bold text-slate-700 dark:text-slate-200">Task Manager</div>
        <div className="flex items-center gap-4">
          <button
            className="hover:bg-emerald-500 text-slate-700 hover:text-white dark:hover:text-white py-2 border-slate-600 rounded-md border hover:border-emerald-500  px-4 dark:text-slate-500 dark:hover:bg-emerald-600"
            onClick={() => setIsCreateModalOpen(true)}
          >
            Add Task
          </button>
          <button
            className="text-slate-700 px-4 py-2 rounded-xl hover:bg-slate-200 dark:text-white dark:hover:bg-slate-600"
            onClick={toggleTheme}
          >
            {darkMode ? <MdDarkMode className='text-violet-600' size={25}/> : <LuSun size={25} className='text-yellow-400' />}
          </button>
          <button
            className="text-slate-700 px-4 py-2 rounded-xl dark:text-slate-500 hover:bg-slate-200"
            onClick={handleLogout}
          >
            <MdLogout size={25} />
          </button>
        </div>
      </header>

      <div className="gap-6 mt-6 flex flex-col">
        {tasks.map((task) => (
          <div key={task.id} className="bg-white dark:border-slate-500 border dark:bg-gray-800 w-full rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">{task.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{task.description}</p>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Created At: {new Date(task.createdAt).toLocaleDateString()}</p>
            </div>

            <div className="flex justify-end p-4 bg-gray-100 dark:bg-gray-700">
              <button
                className="bg-emerald-600 text-white px-8 py-2 rounded-md hover:bg-emerald-500 mr-2"
                onClick={() => {
                  setSelectedTask({ 
                    ...task, 
                    createdAt: new Date(task.createdAt).toISOString() ,
                    dueDate: new Date(task.dueDate).toISOString(), 
                  }); 
                  setIsUpdateModalOpen(true);
                }}
              >
                Edit
              </button>
              <button
                className="text-white px-6 py-2 bg-gray-600 hover:bg-gray-500 border rounded-md border-gray-400"
                onClick={() => {
                  setSelectedTask({ 
                    ...task, 
                    createdAt: new Date(task.createdAt).toISOString() ,
                    dueDate: new Date(task.dueDate).toISOString(), 
                  }); 
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
