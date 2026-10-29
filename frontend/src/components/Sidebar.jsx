import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, CreditCard, ArrowLeftRight, FileCode2 } from 'lucide-react';

export const Sidebar = () => {
  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/customers', label: 'Customers', icon: Users },
    { to: '/accounts', label: 'Accounts', icon: CreditCard },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex-shrink-0 flex flex-col justify-between hidden md:flex">
      <div className="p-4 space-y-2">
        <p className="px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">
          Banking Modules
        </p>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`
                }
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-800 space-y-2 text-xs text-slate-400">
        <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/60">
          <div className="flex items-center space-x-2 text-indigo-400 font-semibold mb-1">
            <FileCode2 className="w-4 h-4" />
            <span>API Docs (OpenAPI)</span>
          </div>
          <p className="text-[11px] text-slate-400 mb-2">Access Swagger UI on microservice ports:</p>
          <div className="space-y-1 text-[11px]">
            <a
              href="http://localhost:8083/swagger-ui/index.html"
              target="_blank"
              rel="noreferrer"
              className="block text-indigo-400 hover:underline"
            >
              • Auth API (:8083)
            </a>
            <a
              href="http://localhost:8081/swagger-ui/index.html"
              target="_blank"
              rel="noreferrer"
              className="block text-indigo-400 hover:underline"
            >
              • Customer API (:8081)
            </a>
            <a
              href="http://localhost:8082/swagger-ui/index.html"
              target="_blank"
              rel="noreferrer"
              className="block text-indigo-400 hover:underline"
            >
              • Account API (:8082)
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
};
