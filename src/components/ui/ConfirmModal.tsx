import React from 'react';
import { AnimatedModal } from './AnimatedModal';
import { AlertCircle, CheckCircle } from '../icons/icons';

export const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Konfirmasi", 
  confirmColor = "#ef4444", 
  icon = "alert", 
  isDark, 
  styles 
}: any) => {
  return (
    <AnimatedModal 
      isOpen={isOpen} 
      onClose={onClose} 
      styles={styles} 
      contentStyle={{ width: '400px', textAlign: 'center', padding: '30px 24px' }}
    >
       {icon === "alert" 
          ? <AlertCircle size={56} color={confirmColor} style={{margin: '0 auto 16px auto', display: 'block'}} />
          : <CheckCircle size={56} color={confirmColor} style={{margin: '0 auto 16px auto', display: 'block'}} />
       }
       <h3 style={{marginTop: 0, color: isDark ? 'white' : '#1f2937', fontSize: '20px'}}>
         {title}
       </h3>
       <div style={{fontSize: '14px', color: isDark ? '#9ca3af' : '#6b7280', marginBottom: '24px', lineHeight: 1.5}}>
         {message}
       </div>
       <div style={{display: 'flex', gap: '12px'}}>
          <button 
            type="button" 
            onClick={onClose} 
            style={{
              flex: 1, 
              padding: '12px', 
              borderRadius: '10px', 
              border: '1px solid #d1d5db', 
              background: 'transparent', 
              color: isDark ? 'white' : '#374151', 
              cursor: 'pointer', 
              fontWeight: 600
            }}
          >
            Batal
          </button>
          <button 
            type="button" 
            onClick={() => { onConfirm(); onClose(); }} 
            style={{
              flex: 1, 
              padding: '12px', 
              borderRadius: '10px', 
              border: 'none', 
              background: confirmColor, 
              color: 'white', 
              fontWeight: 600, 
              cursor: 'pointer', 
              boxShadow: '0 4px 6px -1px rgba(0,0,0, 0.2)'
            }}
          >
            {confirmText}
          </button>
       </div>
    </AnimatedModal>
  );
};