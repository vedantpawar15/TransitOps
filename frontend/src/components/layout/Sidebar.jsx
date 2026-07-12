import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Car, 
  Users, 
  Map, 
  Wrench, 
  Fuel, 
  BarChart3, 
  Settings 
} from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Fleet', path: '/fleet', icon: Car },
    { name: 'Drivers', path: '/drivers', icon: Users },
    { name: 'Trips', path: '/trips', icon: Map },
    { name: 'Maintenance', path: '/maintenance', icon: Wrench },
    { name: 'Fuel & Expenses', path: '/fuel', icon: Fuel },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-white border-r-4 border-black flex flex-col h-screen text-black z-20">
      <div className="p-6 border-b-4 border-black bg-neo-yellow">
        <h1 className="text-2xl font-black uppercase tracking-tighter mix-blend-darken">TransitOps</h1>
      </div>
      <nav className="flex-1 mt-6 px-4">
        <ul className="space-y-3">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 font-bold uppercase transition-all duration-200 border-2 ${
                    isActive 
                      ? 'border-black bg-neo-green shadow-[4px_4px_0_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]' 
                      : 'border-transparent hover:border-black hover:bg-neo-yellow hover:shadow-[4px_4px_0_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]'
                  }`
                }
              >
                <item.icon className="h-5 w-5 mr-3" strokeWidth={2.5} />
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t-4 border-black mt-auto bg-neo-black text-neo-green font-mono text-xs font-bold uppercase">
        <div className="flex items-center justify-between">
          <span>System Status</span>
          <span className="w-2 h-2 bg-neo-green rounded-full animate-pulse"></span>
        </div>
        <div className="mt-1 opacity-70">ONLINE</div>
      </div>
    </div>
  );
};

export default Sidebar;
