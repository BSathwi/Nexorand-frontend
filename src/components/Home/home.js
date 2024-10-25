// src/pages/Home.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthConntext';

const UserInfo = () => {
  const { user } = useAuth();
  const navigate=useNavigate();
  const cook=Cookies.get('token');
  if (cook===undefined){
    return navigate("/home");
  }
  

  if (!user) return null;

  return (
    <div className="absolute top-4 right-4 bg-white p-2 rounded-lg shadow-md">
      <p>Welcome, {user.firstName || user.username}</p>
      <p>Points: {user.Points}</p>
    </div>
  );
};

const Home = () => {
  const [friends, setFriends] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get('https://nexorand-backend.onrender.com/api/user/v1/get-users');
      if (response.data.success) {
        // Get 10 random users excluding the current user
        const allUsers = response.data.data.filter(u => u._id !== user._id);
        const randomFriends = allUsers.sort(() => 0.5 - Math.random()).slice(0, 10);
        setFriends(randomFriends);
      } else {
        throw new Error(response.data.message || 'Failed to fetch friends');
      }
    } catch (error) {
      console.error('Error fetching friends:', error);
      setError('Failed to fetch friends. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const claimPoints = async (username) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.patch('https://nexorand-backend.onrender.com/api/user/v1/claim-points', { username });
      if (response.data.success) {
        setFriends(friends.map(friend => 
          friend.username === username 
            ? { ...friend, Points: response.data.data.Points } 
            : friend
        ));
      } else {
        throw new Error(response.data.message || 'Failed to claim points');
      }
    } catch (error) {
      console.error('Error claiming points:', error);
      setError('Failed to claim points. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 relative">
      <UserInfo />
      <Link to="/leaderboard" className="absolute top-4 left-4 bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition-colors">
        View Leaderboard
      </Link>
      <div className="max-w-4xl mx-auto mt-16">
        <h1 className="text-3xl font-bold mb-8 text-center">Friends List</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {isLoading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {friends.map((friend) => (
              <div key={friend._id} className="bg-white rounded-lg shadow-md p-4">
                <h2 className="text-xl font-semibold mb-2">{friend.firstName} {friend.lastName}</h2>
                <p className="mb-4">Points: {friend.Points}</p>
                <button
                  onClick={() => claimPoints(friend.username)}
                  className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
                >
                  Claim Points
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;