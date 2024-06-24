// src/store.ts
import create from 'zustand';
import { persist } from 'zustand/middleware';

interface Task {
  createdAt: string | number | Date;
  id: string;
  title: string;
  description: string;
  dueDate: string;
}

interface UserStore {
  userId: string | null; // Add userId
  setUserId: (userId: string | null) => void; // Add setUserId
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  clearTasks: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      userId: null, // Initialize userId
      setUserId: (userId) => set({ userId }), // Implement setUserId
      tasks: [],
      setTasks: (tasks) => set({ tasks }),
      clearTasks: () => set({ tasks: [] }),
    }),
    {
      name: 'user-store', // Name of the item in the storage (must be unique)
      getStorage: () => localStorage, // Use local storage to persist data
    }
  )
);
