import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from '../icons/icons';

// Mendefinisikan tipe notifikasi untuk TypeScript
export interface NotificationState {
  message: string;
  type: 'success' | 'error' | 'info';
}

export const NotificationToast = ({ notification, onClose }: { notification: NotificationState, onClose: () => void }) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Animasi keluar akan dimulai pada detik ke-2.7
    const animTimer = setTimeout(() => setIsClosing(true), 2700); 
    // Komponen benar-benar di-unmount pada detik ke-3
    const unmountTimer = setTimeout(onClose, 3000);
    
    return () => { 
      clearTimeout(animTimer); 
      clearTimeout(unmountTimer); 
    };
  }, [onClose]);

  const handleManualClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300);
  };

  const bgColor = notification.type === 'success' ? '#10b981' : (notification.type === 'error' ? '#ef4444' : '#3b82f6');

  return (
    <div style={{
      position: 'fixed', top: '24px', right: '24px', zIndex: 3000,
      backgroundColor: bgColor,
      color: 'white', padding: '14px 24px', borderRadius: '12px',
      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
      display: 'flex', alignItems: 'center', gap: '12px',
      fontWeight: 600, fontSize: '14px',
      animation: isClosing ? 'slideOut 0.3s ease-in forwards' : 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
    }}>
      {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
      <span>{notification.message}</span>
      <button 
        onClick={handleManualClose} 
        style={{ 
          background: 'transparent', border: 'none', color: 'white', 
          cursor: 'pointer', marginLeft: '12px', display: 'flex', 
          padding: '4px', opacity: 0.8 
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
};