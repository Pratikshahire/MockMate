import React from 'react';
import { useNavigate } from 'react-router-dom';

export function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("email");
    navigate("/login"); 
  };

  return (
    <header className="bg-blue-600 text-white p-4 flex items-center justify-between">
      <div className="flex items-center">
        <h1 className="text-xl font-bold">MockMate</h1>
      </div>
      <nav className="space-x-4">
        <a href="/dashboard" className="hover:underline">Dashboard</a>
        <a href="/profile" className="hover:underline">Profile</a>
        <a href="/reports" className="hover:underline">Reports</a>
      </nav>
      <button 
        onClick={handleLogout} 
        className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
      >
        Logout
      </button>
    </header>
  );
}
