import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">TransitOps Dashboard</h1>
          <button 
            onClick={handleLogout}
            className="flex items-center text-sm font-medium text-gray-700 hover:text-indigo-600"
          >
            <LogOut className="h-5 w-5 mr-1" />
            Sign out
          </button>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-8 flex flex-col justify-center items-center text-center bg-white">
              <h2 className="text-2xl font-semibold mb-4">Welcome back, {user?.name}!</h2>
              <p className="text-gray-600 max-w-md">
                You are logged in as <span className="font-medium">{user?.role}</span>. 
                Your teammates will build the specific modules for Vehicles, Drivers, Trips, and Maintenance here.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded border">Vehicles Module Placeholder</div>
                <div className="bg-gray-50 p-4 rounded border">Drivers Module Placeholder</div>
                <div className="bg-gray-50 p-4 rounded border">Trips Module Placeholder</div>
                <div className="bg-gray-50 p-4 rounded border">Maintenance Placeholder</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
