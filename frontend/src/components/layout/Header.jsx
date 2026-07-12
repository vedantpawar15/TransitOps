import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Search, User } from 'lucide-react';

const Header = () => {
  const { user } = useContext(AuthContext);

  const getInitials = (name = 'Raman K.') => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <header className="h-16 bg-zinc-950 border-b border-zinc-850 flex items-center justify-between px-8 z-10 sticky top-0">
      {/* Search Input block */}
      <div className="flex items-center flex-1">
        <div className="relative w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-zinc-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-9 pr-3 py-1.5 border border-zinc-800 bg-zinc-900 text-zinc-200 placeholder-zinc-500 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all"
            placeholder="SEARCH_DATABASE..."
          />
        </div>
      </div>

      {/* User profile & initials badge */}
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <div className="text-xs font-semibold text-zinc-300">{user?.name || 'Raman K.'}</div>
          <div className="text-[10px] text-sky-400 font-bold bg-sky-950/40 border border-sky-800/30 px-2 py-0.5 mt-1 rounded uppercase tracking-wider inline-block">
            {user?.role || 'Dispatcher'}
          </div>
        </div>
        <div className="h-9 w-9 rounded-full bg-sky-500/10 text-sky-400 border border-sky-800/30 flex items-center justify-center text-xs font-extrabold shadow-sm shadow-sky-900/10">
          {getInitials(user?.name)}
        </div>
      </div>
    </header>
  );
};

export default Header;
