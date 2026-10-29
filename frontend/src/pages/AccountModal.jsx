import React, { useState, useEffect } from 'react';
import { Modal } from '../components/Modal';
import { Alert } from '../components/Alert';
import { accountService } from '../api/accountService';
import { CreditCard, DollarSign, User, Hash } from 'lucide-react';

export const AccountModal = ({
  isOpen,
  onClose,
  account,
  prefilledCustomerId,
  onSuccess,
}) => {
  const isEditing = !!account;

  const [formData, setFormData] = useState({
    customerId: '',
    accountNumber: '',
    type: 'SAVINGS',
    balance: '0.00',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (account) {
      setFormData({
        customerId: account.customerId || '',
        accountNumber: account.accountNumber || '',
        type: account.type || 'SAVINGS',
        balance: account.balance !== undefined ? String(account.balance) : '0.00',
      });
    } else {
      setFormData({
        customerId: prefilledCustomerId ? String(prefilledCustomerId) : '',
        accountNumber: '',
        type: 'SAVINGS',
        balance: '500.00',
      });
    }
    setError('');
  }, [account, prefilledCustomerId, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customerId) {
      setError('Customer ID is required.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const payload = {
        customerId: Number(formData.customerId),
        type: formData.type,
        balance: Number(formData.balance) || 0,
        accountNumber: formData.accountNumber.trim() || undefined,
      };

      if (isEditing) {
        await accountService.update(account.id, payload);
      } else {
        await accountService.create(payload);
      }
      onSuccess();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Failed to save account.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Account #${account.id} (${account.accountNumber})` : 'Open New Bank Account'}
    >
      <Alert type="error" message={error} onClose={() => setError('')} />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Customer ID *
          </label>
          <div className="relative rounded-xl">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <User className="w-4 h-4" />
            </div>
            <input
              type="number"
              required
              min="1"
              value={formData.customerId}
              onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
              placeholder="e.g. 1"
              className="w-full pl-9 pr-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Account Type *
          </label>
          <div className="relative rounded-xl">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <CreditCard className="w-4 h-4" />
            </div>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full pl-9 pr-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="SAVINGS">SAVINGS (Standard Interest Account)</option>
              <option value="CURRENT">CURRENT (Checking / Commercial Account)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            {isEditing ? 'Current Balance ($)' : 'Initial Deposit ($)'}
          </label>
          <div className="relative rounded-xl">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <DollarSign className="w-4 h-4" />
            </div>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.balance}
              onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
              className="w-full pl-9 pr-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {!isEditing && (
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Custom Account Number (Optional)
            </label>
            <div className="relative rounded-xl">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Hash className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                placeholder="Leave blank to auto-generate (e.g. NS0012345678)"
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
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
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-600/30 transition disabled:opacity-50"
          >
            {loading ? 'Saving...' : isEditing ? 'Update Account' : 'Open Account'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
