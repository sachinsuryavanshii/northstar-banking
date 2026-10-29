import React, { useState, useEffect } from 'react';
import { accountService } from '../api/accountService';
import { AccountModal } from './AccountModal';
import { TransactionModal } from './TransactionModal';
import { Pagination } from '../components/Pagination';
import { Alert } from '../components/Alert';
import {
  CreditCard,
  PlusCircle,
  Search,
  Edit2,
  Trash2,
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
  Filter
} from 'lucide-react';

export const AccountsPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [customerIdFilter, setCustomerIdFilter] = useState('');
  const [activeCustomerFilter, setActiveCustomerFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  // Modals
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [transactionAccount, setTransactionAccount] = useState(null);
  const [transactionMode, setTransactionMode] = useState('deposit');

  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        size: pageSize,
        sortBy: 'id',
        direction: 'asc',
      };
      if (activeCustomerFilter) {
        params.customerId = Number(activeCustomerFilter);
      }

      const data = await accountService.getAll(params);

      if (data.content !== undefined) {
        setAccounts(data.content);
        setTotalElements(data.totalElements);
        setTotalPages(data.totalPages);
      } else if (Array.isArray(data)) {
        setAccounts(data);
        setTotalElements(data.length);
        setTotalPages(Math.ceil(data.length / pageSize));
      }
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.response?.data?.message || 'Failed to load accounts.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [page, pageSize, activeCustomerFilter]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    setActiveCustomerFilter(customerIdFilter.trim());
  };

  const handleClearFilter = () => {
    setCustomerIdFilter('');
    setActiveCustomerFilter('');
    setPage(0);
  };

  const handleDelete = async (id) => {
    try {
      await accountService.delete(id);
      setAlert({ type: 'success', message: `Account #${id} deleted successfully.` });
      setDeleteConfirmId(null);
      fetchAccounts();
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.response?.data?.message || 'Failed to delete account.',
      });
    }
  };

  const openDeposit = (account) => {
    setTransactionAccount(account);
    setTransactionMode('deposit');
    setIsTransactionModalOpen(true);
  };

  const openWithdraw = (account) => {
    setTransactionAccount(account);
    setTransactionMode('withdraw');
    setIsTransactionModalOpen(true);
  };

  const openEdit = (account) => {
    setSelectedAccount(account);
    setIsAccountModalOpen(true);
  };

  const openCreate = () => {
    setSelectedAccount(null);
    setIsAccountModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center space-x-2.5">
            <CreditCard className="w-6 h-6 text-indigo-400" />
            <span>Bank Accounts & Balances</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Savings, checking, real-time deposits, withdrawals, and ledger operations.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchAccounts}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition"
            title="Refresh accounts"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={openCreate}
            className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-indigo-600/30 transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Open Account</span>
          </button>
        </div>
      </div>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {/* Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
        <form onSubmit={handleFilterSubmit} className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <Filter className="w-4 h-4 text-indigo-400" />
            <span>Filter By:</span>
          </div>
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <input
              type="number"
              min="1"
              value={customerIdFilter}
              onChange={(e) => setCustomerIdFilter(e.target.value)}
              placeholder="Filter by Customer ID (e.g. 1)"
              className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition"
          >
            Apply Filter
          </button>
          {activeCustomerFilter && (
            <button
              type="button"
              onClick={handleClearFilter}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl border border-slate-700 transition"
            >
              Clear Filter
            </button>
          )}
        </form>
      </div>

      {/* Accounts Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-[11px] uppercase bg-slate-800/70 text-slate-400 font-bold tracking-wider">
              <tr>
                <th className="px-6 py-3.5">ID</th>
                <th className="px-6 py-3.5">Account Number</th>
                <th className="px-6 py-3.5">Customer ID</th>
                <th className="px-6 py-3.5">Type</th>
                <th className="px-6 py-3.5 text-right">Balance</th>
                <th className="px-6 py-3.5 text-right">Transactions</th>
                <th className="px-6 py-3.5 text-right">Manage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading && accounts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-slate-400 text-xs">
                    <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    Loading accounts...
                  </td>
                </tr>
              ) : accounts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-slate-500 text-xs">
                    No accounts found matching your criteria. Click "Open Account" to create one.
                  </td>
                </tr>
              ) : (
                accounts.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-6 py-3.5 font-mono text-xs text-indigo-400 font-bold">
                      #{a.id}
                    </td>
                    <td className="px-6 py-3.5 font-mono text-xs text-white font-bold">
                      {a.accountNumber}
                    </td>
                    <td className="px-6 py-3.5 text-xs text-slate-300">
                      Customer #{a.customerId}
                    </td>
                    <td className="px-6 py-3.5 text-xs">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          a.type === 'SAVINGS'
                            ? 'bg-sky-950 text-sky-400 border border-sky-800'
                            : 'bg-purple-950 text-purple-400 border border-purple-800'
                        }`}
                      >
                        {a.type}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right font-mono font-bold text-white text-xs">
                      ${Number(a.balance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-3.5 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => openDeposit(a)}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 rounded-lg text-xs font-semibold transition"
                        title="Deposit funds into account"
                      >
                        <ArrowDownLeft className="w-3.5 h-3.5" />
                        <span>Deposit</span>
                      </button>
                      <button
                        onClick={() => openWithdraw(a)}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-800 rounded-lg text-xs font-semibold transition"
                        title="Withdraw funds from account"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        <span>Withdraw</span>
                      </button>
                    </td>
                    <td className="px-6 py-3.5 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => openEdit(a)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-xs transition inline-flex items-center"
                        title="Edit account details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {deleteConfirmId === a.id ? (
                        <div className="inline-flex items-center space-x-1">
                          <button
                            onClick={() => handleDelete(a.id)}
                            className="px-2 py-1 bg-red-600 hover:bg-red-500 text-white rounded-lg text-[10px] font-bold transition"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-2 py-1 bg-slate-800 text-slate-300 rounded-lg text-[10px] transition"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(a.id)}
                          className="p-1.5 bg-red-950/60 hover:bg-red-900/80 text-red-400 border border-red-800/60 rounded-lg text-xs transition inline-flex items-center"
                          title="Delete account"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalElements={totalElements}
          pageSize={pageSize}
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setPage(0);
          }}
        />
      </div>

      {/* Account Modal */}
      <AccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        account={selectedAccount}
        onSuccess={() => {
          setAlert({
            type: 'success',
            message: selectedAccount ? 'Account details updated.' : 'Account created successfully.',
          });
          fetchAccounts();
        }}
      />

      {/* Transaction Modal (Deposit / Withdraw) */}
      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        account={transactionAccount}
        mode={transactionMode}
        onSuccess={(msg) => {
          setAlert({ type: 'success', message: msg });
          fetchAccounts();
        }}
      />
    </div>
  );
};
