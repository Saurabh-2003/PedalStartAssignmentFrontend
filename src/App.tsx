// src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import TasksList from './components/TaskList';
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
          <Route path="/" index element={<Login />} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/tasks" element={<TasksList/>} />
      </Routes>
    </Router>
  );
};

export default App;
