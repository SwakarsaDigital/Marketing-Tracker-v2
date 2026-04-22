import React, { useEffect, useState, useMemo } from 'react';
import { 
  FileText, Users, BarChart2, RefreshCw, Link as LinkIcon, X, 
  Search as SearchIcon, CheckSquare, Shield, Lock, Download, Edit, Trash2, Menu as MenuIcon, 
  TrendingUp, AlertCircle, CheckCircle2 
} from 'lucide-react';

// --- CONFIGURATION ---
// URL Google Apps Script Anda
const GAS_API_URL = "https://script.google.com/macros/s/AKfycbx0TaLAHHMxE3JANtOYcmhQIZxxHsBXLkoGFAqr4Fdy8M6_SIWScP8o90cFRsTS9l2r/exec";
const SECURITY_PIN = "Yoyomagey1@"; 

// --- TYPES & INTERFACES ---
export interface DailyLog {
  id: number;
  rowNumber: number; 
  date: string; 
  rawDateIso: string; 
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
  email: string;
  approvalStatus: 'None' | 'Pending' | 'Approved' | 'Declined';
}

export interface NotificationState {
  message: string;
  type: 'success' | 'error' | 'info';
}

// --- INLINE STYLES (Menggantikan lxStyles.ts) ---
const LXStyles = (isDark: boolean, isMobile: boolean) => ({
  container: { 
    backgroundColor: isDark ? '#111827' : '#f9fafb', 
    minHeight: '100vh', 
    fontFamily: 'system-ui, -apple-system, sans-serif', 
    color: isDark ? '#f3f4f6' : '#111827' 
  },
  header: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: '16px 24px', 
    backgroundColor: isDark ? '#1f2937' : '#166534', 
    color: 'white',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  tabBar: { 
    display: isMobile ? 'none' : 'flex', 
    backgroundColor: isDark ? '#374151' : 'white', 
    borderBottom: isDark ? '1px solid #4b5563' : '1px solid #e5e7eb', 
    padding: '0 24px',
    overflowX: 'auto' as const
  },
  tab: (active: boolean) => ({ 
    padding: '12px 16px', 
    cursor: 'pointer', 
    borderBottom: active ? '2px solid #16a34a' : '2px solid transparent', 
    color: active ? (isDark ? '#4ade80' : '#16a34a') : (isDark ? '#9ca3af' : '#6b7280'), 
    fontWeight: active ? 600 : 500, 
    display: 'flex', 
    alignItems: 'center', 
    gap: '8px',
    whiteSpace: 'nowrap' as const
  }),
  content: { 
    padding: '24px',
    maxWidth: '1400px',
    margin: '0 auto'
  },
  card: { 
    backgroundColor: isDark ? '#1f2937' : 'white', 
    borderRadius: '12px', 
    padding: '20px', 
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    border: isDark ? '1px solid #374151' : '1px solid #e5e7eb'
  },
  table: { 
    width: '100%', 
    borderCollapse: 'collapse' as const, 
    fontSize: '13px' 
  },
  th: { 
    textAlign: 'left' as const, 
    padding: '12px 16px', 
    borderBottom: isDark ? '1px solid #4b5563' : '1px solid #e5e7eb', 
    backgroundColor: isDark ? '#374151' : '#f3f4f6', 
    color: isDark ? '#d1d5db' : '#374151', 
    fontWeight: 600,
    whiteSpace: 'nowrap' as const
  },
  td: { 
    padding: '12px 16px', 
    borderBottom: isDark ? '1px solid #4b5563' : '1px solid #e5e7eb', 
    color: isDark ? '#f3f4f6' : '#1f2937' 
  },
  input: { 
    padding: '10px 12px', 
    borderRadius: '8px', 
    border: isDark ? '1px solid #4b5563' : '1px solid #d1d5db', 
    backgroundColor: isDark ? '#374151' : 'white', 
    color: isDark ? 'white' : 'black', 
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s'
  },
  btnPrimary: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '8px', 
    padding: '10px 16px', 
    borderRadius: '8px', 
    backgroundColor: '#16a34a', 
    color: 'white', 
    border: 'none', 
    cursor: 'pointer', 
    fontWeight: 600,
    transition: 'background-color 0.2s'
  },
  actionBtn: { 
    border: 'none', 
    cursor: 'pointer', 
    borderRadius: '6px', 
    padding: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'opacity 0.2s'
  }
});

// --- INLINE UI COMPONENTS ---

const FullScreenLoader = ({ isOpen, isDark }: { isOpen: boolean, isDark: boolean }) => {
  if (!isOpen) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, 
      backgroundColor: isDark ? 'rgba(17, 24, 39, 0.8)' : 'rgba(255, 255, 255, 0.8)', 
      zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center',
      backdropFilter: 'blur(4px)'
    }}>
      <div className="spin" style={{
        width: '48px', height: '48px', 
        border: '4px solid #16a34a', borderTopColor: 'transparent', borderRadius: '50%'
      }}></div>
    </div>
  );
};

const AnimatedModal = ({ isOpen, onClose, children, styles, contentStyle }: any) => {
  if (!isOpen) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', 
      zIndex: 999, display: 'flex', justifyContent: 'center', alignItems: 'center',
      animation: 'fadeIn 0.2s ease-out', padding: '20px'
    }} onClick={onClose}>
      <div style={{
        backgroundColor: styles.card.backgroundColor, 
        padding: '24px', borderRadius: '12px', 
        maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        animation: 'scaleIn 0.2s ease-out',
        ...contentStyle
      }} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

const NotificationToast = ({ notification, onClose }: { notification: NotificationState, onClose: () => void }) => {
  useEffect(() => { 
    const timer = setTimeout(onClose, 3500); 
    return () => clearTimeout(timer); 
  }, [notification, onClose]);

  const isError = notification.type === 'error';
  
  return (
    <div style={{
      position: 'fixed', bottom: '24px', right: '24px', 
      backgroundColor: isError ? '#ef4444' : '#16a34a', color: 'white', 
      padding: '16px 24px', borderRadius: '8px', zIndex: 10000, 
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      display: 'flex', alignItems: 'center', gap: '12px',
      animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      {isError ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
      <span style={{fontWeight: 500, fontSize: '14px'}}>{notification.message}</span>
      <button onClick={onClose} style={{background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', padding: '0', marginLeft: '12px', display: 'flex'}}>
        <X size={16} />
      </button>
    </div>
  );
};

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText, confirmColor, icon, isDark, styles }: any) => {
  if (!isOpen) return null;
  return (
    <AnimatedModal isOpen={isOpen} onClose={onClose} styles={styles} contentStyle={{width: '400px', maxWidth: '100%'}}>
      <div style={{display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '24px'}}>
        <div style={{
          backgroundColor: icon === 'alert' ? (isDark ? '#7f1d1d' : '#fee2e2') : (isDark ? '#14532d' : '#dcfce7'),
          color: icon === 'alert' ? '#ef4444' : '#16a34a',
          padding: '10px', borderRadius: '50%', display: 'flex'
        }}>
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

const SearchableDropdown = ({ value, onChange, options, placeholder, isDark }: any) => {
  return (
    <div style={{position: 'relative', width: '100%'}}>
      <select 
        value={value} 
        onChange={e => onChange(e.target.value)} 
        style={{
          padding: '10px 12px', borderRadius: '8px', 
          border: isDark ? '1px solid #4b5563' : '1px solid #d1d5db', 
          backgroundColor: isDark ? '#374151' : 'white', 
          color: isDark ? 'white' : 'black', 
          width: '100%', outline: 'none', appearance: 'none',
          fontFamily: 'inherit', fontSize: '13px'
        }}
      >
        <option value="">{placeholder}</option>
        {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      <div style={{position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: isDark ? '#9ca3af' : '#6b7280'}}>
        <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16"><path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/></svg>
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---
export default function App() {
  const [activeTab, setActiveTab] = useState<'daily' | 'influencer' | 'marketers' | 'kpi' | 'admin'>('daily');
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);
  
  // Loading & Auth
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [notification, setNotification] = useState<NotificationState | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  // Modals Data
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<DailyLog | null>(null);
  
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean; title: string; message: React.ReactNode; confirmText: string; confirmColor: string; icon: 'alert' | 'check'; onConfirm: () => void;
  }>({ isOpen: false, title: '', message: '', confirmText: 'Ya', confirmColor: '#ef4444', icon: 'alert', onConfirm: () => {} });

  // Approval Modal
  const [approvalModalLead, setApprovalModalLead] = useState<DailyLog | null>(null);
  const [approvalEmail, setApprovalEmail] = useState('');

  // Decline Modal (Reason)
  const [declineModalLead, setDeclineModalLead] = useState<DailyLog | null>(null);
  const [declineReason, setDeclineReason] = useState('');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [marketerFilter, setMarketerFilter] = useState('');
  const [marketerSearchQuery, setMarketerSearchQuery] = useState(''); 
  
  // Theme & Responsiveness
  const [isDark, setIsDark] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const styles = useMemo(() => LXStyles(isDark, isMobile), [isDark, isMobile]);

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ message, type });
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) setIsDark(true);
    
    // Auto Login Feature
    if (localStorage.getItem('isAdminLoggedIn') === 'true') {
       setIsAdmin(true);
    }
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- FETCH FROM GOOGLE SHEETS API ---
  const fetchData = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    try {
      const timestamp = new Date().getTime();
      const apiUrl = `${GAS_API_URL}?t=${timestamp}`;

      const resLogs = await fetch(apiUrl);
      const dataLogs = await resLogs.json();
      
      if(dataLogs.status === 'success') {
        let offset = 1;
        if (dataLogs.data && dataLogs.data.length > 0) {
          const firstRow = dataLogs.data[0];
          const firstVal = Array.isArray(firstRow) ? firstRow[0] : firstRow["Date of Contact"];
          if (String(firstVal).toLowerCase().includes('date')) {
            offset = 1; 
          } else {
            offset = 2; 
          }
        }

        const mappedLogs = dataLogs.data
        .map((row: any, originalIndex: number) => ({ row, originalIndex }))
        .filter(({row}: any) => {
             const firstVal = Array.isArray(row) ? row[0] : row["Date of Contact"];
             if (!firstVal) return false;
             const str = String(firstVal).toLowerCase().trim();
             if (str.includes("date") || str.includes("header") || str.length < 5) return false;
             if (!/\d/.test(str)) return false;
             return true;
        })
        .map(({row, originalIndex}: any, idx: number) => {
          const isArray = Array.isArray(row);
          const values = isArray ? row : Object.values(row);
          
          const getValue = (keyName: string, index: number) => {
            if (!isArray && row[keyName] !== undefined) return row[keyName];
            return isArray && row[index] !== undefined ? row[index] : (values[index] || '');
          };

          let rawDate = getValue("Date of Contact", 0);
          let dateStr = '-';
          let rawDateIso = ''; 
          
          if (rawDate) {
             try {
               const d = new Date(rawDate);
               if (!isNaN(d.getTime())) {
                   dateStr = d.toLocaleDateString('en-US');
                   const tzOffset = d.getTimezoneOffset() * 60000;
                   const localISOTime = (new Date(d.getTime() - tzOffset)).toISOString().slice(0, 10);
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
            rowNumber: originalIndex + offset,
            date: dateStr,
            rawDateIso: rawDateIso,
            leadName: getValue("Lead Name", 1) || '-',
            profileUrl: getValue("Google Drive Proof", 2) || getValue("LinkedIn Profile URL", 2) || '',
            industry: getValue("Industry/Role", 3) || '-',
            source: getValue("Source Post/Influencer", 4) || '-',
            template: getValue("Template Used", 5) || '-',
            interactionType: getValue("Interaction Type", 6) || '-',
            tagged: String(getValue("Jonathan Tagged?", 7)).toLowerCase() === 'true',
            responseTime: getValue("Response Time", 8) || '-',
            status: getValue("Conversion Status", 9) || 'New',
            notes: getValue("Notes/Feedback", 10) || '',
            marketer: getValue("Marketer", 11) || '', // Now treated as Email
            email: getValue("Email", 12) || '',
            approvalStatus: getValue("Approval Status", 13) || 'None'
          };
        });

        setDailyLogs(mappedLogs.reverse());
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      if (showLoader) showNotification("Connection failed. Check console.", 'error');
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(true);
  }, []);

  // --- FILTER LOGIC ---
  const filteredLogs = useMemo(() => {
    return dailyLogs.filter(log => {
      let matchDate = true;
      if (dateRange.start || dateRange.end) {
         const logDate = new Date(log.rawDateIso);
         if (dateRange.start) matchDate = matchDate && logDate >= new Date(dateRange.start);
         if (dateRange.end) matchDate = matchDate && logDate <= new Date(dateRange.end);
      }
      const matchName = log.leadName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchMarketer = marketerFilter ? log.marketer === marketerFilter : true;
      
      const matchPending = activeTab === 'admin' ? (log.approvalStatus === 'Pending' && !!log.email) : true; 

      return matchDate && matchName && matchMarketer && matchPending;
    });
  }, [dailyLogs, searchQuery, dateRange, marketerFilter, activeTab]);

  const availableMarketers = useMemo(() => {
    const activeInDateRange = dailyLogs.filter(log => {
      let matchDate = true;
      if (dateRange.start || dateRange.end) {
         const logDate = new Date(log.rawDateIso);
         if (dateRange.start) matchDate = matchDate && logDate >= new Date(dateRange.start);
         if (dateRange.end) matchDate = matchDate && logDate <= new Date(dateRange.end);
      }
      return matchDate;
    });
    return Array.from(new Set(activeInDateRange.map(l => l.marketer))).filter(Boolean).sort();
  }, [dailyLogs, dateRange]);

  // Pagination Calculation
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
     setCurrentPage(1);
  }, [searchQuery, dateRange, marketerFilter, activeTab, itemsPerPage]);

  // --- DYNAMIC KPIs (Admin Dashboard) ---
  const adminKpiStats = useMemo(() => {
    let total = 0, pending = 0, approved = 0, declined = 0;
    dailyLogs.forEach(log => {
      // 1. Apply Filters
      let matchDate = true;
      if (dateRange.start || dateRange.end) {
         const logDate = new Date(log.rawDateIso);
         if (dateRange.start) matchDate = matchDate && logDate >= new Date(dateRange.start);
         if (dateRange.end) matchDate = matchDate && logDate <= new Date(dateRange.end);
      }
      const matchMarketer = marketerFilter ? log.marketer === marketerFilter : true;
      const matchName = log.leadName.toLowerCase().includes(searchQuery.toLowerCase());

      // 2. Count if it matches the current filters
      if (matchDate && matchMarketer && matchName) {
         total++;
         if (log.approvalStatus === 'Pending' && log.email) pending++;
         else if (log.approvalStatus === 'Approved') approved++;
         else if (log.approvalStatus === 'Declined') declined++;
      }
    });
    return { total, pending, approved, declined };
  }, [dailyLogs, dateRange, marketerFilter, searchQuery]);


  // --- GLOBAL KPIs (Dashboard KPI Tab) ---
  const globalKpiStats = useMemo(() => {
    const kpiLogs = dailyLogs.filter(log => {
       let matchDate = true;
       if (dateRange.start || dateRange.end) {
          const logDate = new Date(log.rawDateIso);
          if (dateRange.start) matchDate = matchDate && logDate >= new Date(dateRange.start);
          if (dateRange.end) matchDate = matchDate && logDate <= new Date(dateRange.end);
       }
       const matchMarketer = marketerFilter ? log.marketer === marketerFilter : true;
       return matchDate && matchMarketer;
    });

    let totalLeads = kpiLogs.length;
    let directAskCount = 0;
    let conversionCount = 0;
    const sourceMap: Record<string, number> = {};

    kpiLogs.forEach(log => {
      if (log.interactionType === 'Direct Ask') directAskCount++;
      const currentStatus = String(log.status).toLowerCase();
      if (currentStatus.includes('deal') || currentStatus.includes('signed')) {
          conversionCount++;
      }
      const src = log.source || 'Unknown';
      sourceMap[src] = (sourceMap[src] || 0) + 1;
    });

    const postPerformance = Object.entries(sourceMap)
      .map(([source, count]) => {
         let rating = 'Needs Work';
         if (count > 20) rating = 'Excellent';
         else if (count > 5) rating = 'Good';
         return { source, count, rating };
      })
      .sort((a, b) => b.count - a.count);

    return { totalLeads, directAskCount, conversionCount, postPerformance };
  }, [dailyLogs, dateRange, marketerFilter]);

  const conversionRate = useMemo(() => {
    if (globalKpiStats.totalLeads === 0) return 0;
    return ((globalKpiStats.conversionCount / globalKpiStats.totalLeads) * 100).toFixed(1);
  }, [globalKpiStats]);


  // --- MARKETERS PAGE STATS ---
  const marketersStatsList = useMemo(() => {
    const stats: Record<string, any> = {};
    
    dailyLogs.forEach(log => {
       const mName = log.marketer || 'Unknown';
       if (!stats[mName]) {
          stats[mName] = { name: mName, totalLeads: 0, deals: 0, directAsks: 0, lastUpdate: log.rawDateIso };
       }
       if (log.rawDateIso > stats[mName].lastUpdate) {
           stats[mName].lastUpdate = log.rawDateIso;
       }

       let matchDate = true;
       if (dateRange.start || dateRange.end) {
          const logDate = new Date(log.rawDateIso);
          if (dateRange.start) matchDate = matchDate && logDate >= new Date(dateRange.start);
          if (dateRange.end) matchDate = matchDate && logDate <= new Date(dateRange.end);
       }

       if (matchDate) {
           stats[mName].totalLeads += 1;
           const currentStatus = String(log.status).toLowerCase();
           if (currentStatus.includes('deal') || currentStatus.includes('signed')) stats[mName].deals += 1;
           if (log.interactionType === 'Direct Ask') stats[mName].directAsks += 1;
       }
    });

    return Object.values(stats).map(m => ({
       ...m,
       status: m.totalLeads > 0 ? 'Active' : 'Non-active',
       conversionRate: m.totalLeads > 0 ? ((m.deals / m.totalLeads) * 100).toFixed(1) : '0.0'
    }))
    .filter(m => m.name.toLowerCase().includes(marketerSearchQuery.toLowerCase()))
    .sort((a, b) => b.totalLeads - a.totalLeads);
  }, [dailyLogs, dateRange, marketerSearchQuery]);


  // --- EXPORT TO EXCEL / CSV ---
  const handleExportCSV = () => {
    if (filteredLogs.length === 0) {
      showNotification("There is no data to export", "error");
      return;
    }
    
    const headers = ['Date', 'Lead Name', 'Industry', 'Source', 'Template', 'Type', 'Tagged', 'Response Time', 'Status', 'Notes', 'Marketer Email', 'Lead Email', 'Approval Status'];
    const csvRows = [headers.join(',')];

    filteredLogs.forEach(row => {
      const values = [
        row.rawDateIso, row.leadName, row.industry, row.source, row.template, 
        row.interactionType, row.tagged ? 'Yes' : 'No', row.responseTime, 
        row.status, row.notes, row.marketer, row.email, row.approvalStatus
      ];
      const escapedValues = values.map(v => {
        const str = String(v || '').replace(/"/g, '""');
        return `"${str}"`;
      });
      csvRows.push(escapedValues.join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Marketing_Leads_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  // --- CRUD ACTIONS (Google Apps Script) ---
  const performActionSilently = async (actionType: 'create' | 'edit' | 'delete', data: any, successMsg: string) => {
    try {
      const payload = {
        action: actionType,
        ...data,
        rowNumber: data.rowNumber 
      };

      await fetch(GAS_API_URL, {
        method: 'POST', mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });

      showNotification(successMsg, 'success');
      setTimeout(() => fetchData(false), 2500);
    } catch (error) {
      showNotification('Failed to perform synchronization action to server.', 'error');
      fetchData(false); // Revert UI
    }
  };

  const handleFormSubmit = (data: any) => {
    setIsModalOpen(false); 
    if (editingLead) {
      performActionSilently('edit', { ...data, rowNumber: editingLead.rowNumber }, 'Edit confirmed. Data successfully updated.');
      setEditingLead(null);
    } else {
      performActionSilently('create', { ...data, approvalStatus: 'None' }, 'New data successfully added.');
    }
  };

  // --- HANDLER UNTUK MODAL KONFIRMASI & LOGIN ---
  const handleLoginSuccess = () => {
    setIsAdmin(true);
    localStorage.setItem('isAdminLoggedIn', 'true');
    setIsLoginModalOpen(false);
    setActiveTab('admin'); 
  };

  const handleTabAdminClick = () => {
    if (!isAdmin) {
      setIsLoginModalOpen(true);
    } else {
      setActiveTab('admin');
    }
    setIsMobileMenuOpen(false);
  };

  const handleLogoutClick = () => {
    setIsMobileMenuOpen(false);
    setConfirmDialog({
      isOpen: true,
      title: 'Confirm Logout',
      message: 'Are you sure you want to leave the Admin Dashboard?',
      confirmText: 'Yes, Logout',
      confirmColor: '#ef4444',
      icon: 'alert',
      onConfirm: () => {
         setIsAdmin(false);
         localStorage.removeItem('isAdminLoggedIn');
         setActiveTab('daily'); 
      }
    });
  };

  const handleDeleteClick = (lead: DailyLog) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Confirm Delete',
      message: <>Are you sure you want to delete the marketing data for <b>{lead.leadName}</b>? This action cannot be undone.</>,
      confirmText: 'Yes, Delete',
      confirmColor: '#ef4444',
      icon: 'alert',
      onConfirm: () => performActionSilently('delete', lead, 'Data successfully deleted from the system.')
    });
  };

  const handleApproveClick = (lead: DailyLog) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Verifikasi & Approval',
      message: (
         <div style={{ textAlign: 'left', backgroundColor: isDark ? '#374151' : '#f3f4f6', padding: '16px', borderRadius: '8px', marginTop: '10px' }}>
            <div style={{marginBottom: '6px', fontSize: '13px'}}>Name Lead: <span style={{fontWeight: 600, color: isDark?'white':'black'}}>{lead.leadName}</span></div>
            <div style={{marginBottom: '6px', fontSize: '13px'}}>Marketer Email: <span style={{fontWeight: 600, color: isDark?'white':'black'}}>{lead.marketer}</span></div>
            <div style={{fontSize: '11px', color: isDark ? '#9ca3af' : '#6b7280', borderTop: isDark?'1px solid #4b5563':'1px solid #e5e7eb', paddingTop: '8px', lineHeight: 1.4}}>
               If approved, the status will automatically change to "In Progress".
            </div>
         </div>
      ),
      confirmText: 'Yes, Approve',
      confirmColor: '#16a34a',
      icon: 'check',
      onConfirm: () => handleAdminApprovalAction(lead, 'Approve')
    });
  };

  const handleDeclineClick = (lead: DailyLog) => {
    setDeclineModalLead(lead);
    setDeclineReason('');
  };

  // --- APPROVAL LOGIC ---
  const handleRequestApproval = async (e: any) => {
    e.preventDefault();
    if (!approvalModalLead || !approvalEmail) return;
    
    const leadToUpdate = approvalModalLead;
    const emailToUpdate = approvalEmail;

    setDailyLogs(prevLogs => prevLogs.map(log => 
       log.id === leadToUpdate.id ? { ...log, email: emailToUpdate, approvalStatus: 'Pending' } : log
    ));

    setApprovalModalLead(null);
    setApprovalEmail('');

    const dataToUpdate = {
       rowNumber: leadToUpdate.rowNumber,
       rawDateIso: leadToUpdate.rawDateIso, 
       name: leadToUpdate.leadName,
       url: leadToUpdate.profileUrl,
       industry: leadToUpdate.industry,
       source: leadToUpdate.source,
       template: leadToUpdate.template,
       interactionType: leadToUpdate.interactionType,
       tagged: leadToUpdate.tagged,
       responseTime: leadToUpdate.responseTime,
       status: leadToUpdate.status,
       notes: leadToUpdate.notes,
       marketer: leadToUpdate.marketer,
       email: emailToUpdate,
       approvalStatus: 'Pending'
    };

    await performActionSilently('edit', dataToUpdate, `Request Approval sent to ${leadToUpdate.leadName}`);
  };

  const handleAdminApprovalAction = async (lead: DailyLog, actionType: 'Approve' | 'Decline', reason?: string) => {
    if (!isAdmin) return;

    const newApprovalStatus = actionType === 'Approve' ? 'Approved' : 'Declined';
    const newStatus = actionType === 'Approve' ? 'In Progress' : lead.status;
    const updatedNotes = actionType === 'Decline' && reason ? `[DECLINED: ${reason}]\n${lead.notes}` : lead.notes;

    setDailyLogs(prevLogs => prevLogs.map(l => 
       l.id === lead.id ? { ...l, approvalStatus: newApprovalStatus, status: newStatus, notes: updatedNotes } : l
    ));

    const dataToUpdate = {
       rowNumber: lead.rowNumber,
       rawDateIso: lead.rawDateIso, 
       name: lead.leadName,
       url: lead.profileUrl,
       industry: lead.industry,
       source: lead.source,
       template: lead.template,
       interactionType: lead.interactionType,
       tagged: lead.tagged,
       responseTime: lead.responseTime,
       status: newStatus,
       notes: updatedNotes,
       marketer: lead.marketer,
       email: lead.email,
       approvalStatus: newApprovalStatus,
       declineReason: reason || '' // Bisa ditangkap oleh GAS jika diset up untuk kirim email notif
    };

    await performActionSilently('edit', dataToUpdate, `${actionType} successful for ${lead.leadName}.`);
  };

  const switchTabMobile = (tab: any) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };


  return (
    <div style={styles.container}>
      {/* GLOBAL STYLE FOR ANIMATIONS */}
      <style>{`
        @keyframes slideIn { from { transform: translateX(50px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(50px); opacity: 0; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
        @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes scaleOut { from { transform: scale(1); opacity: 1; } to { transform: scale(0.95); opacity: 0; } }
        @keyframes slideInLeft { from { transform: translateX(-100%); } to { transform: translateX(0); } }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
      `}</style>

      <FullScreenLoader isOpen={loading} isDark={isDark} />
      {notification && <NotificationToast notification={notification} onClose={() => setNotification(null)} />}

      {/* LOGIN ADMIN MODAL */}
      <PinModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onSubmit={handleLoginSuccess}
        isDark={isDark} styles={styles}
      />

      {/* UNIVERSAL CONFIRM MODAL */}
      <ConfirmModal 
         isOpen={confirmDialog.isOpen} 
         onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })} 
         onConfirm={confirmDialog.onConfirm}
         title={confirmDialog.title}
         message={confirmDialog.message}
         confirmText={confirmDialog.confirmText}
         confirmColor={confirmDialog.confirmColor}
         icon={confirmDialog.icon}
         isDark={isDark} 
         styles={styles} 
      />

      {/* --- ADD / EDIT LEAD MODAL INLINE --- */}
      <AnimatedModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingLead(null); }} 
        styles={styles} 
        contentStyle={{ width: '600px', maxWidth: '95vw' }}
      >
         <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px'}}>
            <h3 style={{margin:0, color: isDark?'white':'#1f2937', fontSize: '20px', fontWeight: 700}}>
              {editingLead ? 'Edit Lead' : 'New Lead'}
            </h3>
            <button onClick={() => { setIsModalOpen(false); setEditingLead(null); }} style={{background:'none', border:'none', cursor:'pointer', color:'#9ca3af', display: 'flex'}}>
              <X size={24}/>
            </button>
         </div>
         <InlineAddEditForm 
            initialData={editingLead}
            onSubmit={handleFormSubmit}
            onCancel={() => { setIsModalOpen(false); setEditingLead(null); }}
            isDark={isDark}
            styles={styles}
         />
      </AnimatedModal>

      {/* REQUEST APPROVAL MODAL */}
      <AnimatedModal isOpen={!!approvalModalLead} onClose={() => setApprovalModalLead(null)} styles={styles} contentStyle={{ width: '380px' }}>
         <div style={{display:'flex', justifyContent:'space-between', marginBottom:'16px'}}>
            <h3 style={{margin:0, color: isDark?'white':'#1f2937', fontSize: '18px'}}>Request Approval</h3>
            <button onClick={() => setApprovalModalLead(null)} style={{background:'none', border:'none', cursor:'pointer', color:'#9ca3af', display: 'flex'}}><X size={20}/></button>
         </div>
         <p style={{fontSize: '13px', color: isDark ? '#9ca3af' : '#6b7280', marginBottom: '16px'}}>
            Enter <b>Lead Email</b> to register <b>{approvalModalLead?.leadName}</b>
         </p>
         <form onSubmit={handleRequestApproval}>
            <input 
              type="email" required autoFocus
              value={approvalEmail} onChange={(e) => setApprovalEmail(e.target.value)}
              placeholder="lead.email@example.com"
              style={{...styles.input, marginBottom: '20px', width: '100%', boxSizing: 'border-box'}} 
            />
            <button type="submit" style={{...styles.btnPrimary, width: '100%', justifyContent: 'center'}}>Kirim Request</button>
         </form>
      </AnimatedModal>

      {/* DECLINE APPROVAL MODAL DENGAN ALASAN */}
      <AnimatedModal isOpen={!!declineModalLead} onClose={() => setDeclineModalLead(null)} styles={styles} contentStyle={{ width: '400px' }}>
         <div style={{display:'flex', justifyContent:'space-between', marginBottom:'16px'}}>
            <h3 style={{margin:0, color: isDark?'white':'#1f2937', fontSize: '18px'}}>Tolak Request</h3>
            <button onClick={() => setDeclineModalLead(null)} style={{background:'none', border:'none', cursor:'pointer', color:'#9ca3af', display: 'flex'}}><X size={20}/></button>
         </div>
         <p style={{fontSize: '13px', color: isDark ? '#9ca3af' : '#6b7280', marginBottom: '16px'}}>
            Reject request approval for <b>{declineModalLead?.leadName}</b>? Data will be returned to the Marketer. Give reasons for rejection so that marketers know:
         </p>
         <form onSubmit={(e) => {
            e.preventDefault();
            if (declineModalLead) handleAdminApprovalAction(declineModalLead, 'Decline', declineReason);
            setDeclineModalLead(null);
         }}>
            <textarea
              required autoFocus
              value={declineReason} onChange={(e) => setDeclineReason(e.target.value)}
              placeholder="Write rejection reason..."
              style={{...styles.input, marginBottom: '20px', width: '100%', height: '80px', resize: 'none', boxSizing: 'border-box'}}
            />
            <button type="submit" style={{...styles.btnPrimary, backgroundColor: '#ef4444', width: '100%', justifyContent: 'center'}}>Reject & Provide Reason</button>
         </form>
      </AnimatedModal>

      {/* HAMBURGER MENU OVERLAY (MOBILE) */}
      {isMobile && isMobileMenuOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999,
          animation: 'fadeIn 0.2s ease-out forwards'
        }} onClick={() => setIsMobileMenuOpen(false)}>
           <div style={{
              width: '280px', height: '100%', backgroundColor: isDark ? '#1f2937' : '#fff',
              padding: '24px 0', display: 'flex', flexDirection: 'column',
              animation: 'slideInLeft 0.3s forwards', boxShadow: '2px 0 10px rgba(0,0,0,0.2)'
           }} onClick={e => e.stopPropagation()}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px', marginBottom: '24px'}}>
                 <h2 style={{margin: 0, color: isDark ? '#fff' : '#166534', fontSize: '20px', fontWeight: 700}}>Menu Utama</h2>
                 <button onClick={() => setIsMobileMenuOpen(false)} style={{background:'none', border:'none', color: isDark?'#fff':'#000', cursor:'pointer', display: 'flex'}}><X size={24}/></button>
              </div>
              
              <div style={{display:'flex', flexDirection:'column', gap:'8px', padding: '0 16px'}}>
                <button onClick={() => switchTabMobile('daily')} style={{...styles.tab(activeTab === 'daily'), borderRadius:'8px', border:'none', background: activeTab==='daily' ? (isDark?'#374151':'#f0fdf4') : 'transparent'}}>
                  <FileText size={20} /> Daily Log
                </button>
                <button onClick={() => switchTabMobile('marketers')} style={{...styles.tab(activeTab === 'marketers'), borderRadius:'8px', border:'none', background: activeTab==='marketers' ? (isDark?'#374151':'#f0fdf4') : 'transparent'}}>
                  <Users size={20} /> Marketers
                </button>
                <button onClick={() => switchTabMobile('influencer')} style={{...styles.tab(activeTab === 'influencer'), borderRadius:'8px', border:'none', background: activeTab==='influencer' ? (isDark?'#374151':'#f0fdf4') : 'transparent'}}>
                  <CheckSquare size={20} /> Influencer Stats
                </button>
                <button onClick={() => switchTabMobile('kpi')} style={{...styles.tab(activeTab === 'kpi'), borderRadius:'8px', border:'none', background: activeTab==='kpi' ? (isDark?'#374151':'#f0fdf4') : 'transparent'}}>
                  <BarChart2 size={20} /> Dashboard KPI
                </button>
                <div style={{borderTop: isDark?'1px solid #374151':'1px solid #eee', margin: '16px 0'}}></div>
                <button onClick={handleTabAdminClick} style={{...styles.tab(activeTab === 'admin'), borderRadius:'8px', border:'none', color: isAdmin ? '#16a34a' : (isDark?'#9ca3af':'#6b7280'), background: activeTab==='admin' ? (isDark?'#374151':'#f0fdf4') : 'transparent'}}>
                  {isAdmin ? <Shield size={20} /> : <Lock size={20} />} Admin Dashboard
                </button>
              </div>
           </div>
        </div>
      )}

      {/* HEADER */}
      <div style={styles.header}>
        <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
           {/* Hamburger Icon for Mobile */}
           {isMobile && (
             <button onClick={() => setIsMobileMenuOpen(true)} style={{background:'none', border:'none', color:'white', cursor:'pointer', padding: 0, display: 'flex', alignItems: 'center'}}>
               <MenuIcon size={28} />
             </button>
           )}
           <div style={{background: 'rgba(255,255,255,0.2)', padding: '10px', borderRadius: '10px', display: isMobile ? 'none' : 'flex'}}>
             <FileText size={24} />
           </div>
           <div>
             <h1 style={{fontSize: isMobile ? '18px' : '20px', margin:0, fontWeight:700}}>Marketing Tracker</h1>
             <div style={{fontSize:'12px', opacity:0.8, display:'flex', alignItems:'center', gap:'6px'}}>
               <span style={{width:'8px', height:'8px', borderRadius:'50%', backgroundColor:'#4ade80'}}></span> Online Sync
             </div>
           </div>
        </div>
        <div style={{display:'flex', gap:'12px'}}>
          {!isMobile && (
             <button onClick={() => isAdmin ? handleLogoutClick() : setIsLoginModalOpen(true)} style={{background: isAdmin ? '#ef4444' : '#3b82f6', border:'none', color:'white', borderRadius:'8px', padding:'8px 16px', fontSize:'13px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px'}}>
                {isAdmin ? <><Lock size={16}/> Logout Admin</> : <><Shield size={16}/> Login Admin</>}
             </button>
          )}
          <button onClick={() => fetchData(true)} style={{background:'rgba(255,255,255,0.2)', border:'none', color:'white', borderRadius:'8px', padding:'10px', cursor:'pointer', display: 'flex'}} title="Refresh Data">
            <RefreshCw size={20} />
          </button>
          <button onClick={() => setIsDark(!isDark)} style={{background:'rgba(255,255,255,0.2)', border:'none', color:'white', borderRadius:'8px', padding:'8px 16px', fontSize:'13px', cursor: 'pointer', fontWeight: 600}}>
             {isDark ? 'Light' : 'Dark'}
          </button>
        </div>
      </div>

      {/* TABS PENGGUNA (Hanya muncul di Desktop) */}
      <div style={styles.tabBar}>
        <div onClick={() => setActiveTab('daily')} style={styles.tab(activeTab === 'daily')}><FileText size={18} /> Daily Log</div>
        <div onClick={() => setActiveTab('marketers')} style={styles.tab(activeTab === 'marketers')}><Users size={18} /> Marketers</div>
        <div onClick={() => setActiveTab('influencer')} style={styles.tab(activeTab === 'influencer')}><CheckSquare size={18} /> Influencer Stats</div>
        <div onClick={() => setActiveTab('kpi')} style={styles.tab(activeTab === 'kpi')}><BarChart2 size={18} /> Dashboard KPI</div>
        
        {/* Tab Spesial Admin Dashboard */}
        <div 
           onClick={handleTabAdminClick} 
           style={{...styles.tab(activeTab === 'admin'), marginLeft: 'auto', color: isAdmin ? '#16a34a' : (isDark?'#9ca3af':'#6b7280')}}
        >
           {isAdmin ? <Shield size={18} /> : <Lock size={18} />} Admin Dashboard
        </div>
      </div>

      {/* CONTENT AREA */}
      <div style={styles.content}>
        
        {/* --- TAB 1 & 5 : DAILY LOG & ADMIN DASHBOARD --- */}
        {(activeTab === 'daily' || (activeTab === 'admin' && isAdmin)) && (
          <div>
            {/* FITUR PENCARIAN & FILTER RESPONSIVE */}
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'24px', flexWrap:'wrap', gap:'16px', alignItems: 'flex-end'}}>
               
               <div style={{display:'flex', gap:'12px', flex:1, flexWrap: 'wrap', alignItems: 'center'}}>
                  {/* Judul Halaman dinamis */}
                  <div style={{width: '100%', marginBottom: '8px'}}>
                     <h2 style={{fontSize: isMobile ? '18px' : '22px', margin:0, color: isDark?'white':'#111827', fontWeight: 800}}>
                        {activeTab === 'admin' ? 'Admin Dashboard - Kelola & Setujui Leads' : 'Daily Log - All Leads'}
                     </h2>
                  </div>

                  {/* Name Search */}
                  <div style={{display:'flex', alignItems:'center', backgroundColor: isDark?'#374151':'white', border: isDark?'1px solid #4b5563':'1px solid #d1d5db', borderRadius:'8px', padding:'0 12px', flex: isMobile ? '1 1 100%' : '1 1 220px', minWidth: '150px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)'}}>
                     <SearchIcon size={18} color={isDark ? "#9ca3af" : "#6b7280"}/>
                     <input placeholder="Search for Lead Name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{border:'none', background:'transparent', padding:'10px', outline:'none', color: isDark?'white':'black', width:'100%', fontSize: '14px'}} />
                  </div>
                  
                  {/* Date Range Start */}
                  <div style={{display:'flex', alignItems:'center', backgroundColor: isDark?'#374151':'white', border: isDark?'1px solid #4b5563':'1px solid #d1d5db', borderRadius:'8px', padding:'0 12px', flex: isMobile ? '1 1 45%' : '0 1 auto', boxShadow: '0 1px 2px rgba(0,0,0,0.05)'}}>
                     <span style={{fontSize:'13px', color: isDark ? '#9ca3af' : '#6b7280', marginRight:'8px'}}>Start:</span>
                     <input type="date" value={dateRange.start} onChange={(e) => setDateRange({...dateRange, start: e.target.value})} style={{border:'none', background:'transparent', padding:'10px 0', outline:'none', color: isDark?'white':'black', fontSize: '14px', fontFamily: 'inherit', width: '100%'}} />
                  </div>

                  {/* Date Range End */}
                  <div style={{display:'flex', alignItems:'center', backgroundColor: isDark?'#374151':'white', border: isDark?'1px solid #4b5563':'1px solid #d1d5db', borderRadius:'8px', padding:'0 12px', flex: isMobile ? '1 1 45%' : '0 1 auto', boxShadow: '0 1px 2px rgba(0,0,0,0.05)'}}>
                     <span style={{fontSize:'13px', color: isDark ? '#9ca3af' : '#6b7280', marginRight:'8px'}}>End:</span>
                     <input type="date" value={dateRange.end} onChange={(e) => setDateRange({...dateRange, end: e.target.value})} style={{border:'none', background:'transparent', padding:'10px 0', outline:'none', color: isDark?'white':'black', fontSize: '14px', fontFamily: 'inherit', width: '100%'}} />
                  </div>

                  {/* Kustom Searchable Dropdown Marketer */}
                  <div style={{ flex: isMobile ? '1 1 100%' : '1 1 200px' }}>
                    <SearchableDropdown 
                       value={marketerFilter} 
                       onChange={setMarketerFilter} 
                       options={availableMarketers} 
                       placeholder="All Email Marketers (Search...)" 
                       isDark={isDark} 
                    />
                  </div>
               </div>

               {/* Action Buttons */}
               <div style={{display: 'flex', gap: '12px', height: 'fit-content', width: isMobile ? '100%' : 'auto', justifyContent: isMobile ? 'space-between' : 'flex-start'}}>
                  <button onClick={handleExportCSV} style={{...styles.btnPrimary, backgroundColor: '#0284c7', flex: isMobile ? 1 : 'none', justifyContent: 'center'}} title="Export ke Excel/CSV">
                    <Download size={18} /> <span>Export</span>
                  </button>
                  <button onClick={() => { setEditingLead(null); setIsModalOpen(true); }} style={{...styles.btnPrimary, flex: isMobile ? 1 : 'none', justifyContent: 'center'}}>
                    <span style={{fontSize: '18px', lineHeight: 1}}>+</span> <span>New Lead</span>
                  </button>
               </div>
            </div>

            {/* --- ADMIN DASHBOARD KPIs --- */}
            {activeTab === 'admin' && (
              <div style={{display:'grid', gridTemplateColumns: isMobile?'1fr 1fr':'repeat(4, 1fr)', gap:'16px', marginBottom: '24px'}}>
                 <div style={styles.card}>
                    <div style={{fontSize:'13px', color:'#6b7280', fontWeight: 600}}>Total Filtered Leads</div>
                    <div style={{fontSize:'28px', fontWeight:800, color: isDark?'white':'#111827', marginTop: '4px'}}>{adminKpiStats.total}</div>
                 </div>
                 <div style={styles.card}>
                    <div style={{fontSize:'13px', color:'#d97706', fontWeight: 600}}>Pending Approval</div>
                    <div style={{fontSize:'28px', fontWeight:800, color: '#d97706', marginTop: '4px'}}>{adminKpiStats.pending}</div>
                 </div>
                 <div style={styles.card}>
                    <div style={{fontSize:'13px', color:'#16a34a', fontWeight: 600}}>Approved</div>
                    <div style={{fontSize:'28px', fontWeight:800, color: '#16a34a', marginTop: '4px'}}>{adminKpiStats.approved}</div>
                 </div>
                 <div style={styles.card}>
                    <div style={{fontSize:'13px', color:'#ef4444', fontWeight: 600}}>Declined</div>
                    <div style={{fontSize:'28px', fontWeight:800, color: '#ef4444', marginTop: '4px'}}>{adminKpiStats.declined}</div>
                 </div>
              </div>
            )}

            {/* TABEL DATA RESPONSIVE */}
            <div style={{overflowX: 'auto', border: isDark ? '1px solid #374151' : '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)'}}>
               <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={{...styles.th, textAlign: 'center'}}>No.</th>
                      <th style={styles.th}>Date</th>
                      <th style={styles.th}>Lead Name</th>
                      <th style={styles.th}>Google Drive Proof</th> 
                      <th style={styles.th}>Lead Email</th>
                      <th style={styles.th}>Approval Status / Action</th> 
                      <th style={styles.th}>Status</th>
                      <th style={styles.th}>Industry</th>
                      <th style={styles.th}>Source</th>
                      <th style={styles.th}>Template</th>
                      <th style={styles.th}>Type</th>
                      <th style={styles.th}>Notes</th>
                      <th style={styles.th}>Marketer Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedLogs.length === 0 ? (
                       <tr><td colSpan={13} style={{padding:'60px', textAlign:'center', color:'#6b7280', fontSize: '15px'}}>Tidak ada data ditemukan.</td></tr>
                    ) : (
                       paginatedLogs.map((row, index) => (
                         <tr key={row.id} style={{backgroundColor: isDark ? 'transparent' : 'white', transition: 'background-color 0.2s'}}>
                           <td style={{...styles.td, textAlign: 'center', color: isDark ? '#9ca3af' : '#6b7280', fontSize: '13px'}}>
                              {(currentPage - 1) * itemsPerPage + index + 1}
                           </td>

                           <td style={{...styles.td, whiteSpace: 'nowrap'}}>{row.date}</td>
                           <td style={styles.td}><span style={{fontWeight: 600, display: 'inline-block', whiteSpace: 'nowrap'}}>{row.leadName}</span></td>
                           <td style={{...styles.td, textAlign: 'center'}}>{row.profileUrl && <a href={row.profileUrl} target="_blank" rel="noreferrer" style={{color:'#2563eb', display: 'inline-flex', alignItems: 'center', padding: '4px', borderRadius: '4px', background: isDark?'#374151':'#eff6ff'}}><LinkIcon size={18}/></a>}</td>
                           <td style={styles.td}>{row.email || <span style={{color: isDark?'#6b7280':'#9ca3af', fontStyle:'italic'}}>-</span>}</td>
                           
                           <td style={styles.td}>
                              {/* Logika Tampilan Utama Approval */}
                              {activeTab === 'admin' ? (
                                 <div style={{display:'flex', gap:'8px', alignItems: 'center'}}>
                                   <button onClick={() => handleApproveClick(row)} style={{...styles.actionBtn, backgroundColor: isDark ? '#14532d' : '#dcfce7', color: '#16a34a', padding: '6px 10px'}} title="Approve"><CheckSquare size={16} /> <span style={{marginLeft:'6px', fontSize:'12px', fontWeight:600}}>Approve</span></button>
                                   <button onClick={() => handleDeclineClick(row)} style={{...styles.actionBtn, backgroundColor: isDark ? '#7f1d1d' : '#fee2e2', color: '#ef4444', padding: '6px 10px'}} title="Decline"><X size={16} /> <span style={{marginLeft:'6px', fontSize:'12px', fontWeight:600}}>Decline</span></button>
                                 </div>
                              ) : (
                                 row.status === 'New' ? (
                                    (row.approvalStatus === 'Pending' && row.email) ? (
                                       <span style={{color: '#d97706', fontSize: '13px', fontWeight: 600, display: 'inline-block', whiteSpace: 'nowrap'}}>Pending...</span>
                                    ) : row.approvalStatus === 'Declined' ? (
                                       <div style={{display:'flex', flexDirection: 'column', gap:'6px'}}>
                                          <span style={{color: '#ef4444', fontSize: '13px', fontWeight: 700}}>Declined</span>
                                          <button onClick={() => setApprovalModalLead(row)} style={{fontSize:'11px', padding: '4px 8px', borderRadius:'6px', background: isDark?'#374151':'#f3f4f6', color:isDark?'white':'#111827', border:isDark?'1px solid #4b5563':'1px solid #d1d5db', cursor:'pointer', whiteSpace: 'nowrap', fontWeight: 500}}>Req. Again</button>
                                       </div>
                                    ) : (
                                       <button onClick={() => setApprovalModalLead(row)} style={{fontSize:'12px', padding: '6px 10px', borderRadius:'6px', background: isDark?'#374151':'#f3f4f6', color:isDark?'white':'#111827', border:isDark?'1px solid #4b5563':'1px solid #d1d5db', cursor:'pointer', whiteSpace: 'nowrap', fontWeight: 500}}>Req. Approval</button>
                                    )
                                 ) : <span style={{color:'#16a34a', fontSize:'13px', fontWeight: 600, display: 'inline-block', whiteSpace: 'nowrap'}}>Approved</span>
                              )}

                              {/* Alat Khusus Admin: Edit & Delete Tampil di Semua Tab jika sudah Login */}
                              {isAdmin && (
                                 <div style={{display:'flex', gap:'8px', alignItems: 'center', marginTop: '10px', paddingTop: '10px', borderTop: isDark ? '1px solid #4b5563' : '1px solid #e5e7eb'}}>
                                    <button onClick={() => {setEditingLead(row); setIsModalOpen(true);}} style={{...styles.actionBtn, backgroundColor: isDark ? '#1e3a8a' : '#e0f2fe', color: '#0284c7'}} title="Edit Log Manual"><Edit size={16} /></button>
                                    <button onClick={() => handleDeleteClick(row)} style={{...styles.actionBtn, backgroundColor: isDark ? '#7f1d1d' : '#fee2e2', color: '#ef4444'}} title="Delete Log Manual"><Trash2 size={16} /></button>
                                 </div>
                              )}
                           </td>

                           <td style={styles.td}>
                             <span style={{
                               display: 'inline-block',
                               whiteSpace: 'nowrap',
                               padding:'6px 12px', borderRadius:'20px', fontSize:'12px', fontWeight:600,
                               backgroundColor: String(row.status).toLowerCase().includes('deal')||String(row.status).toLowerCase().includes('signed') ? (isDark ? '#14532d' : '#dcfce7') : (row.status==='In Progress' ? (isDark ? '#1e3a8a' : '#dbeafe') : (isDark ? '#374151' : '#f3f4f6')),
                               color: String(row.status).toLowerCase().includes('deal')||String(row.status).toLowerCase().includes('signed') ? (isDark ? '#4ade80' : '#166534') : (row.status==='In Progress' ? (isDark ? '#60a5fa' : '#1e40af') : (isDark ? '#e5e7eb' : '#374151')),
                             }}>{row.status}</span>
                           </td>
                           <td style={{...styles.td, whiteSpace: 'nowrap'}}>{row.industry}</td>
                           <td style={{...styles.td, whiteSpace: 'nowrap'}}>{row.source}</td>
                           <td style={{...styles.td, whiteSpace: 'nowrap'}}>{row.template}</td>
                           <td style={{...styles.td, whiteSpace: 'nowrap'}}>{row.interactionType}</td>
                           <td style={{...styles.td, fontSize:'13px', color: isDark ? '#9ca3af' : '#4b5563', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}} title={row.notes}>{row.notes}</td>
                           <td style={{...styles.td, whiteSpace: 'nowrap', fontWeight: 600}}>{row.marketer}</td>
                         </tr>
                       ))
                    )}
                  </tbody>
               </table>
            </div>
            
            {/* PAGINATION CONTROLS */}
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', flexWrap: 'wrap', gap: '16px'}}>
               <div style={{fontSize: '14px', color: isDark ? '#9ca3af' : '#6b7280', display: 'flex', alignItems: 'center'}}>
                  Showing 
                  <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} style={{margin: '0 8px', padding: '6px 10px', borderRadius: '6px', border: isDark?'1px solid #4b5563':'1px solid #d1d5db', background: isDark?'#374151':'white', color: isDark?'white':'black', fontFamily: 'inherit'}}>
                     <option value={25}>25</option>
                     <option value={50}>50</option>
                     <option value={75}>75</option>
                     <option value={100}>100</option>
                  </select> 
                  rows per page (Total: <span style={{fontWeight: 700, marginLeft: '4px'}}>{filteredLogs.length}</span>)
               </div>
               <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                  <button disabled={currentPage === 1} onClick={() => setCurrentPage(c => c - 1)} style={{padding: '8px 16px', borderRadius: '8px', border: isDark?'1px solid #4b5563':'1px solid #d1d5db', background: currentPage===1 ? 'transparent' : (isDark?'#374151':'white'), color: currentPage===1 ? (isDark?'#4b5563':'#9ca3af') : (isDark?'white':'#111827'), cursor: currentPage===1 ? 'not-allowed' : 'pointer', fontWeight: 500}}>Prev</button>
                  <span style={{fontSize: '14px', margin: '0 8px', fontWeight: 500}}>Page {currentPage} of {totalPages || 1}</span>
                  <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(c => c + 1)} style={{padding: '8px 16px', borderRadius: '8px', border: isDark?'1px solid #4b5563':'1px solid #d1d5db', background: (currentPage === totalPages || totalPages === 0) ? 'transparent' : (isDark?'#374151':'white'), color: (currentPage === totalPages || totalPages === 0) ? (isDark?'#4b5563':'#9ca3af') : (isDark?'white':'#111827'), cursor: (currentPage === totalPages || totalPages === 0) ? 'not-allowed' : 'pointer', fontWeight: 500}}>Next</button>
               </div>
            </div>

          </div>
        )}

        {/* Jika User bypass Admin Panel tanpa Login */}
        {activeTab === 'admin' && !isAdmin && (
           <div style={{textAlign: 'center', padding: '80px 20px'}}>
              <div style={{background: isDark?'#374151':'#fee2e2', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto'}}>
                <Lock size={40} color="#ef4444" />
              </div>
              <h2 style={{color: isDark?'white':'#111827', marginBottom: '12px', fontSize: '24px'}}>Locked Access</h2>
              <p style={{color: isDark?'#9ca3af':'#6b7280', marginBottom: '24px', fontSize: '15px'}}>You must log in as admin to view this page.</p>
              <button onClick={() => setIsLoginModalOpen(true)} style={{...styles.btnPrimary, margin: '0 auto', padding: '12px 24px'}}>Login Admin</button>
           </div>
        )}

        {/* --- TAB 2: MARKETERS PAGE --- */}
        {activeTab === 'marketers' && (
           <div>
              <div style={{display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', marginBottom: '24px', gap: '16px'}}>
                 <h2 style={{fontSize: isMobile ? '18px' : '22px', margin:0, color: isDark?'white':'#111827', fontWeight: 800}}>Marketers Performance (by Email)</h2>
                 
                 <div style={{display:'flex', flexDirection: isMobile ? 'column' : 'row', gap:'12px', width: isMobile ? '100%' : 'auto', alignItems: 'center'}}>
                    {/* Search Marketer */}
                    <div style={{display:'flex', alignItems:'center', backgroundColor: isDark?'#374151':'white', border: isDark?'1px solid #4b5563':'1px solid #d1d5db', borderRadius:'8px', padding:'0 12px', flex: isMobile ? '1 1 100%' : '1 1 220px', minWidth: '150px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', width: isMobile ? '100%' : 'auto'}}>
                       <SearchIcon size={18} color={isDark ? "#9ca3af" : "#6b7280"}/>
                       <input placeholder="Search Email Marketer..." value={marketerSearchQuery} onChange={(e) => setMarketerSearchQuery(e.target.value)} style={{border:'none', background:'transparent', padding:'10px', outline:'none', color: isDark?'white':'black', width:'100%', fontSize: '14px'}} />
                    </div>
                    
                    {/* Wrapper untuk Date Range agar tetap berdampingan/proporsional */}
                    <div style={{display: 'flex', gap: '12px', width: isMobile ? '100%' : 'auto'}}>
                       {/* Date Range Start */}
                       <div style={{display:'flex', alignItems:'center', backgroundColor: isDark?'#374151':'white', border: isDark?'1px solid #4b5563':'1px solid #d1d5db', borderRadius:'8px', padding:'0 12px', flex: 1, boxShadow: '0 1px 2px rgba(0,0,0,0.05)'}}>
                          <span style={{fontSize:'13px', color: isDark ? '#9ca3af' : '#6b7280', marginRight:'8px'}}>Start:</span>
                          <input type="date" value={dateRange.start} onChange={(e) => setDateRange({...dateRange, start: e.target.value})} style={{border:'none', background:'transparent', padding:'10px 0', outline:'none', color: isDark?'white':'black', fontSize: '14px', fontFamily: 'inherit', width: '100%'}} />
                       </div>

                       {/* Date Range End */}
                       <div style={{display:'flex', alignItems:'center', backgroundColor: isDark?'#374151':'white', border: isDark?'1px solid #4b5563':'1px solid #d1d5db', borderRadius:'8px', padding:'0 12px', flex: 1, boxShadow: '0 1px 2px rgba(0,0,0,0.05)'}}>
                          <span style={{fontSize:'13px', color: isDark ? '#9ca3af' : '#6b7280', marginRight:'8px'}}>End:</span>
                          <input type="date" value={dateRange.end} onChange={(e) => setDateRange({...dateRange, end: e.target.value})} style={{border:'none', background:'transparent', padding:'10px 0', outline:'none', color: isDark?'white':'black', fontSize: '14px', fontFamily: 'inherit', width: '100%'}} />
                       </div>
                    </div>
                 </div>
              </div>
              
              <div style={{overflowX: 'auto', border: isDark ? '1px solid #374151' : '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)'}}>
                <table style={styles.table}>
                   <thead>
                     <tr>
                       <th style={{...styles.th, whiteSpace: 'nowrap'}}>Marketer Email</th>
                       <th style={{...styles.th, whiteSpace: 'nowrap'}}>Total Leads</th>
                       <th style={{...styles.th, whiteSpace: 'nowrap'}}>Direct Asks</th>
                       <th style={{...styles.th, whiteSpace: 'nowrap'}}>Deals / Signed</th>
                       <th style={{...styles.th, whiteSpace: 'nowrap'}}>Conversion Rate</th>
                       <th style={{...styles.th, whiteSpace: 'nowrap'}}>Status</th>
                       <th style={{...styles.th, whiteSpace: 'nowrap'}}>Last Update</th>
                     </tr>
                   </thead>
                   <tbody>
                     {marketersStatsList.map((m, idx) => (
                       <tr key={idx} style={{backgroundColor: isDark ? 'transparent' : 'white'}}>
                         <td style={{...styles.td, fontWeight:600, whiteSpace: 'nowrap'}}>{m.name}</td>
                         <td style={styles.td}>{m.totalLeads}</td>
                         <td style={styles.td}>{m.directAsks}</td>
                         <td style={styles.td}>{m.deals}</td>
                         <td style={{...styles.td, color: '#d97706', fontWeight: 700}}>{m.conversionRate}%</td>
                         <td style={styles.td}>
                            <span style={{display: 'inline-block', whiteSpace: 'nowrap', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, backgroundColor: m.status === 'Active' ? (isDark ? '#14532d' : '#dcfce7') : (isDark ? '#7f1d1d' : '#fee2e2'), color: m.status === 'Active' ? (isDark ? '#4ade80' : '#16a34a') : (isDark ? '#f87171' : '#ef4444')}}>
                               {m.status}
                            </span>
                         </td>
                         <td style={{...styles.td, fontSize: '13px', color: isDark ? '#9ca3af' : '#6b7280', whiteSpace: 'nowrap'}}>{m.lastUpdate || '-'}</td>
                       </tr>
                     ))}
                     {marketersStatsList.length === 0 && (
                        <tr><td colSpan={7} style={{padding:'60px', textAlign:'center', color:'#6b7280', fontSize: '15px'}}>Belum ada data marketer.</td></tr>
                     )}
                   </tbody>
                </table>
              </div>
           </div>
        )}

        {/* --- TAB 3: INFLUENCER --- */}
        {activeTab === 'influencer' && (
           <div>
              <h2 style={{fontSize: isMobile ? '18px' : '22px', marginBottom:'24px', color: isDark?'white':'#111827', fontWeight: 800}}>Influencer / Source Performance (All Time)</h2>
              <div style={{overflowX: 'auto', border: isDark ? '1px solid #374151' : '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)'}}>
                <table style={styles.table}>
                   <thead>
                     <tr>
                       <th style={{...styles.th, whiteSpace: 'nowrap'}}>Source / Post Name</th>
                       <th style={{...styles.th, whiteSpace: 'nowrap'}}>Total Leads Generated</th>
                       <th style={{...styles.th, whiteSpace: 'nowrap'}}>Performance Rating</th>
                     </tr>
                   </thead>
                   <tbody>
                     {globalKpiStats.postPerformance?.map((item, idx) => (
                       <tr key={idx} style={{backgroundColor: isDark ? 'transparent' : 'white'}}>
                         <td style={{...styles.td, whiteSpace: 'nowrap', fontWeight: 500}}>{item.source}</td>
                         <td style={{...styles.td, fontSize:'16px', fontWeight:'700'}}>{item.count}</td>
                         <td style={styles.td}>
                            <span style={{
                               display: 'inline-block', whiteSpace: 'nowrap',
                               padding:'6px 12px', borderRadius:'20px', fontSize:'12px', fontWeight:700,
                               backgroundColor: item.rating==='Excellent' ? (isDark?'#14532d':'#dcfce7') : (item.rating==='Good' ? (isDark?'#1e3a8a':'#dbeafe') : (isDark?'#713f12':'#fef9c3')),
                               color: item.rating==='Excellent' ? (isDark?'#4ade80':'#166534') : (item.rating==='Good' ? (isDark?'#60a5fa':'#1e40af') : (isDark?'#fde047':'#854d0e'))
                            }}>{item.rating}</span>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                </table>
              </div>
           </div>
        )}

        {/* --- TAB 4: KPI DASHBOARD --- */}
        {activeTab === 'kpi' && (
           <div style={{display:'grid', gridTemplateColumns: isMobile?'1fr':'repeat(4, 1fr)', gap:'24px'}}>
              <div style={{gridColumn: '1 / -1', background: isDark?'rgba(55, 65, 81, 0.5)':'#f3f4f6', padding: '16px', borderRadius: '8px', fontSize: '14px', color: isDark?'#d1d5db':'#4b5563', borderLeft: '4px solid #3b82f6'}}>
                 KPI data is calculated <b>automatically</b> based on the <b>Date Range</b> and <b>Mail Marketer</b> filters you select in the Daily Log menu.
              </div>
              <div style={styles.card}>
                 <div style={{fontSize:'13px', textTransform:'uppercase', color: isDark?'#9ca3af':'#6b7280', fontWeight: 600, letterSpacing: '0.5px'}}>Total Leads</div>
                 <div style={{fontSize:'40px', fontWeight:800, color: isDark?'white':'#111827', marginTop: '12px'}}>{globalKpiStats.totalLeads}</div>
              </div>
              <div style={styles.card}>
                 <div style={{fontSize:'13px', textTransform:'uppercase', color:'#3b82f6', fontWeight: 600, letterSpacing: '0.5px'}}>Direct Asks</div>
                 <div style={{fontSize:'40px', fontWeight:800, color: '#3b82f6', marginTop: '12px'}}>{globalKpiStats.directAskCount}</div>
              </div>
              <div style={styles.card}>
                 <div style={{fontSize:'13px', textTransform:'uppercase', color:'#16a34a', fontWeight: 600, letterSpacing: '0.5px'}}>Deals / Signed</div>
                 <div style={{fontSize:'40px', fontWeight:800, color: '#16a34a', marginTop: '12px'}}>{globalKpiStats.conversionCount}</div>
              </div>
              <div style={styles.card}>
                 <div style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize:'13px', textTransform:'uppercase', color:'#d97706', fontWeight: 600, letterSpacing: '0.5px'}}>
                    <TrendingUp size={18} /> Conversion Rate
                 </div>
                 <div style={{fontSize:'40px', fontWeight:800, color: '#d97706', marginTop: '12px'}}>{conversionRate}%</div>
              </div>
           </div>
        )}

      </div>

    </div>
  );
}

// --- KOMPONEN INLINE BARU ---
const InlineAddEditForm = ({ initialData, onSubmit, onCancel, isDark, styles }: any) => {
  const [formData, setFormData] = useState<any>({});

  // Reset form setiap kali dipanggil, auto-fill Marketer Email jika ada di lokal.
  useEffect(() => {
    setFormData({
      rawDateIso: initialData?.rawDateIso || new Date().toISOString().split('T')[0],
      name: initialData?.leadName || '',
      url: initialData?.profileUrl || '',
      email: initialData?.email || '',
      industry: initialData?.industry || '',
      source: initialData?.source || '',
      template: initialData?.template || '',
      interactionType: initialData?.interactionType || '',
      tagged: initialData?.tagged || false,
      responseTime: initialData?.responseTime || '',
      status: initialData?.status || 'New',
      notes: initialData?.notes || '',
      marketer: initialData?.marketer || localStorage.getItem('savedMarketerEmail') || '',
      approvalStatus: initialData?.approvalStatus || 'None'
    });
  }, [initialData]);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    // Mengunci agar jika bukan admin edit, status tidak bisa diubah-ubah nilainya
    if (!initialData && name === 'status') return;

    setFormData((prev: any) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!initialData && formData.marketer) {
        // Simpan Email lokal biar sesi selanjutnya marketer ga perlu ketik ulang
        localStorage.setItem('savedMarketerEmail', formData.marketer);
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <label style={{ fontSize: '13px', color: isDark ? '#d1d5db' : '#4b5563', marginBottom: '6px', display: 'block', fontWeight: 500 }}>Contact Date</label>
          <input type="date" name="rawDateIso" value={formData.rawDateIso || ''} onChange={handleChange} required style={{...styles.input, width: '100%', boxSizing: 'border-box'}} />
        </div>
        <div>
          <label style={{ fontSize: '13px', color: isDark ? '#d1d5db' : '#4b5563', marginBottom: '6px', display: 'block', fontWeight: 500 }}>Lead Name</label>
          <input type="text" name="name" value={formData.name || ''} onChange={handleChange} required style={{...styles.input, width: '100%', boxSizing: 'border-box'}} />
        </div>
        
        {/* Hanya dimunculkan saat ADMIN SEDANG EDIT */}
        {initialData && (
          <div>
            <label style={{ fontSize: '13px', color: isDark ? '#d1d5db' : '#4b5563', marginBottom: '6px', display: 'block', fontWeight: 500 }}>Lead Email</label>
            <input type="email" name="email" value={formData.email || ''} onChange={handleChange} style={{...styles.input, width: '100%', boxSizing: 'border-box'}} />
          </div>
        )}

        <div>
          <label style={{ fontSize: '13px', color: isDark ? '#d1d5db' : '#4b5563', marginBottom: '6px', display: 'block', fontWeight: 500 }}>Proof/ Profile URL</label>
          <input type="text" name="url" value={formData.url || ''} onChange={handleChange} style={{...styles.input, width: '100%', boxSizing: 'border-box'}} />
        </div>
        <div>
          <label style={{ fontSize: '13px', color: isDark ? '#d1d5db' : '#4b5563', marginBottom: '6px', display: 'block', fontWeight: 500 }}>Industry / Role</label>
          <input type="text" name="industry" value={formData.industry || ''} onChange={handleChange} style={{...styles.input, width: '100%', boxSizing: 'border-box'}} />
        </div>
        <div>
          <label style={{ fontSize: '13px', color: isDark ? '#d1d5db' : '#4b5563', marginBottom: '6px', display: 'block', fontWeight: 500 }}>Marketer Email</label>
          <input type="email" name="marketer" placeholder="email@swakarsa.com" value={formData.marketer || ''} onChange={handleChange} required style={{...styles.input, width: '100%', boxSizing: 'border-box'}} />
        </div>
        <div>
          <label style={{ fontSize: '13px', color: isDark ? '#d1d5db' : '#4b5563', marginBottom: '6px', display: 'block', fontWeight: 500 }}>Source / Influencer</label>
          <input type="text" name="source" value={formData.source || ''} onChange={handleChange} style={{...styles.input, width: '100%', boxSizing: 'border-box'}} />
        </div>
        <div>
          <label style={{ fontSize: '13px', color: isDark ? '#d1d5db' : '#4b5563', marginBottom: '6px', display: 'block', fontWeight: 500 }}>Template Used</label>
          <input type="text" name="template" value={formData.template || ''} onChange={handleChange} style={{...styles.input, width: '100%', boxSizing: 'border-box'}} />
        </div>
        <div>
          <label style={{ fontSize: '13px', color: isDark ? '#d1d5db' : '#4b5563', marginBottom: '6px', display: 'block', fontWeight: 500 }}>Interaction Type</label>
          <select name="interactionType" value={formData.interactionType || ''} onChange={handleChange} style={{...styles.input, width: '100%', boxSizing: 'border-box', appearance: 'auto'}}>
            <option value="">-- Pilih --</option>
            <option value="Direct Ask">Direct Ask</option>
            <option value="Soft Sell">Soft Sell</option>
            <option value="Inbound">Inbound</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: '13px', color: isDark ? '#d1d5db' : '#4b5563', marginBottom: '6px', display: 'block', fontWeight: 500 }}>Status Conversion</label>
          {initialData ? (
            <select name="status" value={formData.status || ''} onChange={handleChange} style={{...styles.input, width: '100%', boxSizing: 'border-box', appearance: 'auto'}}>
              <option value="New">New</option>
              <option value="In Progress">In Progress</option>
              <option value="Deal / Signed">Deal / Signed</option>
              <option value="Drop">Drop</option>
            </select>
          ) : (
            <input 
              type="text" 
              name="status" 
              value="New" 
              readOnly 
              style={{
                ...styles.input, 
                width: '100%', 
                boxSizing: 'border-box',
                backgroundColor: isDark ? '#4b5563' : '#e5e7eb',
                color: isDark ? '#9ca3af' : '#6b7280',
                cursor: 'not-allowed'
              }} 
            />
          )}
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
         <div>
            <label style={{ fontSize: '13px', color: isDark ? '#d1d5db' : '#4b5563', marginBottom: '6px', display: 'block', fontWeight: 500 }}>Response Time</label>
            <input type="text" name="responseTime" value={formData.responseTime || ''} onChange={handleChange} placeholder="e.g. 5 Mins" style={{...styles.input, width: '100%', boxSizing: 'border-box'}} />
         </div>
         <div style={{ display: 'flex', alignItems: 'center', paddingTop: '20px' }}>
            <label style={{ fontSize: '14px', color: isDark ? '#f3f4f6' : '#111827', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600 }}>
              <input type="checkbox" name="tagged" checked={formData.tagged || false} onChange={handleChange} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
              Jonathan Tagged?
            </label>
         </div>
      </div>

      <div>
        <label style={{ fontSize: '13px', color: isDark ? '#d1d5db' : '#4b5563', marginBottom: '6px', display: 'block', fontWeight: 500 }}>Notes / Feedback</label>
        <textarea name="notes" value={formData.notes || ''} onChange={handleChange} style={{ ...styles.input, width: '100%', height: '80px', resize: 'none', boxSizing: 'border-box' }} />
      </div>

      <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
        <button type="button" onClick={onCancel} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: isDark ? '1px solid #4b5563' : '1px solid #d1d5db', background: 'transparent', color: isDark ? 'white' : '#111827', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
        <button type="submit" style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: '#0284c7', color: 'white', fontWeight: 600, cursor: 'pointer' }}>{initialData ? 'Data Update' : 'Save New Lead'}</button>
      </div>
    </form>
  );
};

// --- PIN MODAL COMPONENT ---
const PinModal = ({ isOpen, onClose, onSubmit, isDark, styles }: any) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === SECURITY_PIN) {
      onSubmit(); setPin(''); setError(''); onClose();
    } else {
      setError('Password Salah! Akses ditolak.'); setPin('');
    }
  };

  return (
    <AnimatedModal isOpen={isOpen} onClose={() => { onClose(); setPin(''); setError(''); }} styles={styles} contentStyle={{ width: '340px', textAlign: 'center' }}>
       <div style={{background: isDark?'#374151':'#f3f4f6', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto'}}>
         <Lock size={32} color={isDark ? '#e5e7eb' : '#374151'} />
       </div>
       <h3 style={{marginTop:0, color: isDark?'white':'#111827', fontSize: '20px', fontWeight: 700}}>Login Admin</h3>
       <p style={{fontSize: '14px', color: isDark ? '#9ca3af' : '#6b7280', marginBottom: '24px'}}>
         Enter the admin password to access the Admin feature.
       </p>
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