import React, { useState, useEffect } from 'react';
import { useDelayUnmount } from '../../hooks/useDelayUnmount';

export const AnimatedModal = ({ isOpen, onClose, children, styles, contentStyle }: any) => {
  const shouldRender = useDelayUnmount(isOpen, 250);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) setIsClosing(false);
    else setIsClosing(true);
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div 
      style={{
        ...styles.modalOverlay, 
        animation: isClosing ? 'fadeOut 0.25s ease-out forwards' : 'fadeIn 0.25s ease-out forwards'
      }} 
      onMouseDown={onClose}
    >
       <div 
         style={{
           ...styles.modalContent, 
           ...contentStyle, 
           animation: isClosing ? 'scaleOut 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards' : 'scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards'
         }} 
         onMouseDown={e => e.stopPropagation()}
       >
         {children}
       </div>
    </div>
  );
};