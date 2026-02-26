import React, { useState, useEffect } from 'react';
import { useDelayUnmount } from '../../hooks/useDelayUnmount';

export const FullScreenLoader = ({ isOpen, isDark }: { isOpen: boolean, isDark: boolean }) => {
  const shouldRender = useDelayUnmount(isOpen, 250);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) setIsClosing(false);
    else setIsClosing(true);
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: isDark ? 'rgba(17, 24, 39, 0.7)' : 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 9999, animation: isClosing ? 'fadeOut 0.25s ease-out forwards' : 'fadeIn 0.25s ease-out forwards'
    }}>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
        backgroundColor: isDark ? '#1f2937' : 'white',
        padding: '30px 40px', borderRadius: '20px',
        boxShadow: isDark ? '0 10px 25px rgba(0,0,0,0.5)' : '0 10px 25px rgba(0,0,0,0.1)',
        border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
        animation: isClosing ? 'scaleOut 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards' : 'scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }}>
        <div style={{
          width: '45px', height: '45px', border: '4px solid',
          borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          borderTopColor: '#16a34a', borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <div style={{ fontWeight: 600, color: isDark ? 'white' : '#374151', animation: 'pulse 1.5s ease-in-out infinite', fontSize: '15px' }}>
           Memproses Data...
        </div>
      </div>
    </div>
  );
};