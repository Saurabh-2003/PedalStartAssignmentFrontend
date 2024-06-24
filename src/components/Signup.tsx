import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store';
import axios from 'axios';
import toast from 'react-hot-toast';

const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState<boolean> (false)
  const navigate = useNavigate();
  const setUserId = useUserStore((state) => state.setUserId);
  const userId = useUserStore((state) => state.userId);

  // Redirect to /tasks if userId is already set in the store
  useEffect(() => {
    if (userId) {
      navigate('/tasks');
    }
  }, [userId]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
  
    try {
      setLoading(true);
      const response = await axios.post(`${import.meta.env.VITE_BACKEND}/api/user/signup`, { name, email, password });
  
      if (response.status === 201) {
        if(response?.data?.message){
          toast.success(response?.data?.message)
        }
        setUserId(response.data.userId); 
      } else {
        toast.error(response.data.error || 'Signup failed');
      }
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.errors) {
        error.response.data.errors.forEach((err: string) => toast.error(err));
      } else if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Internal server error');
      }
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-800">
      <div className="bg-white dark:bg-gray-900 p-8 rounded shadow-md w-full sm:w-96">
        <h2 className="text-2xl dark:text-white font-bold mb-8 text-center">Sign Up</h2>
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block dark:text-gray-300 mb-1 font-medium">Name</label>
            <input
              disabled={loading}
              type="text"
              className="w-full dark:bg-slate-700 focus:ring-emerald-500 dark:text-white px-4 py-2 disabled:cursor-not-allowed rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-emerald-600"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block dark:text-gray-300 mb-1 font-medium">Email</label>
            <input
              disabled={loading}
              type="email"
              className="w-full dark:bg-slate-700 focus:ring-emerald-500 dark:text-white px-4 py-2 disabled:cursor-not-allowed rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-emerald-600"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block dark:text-gray-300 mb-1 font-medium">Password</label>
            <input
              disabled={loading}
              type="password"
              className="w-full dark:bg-slate-700 focus:ring-emerald-500 dark:text-white px-4 disabled:cursor-not-allowed py-2 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-emerald-600"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block dark:text-gray-300 mb-1 font-medium">Confirm Password</label>
            <input
              disabled={loading}
              type="password"
              className="w-full dark:bg-slate-700 focus:ring-emerald-500 dark:text-white px-4 disabled:cursor-not-allowed py-2 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-emerald-600"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              disabled={loading}
              type="submit"
              className="w-full bg-emerald-600 disabled:bg-gray-600 disabled:cursor-wait hover:bg-emerald-700 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              Sign Up
            </button>
          </div>
        </form>
        <div className="mt-4 dark:text-gray-300 text-center">
          <p>
            Already have an account?{' '}
            <button onClick={() => navigate('/')} className="text-emerald-600 hover:underline">
              Login here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
