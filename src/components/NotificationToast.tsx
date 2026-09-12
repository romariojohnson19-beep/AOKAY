import React from 'react';
import { PushNotificationEvent } from '../types';
import { Bell, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NotificationToastProps {
  notification: PushNotificationEvent | null;
  onDismiss: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
  onDismiss,
}) => {
  if (!notification) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -30, scale: 0.95 }}
        className="fixed top-3 left-3 right-3 sm:left-auto sm:right-4 sm:w-96 z-50 pointer-events-auto"
      >
        <div
          className={`p-4 rounded-2xl shadow-2xl border flex items-start gap-3 backdrop-blur-md ${
            notification.type === 'EMERGENCY'
              ? 'bg-red-950/95 border-red-500 text-white shadow-red-900/50'
              : notification.type === 'PING'
              ? 'bg-amber-950/95 border-amber-500/80 text-white shadow-amber-950/60'
              : 'bg-slate-900/95 border-blue-500/60 text-white shadow-blue-950/60'
          }`}
        >
          {/* Icon */}
          <div
            className={`p-2 rounded-xl shrink-0 ${
              notification.type === 'EMERGENCY'
                ? 'bg-red-600 text-white animate-pulse'
                : notification.type === 'PING'
                ? 'bg-amber-500 text-slate-950'
                : 'bg-blue-600 text-white'
            }`}
          >
            {notification.type === 'EMERGENCY' ? (
              <AlertTriangle className="w-5 h-5 fill-current" />
            ) : notification.type === 'PING' ? (
              <Bell className="w-5 h-5 fill-current" />
            ) : (
              <CheckCircle className="w-5 h-5" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 pr-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider opacity-80">
                {notification.type === 'EMERGENCY'
                  ? 'High Priority Alert'
                  : notification.type === 'PING'
                  ? 'Family Nudge'
                  : 'Check-In Update'}
              </span>
              <span className="text-[10px] opacity-60">Just now</span>
            </div>
            <h4 className="text-xs font-bold mt-0.5 truncate">{notification.title}</h4>
            <p className="text-xs opacity-90 mt-0.5 leading-snug">{notification.body}</p>
          </div>

          {/* Dismiss button */}
          <button
            onClick={onDismiss}
            className="p-1 rounded-lg opacity-60 hover:opacity-100 hover:bg-white/10 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
