import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { FormNotification } from '../types';

interface NotificationToastProps {
  notification: FormNotification | null;
  onDismiss: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
  onDismiss,
}) => {
  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          id="status-notification-toast"
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          className={`neu-button px-4 py-2.5 mb-4 flex items-center justify-between text-xs font-medium ${
            notification.type === 'error'
              ? 'text-red-700 bg-red-50/50'
              : notification.type === 'success'
              ? 'text-emerald-800 bg-emerald-50/50'
              : 'text-blue-800 bg-blue-50/50'
          }`}
        >
          <div className="flex items-center gap-2 pr-2">
            {notification.type === 'error' && <AlertCircle size={16} className="text-red-500 shrink-0" />}
            {notification.type === 'success' && <CheckCircle size={16} className="text-emerald-500 shrink-0" />}
            {notification.type === 'info' && <Info size={16} className="text-blue-500 shrink-0" />}
            <span>{notification.message}</span>
          </div>
          <button
            type="button"
            id="btn-dismiss-toast"
            onClick={onDismiss}
            className="text-gray-400 hover:text-gray-600 ml-2"
          >
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
