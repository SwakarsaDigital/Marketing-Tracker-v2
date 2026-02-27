import React, { useEffect, useState, useMemo } from 'react';

// --- IMPORTS DARI FILE YANG SUDAH DIPISAH ---
import { LXStyles } from './styles/lxStyles';
import { 
  FileText, Users, BarChart2, RefreshCw, LinkIcon, X, 
  SearchIcon, CheckSquare, Shield, Lock, Download, Edit, Trash2, MenuIcon, 
  TrendingUp
} from './components/icons/icons';
import { FullScreenLoader } from './components/ui/FullScreenLoader';
import { AnimatedModal } from './components/ui/AnimatedModal';
import { NotificationToast } from './components/ui/NotificationToast';
import { ConfirmModal } from './components/ui/ConfirmModal';
import { SearchableDropdown } from './components/ui/SearchableDropdown';

// --- CONFIGURATION ---
// URL Google Apps Script Anda
const GAS_API_URL = "https://script.google.com/macros/s/AKfycbx0TaLAHHMxE3JANtOYcmhQIZxxHsBXLkoGFAqr4Fdy8M6_SIWScP8o90cFRsTS9l2r/exec";
const SECURITY_PIN = "Yoyomagey1@"; 

// --- TYPES ---
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
            profileUrl: getValue("Bukti Google Drive", 2) || getValue("LinkedIn Profile URL", 2) || '',
            industry: getValue("Industry/Role", 3) || '-',
            source: getValue("Source Post/Influencer", 4) || '-',
            template: getValue("Template Used", 5) || '-',
            interactionType: getValue("Interaction Type", 6) || '-',
            tagged: String(getValue("Jonathan Tagged?", 7)).toLowerCase() === 'true',
            responseTime: getValue("Response Time", 8) || '-',
            status: getValue("Conversion Status", 9) || 'New',
            notes: getValue("Notes/Feedback", 10) || '',
            marketer: getValue("Marketer", 11) || '',
            email: getValue("Email", 12) || '',
            approvalStatus: getValue("Approval Status", 13) || 'None'
          };
        });

        setDailyLogs(mappedLogs.reverse());
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      if (showLoader) showNotification("Koneksi gagal. Cek konsol.", 'error');
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
      
      const matchPending = activeTab === 'admin' ? log.approvalStatus === 'Pending' : true; 

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

  // --- DYNAMIC KPIs (Admin Dashboard - PDF Point #2) ---
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
         if (log.approvalStatus === 'Pending') pending++;
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
      showNotification("Tidak ada data untuk di-export", "error");
      return;
    }
    
    const headers = ['Date', 'Lead Name', 'Industry', 'Source', 'Template', 'Type', 'Tagged', 'Response Time', 'Status', 'Notes', 'Marketer', 'Lead Email', 'Approval Status'];
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
      showNotification('Gagal melakukan aksi sinkronisasi ke server.', 'error');
      fetchData(false); // Revert UI
    }
  };

  const handleFormSubmit = (data: any) => {
    setIsModalOpen(false); 
    if (editingLead) {
      performActionSilently('edit', { ...data, rowNumber: editingLead.rowNumber }, 'Edit terkonfirmasi. Data berhasil diperbarui.');
      setEditingLead(null);
    } else {
      performActionSilently('create', { ...data, approvalStatus: 'Pending' }, 'Data baru berhasil ditambahkan.');
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
      title: 'Konfirmasi Logout',
      message: 'Apakah Anda yakin ingin keluar dari Admin Dashboard?',
      confirmText: 'Ya, Keluar',
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
      title: 'Konfirmasi Hapus',
      message: <>Yakin ingin menghapus data pemasaran atas nama <b>{lead.leadName}</b>? Data ini akan hilang permanen.</>,
      confirmText: 'Ya, Hapus',
      confirmColor: '#ef4444',
      icon: 'alert',
      onConfirm: () => performActionSilently('delete', lead, 'Data berhasil dihapus dari sistem.')
    });
  };

  const handleApproveClick = (lead: DailyLog) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Verifikasi & Approval',
      message: (
         <div style={{ textAlign: 'left', backgroundColor: isDark ? '#374151' : '#f3f4f6', padding: '16px', borderRadius: '8px', marginTop: '10px' }}>
            <div style={{marginBottom: '6px', fontSize: '13px'}}>Nama Lead: <span style={{fontWeight: 600, color: isDark?'white':'black'}}>{lead.leadName}</span></div>
            <div style={{marginBottom: '6px', fontSize: '13px'}}>Marketer: <span style={{fontWeight: 600, color: isDark?'white':'black'}}>{lead.marketer}</span></div>
            <div style={{marginBottom: '12px', fontSize: '13px'}}>Lead Email: <span style={{fontWeight: 700, color: '#0284c7'}}>{lead.email || '- Belum diisi -'}</span></div>
            <div style={{fontSize: '11px', color: isDark ? '#9ca3af' : '#6b7280', borderTop: isDark?'1px solid #4b5563':'1px solid #e5e7eb', paddingTop: '8px', lineHeight: 1.4}}>
               Jika disetujui, status otomatis berubah menjadi "In Progress".
            </div>
         </div>
      ),
      confirmText: 'Ya, Setujui',
      confirmColor: '#16a34a',
      icon: 'check',
      onConfirm: () => handleAdminApprovalAction(lead, 'Approve')
    });
  };

  const handleDeclineClick = (lead: DailyLog) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Decline Approval',
      message: <>Tolak request approval untuk <b>{lead.leadName}</b>? Data akan dikembalikan ke Marketer.</>,
      confirmText: 'Ya, Tolak',
      confirmColor: '#ef4444',
      icon: 'alert',
      onConfirm: () => handleAdminApprovalAction(lead, 'Decline')
    });
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

    await performActionSilently('edit', dataToUpdate, `Request Approval dikirim untuk ${leadToUpdate.leadName}`);
  };

  const handleAdminApprovalAction = async (lead: DailyLog, actionType: 'Approve' | 'Decline') => {
    if (!isAdmin) return;

    const newApprovalStatus = actionType === 'Approve' ? 'Approved' : 'Declined';
    const newStatus = actionType === 'Approve' ? 'In Progress' : lead.status;

    setDailyLogs(prevLogs => prevLogs.map(l => 
       l.id === lead.id ? { ...l, approvalStatus: newApprovalStatus, status: newStatus } : l
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
       notes: lead.notes,
       marketer: lead.marketer,
       email: lead.email,
       approvalStatus: newApprovalStatus
    };

    await performActionSilently('edit', dataToUpdate, `${actionType} sukses untuk ${lead.leadName}.`);
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
        @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes scaleOut { from { transform: scale(1); opacity: 1; } to { transform: scale(0.9); opacity: 0; } }
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

      {/* --- ADD / EDIT LEAD MODAL INLINE (Penyelesaian Crash) --- */}
      <AnimatedModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingLead(null); }} 
        title={editingLead ? 'Edit Lead' : 'New Lead'}
        styles={styles} 
        contentStyle={{ width: '600px', maxWidth: '95vw' }}
      >
         <div style={{display:'flex', justifyContent:'space-between', marginBottom:'16px'}}>
            <h3 style={{margin:0, color: isDark?'white':'#1f2937', fontSize: '18px'}}>
              {editingLead ? 'Edit Lead' : 'New Lead'}
            </h3>
            <button onClick={() => { setIsModalOpen(false); setEditingLead(null); }} style={{background:'none', border:'none', cursor:'pointer', color:'#9ca3af'}}>
              <X size={20}/>
            </button>
         </div>
         {/* Form Custom Inline yang formatnya sesuai dengan data Google Apps Script (Mencegah Layar Hitam) */}
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
            <button onClick={() => setApprovalModalLead(null)} style={{background:'none', border:'none', cursor:'pointer', color:'#9ca3af'}}><X size={20}/></button>
         </div>
         <p style={{fontSize: '13px', color: isDark ? '#9ca3af' : '#6b7280', marginBottom: '16px'}}>
            Masukkan <b>Lead Email</b> untuk mendaftarkan <b>{approvalModalLead?.leadName}</b>
         </p>
         <form onSubmit={handleRequestApproval}>
            <input 
              type="email" required autoFocus
              value={approvalEmail} onChange={(e) => setApprovalEmail(e.target.value)}
              placeholder="lead.email@example.com"
              style={{...styles.input, marginBottom: '20px'}} 
            />
            <button type="submit" style={{...styles.btnPrimary, width: '100%', justifyContent: 'center'}}>Kirim Request</button>
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
              width: '260px', height: '100%', backgroundColor: isDark ? '#1f2937' : '#fff',
              padding: '20px 0', display: 'flex', flexDirection: 'column',
              animation: 'slideInLeft 0.3s forwards', boxShadow: '2px 0 10px rgba(0,0,0,0.2)'
           }} onClick={e => e.stopPropagation()}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px', marginBottom: '20px'}}>
                 <h2 style={{margin: 0, color: isDark ? '#fff' : '#166534', fontSize: '18px', fontWeight: 700}}>Menu</h2>
                 <button onClick={() => setIsMobileMenuOpen(false)} style={{background:'none', border:'none', color: isDark?'#fff':'#000', cursor:'pointer'}}><X size={24}/></button>
              </div>
              
              <div style={{display:'flex', flexDirection:'column', gap:'5px', padding: '0 10px'}}>
                <button onClick={() => switchTabMobile('daily')} style={{...styles.tab(activeTab === 'daily'), borderRadius:'8px', border:'none', background: activeTab==='daily' ? (isDark?'#374151':'#f0fdf4') : 'transparent'}}>
                  <FileText size={18} /> Daily Log
                </button>
                <button onClick={() => switchTabMobile('marketers')} style={{...styles.tab(activeTab === 'marketers'), borderRadius:'8px', border:'none', background: activeTab==='marketers' ? (isDark?'#374151':'#f0fdf4') : 'transparent'}}>
                  <Users size={18} /> Marketers
                </button>
                <button onClick={() => switchTabMobile('influencer')} style={{...styles.tab(activeTab === 'influencer'), borderRadius:'8px', border:'none', background: activeTab==='influencer' ? (isDark?'#374151':'#f0fdf4') : 'transparent'}}>
                  <CheckSquare size={18} /> Influencer Stats
                </button>
                <button onClick={() => switchTabMobile('kpi')} style={{...styles.tab(activeTab === 'kpi'), borderRadius:'8px', border:'none', background: activeTab==='kpi' ? (isDark?'#374151':'#f0fdf4') : 'transparent'}}>
                  <BarChart2 size={18} /> Dashboard KPI
                </button>
                <div style={{borderTop: isDark?'1px solid #374151':'1px solid #eee', margin: '10px 0'}}></div>
                <button onClick={handleTabAdminClick} style={{...styles.tab(activeTab === 'admin'), borderRadius:'8px', border:'none', color: isAdmin ? '#16a34a' : (isDark?'#9ca3af':'#6b7280'), background: activeTab==='admin' ? (isDark?'#374151':'#f0fdf4') : 'transparent'}}>
                  {isAdmin ? <Shield size={18} /> : <Lock size={18} />} Admin Dashboard
                </button>
              </div>
           </div>
        </div>
      )}

      {/* HEADER */}
      <div style={styles.header}>
        <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
           {/* Hamburger Icon for Mobile */}
           {isMobile && (
             <button onClick={() => setIsMobileMenuOpen(true)} style={{background:'none', border:'none', color:'white', cursor:'pointer', padding: 0, display: 'flex', alignItems: 'center'}}>
               <MenuIcon size={26} />
             </button>
           )}
           <div style={{background: 'rgba(255,255,255,0.2)', padding: '8px', borderRadius: '8px', display: isMobile ? 'none' : 'flex'}}>
             <FileText size={20} />
           </div>
           <div>
             <h1 style={{fontSize: isMobile ? '16px' : '18px', margin:0, fontWeight:700}}>Marketing Tracker</h1>
             <div style={{fontSize:'11px', opacity:0.8, display:'flex', alignItems:'center', gap:'4px'}}>
               <span style={{width:'6px', height:'6px', borderRadius:'50%', backgroundColor:'#4ade80'}}></span> Online
             </div>
           </div>
        </div>
        <div style={{display:'flex', gap:'8px'}}>
          {!isMobile && (
             <button onClick={() => isAdmin ? handleLogoutClick() : setIsLoginModalOpen(true)} style={{background: isAdmin ? '#ef4444' : '#3b82f6', border:'none', color:'white', borderRadius:'6px', padding:'6px 12px', fontSize:'12px', cursor: 'pointer', fontWeight: 600}}>
                {isAdmin ? 'Keluar Admin' : 'Masuk Admin'}
             </button>
          )}
          <button onClick={() => fetchData(true)} style={{background:'rgba(255,255,255,0.2)', border:'none', color:'white', borderRadius:'6px', padding:'6px', cursor:'pointer'}} title="Refresh Data">
            <RefreshCw size={18} />
          </button>
          <button onClick={() => setIsDark(!isDark)} style={{background:'rgba(255,255,255,0.2)', border:'none', color:'white', borderRadius:'6px', padding:'6px 12px', fontSize:'12px', cursor: 'pointer', fontWeight: 500}}>
             {isDark ? 'Light' : 'Dark'}
          </button>
        </div>
      </div>

      {/* TABS PENGGUNA (Hanya muncul di Desktop) */}
      <div style={styles.tabBar}>
        <div onClick={() => setActiveTab('daily')} style={styles.tab(activeTab === 'daily')}><FileText size={16} /> Daily Log</div>
        <div onClick={() => setActiveTab('marketers')} style={styles.tab(activeTab === 'marketers')}><Users size={16} /> Marketers</div>
        <div onClick={() => setActiveTab('influencer')} style={styles.tab(activeTab === 'influencer')}><CheckSquare size={16} /> Influencer Stats</div>
        <div onClick={() => setActiveTab('kpi')} style={styles.tab(activeTab === 'kpi')}><BarChart2 size={16} /> Dashboard KPI</div>
        
        {/* Tab Spesial Admin Dashboard */}
        <div 
           onClick={handleTabAdminClick} 
           style={{...styles.tab(activeTab === 'admin'), marginLeft: 'auto', color: isAdmin ? '#16a34a' : (isDark?'#9ca3af':'#6b7280')}}
        >
           {isAdmin ? <Shield size={16} /> : <Lock size={16} />} Admin Dashboard
        </div>
      </div>

      {/* CONTENT AREA */}
      <div style={styles.content}>
        
        {/* --- TAB 1 & 5 : DAILY LOG & ADMIN DASHBOARD --- */}
        {(activeTab === 'daily' || (activeTab === 'admin' && isAdmin)) && (
          <div>
            {/* FITUR PENCARIAN & FILTER RESPONSIVE */}
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px', flexWrap:'wrap', gap:'15px', alignItems: 'flex-end'}}>
               
               <div style={{display:'flex', gap:'10px', flex:1, flexWrap: 'wrap', alignItems: 'center'}}>
                  {/* Judul Halaman dinamis */}
                  <div style={{width: '100%', marginBottom: '5px'}}>
                     <h2 style={{fontSize: isMobile ? '16px' : '18px', margin:0, color: isDark?'white':'#333', fontWeight: 700}}>
                        {activeTab === 'admin' ? 'Admin Dashboard - Kelola & Setujui Leads' : 'Daily Log - Semua Leads'}
                     </h2>
                  </div>

                  {/* Name Search */}
                  <div style={{display:'flex', alignItems:'center', backgroundColor: isDark?'#374151':'white', border: isDark?'1px solid #4b5563':'1px solid #ddd', borderRadius:'8px', padding:'0 12px', flex: isMobile ? '1 1 100%' : '1 1 200px', minWidth: '150px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)'}}>
                     <SearchIcon size={16} color="#9ca3af"/>
                     <input placeholder="Cari Lead Name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{border:'none', background:'transparent', padding:'10px', outline:'none', color: isDark?'white':'black', width:'100%', fontSize: '13px'}} />
                  </div>
                  
                  {/* Date Range Start */}
                  <div style={{display:'flex', alignItems:'center', backgroundColor: isDark?'#374151':'white', border: isDark?'1px solid #4b5563':'1px solid #ddd', borderRadius:'8px', padding:'0 12px', flex: isMobile ? '1 1 45%' : '0 1 auto', boxShadow: '0 1px 2px rgba(0,0,0,0.05)'}}>
                     <span style={{fontSize:'12px', color:'#9ca3af', marginRight:'5px'}}>Start:</span>
                     <input type="date" value={dateRange.start} onChange={(e) => setDateRange({...dateRange, start: e.target.value})} style={{border:'none', background:'transparent', padding:'10px 0', outline:'none', color: isDark?'white':'black', fontSize: '13px', fontFamily: 'inherit', width: '100%'}} />
                  </div>

                  {/* Date Range End */}
                  <div style={{display:'flex', alignItems:'center', backgroundColor: isDark?'#374151':'white', border: isDark?'1px solid #4b5563':'1px solid #ddd', borderRadius:'8px', padding:'0 12px', flex: isMobile ? '1 1 45%' : '0 1 auto', boxShadow: '0 1px 2px rgba(0,0,0,0.05)'}}>
                     <span style={{fontSize:'12px', color:'#9ca3af', marginRight:'5px'}}>End:</span>
                     <input type="date" value={dateRange.end} onChange={(e) => setDateRange({...dateRange, end: e.target.value})} style={{border:'none', background:'transparent', padding:'10px 0', outline:'none', color: isDark?'white':'black', fontSize: '13px', fontFamily: 'inherit', width: '100%'}} />
                  </div>

                  {/* Kustom Searchable Dropdown Marketer (Fitur Kayak Google Search) */}
                  <div style={{ flex: isMobile ? '1 1 100%' : '1 1 180px' }}>
                    <SearchableDropdown 
                       value={marketerFilter} 
                       onChange={setMarketerFilter} 
                       options={availableMarketers} 
                       placeholder="Semua Marketer (Cari...)" 
                       isDark={isDark} 
                    />
                  </div>
               </div>

               {/* Action Buttons */}
               <div style={{display: 'flex', gap: '10px', height: 'fit-content', width: isMobile ? '100%' : 'auto', justifyContent: isMobile ? 'space-between' : 'flex-start'}}>
                  <button onClick={handleExportCSV} style={{...styles.btnPrimary, backgroundColor: '#0284c7', flex: isMobile ? 1 : 'none', justifyContent: 'center'}} title="Export ke Excel/CSV">
                    <Download size={16} /> <span>Export</span>
                  </button>
                  <button onClick={() => { setEditingLead(null); setIsModalOpen(true); }} style={{...styles.btnPrimary, flex: isMobile ? 1 : 'none', justifyContent: 'center'}}>
                    <span>+</span> <span>New Lead</span>
                  </button>
               </div>
            </div>

            {/* --- ADMIN DASHBOARD KPIs (PDF Nomor 2) --- */}
            {activeTab === 'admin' && (
              <div style={{display:'grid', gridTemplateColumns: isMobile?'1fr 1fr':'repeat(4, 1fr)', gap:'15px', marginBottom: '20px'}}>
                 <div style={{...styles.card, padding: '15px'}}>
                    <div style={{fontSize:'12px', color:'#6b7280', fontWeight: 600}}>Total Filtered Leads</div>
                    <div style={{fontSize:'24px', fontWeight:800, color: isDark?'white':'#1f2937'}}>{adminKpiStats.total}</div>
                 </div>
                 <div style={{...styles.card, padding: '15px'}}>
                    <div style={{fontSize:'12px', color:'#d97706', fontWeight: 600}}>Pending Approval</div>
                    <div style={{fontSize:'24px', fontWeight:800, color: '#d97706'}}>{adminKpiStats.pending}</div>
                 </div>
                 <div style={{...styles.card, padding: '15px'}}>
                    <div style={{fontSize:'12px', color:'#16a34a', fontWeight: 600}}>Approved</div>
                    <div style={{fontSize:'24px', fontWeight:800, color: '#16a34a'}}>{adminKpiStats.approved}</div>
                 </div>
                 <div style={{...styles.card, padding: '15px'}}>
                    <div style={{fontSize:'12px', color:'#ef4444', fontWeight: 600}}>Declined</div>
                    <div style={{fontSize:'24px', fontWeight:800, color: '#ef4444'}}>{adminKpiStats.declined}</div>
                 </div>
              </div>
            )}

            {/* TABEL DATA RESPONSIVE */}
            <div style={{overflowX: 'auto', border: isDark ? '1px solid #374151' : '1px solid #e5e7eb', borderRadius: '12px'}}>
               <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={{...styles.th, textAlign: 'center'}}>No.</th>
                      <th style={styles.th}>Date</th>
                      <th style={styles.th}>Lead Name</th>
                      <th style={styles.th}>Bukti GDrive</th> 
                      <th style={styles.th}>Lead Email</th>
                      <th style={styles.th}>Approval Status / Action</th> 
                      <th style={styles.th}>Status</th>
                      <th style={styles.th}>Industry</th>
                      <th style={styles.th}>Source</th>
                      <th style={styles.th}>Template</th>
                      <th style={styles.th}>Type</th>
                      <th style={styles.th}>Notes</th>
                      <th style={styles.th}>Marketer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedLogs.length === 0 ? (
                       <tr><td colSpan={13} style={{padding:'40px', textAlign:'center', color:'#6b7280'}}>Tidak ada data.</td></tr>
                    ) : (
                       paginatedLogs.map((row, index) => (
                         <tr key={row.id} style={{backgroundColor: isDark ? 'transparent' : 'white'}}>
                           <td style={{...styles.td, textAlign: 'center', color: '#9ca3af', fontSize: '12px'}}>
                              {(currentPage - 1) * itemsPerPage + index + 1}
                           </td>

                           <td style={styles.td}>{row.date}</td>
                           <td style={styles.td}><span style={{fontWeight: 600, display: 'inline-block', whiteSpace: 'nowrap'}}>{row.leadName}</span></td>
                           <td style={styles.td}>{row.profileUrl && <a href={row.profileUrl} target="_blank" rel="noreferrer" style={{color:'#2563eb', display: 'flex', alignItems: 'center'}}><LinkIcon size={16}/></a>}</td>
                           <td style={styles.td}>{row.email || '-'}</td>
                           
                           <td style={styles.td}>
                              {/* Logika Tampilan Utama Approval */}
                              {activeTab === 'admin' ? (
                                 <div style={{display:'flex', gap:'5px', alignItems: 'center'}}>
                                   <button onClick={() => handleApproveClick(row)} style={{...styles.actionBtn, backgroundColor: isDark ? '#374151' : '#dcfce7', color: '#16a34a', padding: '4px 8px'}} title="Approve"><CheckSquare size={14} /> <span style={{marginLeft:'4px', fontSize:'11px', fontWeight:600}}>Approve</span></button>
                                   <button onClick={() => handleDeclineClick(row)} style={{...styles.actionBtn, backgroundColor: isDark ? '#374151' : '#fee2e2', color: '#ef4444', padding: '4px 8px'}} title="Decline"><X size={14} /> <span style={{marginLeft:'4px', fontSize:'11px', fontWeight:600}}>Decline</span></button>
                                 </div>
                              ) : (
                                 row.status === 'New' ? (
                                    row.approvalStatus === 'Pending' ? (
                                       <span style={{color: '#d97706', fontSize: '12px', fontWeight: 600, display: 'inline-block', whiteSpace: 'nowrap'}}>Pending...</span>
                                    ) : row.approvalStatus === 'Declined' ? (
                                       <div style={{display:'flex', flexDirection: 'column', gap:'4px'}}>
                                          <span style={{color: '#ef4444', fontSize: '12px', fontWeight: 700}}>Declined</span>
                                          <button onClick={() => setApprovalModalLead(row)} style={{fontSize:'10px', padding: '2px 6px', borderRadius:'4px', background: isDark?'#374151':'#f3f4f6', color:isDark?'white':'black', border:isDark?'1px solid #4b5563':'1px solid #ddd', cursor:'pointer', whiteSpace: 'nowrap'}}>Req. Again</button>
                                       </div>
                                    ) : (
                                       <button onClick={() => setApprovalModalLead(row)} style={{fontSize:'11px', padding: '4px 8px', borderRadius:'6px', background: isDark?'#374151':'#f3f4f6', color:isDark?'white':'black', border:isDark?'1px solid #4b5563':'1px solid #ddd', cursor:'pointer', whiteSpace: 'nowrap'}}>Req. Approval</button>
                                    )
                                 ) : <span style={{color:'#16a34a', fontSize:'11px', fontWeight: 600, display: 'inline-block', whiteSpace: 'nowrap'}}>Approved</span>
                              )}

                              {/* Alat Khusus Admin: Edit & Delete Tampil di Semua Tab jika sudah Login */}
                              {isAdmin && (
                                 <div style={{display:'flex', gap:'5px', alignItems: 'center', marginTop: '8px', paddingTop: '8px', borderTop: isDark ? '1px solid #4b5563' : '1px solid #e5e7eb'}}>
                                    <button onClick={() => {setEditingLead(row); setIsModalOpen(true);}} style={{...styles.actionBtn, backgroundColor: isDark ? '#374151' : '#e0f2fe', color: '#0284c7'}} title="Edit Log Manual"><Edit size={14} /></button>
                                    <button onClick={() => handleDeleteClick(row)} style={{...styles.actionBtn, backgroundColor: isDark ? '#374151' : '#fee2e2', color: '#ef4444'}} title="Delete Log Manual"><Trash2 size={14} /></button>
                                 </div>
                              )}
                           </td>

                           <td style={styles.td}>
                             <span style={{
                               display: 'inline-block',
                               whiteSpace: 'nowrap',
                               padding:'4px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:600,
                               backgroundColor: String(row.status).toLowerCase().includes('deal')||String(row.status).toLowerCase().includes('signed') ? '#dcfce7' : (row.status==='In Progress' ? '#dbeafe' : (isDark ? '#374151' : '#f3f4f6')),
                               color: String(row.status).toLowerCase().includes('deal')||String(row.status).toLowerCase().includes('signed') ? '#166534' : (row.status==='In Progress' ? '#1e40af' : (isDark ? '#e5e7eb' : '#374151')),
                             }}>{row.status}</span>
                           </td>
                           <td style={{...styles.td, whiteSpace: 'nowrap'}}>{row.industry}</td>
                           <td style={{...styles.td, whiteSpace: 'nowrap'}}>{row.source}</td>
                           <td style={{...styles.td, whiteSpace: 'nowrap'}}>{row.template}</td>
                           <td style={{...styles.td, whiteSpace: 'nowrap'}}>{row.interactionType}</td>
                           <td style={{...styles.td, fontSize:'12px', color: isDark ? '#9ca3af' : '#6b7280', maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}} title={row.notes}>{row.notes}</td>
                           <td style={{...styles.td, whiteSpace: 'nowrap', fontWeight: 600}}>{row.marketer}</td>
                         </tr>
                       ))
                    )}
                  </tbody>
               </table>
            </div>
            
            {/* PAGINATION CONTROLS */}
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px', flexWrap: 'wrap', gap: '10px'}}>
               <div style={{fontSize: '13px', color: isDark ? '#9ca3af' : '#6b7280'}}>
                  Showing 
                  <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} style={{margin: '0 8px', padding: '4px', borderRadius: '4px', border: isDark?'1px solid #4b5563':'1px solid #d1d5db', background: isDark?'#374151':'white', color: isDark?'white':'black'}}>
                     <option value={25}>25</option>
                     <option value={50}>50</option>
                     <option value={75}>75</option>
                     <option value={100}>100</option>
                  </select> 
                  rows per page (Total: {filteredLogs.length})
               </div>
               <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                  <button disabled={currentPage === 1} onClick={() => setCurrentPage(c => c - 1)} style={{padding: '6px 12px', borderRadius: '6px', border: isDark?'1px solid #4b5563':'1px solid #d1d5db', background: currentPage===1 ? 'transparent' : (isDark?'#374151':'white'), color: currentPage===1 ? '#9ca3af' : (isDark?'white':'black'), cursor: currentPage===1 ? 'not-allowed' : 'pointer'}}>Prev</button>
                  <span style={{fontSize: '13px', margin: '0 5px'}}>Page {currentPage} of {totalPages || 1}</span>
                  <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(c => c + 1)} style={{padding: '6px 12px', borderRadius: '6px', border: isDark?'1px solid #4b5563':'1px solid #d1d5db', background: (currentPage === totalPages || totalPages === 0) ? 'transparent' : (isDark?'#374151':'white'), color: (currentPage === totalPages || totalPages === 0) ? '#9ca3af' : (isDark?'white':'black'), cursor: (currentPage === totalPages || totalPages === 0) ? 'not-allowed' : 'pointer'}}>Next</button>
               </div>
            </div>

          </div>
        )}

        {/* Jika User bypass Admin Panel tanpa Login */}
        {activeTab === 'admin' && !isAdmin && (
           <div style={{textAlign: 'center', padding: '60px 20px'}}>
              <Lock size={64} color="#ef4444" style={{margin: '0 auto 20px auto'}} />
              <h2 style={{color: isDark?'white':'#333', marginBottom: '10px'}}>Akses Terkunci</h2>
              <p style={{color: '#6b7280', marginBottom: '20px'}}>Anda harus masuk sebagai admin untuk melihat halaman ini.</p>
              <button onClick={() => setIsLoginModalOpen(true)} style={{...styles.btnPrimary, margin: '0 auto'}}>Masuk Admin</button>
           </div>
        )}

        {/* --- TAB 2: MARKETERS PAGE --- */}
        {activeTab === 'marketers' && (
           <div>
              <div style={{display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', marginBottom: '20px', gap: '15px'}}>
                 <h2 style={{fontSize: isMobile ? '16px' : '18px', margin:0, color: isDark?'white':'#333', fontWeight: 700}}>Marketers Performance</h2>
                 
                 <div style={{display:'flex', flexDirection: isMobile ? 'column' : 'row', gap:'10px', width: isMobile ? '100%' : 'auto', alignItems: 'center'}}>
                    {/* Search Marketer */}
                    <div style={{display:'flex', alignItems:'center', backgroundColor: isDark?'#374151':'white', border: isDark?'1px solid #4b5563':'1px solid #ddd', borderRadius:'8px', padding:'0 12px', flex: isMobile ? '1 1 100%' : '1 1 200px', minWidth: '150px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', width: isMobile ? '100%' : 'auto'}}>
                       <SearchIcon size={16} color="#9ca3af"/>
                       <input placeholder="Cari Marketer..." value={marketerSearchQuery} onChange={(e) => setMarketerSearchQuery(e.target.value)} style={{border:'none', background:'transparent', padding:'10px', outline:'none', color: isDark?'white':'black', width:'100%', fontSize: '13px'}} />
                    </div>
                    
                    {/* Wrapper untuk Date Range agar tetap berdampingan/proporsional */}
                    <div style={{display: 'flex', gap: '10px', width: isMobile ? '100%' : 'auto'}}>
                       {/* Date Range Start */}
                       <div style={{display:'flex', alignItems:'center', backgroundColor: isDark?'#374151':'white', border: isDark?'1px solid #4b5563':'1px solid #ddd', borderRadius:'8px', padding:'0 12px', flex: 1, boxShadow: '0 1px 2px rgba(0,0,0,0.05)'}}>
                          <span style={{fontSize:'12px', color:'#9ca3af', marginRight:'5px'}}>Start:</span>
                          <input type="date" value={dateRange.start} onChange={(e) => setDateRange({...dateRange, start: e.target.value})} style={{border:'none', background:'transparent', padding:'10px 0', outline:'none', color: isDark?'white':'black', fontSize: '13px', fontFamily: 'inherit', width: '100%'}} />
                       </div>

                       {/* Date Range End */}
                       <div style={{display:'flex', alignItems:'center', backgroundColor: isDark?'#374151':'white', border: isDark?'1px solid #4b5563':'1px solid #ddd', borderRadius:'8px', padding:'0 12px', flex: 1, boxShadow: '0 1px 2px rgba(0,0,0,0.05)'}}>
                          <span style={{fontSize:'12px', color:'#9ca3af', marginRight:'5px'}}>End:</span>
                          <input type="date" value={dateRange.end} onChange={(e) => setDateRange({...dateRange, end: e.target.value})} style={{border:'none', background:'transparent', padding:'10px 0', outline:'none', color: isDark?'white':'black', fontSize: '13px', fontFamily: 'inherit', width: '100%'}} />
                       </div>
                    </div>
                 </div>
              </div>
              
              <div style={{overflowX: 'auto', border: isDark ? '1px solid #374151' : '1px solid #e5e7eb', borderRadius: '12px'}}>
                <table style={styles.table}>
                   <thead>
                     <tr>
                       <th style={{...styles.th, whiteSpace: 'nowrap'}}>Marketer Name</th>
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
                       <tr key={idx}>
                         <td style={{...styles.td, fontWeight:600, whiteSpace: 'nowrap'}}>{m.name}</td>
                         <td style={styles.td}>{m.totalLeads}</td>
                         <td style={styles.td}>{m.directAsks}</td>
                         <td style={styles.td}>{m.deals}</td>
                         <td style={{...styles.td, color: '#d97706', fontWeight: 700}}>{m.conversionRate}%</td>
                         <td style={styles.td}>
                            <span style={{display: 'inline-block', whiteSpace: 'nowrap', padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 600, backgroundColor: m.status === 'Active' ? '#dcfce7' : '#fee2e2', color: m.status === 'Active' ? '#16a34a' : '#ef4444'}}>
                               {m.status}
                            </span>
                         </td>
                         <td style={{...styles.td, fontSize: '12px', color: '#6b7280', whiteSpace: 'nowrap'}}>{m.lastUpdate || '-'}</td>
                       </tr>
                     ))}
                     {marketersStatsList.length === 0 && (
                        <tr><td colSpan={7} style={{padding:'40px', textAlign:'center', color:'#6b7280'}}>Belum ada data marketer.</td></tr>
                     )}
                   </tbody>
                </table>
              </div>
           </div>
        )}

        {/* --- TAB 3: INFLUENCER --- */}
        {activeTab === 'influencer' && (
           <div>
              <h2 style={{fontSize: isMobile ? '16px' : '18px', marginBottom:'15px', color: isDark?'white':'#333', fontWeight: 700}}>Influencer / Source Performance (All Time)</h2>
              <div style={{overflowX: 'auto', border: isDark ? '1px solid #374151' : '1px solid #e5e7eb', borderRadius: '12px'}}>
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
                       <tr key={idx}>
                         <td style={{...styles.td, whiteSpace: 'nowrap'}}>{item.source}</td>
                         <td style={{...styles.td, fontSize:'16px', fontWeight:'bold'}}>{item.count}</td>
                         <td style={styles.td}>
                            <span style={{
                               display: 'inline-block', whiteSpace: 'nowrap',
                               padding:'4px 10px', borderRadius:'12px', fontSize:'12px', fontWeight:700,
                               backgroundColor: item.rating==='Excellent' ? '#dcfce7' : (item.rating==='Good' ? '#dbeafe' : '#fef9c3'),
                               color: item.rating==='Excellent' ? '#166534' : (item.rating==='Good' ? '#1e40af' : '#854d0e')
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
           <div style={{display:'grid', gridTemplateColumns: isMobile?'1fr':'repeat(4, 1fr)', gap:'20px'}}>
              <div style={{gridColumn: '1 / -1', background: isDark?'#374151':'#f3f4f6', padding: '12px', borderRadius: '8px', fontSize: '13px', color: isDark?'#d1d5db':'#4b5563'}}>
                 Data KPI dihitung secara otomatis berdasarkan filter <b>Date Range</b> dan <b>Marketer</b> yang Anda pilih di menu utama.
              </div>
              <div style={styles.card}>
                 <div style={{fontSize:'12px', textTransform:'uppercase', color:'#6b7280', fontWeight: 600, letterSpacing: '0.5px'}}>Total Leads</div>
                 <div style={{fontSize:'36px', fontWeight:800, color: isDark?'white':'#1f2937', marginTop: '8px'}}>{globalKpiStats.totalLeads}</div>
              </div>
              <div style={styles.card}>
                 <div style={{fontSize:'12px', textTransform:'uppercase', color:'#2563eb', fontWeight: 600, letterSpacing: '0.5px'}}>Direct Asks</div>
                 <div style={{fontSize:'36px', fontWeight:800, color: '#2563eb', marginTop: '8px'}}>{globalKpiStats.directAskCount}</div>
              </div>
              <div style={styles.card}>
                 <div style={{fontSize:'12px', textTransform:'uppercase', color:'#16a34a', fontWeight: 600, letterSpacing: '0.5px'}}>Deals / Signed</div>
                 <div style={{fontSize:'36px', fontWeight:800, color: '#16a34a', marginTop: '8px'}}>{globalKpiStats.conversionCount}</div>
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

    </div>
  );
}

// --- KOMPONEN INLINE BARU: MENGGANTIKAN AddLeadForm.tsx YANG BENTROK ---
const InlineAddEditForm = ({ initialData, onSubmit, onCancel, isDark, styles }: any) => {
  const [formData, setFormData] = useState<any>({});

  // Reset form setiap kali dipanggil (terutama saat berpindah antar Edit baris yang berbeda)
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
      marketer: initialData?.marketer || '',
      approvalStatus: initialData?.approvalStatus || 'None'
    });
  }, [initialData]);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        <div>
          <label style={{ fontSize: '12px', color: isDark ? '#9ca3af' : '#4b5563', marginBottom: '4px', display: 'block' }}>Tanggal Kontak</label>
          <input type="date" name="rawDateIso" value={formData.rawDateIso || ''} onChange={handleChange} required style={{...styles.input, width: '100%', boxSizing: 'border-box'}} />
        </div>
        <div>
          <label style={{ fontSize: '12px', color: isDark ? '#9ca3af' : '#4b5563', marginBottom: '4px', display: 'block' }}>Lead Name</label>
          <input type="text" name="name" value={formData.name || ''} onChange={handleChange} required style={{...styles.input, width: '100%', boxSizing: 'border-box'}} />
        </div>
        <div>
          <label style={{ fontSize: '12px', color: isDark ? '#9ca3af' : '#4b5563', marginBottom: '4px', display: 'block' }}>Lead Email</label>
          <input type="email" name="email" value={formData.email || ''} onChange={handleChange} style={{...styles.input, width: '100%', boxSizing: 'border-box'}} />
        </div>
        <div>
          <label style={{ fontSize: '12px', color: isDark ? '#9ca3af' : '#4b5563', marginBottom: '4px', display: 'block' }}>Bukti / Profile URL</label>
          <input type="text" name="url" value={formData.url || ''} onChange={handleChange} style={{...styles.input, width: '100%', boxSizing: 'border-box'}} />
        </div>
        <div>
          <label style={{ fontSize: '12px', color: isDark ? '#9ca3af' : '#4b5563', marginBottom: '4px', display: 'block' }}>Industry / Role</label>
          <input type="text" name="industry" value={formData.industry || ''} onChange={handleChange} style={{...styles.input, width: '100%', boxSizing: 'border-box'}} />
        </div>
        <div>
          <label style={{ fontSize: '12px', color: isDark ? '#9ca3af' : '#4b5563', marginBottom: '4px', display: 'block' }}>Marketer Name</label>
          <input type="text" name="marketer" value={formData.marketer || ''} onChange={handleChange} required style={{...styles.input, width: '100%', boxSizing: 'border-box'}} />
        </div>
        <div>
          <label style={{ fontSize: '12px', color: isDark ? '#9ca3af' : '#4b5563', marginBottom: '4px', display: 'block' }}>Source / Influencer</label>
          <input type="text" name="source" value={formData.source || ''} onChange={handleChange} style={{...styles.input, width: '100%', boxSizing: 'border-box'}} />
        </div>
        <div>
          <label style={{ fontSize: '12px', color: isDark ? '#9ca3af' : '#4b5563', marginBottom: '4px', display: 'block' }}>Template Used</label>
          <input type="text" name="template" value={formData.template || ''} onChange={handleChange} style={{...styles.input, width: '100%', boxSizing: 'border-box'}} />
        </div>
        <div>
          <label style={{ fontSize: '12px', color: isDark ? '#9ca3af' : '#4b5563', marginBottom: '4px', display: 'block' }}>Interaction Type</label>
          <select name="interactionType" value={formData.interactionType || ''} onChange={handleChange} style={{...styles.input, width: '100%', boxSizing: 'border-box'}}>
            <option value="">-- Pilih --</option>
            <option value="Direct Ask">Direct Ask</option>
            <option value="Soft Sell">Soft Sell</option>
            <option value="Inbound">Inbound</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: '12px', color: isDark ? '#9ca3af' : '#4b5563', marginBottom: '4px', display: 'block' }}>Status Conversion</label>
          <select name="status" value={formData.status || ''} onChange={handleChange} style={{...styles.input, width: '100%', boxSizing: 'border-box'}}>
            <option value="New">New</option>
            <option value="In Progress">In Progress</option>
            <option value="Deal / Signed">Deal / Signed</option>
            <option value="Drop">Drop</option>
          </select>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
         <div>
            <label style={{ fontSize: '12px', color: isDark ? '#9ca3af' : '#4b5563', marginBottom: '4px', display: 'block' }}>Response Time</label>
            <input type="text" name="responseTime" value={formData.responseTime || ''} onChange={handleChange} placeholder="e.g. 5 Mins" style={{...styles.input, width: '100%', boxSizing: 'border-box'}} />
         </div>
         <div style={{ display: 'flex', alignItems: 'center', paddingTop: '15px' }}>
            <label style={{ fontSize: '13px', color: isDark ? '#d1d5db' : '#374151', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600 }}>
              <input type="checkbox" name="tagged" checked={formData.tagged || false} onChange={handleChange} style={{ width: '16px', height: '16px' }} />
              Jonathan Tagged?
            </label>
         </div>
      </div>

      <div>
        <label style={{ fontSize: '12px', color: isDark ? '#9ca3af' : '#4b5563', marginBottom: '4px', display: 'block' }}>Notes / Feedback</label>
        <textarea name="notes" value={formData.notes || ''} onChange={handleChange} style={{ ...styles.input, width: '100%', height: '70px', resize: 'none', boxSizing: 'border-box' }} />
      </div>

      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        <button type="button" onClick={onCancel} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', background: 'transparent', color: isDark ? 'white' : '#374151', cursor: 'pointer', fontWeight: 600 }}>Batal</button>
        <button type="submit" style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: '#0ea5e9', color: 'white', fontWeight: 600, cursor: 'pointer' }}>{initialData ? 'Update Data' : 'Simpan Baru'}</button>
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
    <AnimatedModal isOpen={isOpen} onClose={() => { onClose(); setPin(''); setError(''); }} styles={styles} contentStyle={{ width: '320px', textAlign: 'center' }}>
       <Lock size={48} color={isDark ? '#e5e7eb' : '#374151'} style={{margin: '0 auto 15px auto', display: 'block'}} />
       <h3 style={{marginTop:0, color: isDark?'white':'#1f2937', fontSize: '18px'}}>Login Admin</h3>
       <p style={{fontSize: '13px', color: isDark ? '#9ca3af' : '#6b7280', marginBottom: '24px'}}>
         Masukkan password admin untuk mengakses fitur Admin.
       </p>
       <form onSubmit={handleSubmit}>
          <input type="password" value={pin} autoFocus onChange={(e) => setPin(e.target.value)} placeholder="Password" style={{...styles.input, textAlign: 'center', fontSize: '16px', marginBottom: '15px', padding: '12px'}} />
          {error && <div style={{color: '#ef4444', fontSize: '12px', marginBottom: '10px'}}>{error}</div>}
          <div style={{display: 'flex', gap: '10px'}}>
             <button type="button" onClick={() => { onClose(); setPin(''); setError(''); }} style={{flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', background: 'transparent', color: isDark ? 'white' : '#374151', cursor: 'pointer', fontWeight: 500}}>Batal</button>
             <button type="submit" style={{flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: '#166534', color: 'white', fontWeight: 600, cursor: 'pointer'}}>Verifikasi</button>
          </div>
       </form>
    </AnimatedModal>
  );
}; // test commit