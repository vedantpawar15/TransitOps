import React from 'react';
import { Search, Bell, UserCircle } from 'lucide-react';

const Header = () => {
  return (
    <header className="h-20 bg-white border-b-4 border-black flex items-center justify-between px-8 z-10 sticky top-0">
      <div className="flex items-center flex-1">
        <div className="relative w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-black" strokeWidth={3} />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border-2 border-black bg-white text-black placeholder-gray-500 focus:outline-none focus:border-black focus:shadow-[4px_4px_0_rgba(0,0,0,1)] focus:-translate-y-1 focus:-translate-x-1 font-mono font-bold transition-all"
            placeholder="SEARCH_DATABASE..."
          />
        </div>
      </div>
      <div className="flex items-center space-x-6">
        <button className="w-10 h-10 border-2 border-black bg-neo-pink flex items-center justify-center hover:bg-black hover:text-neo-pink transition-colors shadow-[2px_2px_0_rgba(0,0,0,1)]">
          <Bell className="h-5 w-5" strokeWidth={2.5} />
        </button>
        <div className="flex items-center space-x-3 border-l-4 border-black pl-6">
          <div className="text-right">
            <div className="text-sm font-black uppercase tracking-tighter">Raman K.</div>
            <div className="text-[10px] text-black font-mono font-bold bg-neo-blue border-2 border-black px-2 py-0.5 mt-1 shadow-[2px_2px_0_rgba(0,0,0,1)] uppercase">Dispatcher Rx</div>
          </div>
          <UserCircle className="h-10 w-10 text-black" strokeWidth={2} />
        </div>
      </div>
    </header>
  );
};

export default Header;
