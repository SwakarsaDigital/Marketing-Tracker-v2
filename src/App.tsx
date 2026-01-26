import React, { useEffect, useState, useMemo, useRef } from 'react';

// --- ICONS (INLINE SVG) ---
// Updated icons to accept ...props (style, className, etc.)
const FileText = ({ size = 20, color = 'currentColor', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
);
const Users = ({ size = 20, color = 'currentColor', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
);
const BarChart2 = ({ size = 20, color = 'currentColor', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
);
const AlertCircle = ({ size = 20, color = 'currentColor', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
);
const Save = ({ size = 20, color = 'currentColor', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
);
const Download = ({ size = 20, color = 'currentColor', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
);
const Upload = ({ size = 20, color = 'currentColor', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
);
const Cloud = ({ size = 20, color = 'currentColor', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>
);
const CloudOff = ({ size = 20, color = 'currentColor', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22.61 16.95A5 5 0 0 0 18 10h-1.26a8 8 0 0 0-7.05-6M5 5a8 8 0 0 0 4 15h9a5 5 0 0 0 1.7-.3"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
);
const Trash = ({ size = 20, color = 'currentColor', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
);
const Eye = ({ size = 20, color = 'currentColor', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
);
const LinkIcon = ({ size = 16, color = 'currentColor', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
);
const Menu = ({ size = 24, color = 'currentColor', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
);
const X = ({ size = 24, color = 'currentColor', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);
const Filter = ({ size = 20, color = 'currentColor', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
);
const SearchIcon = ({ size = 20, color = 'currentColor', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);

// --- KONFIGURASI FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyBDIPq0mDqwit2NvtgalMbB3I0oJNxFBrs",
  authDomain: "marketingtracker-55ace.firebaseapp.com",
  projectId: "marketingtracker-55ace",
  storageBucket: "marketingtracker-55ace.firebasestorage.app",
  messagingSenderId: "59624339475",
  appId: "1:59624339475:web:3f34f6aea8cb054b82a7e6",
  measurementId: "G-6W0WVHMYJY"
};

// --- DATA TYPES & INTERFACES ---
interface DailyLog {
  id: number;
  date: string;
  leadName: string;
  profileUrl: string;
  industry: string;
  source: string;
  template: string;
  interactionType: 'They Asked Directly' | 'We Offered Link';
  tagged: boolean;
  responseTime: '< 2 Hours (Ideal)' | '< 24 Hours (Acceptable)' | '48+ Hours (Too Slow)';
  status: 'Link Sent' | 'Signed Up' | 'Upgraded to Paid' | 'Ghosted';
  notes: string;
}

interface InfluencerData {
  id: number;
  name: string;
  followers: string;
  code: string;
  dateCreated: string;
  leads: number;
  status: 'Active' | 'Inactive';
}

interface AppData {
  dailyLogs: DailyLog[];
  influencers: InfluencerData[];
}

// --- DATA MOCKUP (EMPTY) ---
const DEFAULT_DATA: AppData = {
  dailyLogs: [],
  influencers: []
};

// --- RESPONSIVE HOOK ---
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(window.matchMedia(query).matches);
  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) setMatches(media.matches);
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);
  return matches;
}

// --- DYNAMIC STYLES ---
const getStyles = (isDark: boolean, isMobile: boolean) => ({
  container: { 
    fontFamily: 'Segoe UI, sans-serif', 
    fontSize: '14px', 
    color: isDark ? '#f9fafb' : '#333', 
    height: '100vh', 
    width: '100vw', 
    margin: 0,
    padding: 0,
    display: 'flex', 
    flexDirection: 'column' as const, 
    backgroundColor: isDark ? '#111827' : '#f9fafb',
    overflow: 'hidden',
    transition: 'background-color 0.3s, color 0.3s'
  },
  header: { 
    backgroundColor: '#166534', 
    color: 'white', 
    padding: isMobile ? '10px 16px' : '15px 20px', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    zIndex: 20
  },
  tabBar: { 
    display: isMobile ? 'none' : 'flex', 
    borderBottom: isDark ? '1px solid #374151' : '1px solid #e5e7eb', 
    backgroundColor: isDark ? '#1f2937' : 'white' 
  },
  tab: (isActive: boolean) => ({
    padding: '12px 20px', 
    cursor: 'pointer', 
    borderBottom: isActive ? '3px solid #166534' : '3px solid transparent',
    color: isActive ? '#22c55e' : (isDark ? '#9ca3af' : '#6b7280'), 
    fontWeight: isActive ? 600 : 500, 
    display: 'flex', 
    alignItems: 'center', 
    gap: '8px',
    backgroundColor: isActive ? (isDark ? '#064e3b' : '#f0fdf4') : 'transparent', 
    transition: 'all 0.2s'
  }),
  content: { 
    padding: isMobile ? '15px' : '20px', 
    overflow: 'auto', 
    flex: 1, 
    width: '100%', 
    boxSizing: 'border-box' as const 
  },
  table: { 
    width: '100%', 
    borderCollapse: 'collapse' as const, 
    backgroundColor: isDark ? '#1f2937' : 'white', 
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
  },
  th: { 
    padding: '12px', 
    border: isDark ? '1px solid #374151' : '1px solid #e5e7eb', 
    backgroundColor: isDark ? '#374151' : '#f3f4f6', 
    textAlign: 'left' as const, 
    fontSize: '12px', 
    fontWeight: 700, 
    color: isDark ? '#d1d5db' : '#4b5563', 
    whiteSpace: 'nowrap' as const 
  },
  td: { 
    padding: '8px 12px', 
    border: isDark ? '1px solid #374151' : '1px solid #e5e7eb', 
    fontSize: '13px', 
    color: isDark ? '#e5e7eb' : '#333'
  },
  input: { 
    width: '100%', 
    padding: '6px', 
    border: isDark ? '1px solid #4b5563' : '1px solid transparent', 
    borderRadius: '4px', 
    boxSizing: 'border-box' as const,
    backgroundColor: isDark ? '#111827' : 'white',
    color: isDark ? '#fff' : '#000'
  },
  select: { 
    width: '100%', 
    padding: '6px', 
    border: isDark ? '1px solid #4b5563' : '1px solid #d1d5db', 
    borderRadius: '4px', 
    backgroundColor: isDark ? '#111827' : 'white', 
    color: isDark ? '#fff' : '#000',
    boxSizing: 'border-box' as const 
  },
  badge: (color: string) => ({ 
    padding: '2px 8px', 
    borderRadius: '12px', 
    fontSize: '11px', 
    fontWeight: 600, 
    backgroundColor: color, 
    color: '#fff' 
  }),
  card: { 
    backgroundColor: isDark ? '#1f2937' : 'white', 
    padding: '20px', 
    borderRadius: '8px', 
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
    border: isDark ? '1px solid #374151' : '1px solid #e5e7eb' 
  },
  kpiValue: { 
    fontSize: '24px', 
    fontWeight: 700, 
    color: isDark ? '#fff' : '#111', 
    marginTop: '4px' 
  },
  kpiLabel: { 
    fontSize: '12px', 
    color: isDark ? '#9ca3af' : '#6b7280', 
    textTransform: 'uppercase' as const, 
    fontWeight: 600 
  },
  rulesBox: {
    backgroundColor: isDark ? '#422006' : '#fefce8', 
    color: isDark ? '#fef08a' : '#854d0e', 
    padding: '10px', 
    borderRadius: '6px', 
    border: isDark ? '1px solid #713f12' : '1px solid #fde047', 
    fontSize: '13px', 
    display: 'flex', 
    alignItems: 'center', 
    gap: '8px',
    marginBottom: '15px'
  },
  btnAction: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '6px 12px',
    fontSize: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginLeft: '8px',
    fontWeight: 600,
    transition: 'background-color 0.2s'
  },
  statusBadge: (isOnline: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '11px',
    padding: '4px 8px',
    borderRadius: '12px',
    backgroundColor: isOnline ? 'rgba(74, 222, 128, 0.2)' : 'rgba(251, 191, 36, 0.2)',
    color: isOnline ? '#86efac' : '#fcd34d',
    border: isOnline ? '1px solid #22c55e' : '1px solid #d97706'
  }),
  // --- Mobile Sidebar ---
  sidebarOverlay: {
    position: 'fixed' as const, top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 99,
    backdropFilter: 'blur(3px)'
  },
  sidebar: {
    position: 'fixed' as const, top: 0, right: 0, bottom: 0,
    width: '280px', backgroundColor: isDark ? '#1f2937' : 'white',
    zIndex: 100, boxShadow: '-4px 0 15px rgba(0,0,0,0.1)',
    display: 'flex', flexDirection: 'column' as const,
    transform: 'translateX(0)', transition: 'transform 0.3s ease-in-out'
  },
  sidebarItem: (isActive: boolean) => ({
    padding: '16px 24px', borderBottom: isDark ? '1px solid #374151' : '1px solid #f3f4f6',
    cursor: 'pointer', color: isActive ? '#16a34a' : (isDark ? '#e5e7eb' : '#333'),
    fontWeight: isActive ? 700 : 500, display: 'flex', alignItems: 'center', gap: '12px',
    backgroundColor: isActive ? (isDark ? '#064e3b' : '#f0fdf4') : 'transparent'
  }),
  // --- Modal Styles ---
  modalOverlay: {
    position: 'fixed' as const, top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)',
    display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
  },
  modalContent: {
    backgroundColor: isDark ? '#1f2937' : 'white',
    padding: '24px', borderRadius: '12px', width: '360px', maxWidth: '90%',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    textAlign: 'center' as const, border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
    animation: 'fadeIn 0.2s ease-out'
  },
  // View Modal specific styles (wider)
  viewModalContent: {
    backgroundColor: isDark ? '#1f2937' : 'white',
    padding: '30px', borderRadius: '12px', width: '500px', maxWidth: '95%',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
    textAlign: 'left' as const, border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
    animation: 'fadeIn 0.2s ease-out',
    maxHeight: '90vh', overflowY: 'auto' as const
  },
  viewRow: {
    display: 'flex', borderBottom: isDark ? '1px solid #374151' : '1px solid #f3f4f6',
    padding: '12px 0'
  },
  viewLabel: {
    width: '140px', fontWeight: 600, color: isDark ? '#9ca3af' : '#6b7280', fontSize: '13px', flexShrink: 0
  },
  viewValue: {
    flex: 1, color: isDark ? '#f3f4f6' : '#111827', fontSize: '14px', wordBreak: 'break-word' as const
  },
  btnDelete: {
    backgroundColor: '#dc2626', color: 'white', padding: '10px 20px', borderRadius: '6px',
    border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '14px',
    transition: 'background-color 0.2s', display: 'flex', alignItems: 'center', gap: '6px'
  },
  btnCancel: {
    backgroundColor: isDark ? '#374151' : '#f3f4f6', 
    color: isDark ? '#d1d5db' : '#4b5563', 
    padding: '10px 20px', borderRadius: '6px', border: '1px solid transparent',
    cursor: 'pointer', fontWeight: 600, fontSize: '14px',
    transition: 'background-color 0.2s'
  },
  actionIcon: {
    cursor: 'pointer', opacity: 0.8,
    transition: 'opacity 0.2s', padding: '6px', borderRadius: '4px',
    display: 'flex', alignItems: 'center', justifyContent: 'center'
  },
  // --- Filter & Search Styles ---
  filterContainer: {
    display: 'flex', alignItems: 'center', gap: '8px', 
    backgroundColor: isDark ? '#374151' : 'white',
    border: isDark ? '1px solid #4b5563' : '1px solid #d1d5db',
    borderRadius: '6px', padding: '0 8px', height: '38px', flexShrink: 0
  },
  filterSelect: {
    border: 'none', backgroundColor: 'transparent', 
    color: isDark ? '#fff' : '#333', fontSize: '13px', 
    fontWeight: 500, outline: 'none', cursor: 'pointer'
  },
  searchContainer: {
    display: 'flex', alignItems: 'center', gap: '8px',
    backgroundColor: isDark ? '#374151' : 'white',
    border: isDark ? '1px solid #4b5563' : '1px solid #d1d5db',
    borderRadius: '6px', padding: '0 12px', height: '38px',
    flex: 1, minWidth: '150px'
  },
  searchInput: {
    border: 'none', backgroundColor: 'transparent', width: '100%',
    color: isDark ? '#fff' : '#333', fontSize: '13px', outline: 'none'
  }
});

// --- KOMPONEN UTAMA ---
const MarketingTracker = () => {
  const [activeTab, setActiveTab] = useState<'daily' | 'influencer' | 'kpi'>('daily');
  const [data, setData] = useState<AppData>(DEFAULT_DATA);
  const [lastSaved, setLastSaved] = useState<string>('');
  const [storageMode, setStorageMode] = useState<'LOCAL' | 'FIREBASE'>('LOCAL');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [viewId, setViewId] = useState<number | null>(null);
  const [filterTime, setFilterTime] = useState('All Time');
  const [searchQuery, setSearchQuery] = useState('');
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dbRef = useRef<any>(null);

  const [isDark, setIsDark] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const styles = useMemo(() => getStyles(isDark, isMobile), [isDark, isMobile]);

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) setIsDark(true);
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => setIsDark(event.matches));

    const isFirebaseConfigured = firebaseConfig.apiKey && firebaseConfig.apiKey !== "ISI_API_KEY_DISINI";
    if (isFirebaseConfigured) {
      setStorageMode('FIREBASE');
      initFirebase();
    } else {
      setStorageMode('LOCAL');
      initLocal();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        if (activeTab !== 'daily') setActiveTab('daily');
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab]);

  const initLocal = () => {
    const saved = localStorage.getItem('marketing_tracker_data');
    if (saved) {
      try { setData(JSON.parse(saved)); setLastSaved('Loaded from Local'); } 
      catch (e) { console.error(e); }
    } else { saveData(DEFAULT_DATA, 'LOCAL'); }
  };

  const initFirebase = async () => {
    if (!(window as any).firebase) {
      await loadScript("https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js");
      await loadScript("https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js");
    }
    const firebase = (window as any).firebase;
    if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
    dbRef.current = db;
    db.collection('marketing_data').doc('team_sheet').onSnapshot((doc: any) => {
      if (doc.exists) { setData(doc.data()); setLastSaved(`Synced (${new Date().toLocaleTimeString()})`); } 
      else { db.collection('marketing_data').doc('team_sheet').set(DEFAULT_DATA); }
    });
  };

  const loadScript = (src: string) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      document.body.appendChild(script);
    });
  };

  const saveData = (newData: AppData, mode = storageMode) => {
    setData(newData); 
    if (mode === 'LOCAL') {
      localStorage.setItem('marketing_tracker_data', JSON.stringify(newData));
      setLastSaved(`Saved Locally (${new Date().toLocaleTimeString()})`);
    } else if (mode === 'FIREBASE' && dbRef.current) {
      setLastSaved('Syncing...');
      dbRef.current.collection('marketing_data').doc('team_sheet').set(newData)
        .then(() => setLastSaved(`Saved to Cloud (${new Date().toLocaleTimeString()})`))
        .catch(() => setLastSaved('Error Saving to Cloud'));
    }
  };

  const handleExport = () => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MarketingTracker_${storageMode}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsMenuOpen(false);
  };

  const updateDailyLog = (id: number, field: keyof DailyLog, value: any) => {
    const newLogs = data.dailyLogs.map(log => log.id === id ? { ...log, [field]: value } : log);
    saveData({ ...data, dailyLogs: newLogs });
  };

  const updateInfluencer = (id: number, field: keyof InfluencerData, value: any) => {
    const newInfluencers = data.influencers.map(inf => inf.id === id ? { ...inf, [field]: value } : inf);
    saveData({ ...data, influencers: newInfluencers });
  };

  const addNewRow = () => {
    const newId = Math.max(...data.dailyLogs.map(l => l.id), 0) + 1;
    const newRow: DailyLog = {
      id: newId, date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      leadName: "", profileUrl: "", industry: "", source: "", template: "", interactionType: "They Asked Directly",
      tagged: false, responseTime: "< 24 Hours (Acceptable)", status: "Link Sent", notes: ""
    };
    saveData({ ...data, dailyLogs: [...data.dailyLogs, newRow] });
  };

  const confirmDelete = () => {
    if (deleteId !== null) {
      if (activeTab === 'daily') {
        const newLogs = data.dailyLogs.filter(log => log.id !== deleteId);
        saveData({ ...data, dailyLogs: newLogs });
      } else if (activeTab === 'influencer') {
        const newInfluencers = data.influencers.filter(inf => inf.id !== deleteId);
        saveData({ ...data, influencers: newInfluencers });
      }
      setDeleteId(null);
    }
  };

  // Helper to find log for viewing
  const logToView = useMemo(() => {
    return data.dailyLogs.find(l => l.id === viewId);
  }, [data.dailyLogs, viewId]);

  // --- FILTER & SEARCH LOGIC ---
  const filteredLogs = useMemo(() => {
    let result = data.dailyLogs;

    if (filterTime !== 'All Time') {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      result = result.filter(log => {
        const logDate = new Date(log.date);
        if (filterTime === 'Today') return logDate >= startOfDay;
        if (filterTime === 'Last 7 Days') {
          const sevenDaysAgo = new Date(now);
          sevenDaysAgo.setDate(now.getDate() - 7);
          return logDate >= sevenDaysAgo;
        }
        if (filterTime === 'This Month') {
          return logDate.getMonth() === now.getMonth() && logDate.getFullYear() === now.getFullYear();
        }
        return true;
      });
    }

    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(log => 
        log.leadName.toLowerCase().includes(lowerQuery)
      );
    }

    return result;
  }, [data.dailyLogs, filterTime, searchQuery]);

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
          {isMobile && (
            <div onClick={() => setIsMenuOpen(true)} style={{cursor: 'pointer'}}>
              <Menu size={24} />
            </div>
          )}
          
          <FileText size={isMobile ? 20 : 24} />
          <div>
            <h1 style={{fontSize: isMobile ? '14px' : '16px', margin:0, fontWeight:700, whiteSpace: 'nowrap'}}>
              {isMobile ? 'Marketing Tracker' : 'Marketing Performance Tracker'}
            </h1>
            {!isMobile && (
              <div style={{display:'flex', alignItems:'center', gap:'6px', marginTop:'2px'}}>
                <span style={{fontSize:'11px', opacity:0.8}}>Mode:</span>
                <div style={styles.statusBadge(storageMode === 'FIREBASE')}>
                  {storageMode === 'FIREBASE' ? <Cloud size={10} /> : <CloudOff size={10} />}
                  {storageMode === 'FIREBASE' ? 'ONLINE' : 'OFFLINE'}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {!isMobile && (
          <div style={{display:'flex', alignItems:'center'}}>
            <div style={{fontSize:'12px', display:'flex', alignItems:'center', gap:'5px', padding:'0 10px', color:'rgba(255,255,255,0.8)'}}>
              <Save size={14} /> {lastSaved}
            </div>
            <button onClick={handleExport} style={styles.btnAction} title="Download Backup"><Download size={14} /> Export</button>
            <button onClick={() => setIsDark(!isDark)} style={{marginLeft: '15px', background: 'none', border: '1px solid rgba(255,255,255,0.4)', color: 'white', borderRadius: '4px', cursor: 'pointer', fontSize: '10px', padding: '4px 8px'}}>
              {isDark ? '☀ Light' : '☾ Dark'}
            </button>
          </div>
        )}

        {isMobile && (
          <div style={{fontSize:'10px', opacity:0.8, display: 'flex', alignItems: 'center', gap: '4px'}}>
             {lastSaved ? <Cloud size={14}/> : <Save size={14}/>}
          </div>
        )}
      </div>

      {/* TABS */}
      <div style={styles.tabBar}>
        <div onClick={() => setActiveTab('daily')} style={styles.tab(activeTab === 'daily')}>
          <Users size={16} /> TAB 1: Daily Engagement
        </div>
        <div onClick={() => setActiveTab('influencer')} style={styles.tab(activeTab === 'influencer')}>
          <Users size={16} /> TAB 2: Influencer & Code
        </div>
        <div onClick={() => setActiveTab('kpi')} style={styles.tab(activeTab === 'kpi')}>
          <BarChart2 size={16} /> TAB 3: Weekly KPI
        </div>
      </div>

      {/* MOBILE SIDEBAR MENU */}
      {isMobile && isMenuOpen && (
        <>
          <div style={styles.sidebarOverlay} onClick={() => setIsMenuOpen(false)} />
          <div style={styles.sidebar}>
            <div style={{padding: '20px', borderBottom: isDark ? '1px solid #374151' : '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <h2 style={{margin: 0, fontSize: '18px', fontWeight: 'bold', color: isDark ? 'white' : '#166534'}}>Menu</h2>
              <div onClick={() => setIsMenuOpen(false)} style={{cursor: 'pointer', color: isDark ? '#9ca3af' : '#6b7280'}}><X size={24}/></div>
            </div>
            
            <div style={{flex: 1, overflowY: 'auto'}}>
              <div style={{padding: '16px 24px', fontSize: '12px', textTransform: 'uppercase', color: '#9ca3af', fontWeight: 600}}>Navigation</div>
              <div onClick={() => {setActiveTab('daily'); setIsMenuOpen(false)}} style={styles.sidebarItem(activeTab === 'daily')}>
                <Users size={18} /> Daily Engagement
              </div>
              <div onClick={() => {setActiveTab('influencer'); setIsMenuOpen(false)}} style={styles.sidebarItem(activeTab === 'influencer')}>
                <Users size={18} /> Influencer Strategy
              </div>
              <div onClick={() => {setActiveTab('kpi'); setIsMenuOpen(false)}} style={styles.sidebarItem(activeTab === 'kpi')}>
                <BarChart2 size={18} /> Weekly KPI
              </div>

              <div style={{margin: '10px 0', borderTop: isDark ? '1px solid #374151' : '1px solid #f3f4f6'}}></div>
              
              <div style={{padding: '16px 24px', fontSize: '12px', textTransform: 'uppercase', color: '#9ca3af', fontWeight: 600}}>Actions</div>
              <div onClick={handleExport} style={styles.sidebarItem(false)}>
                <Download size={18} /> Export Data
              </div>
              <div onClick={() => setIsDark(!isDark)} style={styles.sidebarItem(false)}>
                {isDark ? '☀ Switch to Light Mode' : '☾ Switch to Dark Mode'}
              </div>
            </div>

            <div style={{padding: '20px', fontSize: '12px', textAlign: 'center', color: '#9ca3af', borderTop: isDark ? '1px solid #374151' : '1px solid #f3f4f6'}}>
              Mode: <span style={{color: storageMode === 'FIREBASE' ? '#22c55e' : '#f59e0b', fontWeight: 'bold'}}>{storageMode === 'FIREBASE' ? 'Online Sync' : 'Local Storage'}</span>
            </div>
          </div>
        </>
      )}

      {/* CONTENT AREA */}
      <div style={styles.content}>
        {/* TAB 1: DAILY TRACKER */}
        {activeTab === 'daily' && (
          <div style={{ width: '100%' }}>
            <div style={{marginBottom:'15px', display:'flex', justifyContent:'space-between', alignItems:'center', flexDirection: isMobile ? 'column' : 'row', gap: '10px'}}>
              <div style={{...styles.rulesBox, marginBottom: 0, width: isMobile ? '100%' : 'auto', boxSizing: 'border-box'}}>
                <AlertCircle size={16} style={{minWidth: '16px'}}/>
                <span><strong>Rules:</strong> Don't spam. Red = Too Slow (48h+).</span>
              </div>
              
              <div style={{display: 'flex', gap: '10px', width: isMobile ? '100%' : 'auto', flexWrap: isMobile ? 'wrap' : 'nowrap'}}>
                {/* Search Input */}
                <div style={styles.searchContainer}>
                  <SearchIcon size={16} color={isDark ? '#9ca3af' : '#6b7280'} />
                  <input 
                    ref={searchInputRef}
                    style={styles.searchInput}
                    placeholder="Search name... (Ctrl+F)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Time Filter */}
                <div style={styles.filterContainer}>
                  <Filter size={16} color={isDark ? '#9ca3af' : '#6b7280'} />
                  <select 
                    style={styles.filterSelect}
                    value={filterTime}
                    onChange={(e) => setFilterTime(e.target.value)}
                  >
                    <option value="All Time">All</option>
                    <option value="Today">Today</option>
                    <option value="Last 7 Days">7 Days</option>
                    <option value="This Month">Month</option>
                  </select>
                </div>

                <button onClick={addNewRow} style={{backgroundColor:'#166534', color:'white', border:'none', padding:'8px 16px', borderRadius:'6px', cursor:'pointer', fontWeight:600, flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', minWidth: '100px'}}>
                  <span>+</span> Add
                </button>
              </div>
            </div>
            
            <div style={{overflowX: 'auto', border: isDark ? '1px solid #374151' : '1px solid #e5e7eb', borderRadius: '8px'}}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Lead Name</th>
                  <th style={styles.th}>LinkedIn URL</th>
                  <th style={styles.th}>Industry/Role</th>
                  <th style={styles.th}>Source</th>
                  <th style={styles.th}>Template</th>
                  <th style={styles.th}>Interaction Type</th>
                  <th style={styles.th} title="Jonathan Tagged?">Jon?</th>
                  <th style={styles.th}>Response Time</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Notes</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={12} style={{...styles.td, textAlign: 'center', padding: '20px', color: '#9ca3af'}}>
                      {data.dailyLogs.length === 0 ? 'No data yet. Click "+ Add" to add new lead.' : 'No data matches filter/search criteria.'}
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((row) => (
                    <tr key={row.id}>
                      <td style={styles.td}>{row.date}</td>
                      <td style={styles.td}>
                        <input style={styles.input} value={row.leadName} onChange={(e) => updateDailyLog(row.id, 'leadName', e.target.value)} placeholder="Name..." />
                      </td>
                      <td style={styles.td}>
                        <div style={{display:'flex', alignItems:'center', gap:'4px'}}>
                          <input style={styles.input} value={row.profileUrl} onChange={(e) => updateDailyLog(row.id, 'profileUrl', e.target.value)} placeholder="URL..." />
                          {row.profileUrl && <a href={row.profileUrl} target="_blank" rel="noreferrer" style={{color:'#0a66c2'}}><LinkIcon size={14}/></a>}
                        </div>
                      </td>
                      <td style={styles.td}><input style={styles.input} value={row.industry} onChange={(e) => updateDailyLog(row.id, 'industry', e.target.value)} placeholder="Industry..." /></td>
                      <td style={styles.td}><input style={styles.input} value={row.source} onChange={(e) => updateDailyLog(row.id, 'source', e.target.value)} placeholder="Source..." /></td>
                      <td style={styles.td}><input style={styles.input} value={row.template} onChange={(e) => updateDailyLog(row.id, 'template', e.target.value)} placeholder="Template..." /></td>
                      <td style={styles.td}>
                        <select style={styles.select} value={row.interactionType} onChange={(e) => updateDailyLog(row.id, 'interactionType', e.target.value)}>
                          <option>They Asked Directly</option>
                          <option>We Offered Link</option>
                        </select>
                      </td>
                      <td style={{...styles.td, textAlign:'center'}}>
                        <input type="checkbox" checked={row.tagged} onChange={(e) => updateDailyLog(row.id, 'tagged', e.target.checked)} />
                      </td>
                      <td style={styles.td}>
                        <select style={{...styles.select, backgroundColor: row.responseTime.includes("48+") ? (isDark ? '#7f1d1d' : '#fee2e2') : (isDark ? '#111827' : 'white')}} value={row.responseTime} onChange={(e) => updateDailyLog(row.id, 'responseTime', e.target.value)}>
                          <option value="< 2 Hours (Ideal)">&lt; 2 Hours</option>
                          <option value="< 24 Hours (Acceptable)">&lt; 24 Hours</option>
                          <option value="48+ Hours (Too Slow)">48+ Hours</option>
                        </select>
                      </td>
                      <td style={styles.td}>
                        <select style={styles.select} value={row.status} onChange={(e) => updateDailyLog(row.id, 'status', e.target.value)}>
                          <option>Link Sent</option>
                          <option>Signed Up</option>
                          <option>Upgraded to Paid</option>
                          <option>Ghosted</option>
                        </select>
                      </td>
                      <td style={styles.td}><input style={styles.input} value={row.notes} onChange={(e) => updateDailyLog(row.id, 'notes', e.target.value)} placeholder="Notes..." /></td>
                      <td style={styles.td}>
                        <div style={{display:'flex', justifyContent: 'center', gap: '8px'}}>
                          <button onClick={() => setViewId(row.id)} style={{background: 'none', border: 'none'}} title="View Details">
                            <div style={{...styles.actionIcon, color: '#3b82f6'}}><Eye size={16} /></div>
                          </button>
                          <button onClick={() => setDeleteId(row.id)} style={{background: 'none', border: 'none'}} title="Delete">
                            <div style={{...styles.actionIcon, color: '#ef4444'}}><Trash size={16} /></div>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            </div>
          </div>
        )}

        {/* TAB 2: INFLUENCER */}
        {activeTab === 'influencer' && (
          <div style={{maxWidth: '800px', width: '100%'}}>
            <h2 style={{fontSize:'18px', fontWeight:700, marginBottom:'15px', color: isDark ? '#fff' : '#333'}}>Influencer Code Tracking</h2>
            <div style={{overflowX: 'auto', border: isDark ? '1px solid #374151' : '1px solid #e5e7eb', borderRadius: '8px'}}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Influencer Name</th>
                  <th style={styles.th}>Followers</th>
                  <th style={styles.th}>Code Generated</th>
                  <th style={styles.th}>Created Date</th>
                  <th style={styles.th}>Total Leads</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.influencers.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{...styles.td, textAlign: 'center', padding: '20px', color: '#9ca3af'}}>
                      No influencer data yet.
                    </td>
                  </tr>
                ) : (
                  data.influencers.map((inf) => (
                    <tr key={inf.id}>
                      <td style={styles.td}><input style={styles.input} value={inf.name} onChange={(e) => updateInfluencer(inf.id, 'name', e.target.value)} placeholder="Name..." /></td>
                      <td style={styles.td}><input style={styles.input} value={inf.followers} onChange={(e) => updateInfluencer(inf.id, 'followers', e.target.value)} placeholder="Followers..." /></td>
                      <td style={styles.td}><code style={{backgroundColor: isDark ? '#374151' : '#f3f4f6', padding:'2px 6px', borderRadius:'4px', color: isDark ? '#a78bfa' : '#7c3aed', fontWeight:'bold'}}>{inf.code}</code></td>
                      <td style={styles.td}>{inf.dateCreated}</td>
                      <td style={styles.td}><strong>{inf.leads}</strong></td>
                      <td style={styles.td}><span style={styles.badge('#16a34a')}>{inf.status}</span></td>
                      <td style={{...styles.td, textAlign: 'center'}}>
                        <button onClick={() => setDeleteId(inf.id)} style={{background: 'none', border: 'none'}}><div style={{...styles.actionIcon, color: '#ef4444'}}><Trash size={16} /></div></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            </div>
          </div>
        )}

        {/* TAB 3: KPI DASHBOARD */}
        {activeTab === 'kpi' && (
          <div style={{ width: '100%' }}>
             <div style={{display:'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))', gap:'20px', marginBottom:'30px'}}>
                <div style={styles.card}>
                  <div style={styles.kpiLabel}>Total Warm Leads</div>
                  <div style={{...styles.kpiValue, color: '#2563eb'}}>
                    {data.dailyLogs.length}
                  </div>
                  <div style={{fontSize:'12px', color: isDark ? '#9ca3af' : '#6b7280', marginTop:'5px'}}>Weekly Count</div>
                </div>
                <div style={styles.card}>
                  <div style={styles.kpiLabel}>Total Ad Spend</div>
                  <div style={{...styles.kpiValue, color: '#16a34a'}}>$0</div>
                  <div style={{fontSize:'12px', color: isDark ? '#9ca3af' : '#6b7280', marginTop:'5px'}}>Organic Strategy</div>
                </div>
                <div style={styles.card}>
                  <div style={styles.kpiLabel}>Avg Response Time</div>
                  <div style={styles.kpiValue}>
                    {data.dailyLogs.length > 0 ? "< 2h" : "-"}
                  </div>
                  <div style={{fontSize:'12px', color: isDark ? '#9ca3af' : '#6b7280', marginTop:'5px'}}>Within Target</div>
                </div>
             </div>

             <div style={{display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap:'20px', minWidth: isMobile ? 'auto' : '600px'}}>
                <div style={styles.card}>
                  <h3 style={{fontSize:'14px', fontWeight:700, marginBottom:'15px', borderBottom: isDark ? '1px solid #374151' : '1px solid #eee', paddingBottom:'10px', color: isDark ? '#fff' : '#333'}}>Benchmark Reference</h3>
                  <table style={{width:'100%', fontSize:'13px'}}>
                    <tbody>
                      <tr><td style={{padding:'8px', color:'#16a34a', fontWeight:'bold'}}>Excellent</td><td style={{padding:'8px'}}>5+ direct asks</td></tr>
                      <tr><td style={{padding:'8px', color:'#2563eb', fontWeight:'bold'}}>Good</td><td style={{padding:'8px'}}>2-4 direct asks</td></tr>
                      <tr><td style={{padding:'8px', color:'#ca8a04', fontWeight:'bold'}}>Average</td><td style={{padding:'8px'}}>1 direct ask</td></tr>
                      <tr><td style={{padding:'8px', color:'#dc2626', fontWeight:'bold'}}>Poor</td><td style={{padding:'8px'}}>No engagement</td></tr>
                    </tbody>
                  </table>
                </div>

                <div style={styles.card}>
                  <h3 style={{fontSize:'14px', fontWeight:700, marginBottom:'15px', borderBottom: isDark ? '1px solid #374151' : '1px solid #eee', paddingBottom:'10px', color: isDark ? '#fff' : '#333'}}>Source Analysis</h3>
                  <div style={{marginBottom:'15px'}}>
                    <div style={{fontSize:'12px', color: isDark ? '#9ca3af' : '#6b7280'}}>Best Performing Industry</div>
                    <div style={{fontWeight:'bold', fontSize:'16px', color: isDark ? '#fff' : '#333'}}>
                      {data.dailyLogs.length > 0 ? "Engineering / Tech" : "-"}
                    </div>
                  </div>
                  <div>
                    <div style={{fontSize:'12px', color: isDark ? '#9ca3af' : '#6b7280'}}>Best Performing Template</div>
                    <div style={{fontWeight:'bold', fontSize:'16px', color: isDark ? '#fff' : '#333'}}>
                      {data.dailyLogs.length > 0 ? "ATS Story" : "-"}
                    </div>
                  </div>
                </div>
             </div>
          </div>
        )}
      </div>

      {/* VIEW DETAILS MODAL */}
      {viewId !== null && logToView && (
        <div style={styles.modalOverlay} onClick={() => setViewId(null)}>
          <div style={styles.viewModalContent} onClick={e => e.stopPropagation()}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: isDark ? '1px solid #374151' : '1px solid #e5e7eb', paddingBottom: '10px'}}>
              <h3 style={{fontSize: '20px', fontWeight: 700, margin: 0, color: isDark ? '#fff' : '#111'}}>Lead Details</h3>
              <button onClick={() => setViewId(null)} style={{background: 'none', border: 'none', cursor: 'pointer', color: isDark ? '#9ca3af' : '#6b7280'}}>
                <X size={24} />
              </button>
            </div>
            
            <div style={styles.viewRow}>
              <div style={styles.viewLabel}>Date</div>
              <div style={styles.viewValue}>{logToView.date}</div>
            </div>
            <div style={styles.viewRow}>
              <div style={styles.viewLabel}>Lead Name</div>
              <div style={styles.viewValue}>{logToView.leadName}</div>
            </div>
            <div style={styles.viewRow}>
              <div style={styles.viewLabel}>LinkedIn Profile</div>
              <div style={styles.viewValue}>
                {logToView.profileUrl ? (
                  <a href={logToView.profileUrl} target="_blank" rel="noreferrer" style={{color:'#2563eb', display:'flex', alignItems:'center', gap:'4px'}}>
                    {logToView.profileUrl} <LinkIcon size={12}/>
                  </a>
                ) : '-'}
              </div>
            </div>
            <div style={styles.viewRow}>
              <div style={styles.viewLabel}>Industry/Role</div>
              <div style={styles.viewValue}>{logToView.industry || '-'}</div>
            </div>
            <div style={styles.viewRow}>
              <div style={styles.viewLabel}>Source</div>
              <div style={styles.viewValue}>{logToView.source || '-'}</div>
            </div>
            <div style={styles.viewRow}>
              <div style={styles.viewLabel}>Template Used</div>
              <div style={styles.viewValue}>{logToView.template || '-'}</div>
            </div>
            <div style={styles.viewRow}>
              <div style={styles.viewLabel}>Interaction Type</div>
              <div style={styles.viewValue}>{logToView.interactionType}</div>
            </div>
            <div style={styles.viewRow}>
              <div style={styles.viewLabel}>Jonathan Tagged?</div>
              <div style={styles.viewValue}>{logToView.tagged ? 'Yes' : 'No'}</div>
            </div>
            <div style={styles.viewRow}>
              <div style={styles.viewLabel}>Response Time</div>
              <div style={styles.viewValue}>
                <span style={{
                  padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600,
                  backgroundColor: logToView.responseTime.includes("48+") ? (isDark ? '#7f1d1d' : '#fee2e2') : (isDark ? '#111827' : '#f0fdf4'),
                  color: logToView.responseTime.includes("48+") ? (isDark ? '#fca5a5' : '#dc2626') : (isDark ? '#fff' : '#166534')
                }}>
                  {logToView.responseTime}
                </span>
              </div>
            </div>
            <div style={styles.viewRow}>
              <div style={styles.viewLabel}>Status</div>
              <div style={styles.viewValue}>{logToView.status}</div>
            </div>
            <div style={{...styles.viewRow, borderBottom: 'none'}}>
              <div style={styles.viewLabel}>Notes</div>
              <div style={styles.viewValue}>{logToView.notes || '-'}</div>
            </div>

            <div style={{marginTop: '24px', display: 'flex', justifyContent: 'flex-end'}}>
              <button style={styles.btnCancel} onClick={() => setViewId(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteId !== null && (
        <div style={styles.modalOverlay} onClick={() => setDeleteId(null)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={{margin: '0 auto 16px', width: '48px', height: '48px', borderRadius: '50%', backgroundColor: isDark ? '#7f1d1d' : '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626'}}>
              <AlertCircle size={24} />
            </div>
            <h3 style={{fontSize: '18px', fontWeight: 700, marginBottom: '8px', color: isDark ? '#fff' : '#111'}}>Delete Data?</h3>
            <p style={{fontSize: '14px', color: isDark ? '#9ca3af' : '#6b7280', marginBottom: '24px'}}>Are you sure you want to delete this data? This action cannot be undone.</p>
            <div style={{display: 'flex', gap: '12px', justifyContent: 'center'}}>
              <button style={styles.btnCancel} onClick={() => setDeleteId(null)}>Cancel</button>
              <button style={styles.btnDelete} onClick={confirmDelete}><Trash size={16} /> Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- APP WRAPPER ---
function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, overflow: 'hidden' }}>
      <MarketingTracker />
    </div>
  );
}

export default App;