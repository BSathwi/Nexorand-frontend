import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import RegisterPage from "./components/Login/Register/register";
import LoginPage from "./components/Login/Login";
import HomePage from './components/Home/home';
import Leaderboard from './components/Leaderboard/leaderboard';
import './index.css'; // Import Tailwind CSS styles

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} /> {/* Redirect to login */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
