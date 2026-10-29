import React, { useState, useEffect } from 'react';
import { Modal } from '../components/Modal';
import { accountService } from '../api/accountService';
import { CreditCard, DollarSign, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CustomerAccountsModal = ({ isOpen, onClose, customer, onOpenAccount }) => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (customer && isOpen) {
      const fetchAccounts = async () => {
        try {
          setLoading(true);
          const data = await accountService.getAll({ customerId: customer.id, size: 50 });
          setAccounts(data.content || data || []);
        } catch (err) {
          console.error('Error fetching customer accounts:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchAccounts();
    }
  }, [customer, isOpen]);

  if (!customer) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Accounts for ${customer.name} (ID #${customer.id})`}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Registered Email: <span className="text-slate-200 font-semibold">{customer.email}</span></span>
          <button
            onClick={() => {
              onClose();
              onOpenAccount(customer.id);
            }}
            className="inline-flex items-center space-x-1 text-indigo-400 hover:text-indigo-300 font-bold"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Open New Account</span>
          </button>
        </div>

        {loading ? (
          <div className="py-8 text-center text-slate-400 text-sm">
            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            Loading accounts...
          </div>
        ) : accounts.length === 0 ? (
          <div className="py-8 text-center bg-slate-800/40 rounded-xl border border-slate-800 text-slate-400 text-sm">
            <CreditCard className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p>No bank accounts linked to this customer yet.</p>
            <button
              onClick={() => {
                onClose();
                onOpenAccount(customer.id);
              }}
              className="mt-3 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition"
            >
              Open First Account
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {accounts.map((acc) => (
              <div
                key={acc.id}
                className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 flex items-center justify-between"
              >
                <div>
                  <div className="font-mono text-indigo-300 text-xs font-bold">
                    {acc.accountNumber}
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        acc.type === 'SAVINGS'
                          ? 'bg-sky-950 text-sky-400 border border-sky-800'
                          : 'bg-purple-950 text-purple-400 border border-purple-800'
                      }`}
                    >
                      {acc.type}
                    </span>
                    <span className="text-[11px] text-slate-400">Account #{acc.id}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-400">Balance</div>
                  <div className="text-sm font-mono font-bold text-white">
                    ${Number(acc.balance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="pt-3 border-t border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};
