import React, { useState, useEffect } from 'react';
import { Modal } from '../components/Modal';
import { Alert } from '../components/Alert';
import { accountService } from '../api/accountService';
import { DollarSign, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

export const TransactionModal = ({ isOpen, onClose, account, mode = 'deposit', onSuccess }) => {
  const isDeposit = mode === 'deposit';
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setAmount('');
    setError('');
  }, [isOpen, account, mode]);

  if (!account) return null;

  const currentBalance = Number(account.balance) || 0;
  const numAmount = Number(amount) || 0;
  const projectedBalance = isDeposit
    ? currentBalance + numAmount
    : currentBalance - numAmount;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || numAmount <= 0) {
      setError('Please enter a valid amount greater than $0.00');
      return;
    }

    if (!isDeposit && numAmount > currentBalance) {
      setError(`Insufficient funds. Maximum available withdrawal is $${currentBalance.toFixed(2)}.`);
      return;
    }

    try {
      setLoading(true);
      setError('');
      if (isDeposit) {
        await accountService.deposit(account.id, numAmount);
      } else {
        await accountService.withdraw(account.id, numAmount);
      }
      onSuccess(isDeposit ? 'Deposit completed successfully.' : 'Withdrawal completed successfully.');
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || `Failed to process ${mode}.`;
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isDeposit ? `Deposit to ${account.accountNumber}` : `Withdraw from ${account.accountNumber}`}
    >
      <Alert type="error" message={error} onClose={() => setError('')} />

      {/* Account Info Card */}
      <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80 mb-4 flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-400">Account Number</span>
          <div className="font-mono text-indigo-300 font-bold text-sm">{account.accountNumber}</div>
          <span className="text-[11px] text-slate-400">Customer #{account.customerId} • {account.type}</span>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400">Current Balance</span>
          <div className="text-base font-mono font-black text-white">
            ${currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Amount ($) *
          </label>
          <div className="relative rounded-xl">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <DollarSign className="w-4 h-4" />
            </div>
            <input
              type="number"
              step="0.01"
              min="0.01"
              required
              autoFocus
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full pl-9 pr-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-lg"
            />
          </div>
        </div>

        {/* Quick Amount Pills */}
        <div className="flex gap-2 text-xs">
          {[50, 100, 500, 1000].map((quickAmt) => (
            <button
              key={quickAmt}
              type="button"
              onClick={() => setAmount(String(quickAmt))}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition"
            >
              +${quickAmt}
            </button>
          ))}
          {!isDeposit && currentBalance > 0 && (
            <button
              type="button"
              onClick={() => setAmount(String(currentBalance))}
              className="px-2.5 py-1 bg-indigo-950 hover:bg-indigo-900 text-indigo-300 rounded-lg border border-indigo-800 transition font-semibold"
            >
              Max All
            </button>
          )}
        </div>

        {/* Projected Balance preview */}
        {numAmount > 0 && (
          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Balance after transaction:</span>
            <span className={`font-mono font-bold ${projectedBalance < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
              ${projectedBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        )}

        <div className="pt-4 flex items-center justify-end space-x-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-semibold transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-5 py-2 rounded-xl text-sm font-semibold text-white shadow-lg transition disabled:opacity-50 flex items-center space-x-2 ${
              isDeposit
                ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
                : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30'
            }`}
          >
            {loading ? (
              <span>Processing...</span>
            ) : isDeposit ? (
              <>
                <ArrowDownLeft className="w-4 h-4" />
                <span>Confirm Deposit</span>
              </>
            ) : (
              <>
                <ArrowUpRight className="w-4 h-4" />
                <span>Confirm Withdrawal</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
