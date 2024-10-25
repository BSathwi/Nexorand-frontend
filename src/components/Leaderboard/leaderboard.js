// src/pages/Leaderboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from "../context/AuthConntext";
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const UserInfo = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const cook=Cookies.get('token');
  if (cook===undefined){
    return  navigate("/login");
  }

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="absolute top-4 right-4 bg-white p-2 rounded-lg shadow-md">
      <p>Welcome, {user.firstName || user.username}</p>
      <p>Points: {user.Points}</p>
      <button 
        onClick={handleLogout}
        className="mt-2 bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 transition-colors"
      >
        Logout
      </button>
    </div>
  );
};

const HistoryModal = ({ isOpen, onClose, history, username }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Points History for {username}</h2>
        <ul className="mb-4">
          {history.map((entry, index) => (
            <li key={index} className="mb-2">
              {entry.pointsAwarded} points on {entry.date}
            </li>
          ))}
        </ul>
        <button
          onClick={onClose}
          className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const Leaderboard = () => {
  const [allTimeUsers, setAllTimeUsers] = useState([]);
  const [weeklyUsers, setWeeklyUsers] = useState([]);
  const [monthlyUsers, setMonthlyUsers] = useState([]);
  const [selectedUserHistory, setSelectedUserHistory] = useState([]);
  const [selectedUsername, setSelectedUsername] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('allTime');

  useEffect(() => {
    fetchAllTimeUsers();
    fetchWeeklyUsers();
    fetchMonthlyUsers();
  }, []);

  const fetchAllTimeUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get('https://nexorand-backend.onrender.com/api/user/v1/get-users');
      if (response.data.success) {
        const sortedUsers = response.data.data.sort((a, b) => b.Points - a.Points);
        setAllTimeUsers(sortedUsers);
      } else {
        throw new Error(response.data.message || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWeeklyUsers = async () => {
    try {
      const response = await axios.get('https://nexorand-backend.onrender.com/api/user/v1/your-weekly-history');
      if (response.data.success) {
        setWeeklyUsers(response.data.data);
      } else {
        throw new Error(response.data.message || 'Failed to fetch weekly data');
      }
    } catch (error) {
      console.error('Error fetching weekly data:', error);
    }
  };

  const fetchMonthlyUsers = async () => {
    try {
      const response = await axios.get('https://nexorand-backend.onrender.com/api/user/v1/your-monthly-history');
      if (response.data.success) {
        setMonthlyUsers(response.data.data);
      } else {
        throw new Error(response.data.message || 'Failed to fetch monthly data');
      }
    } catch (error) {
      console.error('Error fetching monthly data:', error);
    }
  };

  const fetchUserHistory = async (username) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post('https://nexorand-backend.onrender.com/api/user/v1/your-history', { username });
      if (response.data.success) {
        setSelectedUserHistory(response.data.data);
        setSelectedUsername(username);
        setIsModalOpen(true);
      } else {
        throw new Error(response.data.message || 'Failed to fetch user history');
      }
    } catch (error) {
      console.error('Error fetching user history:', error);
      setError('Failed to fetch user history. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderUserList = (users) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {users.map((user, index) => (
        <div key={user._id || index} className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-2">{user.firstName} {user.lastName || user._id}</h2>
          <p className="mb-4">Points: {user.Points || user.totalPoints || user.totalPointsAwarded}</p>
          <button
            onClick={() => fetchUserHistory(user.username || user._id)}
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
          >
            View History
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8 relative">
      <UserInfo />
      <Link to="/" className="absolute top-4 left-4 bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition-colors">
        Back to Home
      </Link>
      <div className="max-w-4xl mx-auto mt-16">
        <h1 className="text-3xl font-bold mb-8 text-center">Leaderboard</h1>
        <div className="mb-4 flex justify-center">
          <button
            onClick={() => setActiveTab('allTime')}
            className={`mx-2 py-2 px-4 rounded ${activeTab === 'allTime' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
          >
            All Time
          </button>
          <button
            onClick={() => setActiveTab('weekly')}
            className={`mx-2 py-2 px-4 rounded ${activeTab === 'weekly' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
          >
            Weekly
          </button>
          <button
            onClick={() => setActiveTab('monthly')}
            className={`mx-2 py-2 px-4 rounded ${activeTab === 'monthly' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
          >
            Monthly
          </button>
        </div>
        {error &&  <p className="text-red-500 text-center mb-4">{error}</p>}
        {isLoading ? (
          <p className="text-center">Loading...</p>
        ) : (
          activeTab === 'allTime' ? renderUserList(allTimeUsers) :
          activeTab === 'weekly' ? renderUserList(weeklyUsers) :
          renderUserList(monthlyUsers)
        )}
        <HistoryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          history={selectedUserHistory}
          username={selectedUsername}
        />
      </div>
    </div>
  );
};

export default Leaderboard;