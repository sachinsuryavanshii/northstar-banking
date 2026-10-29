import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Compass, LogOut, User as UserIcon, Shield } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-tr from-indigo-600 to-sky-400 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
            <Compass className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
              Northstar
            </span>
            <span className="text-xs font-semibold ml-2 px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-700/50">
              BANKING
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {user && (
            <div className="flex items-center space-x-3 bg-slate-800/80 px-3.5 py-1.5 rounded-full border border-slate-700">
              <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold uppercase shadow">
                {user.username?.charAt(0) || 'U'}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-semibold text-slate-200 leading-tight">
                  {user.username}
                </p>
                <div className="flex items-center space-x-1">
                  <Shield className="w-2.5 h-2.5 text-amber-400" />
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                    {user.role || 'USER'}
                  </span>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={logout}
            className="flex items-center space-x-1.5 text-sm bg-red-600/10 hover:bg-red-600/20 text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg border border-red-500/20 transition duration-150 ease-in-out font-medium"
            title="Sign out of your account"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};
