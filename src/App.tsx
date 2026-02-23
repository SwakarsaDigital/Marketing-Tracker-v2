import { useEffect, useState, useMemo } from 'react';

// --- CONFIGURATION ---
// URL Google Apps Script Anda (Sudah diperbarui dengan link baru)
const GAS_API_URL = "https://script.google.com/macros/s/AKfycbx0TaLAHHMxE3JANtOYcmhQIZxxHsBXLkoGFAqr4Fdy8M6_SIWScP8o90cFRsTS9l2r/exec";

// PIN Keamanan untuk Edit/Delete
const SECURITY_PIN = "Yoyomagey1@"; 

// --- ICONS ---
const FileText = ({ size = 20, color = 'currentColor', ...props }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
);
const Users = ({ size = 20, color = 'currentColor', ...props }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
);
const BarChart2 = ({ size = 20, color = 'currentColor', ...props }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
);
const RefreshCw = ({ size = 20, color = 'currentColor', ...props }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
);
const LinkIcon = ({ size = 16, color = 'currentColor', ...props }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
);
const X = ({ size = 24, color = 'currentColor', ...props }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);
const SearchIcon = ({ size = 20, color = 'currentColor', ...props }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);
const CheckCircle = ({ size = 20, color = 'currentColor', ...props }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
);
const AlertCircle = ({ size = 20, color = 'currentColor', ...props }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
);
const TrendingUp = ({ size = 20, color = 'currentColor', ...props }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
);
const Trash2 = ({ size = 18, color = 'currentColor', ...props }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
);
const Edit = ({ size = 18, color = 'currentColor', ...props }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
);
const Lock = ({ size = 48, color = 'currentColor', ...props }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
);

// --- TYPES ---
interface DailyLog {
  id: number;
  rowNumber: number;
  date: string;
  rawDateIso: string; // Ditambahkan untuk fungsi filter tanggal yang lebih akurat
  leadName: string;
  profileUrl: string;
  industry: string;
  source: string;
  template: string;
  interactionType: string;
  tagged: boolean;
  responseTime: string;
  status: string;
  notes: string;
  marketer: string;
}

interface KPIStats {
  totalLeads: number;
  directAskCount: number;
  conversionCount: number;
  postPerformance: { source: string; count: number; rating: string }[];
}

interface NotificationState {
  message: string;
  type: 'success' | 'error';
}

// --- CUSTOM HOOKS (ANIMATION) ---
// Hook untuk menunda proses unmount (penghapusan dari DOM) agar animasi keluar (exit) sempat berjalan
function useDelayUnmount(isMounted: boolean, delayTime: number) {
  const [shouldRender, setShouldRender] = useState(false);
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    if (isMounted && !shouldRender) {
      setShouldRender(true);
    } else if (!isMounted && shouldRender) {
      timeoutId = setTimeout(() => setShouldRender(false), delayTime);
    }
    return () => clearTimeout(timeoutId);
  }, [isMounted, delayTime, shouldRender]);
  return shouldRender;
}

// --- COMPONENTS ---

// 1. Loader Seluruh Layar (Memproses)
const FullScreenLoader = ({ isOpen, isDark }: { isOpen: boolean, isDark: boolean }) => {
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

// 2. Pembungkus Modal Dinamis & Teranimasi
const AnimatedModal = ({ isOpen, onClose, children, styles, contentStyle }: any) => {
  const shouldRender = useDelayUnmount(isOpen, 250);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) setIsClosing(false);
    else setIsClosing(true);
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div style={{...styles.modalOverlay, animation: isClosing ? 'fadeOut 0.25s ease-out forwards' : 'fadeIn 0.25s ease-out forwards'}} onMouseDown={onClose}>
       <div style={{...styles.modalContent, ...contentStyle, animation: isClosing ? 'scaleOut 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards' : 'scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards'}} onMouseDown={e => e.stopPropagation()}>
         {children}
       </div>
    </div>
  );
};

// 3. Notifikasi Sukses/Error
const NotificationToast = ({ notification, onClose }: { notification: NotificationState, onClose: () => void }) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Mulai animasi keluar sebelum benar-benar unmount
    const animTimer = setTimeout(() => setIsClosing(true), 2700); 
    const unmountTimer = setTimeout(onClose, 3000);
    return () => { clearTimeout(animTimer); clearTimeout(unmountTimer); };
  }, [onClose]);

  const handleManualClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300);
  };

  return (
    <div style={{
      position: 'fixed', top: '24px', right: '24px', zIndex: 3000,
      backgroundColor: notification.type === 'success' ? '#10b981' : '#ef4444',
      color: 'white', padding: '14px 24px', borderRadius: '12px',
      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
      display: 'flex', alignItems: 'center', gap: '12px',
      fontWeight: 600, fontSize: '14px',
      animation: isClosing ? 'slideOut 0.3s ease-in forwards' : 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
    }}>
      {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
      <span>{notification.message}</span>
      <button onClick={handleManualClose} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', marginLeft: '12px', display: 'flex', padding: '4px', opacity: 0.8 }}>
        <X size={16} />
      </button>
    </div>
  );
};

// 4. Modal Konfirmasi Hapus Data
const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, isDark, styles }: any) => {
  return (
    <AnimatedModal isOpen={isOpen} onClose={onClose} styles={styles} contentStyle={{ width: '350px', textAlign: 'center', padding: '30px 24px' }}>
       <AlertCircle size={56} color="#ef4444" style={{margin: '0 auto 16px auto', display: 'block'}} />
       <h3 style={{marginTop:0, color: isDark?'white':'#1f2937', fontSize: '20px'}}>{title}</h3>
       <p style={{fontSize: '14px', color: isDark ? '#9ca3af' : '#6b7280', marginBottom: '24px', lineHeight: 1.5}}>
         {message}
       </p>
       <div style={{display: 'flex', gap: '12px'}}>
          <button type="button" onClick={onClose} style={{flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #d1d5db', background: 'transparent', color: isDark ? 'white' : '#374151', cursor: 'pointer', fontWeight: 600}}>Batal</button>
          <button type="button" onClick={() => { onConfirm(); onClose(); }} style={{flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: '#ef4444', color: 'white', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.2)'}}>Ya, Hapus</button>
       </div>
    </AnimatedModal>
  )
};

// 5. PIN/Password Modal
const PinModal = ({ isOpen, onClose, onSubmit, isDark, styles }: any) => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
  
    const handleSubmit = (e: any) => {
      e.preventDefault();
      if (pin === SECURITY_PIN) {
        onSubmit();
        setPin('');
        setError('');
        onClose();
      } else {
        setError('Password Salah! Akses ditolak.');
        setPin('');
      }
    };
  
    return (
      <AnimatedModal isOpen={isOpen} onClose={() => { onClose(); setPin(''); setError(''); }} styles={styles} contentStyle={{ width: '320px', textAlign: 'center' }}>
         <Lock size={48} color={isDark ? '#e5e7eb' : '#374151'} style={{margin: '0 auto 15px auto', display: 'block'}} />
         <h3 style={{marginTop:0, color: isDark?'white':'#1f2937', fontSize: '18px'}}>Login Admin</h3>
         <p style={{fontSize: '13px', color: isDark ? '#9ca3af' : '#6b7280', marginBottom: '24px'}}>
           Masukkan password admin untuk mengakses fitur Edit dan Delete.
         </p>
         <form onSubmit={handleSubmit}>
            <input 
              type="password" 
              value={pin}
              autoFocus
              onChange={(e) => setPin(e.target.value)}
              placeholder="Password"
              style={{
                ...styles.input, 
                textAlign: 'center', 
                fontSize: '16px', 
                marginBottom: '15px',
                padding: '12px'
              }} 
            />
            {error && <div style={{color: '#ef4444', fontSize: '12px', marginBottom: '10px'}}>{error}</div>}
            <div style={{display: 'flex', gap: '10px'}}>
               <button type="button" onClick={() => { onClose(); setPin(''); setError(''); }} style={{flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', background: 'transparent', color: isDark ? 'white' : '#374151', cursor: 'pointer', fontWeight: 500}}>Batal</button>
               <button type="submit" style={{flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: '#166534', color: 'white', fontWeight: 600, cursor: 'pointer'}}>Verifikasi</button>
            </div>
         </form>
      </AnimatedModal>
    );
};

// --- DYNAMIC STYLES ---
const LXStyles = (isDark: boolean, isMobile: boolean) => ({
  container: { 
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', fontSize: '14px', color: isDark ? '#f9fafb' : '#333', 
    height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column' as const, 
    backgroundColor: isDark ? '#111827' : '#f9fafb', overflow: 'hidden'
  },
  header: { 
    backgroundColor: '#166534', color: 'white', padding: isMobile ? '10px 16px' : '15px 20px', 
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 20,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  tabBar: { 
    display: isMobile ? 'none' : 'flex', borderBottom: isDark ? '1px solid #374151' : '1px solid #e5e7eb', 
    backgroundColor: isDark ? '#1f2937' : 'white' 
  },
  tab: (isActive: boolean) => ({
    padding: '12px 20px', cursor: 'pointer', borderBottom: isActive ? '3px solid #166534' : '3px solid transparent',
    color: isActive ? '#22c55e' : (isDark ? '#9ca3af' : '#6b7280'), fontWeight: isActive ? 600 : 500, 
    display: 'flex', alignItems: 'center', gap: '8px',
    backgroundColor: isActive ? (isDark ? '#064e3b' : '#f0fdf4') : 'transparent',
    transition: 'all 0.2s ease'
  }),
  content: { 
    padding: isMobile ? '15px' : '20px', overflow: 'auto', flex: 1, width: '100%', boxSizing: 'border-box' as const 
  },
  table: { 
    width: '100%', borderCollapse: 'collapse' as const, backgroundColor: isDark ? '#1f2937' : 'white', 
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderRadius: '8px', overflow: 'hidden'
  },
  th: { 
    padding: '12px', borderBottom: isDark ? '1px solid #374151' : '1px solid #e5e7eb', 
    backgroundColor: isDark ? '#374151' : '#f9fafb', textAlign: 'left' as const, 
    fontSize: '12px', fontWeight: 700, color: isDark ? '#d1d5db' : '#4b5563', whiteSpace: 'nowrap' as const 
  },
  td: { 
    padding: '10px 12px', borderBottom: isDark ? '1px solid #374151' : '1px solid #e5e7eb', fontSize: '13px', 
    color: isDark ? '#e5e7eb' : '#333'
  },
  input: { 
    width: '100%', padding: '10px', border: isDark ? '1px solid #4b5563' : '1px solid #d1d5db', 
    borderRadius: '6px', boxSizing: 'border-box' as const, backgroundColor: isDark ? '#374151' : 'white',
    color: isDark ? '#fff' : '#000', outline: 'none'
  },
  card: { 
    backgroundColor: isDark ? '#1f2937' : 'white', padding: '20px', borderRadius: '12px', 
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
    display: 'flex', flexDirection: 'column' as const, justifyContent: 'center'
  },
  btnPrimary: {
    backgroundColor:'#166534', color:'white', border:'none', padding:'10px 20px', borderRadius:'8px', 
    cursor:'pointer', fontWeight:600, display: 'flex', alignItems: 'center', gap: '8px',
    transition: 'background-color 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  modalOverlay: {
    position: 'fixed' as const, top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)',
    display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
  },
  modalContent: {
    backgroundColor: isDark ? '#1f2937' : 'white', padding: '24px', borderRadius: '16px', width: '450px', maxWidth: '95%',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', maxHeight: '90vh', overflowY: 'auto' as const,
    border: isDark ? '1px solid #374151' : 'none'
  },
  actionBtn: {
    padding: '6px', borderRadius: '6px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'background 0.2s'
  }
});


// --- MAIN APP ---
export default function App() {
  const [activeTab, setActiveTab] = useState<'daily' | 'influencer' | 'kpi'>('daily');
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);
  const [kpiStats, setKpiStats] = useState<KPIStats | null>(null);
  
  // Loading Master
  const [loading, setLoading] = useState(false);
  
  // Modals & Forms
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<DailyLog | null>(null);
  
  // Admin Login Logic
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Custom Confirm Delete Logic
  const [confirmDeleteState, setConfirmDeleteState] = useState<{isOpen: boolean, lead: DailyLog | null}>({isOpen: false, lead: null});

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  
  const [notification, setNotification] = useState<NotificationState | null>(null);
  
  const [isDark, setIsDark] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const styles = useMemo(() => LXStyles(isDark, isMobile), [isDark, isMobile]);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) setIsDark(true);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const timestamp = new Date().getTime();
      const apiUrl = `${GAS_API_URL}?t=${timestamp}`;

      const resSummary = await fetch(`${apiUrl}&action=getSummary`);
      const dataSummary = await resSummary.json();
      setKpiStats(dataSummary);

      const resLogs = await fetch(apiUrl);
      const dataLogs = await resLogs.json();
      
      if(dataLogs.status === 'success') {
        const mappedLogs = dataLogs.data
        .filter((row: any) => {
             const firstVal = Array.isArray(row) ? row[0] : row["Date of Contact"];
             if (!firstVal) return false;
             const str = String(firstVal).toLowerCase().trim();
             if (str.includes("date") || str.includes("header") || str.length < 5) return false;
             if (!/\d/.test(str)) return false;
             return true;
        })
        .map((row: any, idx: number) => {
          const isArray = Array.isArray(row);
          const values = isArray ? row : Object.values(row);
          
          const getValue = (keyName: string, index: number) => {
            if (!isArray && row[keyName] !== undefined) return row[keyName];
            return isArray && row[index] !== undefined ? row[index] : (values[index] || '-');
          };

          let rawDate = getValue("Date of Contact", 0);
          let dateStr = '-';
          let rawDateIso = ''; 
          
          if (rawDate) {
             try {
               const d = new Date(rawDate);
               if (!isNaN(d.getTime())) {
                   dateStr = d.toLocaleDateString('en-US');
                   const offset = d.getTimezoneOffset() * 60000;
                   const localISOTime = (new Date(d.getTime() - offset)).toISOString().slice(0, 10);
                   rawDateIso = localISOTime;
               } else {
                   dateStr = String(rawDate);
                   rawDateIso = String(rawDate);
               }
             } catch(e) {
               dateStr = String(rawDate);
               rawDateIso = String(rawDate);
             }
          }

          return {
            id: idx,
            rowNumber: idx + 2, 
            date: dateStr,
            rawDateIso: rawDateIso,
            leadName: getValue("Lead Name", 1) || '-',
            profileUrl: getValue("Bukti Google Drive", 2) || getValue("LinkedIn Profile URL", 2) || '',
            industry: getValue("Industry/Role", 3) || '-',
            source: getValue("Source Post/Influencer", 4) || '-',
            template: getValue("Template Used", 5) || '-',
            interactionType: getValue("Interaction Type", 6) || '-',
            tagged: String(getValue("Jonathan Tagged?", 7)).toLowerCase() === 'true',
            responseTime: getValue("Response Time", 8) || '-',
            status: getValue("Conversion Status", 9) || 'New',
            notes: getValue("Notes/Feedback", 10) || '',
            marketer: getValue("Marketer", 11) || '' 
          };
        });

        setDailyLogs(mappedLogs.reverse());
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      showNotification("Koneksi gagal. Cek konsol.", 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredLogs = useMemo(() => {
    let result = dailyLogs;
    if (searchQuery.trim()) {
      result = result.filter(log => 
        (log.leadName && log.leadName.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    if (dateFilter.trim()) {
      result = result.filter(log => 
        log.rawDateIso === dateFilter || log.date.includes(dateFilter)
      );
    }
    return result;
  }, [dailyLogs, searchQuery, dateFilter]);

  const conversionRate = useMemo(() => {
    if (!kpiStats || kpiStats.totalLeads === 0) return 0;
    return ((kpiStats.conversionCount / kpiStats.totalLeads) * 100).toFixed(1);
  }, [kpiStats]);

  // --- ACTIONS HANDLERS ---
  
  const handleCloseLeadModal = () => {
    setIsModalOpen(false);
    // Menghapus state sedikit tertunda agar animasi out selesai sebelum teks berubah
    setTimeout(() => setEditingLead(null), 250);
  };

  const handleDeleteClick = (lead: DailyLog) => {
    setConfirmDeleteState({ isOpen: true, lead });
  };

  const handleEditClick = (lead: DailyLog) => {
    setEditingLead(lead);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (data: any) => {
    handleCloseLeadModal(); // Memicu animasi keluar pada modal
    if (editingLead) {
      performAction('edit', data);
    } else {
      performAction('create', data);
    }
  };

  const performAction = async (action: 'create' | 'edit' | 'delete', data: any) => {
    setLoading(true);
    
    try {
      const payload = {
        action: action,
        ...data,
        rowNumber: data.rowNumber 
      };

      await fetch(GAS_API_URL, {
        method: 'POST', mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (action === 'edit') {
        showNotification('Edit terkonfirmasi. Data berhasil diperbarui.', 'success');
      } else if (action === 'delete') {
        showNotification('Data berhasil dihapus dari sistem.', 'success');
      } else {
        showNotification('Data baru berhasil ditambahkan.', 'success');
      }
      
      // Memberikan jeda sebelum fetch agar Google Apps Script sempat update cell
      await new Promise(resolve => setTimeout(resolve, 1000));
      await fetchData(); 

    } catch (error) {
      showNotification('Gagal melakukan aksi.', 'error');
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* GLOBAL STYLE FOR ANIMATIONS */}
      <style>{`
        @keyframes slideIn { from { transform: translateX(50px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(50px); opacity: 0; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
        @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes scaleOut { from { transform: scale(1); opacity: 1; } to { transform: scale(0.9); opacity: 0; } }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
      `}</style>

      {/* FULL SCREEN LOADING */}
      <FullScreenLoader isOpen={loading} isDark={isDark} />

      {/* NOTIFICATION TOAST */}
      {notification && <NotificationToast notification={notification} onClose={() => setNotification(null)} />}

      {/* LOGIN ADMIN MODAL */}
      <PinModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onSubmit={() => setIsAdmin(true)}
        isDark={isDark}
        styles={styles}
      />

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
         isOpen={confirmDeleteState.isOpen}
         onClose={() => setConfirmDeleteState({ ...confirmDeleteState, isOpen: false })}
         onConfirm={() => { if (confirmDeleteState.lead) performAction('delete', confirmDeleteState.lead) }}
         title="Konfirmasi Hapus"
         message={`Apakah Anda yakin ingin menghapus data pemasaran atas nama ${confirmDeleteState.lead?.leadName}? Data ini akan hilang permanen.`}
         isDark={isDark}
         styles={styles}
      />

      {/* HEADER */}
      <div style={styles.header}>
        <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
           <div style={{background: 'rgba(255,255,255,0.2)', padding: '8px', borderRadius: '8px', display: 'flex'}}>
             <FileText size={20} />
           </div>
           <div>
             <h1 style={{fontSize:'16px', margin:0, fontWeight:700}}>Marketing Tracker</h1>
             <div style={{fontSize:'11px', opacity:0.8, display:'flex', alignItems:'center', gap:'4px'}}>
               <span style={{width:'6px', height:'6px', borderRadius:'50%', backgroundColor:'#4ade80'}}></span>
               Online
             </div>
           </div>
        </div>
        <div style={{display:'flex', gap:'10px'}}>
          <button onClick={() => isAdmin ? setIsAdmin(false) : setIsLoginModalOpen(true)} style={{background: isAdmin ? '#ef4444' : '#3b82f6', border:'none', color:'white', borderRadius:'6px', padding:'6px 12px', fontSize:'12px', cursor: 'pointer', fontWeight: 600}}>
             {isAdmin ? 'Logout Admin' : 'Login Admin'}
          </button>
          <button onClick={fetchData} style={{background:'none', border:'none', color:'white', cursor:'pointer', opacity: 0.8}} title="Refresh Data">
            <RefreshCw size={20} />
          </button>
          <button onClick={() => setIsDark(!isDark)} style={{background:'rgba(255,255,255,0.2)', border:'none', color:'white', borderRadius:'6px', padding:'6px 12px', fontSize:'12px', cursor: 'pointer', fontWeight: 500}}>
             {isDark ? 'Light' : 'Dark'}
          </button>
        </div>
      </div>

      {/* TABS */}
      <div style={styles.tabBar}>
        <div onClick={() => setActiveTab('daily')} style={styles.tab(activeTab === 'daily')}>
          <Users size={16} /> Daily Log
        </div>
        <div onClick={() => setActiveTab('influencer')} style={styles.tab(activeTab === 'influencer')}>
          <Users size={16} /> Influencer Stats
        </div>
        <div onClick={() => setActiveTab('kpi')} style={styles.tab(activeTab === 'kpi')}>
          <BarChart2 size={16} /> Dashboard KPI
        </div>
      </div>

      {/* MOBILE NAV */}
      {isMobile && (
        <div style={{display:'flex', gap:'10px', padding:'12px', overflowX:'auto', borderBottom: isDark ? '1px solid #374151' : '1px solid #ddd'}}>
             <button onClick={() => setActiveTab('daily')} style={{padding:'8px 16px', borderRadius:'20px', border:'none', backgroundColor: activeTab==='daily'?'#166534':'#e5e7eb', color: activeTab==='daily'?'white':'#374151', fontSize:'12px', fontWeight: 600}}>Log</button>
             <button onClick={() => setActiveTab('influencer')} style={{padding:'8px 16px', borderRadius:'20px', border:'none', backgroundColor: activeTab==='influencer'?'#166534':'#e5e7eb', color: activeTab==='influencer'?'white':'#374151', fontSize:'12px', fontWeight: 600}}>Influencer</button>
             <button onClick={() => setActiveTab('kpi')} style={{padding:'8px 16px', borderRadius:'20px', border:'none', backgroundColor: activeTab==='kpi'?'#166534':'#e5e7eb', color: activeTab==='kpi'?'white':'#374151', fontSize:'12px', fontWeight: 600}}>KPI</button>
        </div>
      )}

      {/* CONTENT AREA */}
      <div style={styles.content}>
        
        {/* --- TAB 1: DAILY LOG --- */}
        {activeTab === 'daily' && (
          <div>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px', flexWrap:'wrap', gap:'10px', alignItems: 'center'}}>
               <div style={{display:'flex', gap:'10px', flex:1, flexWrap: 'wrap'}}>
                  {/* Filter by Name */}
                  <div style={{display:'flex', alignItems:'center', backgroundColor: isDark?'#374151':'white', border: isDark?'1px solid #4b5563':'1px solid #ddd', borderRadius:'8px', padding:'0 12px', flex:1, maxWidth: '250px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)'}}>
                     <SearchIcon size={16} color="#9ca3af"/>
                     <input 
                       placeholder="Cari nama..." 
                       value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                       style={{border:'none', background:'transparent', padding:'10px', outline:'none', color: isDark?'white':'black', width:'100%', fontSize: '13px'}}
                     />
                  </div>
                  
                  {/* Filter by Date */}
                  <div style={{display:'flex', alignItems:'center', backgroundColor: isDark?'#374151':'white', border: isDark?'1px solid #4b5563':'1px solid #ddd', borderRadius:'8px', padding:'0 12px', flex:1, maxWidth: '200px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)'}}>
                     <input 
                       type="date"
                       title="Filter berdasarkan tanggal"
                       value={dateFilter}
                       onChange={(e) => setDateFilter(e.target.value)}
                       style={{border:'none', background:'transparent', padding:'10px', outline:'none', color: isDark?'white':'black', width:'100%', fontSize: '13px'}}
                     />
                  </div>

                  {/* Total Baris Indicator */}
                  <div style={{display: 'flex', alignItems: 'center', padding: '0 10px', fontSize: '13px', fontWeight: 600, color: isDark ? '#d1d5db' : '#4b5563'}}>
                    Total Row: {filteredLogs.length}
                  </div>
               </div>
               <button onClick={() => { setEditingLead(null); setIsModalOpen(true); }} style={styles.btnPrimary}>
                 <span>+</span> Add New Lead
               </button>
            </div>

            <div style={{overflowX: 'auto', border: isDark ? '1px solid #374151' : '1px solid #e5e7eb', borderRadius: '12px'}}>
               <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Actions</th>
                      <th style={styles.th}>Date</th>
                      <th style={styles.th}>Lead Name</th>
                      <th style={styles.th}>Bukti GDrive</th> 
                      <th style={styles.th}>Industry</th>
                      <th style={styles.th}>Source</th>
                      <th style={styles.th}>Template</th>
                      <th style={styles.th}>Type</th>
                      <th style={styles.th}>Tagged?</th>
                      <th style={styles.th}>Resp. Time</th>
                      <th style={styles.th}>Status</th>
                      <th style={styles.th}>Notes</th>
                      <th style={styles.th}>Marketer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.length === 0 ? (
                       <tr><td colSpan={13} style={{padding:'40px', textAlign:'center', color:'#6b7280'}}>
                         Tidak ada data.
                       </td></tr>
                    ) : (
                       filteredLogs.map(row => (
                         <tr key={row.id} style={{backgroundColor: isDark ? 'transparent' : 'white'}}>
                           <td style={styles.td}>
                             {isAdmin ? (
                               <div style={{display:'flex', gap:'5px'}}>
                                 <button onClick={() => handleEditClick(row)} style={{...styles.actionBtn, backgroundColor: isDark ? '#374151' : '#e0f2fe', color: '#0284c7'}} title="Edit">
                                   <Edit size={14} />
                                 </button>
                                 <button onClick={() => handleDeleteClick(row)} style={{...styles.actionBtn, backgroundColor: isDark ? '#374151' : '#fee2e2', color: '#ef4444'}} title="Delete">
                                   <Trash2 size={14} />
                                 </button>
                               </div>
                             ) : (
                               <div style={{color: '#9ca3af', display: 'flex', justifyContent: 'center'}} title="Login sebagai Admin untuk Edit/Delete">
                                 <Lock size={14} />
                               </div>
                             )}
                           </td>
                           <td style={styles.td}>{row.date}</td>
                           <td style={styles.td}><span style={{fontWeight: 600}}>{row.leadName}</span></td>
                           <td style={styles.td}>{row.profileUrl && <a href={row.profileUrl} target="_blank" rel="noreferrer" style={{color:'#2563eb', display: 'flex', alignItems: 'center'}}><LinkIcon size={16}/></a>}</td>
                           <td style={styles.td}>{row.industry}</td>
                           <td style={styles.td}>{row.source}</td>
                           <td style={styles.td}>{row.template}</td>
                           <td style={styles.td}>{row.interactionType}</td>
                           <td style={styles.td}>{row.tagged ? 'Yes' : 'No'}</td>
                           <td style={styles.td}>{row.responseTime}</td>
                           <td style={styles.td}>
                             <span style={{
                               padding:'4px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:600,
                               backgroundColor: row.status==='Deal/Signed' ? '#dcfce7' : (isDark ? '#374151' : '#f3f4f6'),
                               color: row.status==='Deal/Signed' ? '#166534' : (isDark ? '#e5e7eb' : '#374151'),
                               border: row.status==='Deal/Signed' ? '1px solid #bbf7d0' : '1px solid transparent'
                             }}>{row.status}</span>
                           </td>
                           <td style={{...styles.td, fontSize:'12px', color: isDark ? '#9ca3af' : '#6b7280', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{row.notes}</td>
                           <td style={styles.td}>{row.marketer}</td>
                         </tr>
                       ))
                    )}
                  </tbody>
               </table>
            </div>
          </div>
        )}

        {/* --- TAB 2: INFLUENCER --- */}
        {activeTab === 'influencer' && (
           <div>
              <h2 style={{fontSize:'18px', marginBottom:'15px', color: isDark?'white':'#333', fontWeight: 700}}>Influencer & Post Performance</h2>
              <div style={{overflowX: 'auto', border: isDark ? '1px solid #374151' : '1px solid #e5e7eb', borderRadius: '12px'}}>
                <table style={styles.table}>
                   <thead>
                     <tr>
                       <th style={styles.th}>Source / Post Name</th>
                       <th style={styles.th}>Total Leads Generated</th>
                       <th style={styles.th}>Performance Rating</th>
                     </tr>
                   </thead>
                   <tbody>
                     {kpiStats?.postPerformance?.map((item, idx) => (
                       <tr key={idx}>
                         <td style={styles.td}>{item.source}</td>
                         <td style={{...styles.td, fontSize:'16px', fontWeight:'bold'}}>{item.count}</td>
                         <td style={styles.td}>
                            <span style={{
                               padding:'4px 10px', borderRadius:'12px', fontSize:'12px', fontWeight:700,
                               backgroundColor: item.rating==='Excellent' ? '#dcfce7' : (item.rating==='Good' ? '#dbeafe' : '#fef9c3'),
                               color: item.rating==='Excellent' ? '#166534' : (item.rating==='Good' ? '#1e40af' : '#854d0e')
                            }}>
                              {item.rating}
                            </span>
                         </td>
                       </tr>
                     ))}
                     {(!kpiStats || kpiStats.postPerformance.length === 0) && (
                        <tr><td colSpan={3} style={{padding:'40px', textAlign:'center', color:'#6b7280'}}>Belum ada data analitik influencer.</td></tr>
                     )}
                   </tbody>
                </table>
              </div>
           </div>
        )}

        {/* --- TAB 3: KPI DASHBOARD --- */}
        {activeTab === 'kpi' && kpiStats && (
           <div style={{display:'grid', gridTemplateColumns: isMobile?'1fr':'repeat(4, 1fr)', gap:'20px'}}>
              <div style={styles.card}>
                 <div style={{fontSize:'12px', textTransform:'uppercase', color:'#6b7280', fontWeight: 600, letterSpacing: '0.5px'}}>Total Leads</div>
                 <div style={{fontSize:'36px', fontWeight:800, color: isDark?'white':'#1f2937', marginTop: '8px'}}>{kpiStats.totalLeads}</div>
              </div>
              <div style={styles.card}>
                 <div style={{fontSize:'12px', textTransform:'uppercase', color:'#2563eb', fontWeight: 600, letterSpacing: '0.5px'}}>Direct Asks</div>
                 <div style={{fontSize:'36px', fontWeight:800, color: '#2563eb', marginTop: '8px'}}>{kpiStats.directAskCount}</div>
              </div>
              <div style={styles.card}>
                 <div style={{fontSize:'12px', textTransform:'uppercase', color:'#16a34a', fontWeight: 600, letterSpacing: '0.5px'}}>Deals / Signed</div>
                 <div style={{fontSize:'36px', fontWeight:800, color: '#16a34a', marginTop: '8px'}}>{kpiStats.conversionCount}</div>
              </div>
              <div style={styles.card}>
                 <div style={{display: 'flex', alignItems: 'center', gap: '6px', fontSize:'12px', textTransform:'uppercase', color:'#d97706', fontWeight: 600, letterSpacing: '0.5px'}}>
                    <TrendingUp size={16} /> Conversion Rate
                 </div>
                 <div style={{fontSize:'36px', fontWeight:800, color: '#d97706', marginTop: '8px'}}>{conversionRate}%</div>
              </div>
           </div>
        )}

      </div>

      {/* MODAL ADD/EDIT LEAD */}
      <AnimatedModal isOpen={isModalOpen} onClose={handleCloseLeadModal} styles={styles}>
         <div style={{display:'flex', justifyContent:'space-between', marginBottom:'24px', alignItems: 'center'}}>
            <h2 style={{margin:0, fontSize:'20px', fontWeight: 700, color: isDark?'white':'#1f2937'}}>
               {editingLead ? 'Edit Lead' : 'Add New Lead'}
            </h2>
            <button onClick={handleCloseLeadModal} style={{background:'none', border:'none', cursor:'pointer', color:'#9ca3af', padding: '4px'}}>
              <X size={24}/>
            </button>
         </div>
         <AddLeadForm 
           styles={styles} 
           initialData={editingLead}
           onSubmit={handleFormSubmit}
         />
      </AnimatedModal>

    </div>
  );
}

// --- FORM COMPONENT ---
function AddLeadForm({ styles, initialData, onSubmit }: { styles: any, initialData: DailyLog | null, onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    rowNumber: 0, 
    name: '', url: '', industry: 'IT/Tech', source: '', 
    template: 'ATS Story', interactionType: 'Direct Ask', 
    tagged: true, notes: '', marketer: '', status: 'New', responseTime: '-'
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        rowNumber: initialData.rowNumber,
        name: initialData.leadName,
        url: initialData.profileUrl,
        industry: initialData.industry,
        source: initialData.source,
        template: initialData.template,
        interactionType: initialData.interactionType,
        tagged: initialData.tagged,
        notes: initialData.notes,
        marketer: initialData.marketer,
        status: initialData.status,
        responseTime: initialData.responseTime
      });
    }
  }, [initialData]);

  const handleChange = (e: any) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({...formData, [e.target.name]: value});
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{display:'flex', flexDirection:'column', gap:'16px'}}>
       <div>
         <label style={{display:'block', fontSize:'13px', marginBottom:'6px', color: '#6b7280', fontWeight: 500}}>Lead Name</label>
         <input required name="name" value={formData.name} onChange={handleChange} style={styles.input} placeholder="e.g. John Doe" />
       </div>
       <div>
         <label style={{display:'block', fontSize:'13px', marginBottom:'6px', color: '#6b7280', fontWeight: 500}}>Bukti Google Drive (Link)</label>
         <input required type="url" name="url" value={formData.url} onChange={handleChange} style={styles.input} placeholder="https://drive.google.com/..." />
       </div>
       <div style={{display:'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
         <div>
           <label style={{display:'block', fontSize:'13px', marginBottom:'6px', color: '#6b7280', fontWeight: 500}}>Industry</label>
           <input name="industry" value={formData.industry} onChange={handleChange} style={styles.input} placeholder="IT, Finance..." />
         </div>
         <div>
           <label style={{display:'block', fontSize:'13px', marginBottom:'6px', color: '#6b7280', fontWeight: 500}}>Source / Post</label>
           <input name="source" placeholder="e.g. Viral Post #1" value={formData.source} onChange={handleChange} style={styles.input} />
         </div>
       </div>
       
       <div style={{display:'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
         <div>
            <label style={{display:'block', fontSize:'13px', marginBottom:'6px', color: '#6b7280', fontWeight: 500}}>Type</label>
            <select name="interactionType" value={formData.interactionType} onChange={handleChange} style={styles.input}>
               <option>Direct Ask</option>
               <option>Offered</option>
            </select>
         </div>
         <div>
            <label style={{display:'block', fontSize:'13px', marginBottom:'6px', color: '#6b7280', fontWeight: 500}}>Marketer Name</label>
            <input required name="marketer" value={formData.marketer} onChange={handleChange} style={styles.input} placeholder="Your Name" />
         </div>
       </div>

       {initialData && (
          <div>
            <label style={{display:'block', fontSize:'13px', marginBottom:'6px', color: '#6b7280', fontWeight: 500}}>Status</label>
            <select name="status" value={formData.status} onChange={handleChange} style={styles.input}>
               <option>New</option>
               <option>In Progress</option>
               <option>Deal/Signed</option>
               <option>Closed/Lost</option>
            </select>
         </div>
       )}

       <div style={{display: 'flex', alignItems: 'center'}}>
          <label style={{display:'flex', alignItems:'center', gap: '8px', cursor: 'pointer', fontSize:'13px', color: '#374151', fontWeight: 500}}>
            <input type="checkbox" name="tagged" checked={formData.tagged} onChange={handleChange} style={{width: '16px', height: '16px'}} />
            Tagged in comments?
          </label>
       </div>
       
       <div>
         <label style={{display:'block', fontSize:'13px', marginBottom:'6px', color: '#6b7280', fontWeight: 500}}>Notes</label>
         <textarea name="notes" value={formData.notes} onChange={handleChange} style={{...styles.input, height:'80px', fontFamily: 'inherit'}} placeholder="Any additional details..." />
       </div>
       
       <button type="submit" style={{...styles.btnPrimary, justifyContent:'center', marginTop:'12px', padding: '12px'}}>
         {initialData ? 'Update Lead' : 'Save Lead'}
       </button>
    </form>
  );
}