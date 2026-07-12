import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  MapPin, 
  Wrench, 
  Fuel, 
  BarChart3, 
  LogOut, 
  User as UserIcon, 
  Truck,
  Users,
  Settings as SettingsIcon,
  Search
} from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout, hasAccess } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      show: true
    },
    {
      name: 'Fleet',
      path: '/vehicles',
      icon: Truck,
      show: true // Mockup shows Fleet
    },
    {
      name: 'Drivers',
      path: '/drivers',
      icon: Users,
      show: true // Mockup shows Drivers
    },
    {
      name: 'Trips',
      path: '/trips',
      icon: MapPin,
      show: hasAccess('trip', 'read')
    },
    {
      name: 'Maintenance',
      path: '/maintenance',
      icon: Wrench,
      show: hasAccess('maintenance', 'read')
    },
    {
      name: 'Fuel & Expenses',
      path: '/fuel-expenses',
      icon: Fuel,
      show: hasAccess('fuelExpense', 'read')
    },
    {
      name: 'Analytics',
      path: '/analytics',
      icon: BarChart3,
      show: hasAccess('analytics', 'read')
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: SettingsIcon,
      show: true
    }
  ];

  // Helper to get initials
  const getInitials = (name = 'Raman K.') => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 flex-row overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-900/40 border-r border-zinc-800 flex flex-col justify-between shadow-xl z-20">
        <div>
          {/* Brand Logo */}
          <div className="h-16 flex items-center px-6 border-b border-zinc-850">
            <span className="text-lg font-bold tracking-wider text-white">TransitOps</span>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 px-4 space-y-1.5">
            {navItems.filter(item => item.show).map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive 
                      ? 'border border-amber-600/80 bg-amber-500/5 text-amber-400 font-bold' 
                      : 'text-zinc-400 hover:text-zinc-150 hover:bg-zinc-850/40'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User profile & Logout */}
        <div className="p-4 border-t border-zinc-850 bg-zinc-950/20">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-2.5 rounded-lg text-xs font-bold text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800 transition-all cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5 mr-2" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header (Top Search & Profile) */}
        <header className="h-16 border-b border-zinc-850 flex items-center justify-between px-8 bg-zinc-950">
          {/* Search bar */}
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-amber-500/20 focus:border-amber-500/50"
            />
          </div>

          {/* User profile details */}
          <div className="flex items-center space-x-4">
            <span className="text-xs text-zinc-400 font-medium">{user?.name || 'Raman K.'}</span>
            <div className="flex items-center space-x-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5">
              <span className="text-[11px] font-bold text-sky-400 tracking-wide uppercase">{user?.role || 'Dispatcher'}</span>
              <div className="h-6 w-6 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center text-[10px] font-extrabold">
                {getInitials(user?.name)}
              </div>
            </div>
          </div>
        </header>

        {/* Content body */}
        <main className="flex-1 overflow-y-auto bg-zinc-950 relative">
          <div className="max-w-7xl mx-auto p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
