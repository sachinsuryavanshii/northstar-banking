import React, { useState, useEffect } from 'react';
import { customerService } from '../api/customerService';
import { CustomerModal } from './CustomerModal';
import { CustomerAccountsModal } from './CustomerAccountsModal';
import { AccountModal } from './AccountModal';
import { Pagination } from '../components/Pagination';
import { Alert } from '../components/Alert';
import {
  Users,
  UserPlus,
  Search,
  Edit2,
  Trash2,
  CreditCard,
  RefreshCw,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

export const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  // Modals state
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [isAccountsModalOpen, setIsAccountsModalOpen] = useState(false);
  const [accountsModalCustomer, setAccountsModalCustomer] = useState(null);

  const [isNewAccountModalOpen, setIsNewAccountModalOpen] = useState(false);
  const [prefilledCustomerId, setPrefilledCustomerId] = useState(null);

  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await customerService.getAll({
        page,
        size: pageSize,
        search: search.trim() || undefined,
        sortBy: 'id',
        direction: 'asc',
      });

      if (data.content !== undefined) {
        setCustomers(data.content);
        setTotalElements(data.totalElements);
        setTotalPages(data.totalPages);
      } else if (Array.isArray(data)) {
        setCustomers(data);
        setTotalElements(data.length);
        setTotalPages(Math.ceil(data.length / pageSize));
      }
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.response?.data?.message || 'Failed to load customers.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page, pageSize, search]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    setSearch(searchInput);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearch('');
    setPage(0);
  };

  const handleDelete = async (id) => {
    try {
      await customerService.delete(id);
      setAlert({ type: 'success', message: `Customer #${id} deleted successfully.` });
      setDeleteConfirmId(null);
      fetchCustomers();
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.response?.data?.message || 'Failed to delete customer.',
      });
    }
  };

  const openCreateModal = () => {
    setSelectedCustomer(null);
    setIsCustomerModalOpen(true);
  };

  const openEditModal = (customer) => {
    setSelectedCustomer(customer);
    setIsCustomerModalOpen(true);
  };

  const openAccountsModal = (customer) => {
    setAccountsModalCustomer(customer);
    setIsAccountsModalOpen(true);
  };

  const handleOpenAccountForCustomer = (customerId) => {
    setPrefilledCustomerId(customerId);
    setIsNewAccountModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center space-x-2.5">
            <Users className="w-6 h-6 text-indigo-400" />
            <span>Customer Profiles</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage KYC, client personal records, contact data, and associated bank accounts.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchCustomers}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition"
            title="Refresh customers"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-indigo-600/30 transition"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Customer</span>
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

      {/* Search and Filters */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
        <form onSubmit={handleSearchSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search customers by name or email..."
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition"
          >
            Search
          </button>
          {search && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl border border-slate-700 transition"
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {/* Customer Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-[11px] uppercase bg-slate-800/70 text-slate-400 font-bold tracking-wider">
              <tr>
                <th className="px-6 py-3.5">ID</th>
                <th className="px-6 py-3.5">Name</th>
                <th className="px-6 py-3.5">Email</th>
                <th className="px-6 py-3.5">Phone</th>
                <th className="px-6 py-3.5">Address</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading && customers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-400 text-xs">
                    <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    Loading customers...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-500 text-xs">
                    No customers found. Click "Add Customer" to create one.
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-6 py-3.5 font-mono text-xs text-indigo-400 font-bold">
                      #{c.id}
                    </td>
                    <td className="px-6 py-3.5 text-xs font-semibold text-white">
                      {c.name}
                    </td>
                    <td className="px-6 py-3.5 text-xs text-slate-300 font-mono">
                      {c.email}
                    </td>
                    <td className="px-6 py-3.5 text-xs text-slate-400">
                      {c.phone || '—'}
                    </td>
                    <td className="px-6 py-3.5 text-xs text-slate-400 max-w-xs truncate">
                      {c.address || '—'}
                    </td>
                    <td className="px-6 py-3.5 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => openAccountsModal(c)}
                        className="inline-flex items-center space-x-1 p-1.5 bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-800 rounded-lg text-xs font-semibold transition"
                        title="View linked bank accounts"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span className="hidden lg:inline text-[11px]">Accounts</span>
                      </button>

                      <button
                        onClick={() => openEditModal(c)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-xs transition inline-flex items-center"
                        title="Edit customer profile"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {deleteConfirmId === c.id ? (
                        <div className="inline-flex items-center space-x-1">
                          <button
                            onClick={() => handleDelete(c.id)}
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
                          onClick={() => setDeleteConfirmId(c.id)}
                          className="p-1.5 bg-red-950/60 hover:bg-red-900/80 text-red-400 border border-red-800/60 rounded-lg text-xs transition inline-flex items-center"
                          title="Delete customer"
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

      {/* Customer Create/Edit Modal */}
      <CustomerModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        customer={selectedCustomer}
        onSuccess={() => {
          setAlert({
            type: 'success',
            message: selectedCustomer ? 'Customer profile updated.' : 'Customer registered successfully.',
          });
          fetchCustomers();
        }}
      />

      {/* Customer Linked Accounts View Modal */}
      <CustomerAccountsModal
        isOpen={isAccountsModalOpen}
        onClose={() => setIsAccountsModalOpen(false)}
        customer={accountsModalCustomer}
        onOpenAccount={handleOpenAccountForCustomer}
      />

      {/* Open Account Modal */}
      <AccountModal
        isOpen={isNewAccountModalOpen}
        onClose={() => setIsNewAccountModalOpen(false)}
        prefilledCustomerId={prefilledCustomerId}
        onSuccess={() => {
          setAlert({
            type: 'success',
            message: 'New bank account opened for customer successfully.',
          });
        }}
      />
    </div>
  );
};
