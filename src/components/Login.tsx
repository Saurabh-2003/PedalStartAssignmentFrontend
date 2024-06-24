import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store';
import toast from 'react-hot-toast';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const setUserId = useUserStore((state) => state.setUserId);
  const userId = useUserStore((state) => state.userId);

  // Redirect to /tasks if userId is already set in the store
  useEffect(() => {
    if (userId) {
      navigate('/tasks');
    }
  }, [userId]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(`${import.meta.env.VITE_BACKEND}/api/user/login`, { email, password });
      
      if(response?.data?.message){
        toast.success(response?.data?.message)
      }
  
      setUserId(response.data.userId); 
      navigate('/tasks'); 
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('An unexpected error occurred');
      }
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-800">
      <div className="bg-white dark:bg-gray-900 p-8 rounded shadow-md w-full sm:w-96">
        <h2 className="text-2xl dark:text-white font-bold mb-8 text-center">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
            disabled={loading}
              type="email"
              className="w-full focus:ring-emerald-500 dark:bg-slate-700 dark:text-white px-4 py-2 rounded disabled:cursor-not-allowed border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-emerald-600"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input
            disabled={loading}
              type="password"
              className="w-full dark:bg-slate-700 focus:ring-emerald-500 dark:text-white px-4 py-2 rounded border disabled:cursor-not-allowed border-gray-300 dark:border-gray-600 focus:outline-none focus:border-emerald-600"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              disabled={loading}
              type="submit"
              className="w-full bg-emerald-600 disabled:bg-gray-600 disabled:cursor-wait hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Login
            </button>
          </div>
        </form>
        <div className="mt-4 dark:text-slate-400 text-center">
          <p>
            Dont have an account?{' '}
            <button onClick={() => navigate("/signup")} className="text-emerald-600 hover:underline">
              Signup here
            </button>
          </p>
        </div>
        <div className="mt-4 dark:text-slate-400 text-center">
          <p>
            Dont wanna signup ?{' '}
            <button  onClick={() => {setEmail('saurabh@gmail.com');setPassword('saurabh')}} className="text-emerald-600 hover:underline">
              Try test credentials
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
