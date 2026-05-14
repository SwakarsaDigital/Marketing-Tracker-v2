import React, { useEffect, useState } from 'react';
import { X, AlertCircle, CheckCircle2, Lock } from 'lucide-react';
import { NotificationState } from '../../types';
import { SECURITY_PIN } from '../../config/constants';

export const FullScreenLoader = ({ isOpen, isDark }: { isOpen: boolean, isDark: boolean }) => {
  if (!isOpen) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: isDark ? 'rgba(17, 24, 39, 0.8)' : 'rgba(255, 255, 255, 0.8)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(4px)' }}>
      <div className="spin" style={{ width: '48px', height: '48px', border: '4px solid #16a34a', borderTopColor: 'transparent', borderRadius: '50%' }}></div>
    </div>
  );
};

export const AnimatedModal = ({ isOpen, onClose, children, styles, contentStyle }: any) => {
  if (!isOpen) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999, display: 'flex', justifyContent: 'center', alignItems: 'center', animation: 'fadeIn 0.2s ease-out', padding: '20px' }} onClick={onClose}>
      <div style={{ backgroundColor: styles.card.backgroundColor, padding: '24px', borderRadius: '12px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', animation: 'scaleIn 0.2s ease-out', ...contentStyle }} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export const NotificationToast = ({ notification, onClose }: { notification: NotificationState, onClose: () => void }) => {
  useEffect(() => { 
    const timer = setTimeout(onClose, 3500); 
    return () => clearTimeout(timer); 
  }, [notification, onClose]);

  const isError = notification.type === 'error';
  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', backgroundColor: isError ? '#ef4444' : '#16a34a', color: 'white', padding: '16px 24px', borderRadius: '8px', zIndex: 10000, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', display: 'flex', alignItems: 'center', gap: '12px', animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
      {isError ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
      <span style={{fontWeight: 500, fontSize: '14px'}}>{notification.message}</span>
      <button onClick={onClose} style={{background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', padding: '0', marginLeft: '12px', display: 'flex'}}><X size={16} /></button>
    </div>
  );
};

export const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText, confirmColor, icon, isDark, styles }: any) => {
  if (!isOpen) return null;
  return (
    <AnimatedModal isOpen={isOpen} onClose={onClose} styles={styles} contentStyle={{width: '400px', maxWidth: '100%'}}>
      <div style={{display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '24px'}}>
        <div style={{ backgroundColor: icon === 'alert' ? (isDark ? '#7f1d1d' : '#fee2e2') : (isDark ? '#14532d' : '#dcfce7'), color: icon === 'alert' ? '#ef4444' : '#16a34a', padding: '10px', borderRadius: '50%', display: 'flex' }}>
          {icon === 'alert' ? <AlertCircle size={24} /> : <CheckCircle2 size={24} />}
        </div>
        <div>
          <h3 style={{marginTop: 0, marginBottom: '8px', color: isDark ? 'white' : '#111827', fontSize: '18px'}}>{title}</h3>
          <div style={{fontSize: '14px', color: isDark ? '#9ca3af' : '#4b5563', lineHeight: 1.5}}>{message}</div>
        </div>
      </div>
      <div style={{display: 'flex', justifyContent: 'flex-end', gap: '12px'}}>
        <button onClick={onClose} style={{padding: '10px 16px', borderRadius: '8px', border: isDark ? '1px solid #4b5563' : '1px solid #d1d5db', background: 'transparent', color: isDark ? 'white' : '#374151', cursor: 'pointer', fontWeight: 500}}>Cancel</button>
        <button onClick={() => { onConfirm(); onClose(); }} style={{padding: '10px 16px', borderRadius: '8px', border: 'none', background: confirmColor, color: 'white', cursor: 'pointer', fontWeight: 600}}>{confirmText}</button>
      </div>
    </AnimatedModal>
  );
};

export const SearchableDropdown = ({ value, onChange, options, placeholder, isDark }: any) => {
  return (
    <div style={{position: 'relative', width: '100%'}}>
      <select value={value} onChange={e => onChange(e.target.value)} style={{ padding: '10px 12px', borderRadius: '8px', border: isDark ? '1px solid #4b5563' : '1px solid #d1d5db', backgroundColor: isDark ? '#374151' : 'white', color: isDark ? 'white' : 'black', width: '100%', outline: 'none', appearance: 'none', fontFamily: 'inherit', fontSize: '13px' }}>
        <option value="">{placeholder}</option>
        {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      <div style={{position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: isDark ? '#9ca3af' : '#6b7280'}}>
        <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16"><path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/></svg>
      </div>
    </div>
  );
};

export const PinModal = ({ isOpen, onClose, onSubmit, isDark, styles }: any) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === SECURITY_PIN) { onSubmit(); setPin(''); setError(''); onClose(); } 
    else { setError('Password Salah! Akses ditolak.'); setPin(''); }
  };

  return (
    <AnimatedModal isOpen={isOpen} onClose={() => { onClose(); setPin(''); setError(''); }} styles={styles} contentStyle={{ width: '340px', textAlign: 'center' }}>
       <div style={{background: isDark?'#374151':'#f3f4f6', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto'}}>
         <Lock size={32} color={isDark ? '#e5e7eb' : '#374151'} />
       </div>
       <h3 style={{marginTop:0, color: isDark?'white':'#111827', fontSize: '20px', fontWeight: 700}}>Login Admin</h3>
       <p style={{fontSize: '14px', color: isDark ? '#9ca3af' : '#6b7280', marginBottom: '24px'}}>Enter the admin password to access the Admin feature.</p>
       <form onSubmit={handleSubmit}>
          <input type="password" value={pin} autoFocus onChange={(e) => setPin(e.target.value)} placeholder="Password" style={{...styles.input, textAlign: 'center', fontSize: '18px', marginBottom: '16px', padding: '12px', width: '100%', boxSizing: 'border-box'}} />
          {error && <div style={{color: '#ef4444', fontSize: '13px', marginBottom: '16px', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'}}><AlertCircle size={16}/> {error}</div>}
          <div style={{display: 'flex', gap: '12px'}}>
             <button type="button" onClick={() => { onClose(); setPin(''); setError(''); }} style={{flex: 1, padding: '12px', borderRadius: '8px', border: isDark ? '1px solid #4b5563' : '1px solid #d1d5db', background: 'transparent', color: isDark ? 'white' : '#111827', cursor: 'pointer', fontWeight: 600}}>Cancel</button>
             <button type="submit" style={{flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: '#16a34a', color: 'white', fontWeight: 600, cursor: 'pointer'}}>Verifikasi</button>
          </div>
       </form>
    </AnimatedModal>
  );
};