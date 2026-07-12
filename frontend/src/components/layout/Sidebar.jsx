import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Car, 
  Users, 
  MapPin, 
  Wrench, 
  Fuel, 
  BarChart3, 
  Settings as SettingsIcon 
} from 'lucide-react';

const Sidebar = () => {
  const { hasAccess } = useContext(AuthContext);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, show: true },
    { name: 'Fleet', path: '/fleet', icon: Car, show: true },
    { name: 'Drivers', path: '/drivers', icon: Users, show: true },
    { name: 'Trips', path: '/trips', icon: MapPin, show: hasAccess('trip', 'read') },
    { name: 'Maintenance', path: '/maintenance', icon: Wrench, show: hasAccess('maintenance', 'read') },
    { name: 'Fuel & Expenses', path: '/fuel-expenses', icon: Fuel, show: hasAccess('fuelExpense', 'read') },
    { name: 'Analytics', path: '/analytics', icon: BarChart3, show: hasAccess('analytics', 'read') },
    { name: 'Settings', path: '/settings', icon: SettingsIcon, show: true },
  ];

  return (
    <div className="w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col h-screen text-zinc-300 z-20">
      {/* Brand logo header */}
      <div className="p-6 border-b border-zinc-850">
        <h1 className="text-xl font-bold tracking-wider text-white">TransitOps</h1>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 mt-6 px-4">
        <ul className="space-y-1.5">
          {navItems.filter(item => item.show).map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                    isActive 
                      ? 'border border-amber-600/80 bg-amber-500/5 text-amber-400 font-semibold shadow-sm shadow-amber-900/10' 
                      : 'border border-transparent text-zinc-400 hover:text-zinc-150 hover:bg-zinc-900/30'
                  }`
                }
              >
                <item.icon className="h-4 w-4 mr-3" />
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* System Status footer */}
      <div className="p-4 border-t border-zinc-850 mt-auto bg-zinc-900/20 font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-500">
        <div className="flex items-center justify-between">
          <span>System Status</span>
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-sm shadow-emerald-500/50"></span>
        </div>
        <div className="mt-0.5 text-emerald-400 font-semibold">ONLINE</div>
      </div>
    </div>
  );
};

export default Sidebar;
