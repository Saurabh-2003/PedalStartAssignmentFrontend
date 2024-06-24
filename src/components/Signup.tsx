import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store';
import axios from 'axios';

const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
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
      setError('Passwords do not match');
      return;
    }

    try {
      const requestOptions: any = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      };
      const response = await axios.post(`${import.meta.env.VITE_BACKEND}/api/user/signup`,{ name, email, password }, requestOptions);

      if (response.status === 201) {
        setUserId(response.data.userId); // Set userId in global state
        navigate('/login'); // Redirect to login page on successful signup
      } else {
        setError(response.data.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError('Internal server error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-800">
      <div className="bg-white dark:bg-gray-900 p-8 rounded shadow-md w-full sm:w-96">
        <h2 className="text-2xl font-bold mb-8 text-center">Sign Up</h2>
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-emerald-600"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-emerald-600"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-emerald-600"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Confirm Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-emerald-600"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              Sign Up
            </button>
          </div>
        </form>
        <div className="mt-4 text-center">
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
