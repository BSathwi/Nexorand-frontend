import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from '../src/components/context/AuthConntext';
import './index.css'; // Import Tailwind CSS styles
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container); // Use createRoot instead of render

root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
