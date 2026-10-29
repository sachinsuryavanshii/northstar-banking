import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { customerService } from '../api/customerService';
import { accountService } from '../api/accountService';
import {
  Users,
  CreditCard,
  DollarSign,
  ArrowUpRight,
  TrendingUp,
  Activity,
  PlusCircle,
  ExternalLink,
  Shield,
  Server
} from 'lucide-react';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [customerCount, setCustomerCount] = useState(0);
  const [accountCount, setAccountCount] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const [recentAccounts, setRecentAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Load customers summary
        const customersData = await customerService.getAll({ page: 0, size: 5 });
        setCustomerCount(customersData.totalElements ?? customersData.length ?? 0);

        // Load accounts summary
        const accountsData = await accountService.getAll({ page: 0, size: 50 });
        const accountsList = accountsData.content || accountsData || [];
        setAccountCount(accountsData.totalElements ?? accountsList.length ?? 0);
        setRecentAccounts(accountsList.slice(0, 5));

        const sum = accountsList.reduce((acc, curr) => acc + (Number(curr.balance) || 0), 0);
        setTotalBalance(sum);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-indigo-500/10 to-transparent pointer-events-none"></div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Microservices Dashboard
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping mr-1"></span>
                SYSTEM ONLINE
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Welcome back, {user?.username || 'User'}!
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage accounts, customers, transactions, and microservices in real time.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/customers"
              className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-indigo-600/30 transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Customer</span>
            </Link>
            <Link
              to="/accounts"
              className="inline-flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 px-4 py-2 rounded-xl text-sm font-semibold transition"
            >
              <CreditCard className="w-4 h-4" />
              <span>Accounts</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Customers
            </span>
            <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-white">
              {loading ? '...' : customerCount}
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400 mr-1" />
              <span className="text-emerald-400 font-medium">Synchronized</span> with customer-service
            </p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Active Accounts
            </span>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-white">
              {loading ? '...' : accountCount}
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400 mr-1" />
              <span className="text-emerald-400 font-medium">Synchronized</span> with account-service
            </p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Managed Assets
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-emerald-400">
              {loading ? '...' : `$${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center">
              <Activity className="w-3.5 h-3.5 text-emerald-400 mr-1" />
              Aggregated across active savings & current accounts
            </p>
          </div>
        </div>
      </div>

      {/* Services Topology Status */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h2 className="text-base font-bold text-white flex items-center space-x-2 mb-4">
          <Server className="w-4 h-4 text-indigo-400" />
          <span>Microservices Architecture Status</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
            <div className="font-semibold text-slate-200">API Gateway</div>
            <div className="text-slate-400 text-[11px] mt-0.5">Port 8080</div>
            <div className="text-emerald-400 font-bold mt-2 flex items-center">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mr-1.5"></span>
              ACTIVE
            </div>
          </div>
          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
            <div className="font-semibold text-slate-200">Eureka Server</div>
            <div className="text-slate-400 text-[11px] mt-0.5">Port 8761</div>
            <div className="text-emerald-400 font-bold mt-2 flex items-center">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mr-1.5"></span>
              DISCOVERY
            </div>
          </div>
          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
            <div className="font-semibold text-slate-200">Auth Service</div>
            <div className="text-slate-400 text-[11px] mt-0.5">Port 8083 (authdb)</div>
            <div className="text-emerald-400 font-bold mt-2 flex items-center">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mr-1.5"></span>
              JWT AUTH
            </div>
          </div>
          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
            <div className="font-semibold text-slate-200">Customer Service</div>
            <div className="text-slate-400 text-[11px] mt-0.5">Port 8081 (customerdb)</div>
            <div className="text-emerald-400 font-bold mt-2 flex items-center">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mr-1.5"></span>
              CRUD
            </div>
          </div>
          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
            <div className="font-semibold text-slate-200">Account Service</div>
            <div className="text-slate-400 text-[11px] mt-0.5">Port 8082 (accountdb)</div>
            <div className="text-emerald-400 font-bold mt-2 flex items-center">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mr-1.5"></span>
              TRANSACTIONS
            </div>
          </div>
        </div>
      </div>

      {/* Recent Accounts Preview */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <CreditCard className="w-4 h-4 text-indigo-400" />
            <span>Recent Accounts</span>
          </h2>
          <Link
            to="/accounts"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-[11px] uppercase bg-slate-800/60 text-slate-400 font-bold tracking-wider">
              <tr>
                <th className="px-6 py-3">Account Number</th>
                <th className="px-6 py-3">Customer ID</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3 text-right">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {recentAccounts.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-6 text-center text-slate-500 text-xs">
                    {loading ? 'Loading accounts...' : 'No bank accounts found.'}
                  </td>
                </tr>
              ) : (
                recentAccounts.map((acc) => (
                  <tr key={acc.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-6 py-3.5 font-mono text-indigo-300 font-semibold text-xs">
                      {acc.accountNumber}
                    </td>
                    <td className="px-6 py-3.5 text-xs text-slate-300">
                      Customer #{acc.customerId}
                    </td>
                    <td className="px-6 py-3.5 text-xs">
                      <span
                        className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          acc.type === 'SAVINGS'
                            ? 'bg-sky-950 text-sky-400 border border-sky-800'
                            : 'bg-purple-950 text-purple-400 border border-purple-800'
                        }`}
                      >
                        {acc.type}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right font-mono font-bold text-white text-xs">
                      ${Number(acc.balance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
