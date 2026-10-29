import React from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

export const Alert = ({ type = 'error', message, onClose }) => {
  if (!message) return null;

  const styles = {
    error: 'bg-red-950/80 border-red-800 text-red-200',
    success: 'bg-emerald-950/80 border-emerald-800 text-emerald-200',
    info: 'bg-sky-950/80 border-sky-800 text-sky-200',
  };

  const icons = {
    error: <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />,
    success: <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-400 flex-shrink-0" />,
  };

  return (
    <div className={`p-4 rounded-xl border flex items-start justify-between space-x-3 mb-4 shadow-lg ${styles[type] || styles.error}`}>
      <div className="flex items-center space-x-3">
        {icons[type]}
        <div className="text-sm font-medium leading-relaxed">{message}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
