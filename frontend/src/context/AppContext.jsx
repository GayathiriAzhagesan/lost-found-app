import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import notificationService from '../services/notificationService';
import { useAuth } from './AuthContext';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [toasts, setToasts] = useState([]);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);

  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const refreshUnreadCount = useCallback(async () => {
    if (!isAuthenticated) {
      setUnreadNotifCount(0);
      return;
    }
    try {
      const res = await notificationService.getNotifications();
      if (res.success) {
        setUnreadNotifCount(res.unreadCount || 0);
      }
    } catch (error) {
      // Non-critical, ignore silent failures
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshUnreadCount();
    } else {
      setUnreadNotifCount(0);
    }
  }, [isAuthenticated, refreshUnreadCount]);

  return (
    <AppContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        unreadNotifCount,
        refreshUnreadCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
