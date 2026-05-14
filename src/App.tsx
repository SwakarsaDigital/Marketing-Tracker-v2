import React, { useEffect, useState, useMemo } from 'react';
import { 
  FileText, Users, BarChart2, RefreshCw, Link as LinkIcon, X, 
  Search as SearchIcon, CheckSquare, Shield, Lock, Download, Edit, 
  Trash2, Menu as MenuIcon, TrendingUp, Layers, AlertCircle 
} from 'lucide-react';

// --- IMPORTS DARI KOMPONEN TERPISAH ---
import { GAS_API_URL } from './config/constants';
import { DailyLog, NotificationState } from './types';
import { LXStyles } from './styles/lxStyles';
import { 
  FullScreenLoader, NotificationToast, ConfirmModal, 
  SearchableDropdown, AnimatedModal, PinModal 
} from './components/ui/SharedUI';
import InlineAddEditForm from './components/forms/InlineAddEditForm';

export default function App() {
  const [activeModule, setActiveModule] = useState<'Marketing Tracker' | 'ATS' | 'Resilio Partners'>('Marketing Tracker');
  const [activeTab, setActiveTab] = useState<'daily' | 'influencer' | 'marketers' | 'kpi' | 'admin'>('daily');
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [notification, setNotification] = useState<NotificationState | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<DailyLog | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; title: string; message: React.ReactNode; confirmText: string; confirmColor: string; icon: 'alert' | 'check'; onConfirm: () => void; }>({ isOpen: false, title: '', message: '', confirmText: 'Ya', confirmColor: '#ef4444', icon: 'alert', onConfirm: () => {} });

  const [approvalModalLead, setApprovalModalLead] = useState<DailyLog | null>(null);
  const [approvalEmail, setApprovalEmail] = useState('');
  const [declineModalLead, setDeclineModalLead] = useState<DailyLog | null>(null);
  const [declineReason, setDeclineReason] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [marketerFilter, setMarketerFilter] = useState('');
  const [marketerSearchQuery, setMarketerSearchQuery] = useState(''); 
  
  const [isDark, setIsDark] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const styles = useMemo(() => LXStyles(isDark, isMobile), [isDark, isMobile]);

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => setNotification({ message, type });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) setIsDark(true);
    if (localStorage.getItem('isAdminLoggedIn') === 'true') setIsAdmin(true);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchData = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    try {
      const timestamp = new Date().getTime();
      const apiUrl = `${GAS_API_URL}?t=${timestamp}&module=${encodeURIComponent(activeModule)}`;
      const resLogs = await fetch(apiUrl);
      const dataLogs = await resLogs.json();
      
      if(dataLogs.status === 'success') {
        let offset = 1;
        if (dataLogs.data && dataLogs.data.length > 0) {
          const firstRow = dataLogs.data[0];
          const firstVal = Array.isArray(firstRow) ? firstRow[0] : firstRow["Date of Contact"];
          offset = String(firstVal).toLowerCase().includes('date') ? 1 : 2; 
        }

        const mappedLogs = dataLogs.data
        .map((row: any, originalIndex: number) => ({ row, originalIndex }))
        .filter(({row}: any) => {
             const firstVal = Array.isArray(row) ? row[0] : row["Date of Contact"];
             if (!firstVal) return false;
             const str = String(firstVal).toLowerCase().trim();
             if (str.includes("date") || str.includes("header") || str.length < 5) return false;
             return /\d/.test(str);
        })
        .map(({row, originalIndex}: any, idx: number) => {
          const isArray = Array.isArray(row);
          const values = isArray ? row : Object.values(row);
          const getValue = (keyName: string, index: number) => (!isArray && row[keyName] !== undefined) ? row[keyName] : (isArray && row[index] !== undefined ? row[index] : (values[index] || ''));

          let rawDate = getValue("Date of Contact", 0);
          let dateStr = '-', rawDateIso = ''; 
          if (rawDate) {
             try {
               const d = new Date(rawDate);
               if (!isNaN(d.getTime())) {
                   dateStr = d.toLocaleDateString('en-US');
                   rawDateIso = (new Date(d.getTime() - d.getTimezoneOffset() * 60000)).toISOString().slice(0, 10);
               } else { dateStr = String(rawDate); rawDateIso = String(rawDate); }
             } catch(e) { dateStr = String(rawDate); rawDateIso = String(rawDate); }
          }

          return {
            id: idx, rowNumber: originalIndex + offset, date: dateStr, rawDateIso: rawDateIso,
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
            marketer: getValue("Marketer", 11) || '', 
            email: getValue("Email", 12) || '', 
            approvalStatus: getValue("Approval Status", 13) || 'None'
          };
        });
        setDailyLogs(mappedLogs.reverse());
      } else setDailyLogs([]);
    } catch (error) { 
      if (showLoader) showNotification("Connection failed. Check console.", 'error'); 
    } finally { 
      if (showLoader) setLoading(false); 
    }
  };

  useEffect(() => { 
    fetchData(true); 
    setSearchQuery(''); setMarketerFilter(''); setCurrentPage(1); 
  }, [activeModule]);

  // === FILTERING LOGS ===
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
      
      let matchPending = true;
      if (activeTab === 'admin') {
         matchPending = (log.status === 'New' && log.approvalStatus !== 'Approved');
      }

      return matchDate && matchName && matchMarketer && matchPending;
    });
  }, [dailyLogs, searchQuery, dateRange, marketerFilter, activeTab]);

  const availableMarketers = useMemo(() => Array.from(new Set(dailyLogs.filter(log => {
      if (!dateRange.start && !dateRange.end) return true;
      const logDate = new Date(log.rawDateIso);
      let match = true;
      if (dateRange.start) match = match && logDate >= new Date(dateRange.start);
      if (dateRange.end) match = match && logDate <= new Date(dateRange.end);
      return match;
  }).map(l => l.marketer))).filter(Boolean).sort(), [dailyLogs, dateRange]);

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => { setCurrentPage(1); }, [searchQuery, dateRange, marketerFilter, activeTab, itemsPerPage]);

  // === ADMIN KPI STATS ===
  const adminKpiStats = useMemo(() => {
    let total = 0, pending = 0, approved = 0, declined = 0;
    dailyLogs.forEach(log => {
      let matchDate = true;
      if (dateRange.start || dateRange.end) {
         const logDate = new Date(log.rawDateIso);
         if (dateRange.start) matchDate = matchDate && logDate >= new Date(dateRange.start);
         if (dateRange.end) matchDate = matchDate && logDate <= new Date(dateRange.end);
      }
      const matchName = log.leadName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchMarketer = marketerFilter ? log.marketer === marketerFilter : true;

      if (matchDate && matchName && matchMarketer) {
         total++;
         if (log.status === 'New' && log.approvalStatus !== 'Declined') pending++;
         else if (log.approvalStatus === 'Declined') declined++;
         else approved++;
      }
    });
    return { total, pending, approved, declined };
  }, [dailyLogs, dateRange, marketerFilter, searchQuery]);

  const globalKpiStats = useMemo(() => {
    const kpiLogs = dailyLogs.filter(log => {
      let matchDate = true;
      if (dateRange.start || dateRange.end) {
         const logDate = new Date(log.rawDateIso);
         if (dateRange.start) matchDate = matchDate && logDate >= new Date(dateRange.start);
         if (dateRange.end) matchDate = matchDate && logDate <= new Date(dateRange.end);
      }
      return matchDate && (marketerFilter ? log.marketer === marketerFilter : true);
    });

    let totalLeads = kpiLogs.length, directAskCount = 0, conversionCount = 0;
    const sourceMap: Record<string, number> = {};

    kpiLogs.forEach(log => {
      if (log.interactionType === 'Direct Ask') directAskCount++;
      if (String(log.status).toLowerCase().includes('deal') || String(log.status).toLowerCase().includes('signed')) conversionCount++;
      const src = log.source || 'Unknown';
      sourceMap[src] = (sourceMap[src] || 0) + 1;
    });

    const postPerformance = Object.entries(sourceMap).map(([source, count]) => ({ 
      source, count, rating: count > 20 ? 'Excellent' : (count > 5 ? 'Good' : 'Needs Work') 
    })).sort((a, b) => b.count - a.count);
    return { totalLeads, directAskCount, conversionCount, postPerformance };
  }, [dailyLogs, dateRange, marketerFilter]);

  const conversionRate = globalKpiStats.totalLeads === 0 ? '0.0' : ((globalKpiStats.conversionCount / globalKpiStats.totalLeads) * 100).toFixed(1);

  const marketersStatsList = useMemo(() => {
    const stats: Record<string, any> = {};
    dailyLogs.filter(log => {
      let matchDate = true;
      if (dateRange.start || dateRange.end) {
         const logDate = new Date(log.rawDateIso);
         if (dateRange.start) matchDate = matchDate && logDate >= new Date(dateRange.start);
         if (dateRange.end) matchDate = matchDate && logDate <= new Date(dateRange.end);
      }
      return matchDate;
    }).forEach(log => {
       const mName = log.marketer || 'Unknown';
       if (!stats[mName]) stats[mName] = { name: mName, totalLeads: 0, deals: 0, directAsks: 0, lastUpdate: log.rawDateIso };
       if (log.rawDateIso > stats[mName].lastUpdate) stats[mName].lastUpdate = log.rawDateIso;
       stats[mName].totalLeads += 1;
       if (String(log.status).toLowerCase().includes('deal') || String(log.status).toLowerCase().includes('signed')) stats[mName].deals += 1;
       if (log.interactionType === 'Direct Ask') stats[mName].directAsks += 1;
    });
    return Object.values(stats)
      .map(m => ({ ...m, status: m.totalLeads > 0 ? 'Active' : 'Non-active', conversionRate: m.totalLeads > 0 ? ((m.deals / m.totalLeads) * 100).toFixed(1) : '0.0' }))
      .filter(m => m.name.toLowerCase().includes(marketerSearchQuery.toLowerCase()))
      .sort((a, b) => b.totalLeads - a.totalLeads);
  }, [dailyLogs, dateRange, marketerSearchQuery]);

  // === HANDLERS ===
  const handleExportCSV = () => {
    if (filteredLogs.length === 0) return showNotification("There is no data to export", "error");
    const headers = ['Date', 'Lead Name', 'Industry', 'Source', 'Template', 'Type', 'Tagged', 'Response Time', 'Status', 'Notes', 'Marketer Email', 'Lead Email', 'Approval Status'];
    const csvRows = [headers.join(',')];
    filteredLogs.forEach(row => {
      const values = [row.rawDateIso, row.leadName, row.industry, row.source, row.template, row.interactionType, row.tagged ? 'Yes' : 'No', row.responseTime, row.status, row.notes, row.marketer, row.email, row.approvalStatus];
      csvRows.push(values.map(v => `"${String(v || '').replace(/"/g, '""')}"`).join(','));
    });
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a"); 
    link.href = URL.createObjectURL(blob); 
    link.setAttribute("download", `${activeModule.replace(/\s+/g, '_')}_Leads_${new Date().toISOString().slice(0,10)}.csv`); 
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  const performActionSilently = async (actionType: 'create' | 'edit' | 'delete', data: any, successMsg: string) => {
    // OPTIMISTIC UPDATE: Lenyapkan seketika dari layar saat mendelete
    if (actionType === 'delete') {
      setDailyLogs(prev => prev.filter(log => log.id !== data.id));
    }

    try {
      const payload = { 
        action: actionType, 
        module: activeModule, 
        ...data, 
        name: data.leadName || data.name, // Dikirim untuk fitur Smart Delete Backend
        rowNumber: data.rowNumber 
      };

      await fetch(GAS_API_URL, { 
        method: 'POST', mode: 'no-cors', 
        headers: { 'Content-Type': 'text/plain;charset=utf-8' }, 
        body: JSON.stringify(payload) 
      });

      showNotification(successMsg, 'success');
      setTimeout(() => fetchData(false), 2000); // Fetch di belakang layar
    } catch (error) { 
      showNotification('Gagal menghubungi server.', 'error'); 
      fetchData(false); 
    }
  };

  const handleFormSubmit = (data: any) => {
    setIsModalOpen(false); 
    if (editingLead) { 
      performActionSilently('edit', { ...data, rowNumber: editingLead.rowNumber }, 'Edit confirmed. Data successfully updated.'); 
      setEditingLead(null); 
    } else {
      performActionSilently('create', { ...data, approvalStatus: 'Pending' }, 'New data successfully added.');
    }
  };

  const handleLoginSuccess = () => {
    setIsAdmin(true); localStorage.setItem('isAdminLoggedIn', 'true');
    setIsLoginModalOpen(false); setActiveTab('admin'); 
  };

  const handleTabAdminClick = () => {
    if (!isAdmin) setIsLoginModalOpen(true);
    else setActiveTab('admin');
    setIsMobileMenuOpen(false);
  };

  const handleLogoutClick = () => {
    setIsMobileMenuOpen(false);
    setConfirmDialog({ isOpen: true, title: 'Confirm Logout', message: 'Are you sure you want to leave the Admin Dashboard?', confirmText: 'Yes, Logout', confirmColor: '#ef4444', icon: 'alert', onConfirm: () => { setIsAdmin(false); localStorage.removeItem('isAdminLoggedIn'); setActiveTab('daily'); } });
  };

  // --- ACTION HANDLERS (DELETE, APPROVE, DECLINE) ---
  const handleDeleteClick = (lead: DailyLog) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Confirm Delete',
      message: <>Are you sure you want to delete the data for <b style={{color: isDark ? 'white' : 'black'}}>{lead.leadName}</b>? This action cannot be undone.</>,
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
         <div style={{ textAlign: 'left', backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : '#f8fafc', padding: '16px', borderRadius: '12px', marginTop: '10px', border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #e2e8f0' }}>
            <div style={{marginBottom: '8px', fontSize: '13px'}}>Name Lead: <span style={{fontWeight: 700, color: isDark?'white':'#0f172a'}}>{lead.leadName}</span></div>
            <div style={{marginBottom: '8px', fontSize: '13px'}}>Marketer Email: <span style={{fontWeight: 700, color: isDark?'white':'#0f172a'}}>{lead.marketer}</span></div>
            <div style={{fontSize: '11px', color: isDark ? '#94a3b8' : '#64748b', borderTop: isDark?'1px solid rgba(255,255,255,0.1)':'1px solid #e2e8f0', paddingTop: '10px', lineHeight: 1.4}}>
               If approved, the status will automatically change to "In Progress".
            </div>
         </div>
      ),
      confirmText: 'Yes, Approve',
      confirmColor: '#10b981',
      icon: 'check',
      onConfirm: () => handleAdminApprovalAction(lead, 'Approve')
    });
  };

  const handleDeclineClick = (lead: DailyLog) => {
    setDeclineModalLead(lead);
    setDeclineReason('');
  };

  const handleAdminApprovalAction = async (lead: DailyLog, actionType: 'Approve' | 'Decline', reason?: string) => {
    if (!isAdmin) return;
    const newApprovalStatus = actionType === 'Approve' ? 'Approved' : 'Declined';
    const newStatus = actionType === 'Approve' ? 'In Progress' : lead.status;
    const updatedNotes = actionType === 'Decline' && reason ? `[DECLINED: ${reason}]\n${lead.notes}` : lead.notes;
    
    setDailyLogs(prevLogs => prevLogs.map(l => l.id === lead.id ? { ...l, approvalStatus: newApprovalStatus, status: newStatus, notes: updatedNotes } : l));
    await performActionSilently('edit', { rowNumber: lead.rowNumber, rawDateIso: lead.rawDateIso, name: lead.leadName, url: lead.profileUrl, industry: lead.industry, source: lead.source, template: lead.template, interactionType: lead.interactionType, tagged: lead.tagged, responseTime: lead.responseTime, status: newStatus, notes: updatedNotes, marketer: lead.marketer, email: lead.email, approvalStatus: newApprovalStatus, declineReason: reason || '' }, `${actionType} successful for ${lead.leadName}.`);
  };

  const handleRequestApproval = async (e: any) => {
    e.preventDefault(); if (!approvalModalLead || !approvalEmail) return;
    setDailyLogs(prevLogs => prevLogs.map(log => log.id === approvalModalLead.id ? { ...log, email: approvalEmail, approvalStatus: 'Pending' } : log));
    await performActionSilently('edit', { ...approvalModalLead, email: approvalEmail, approvalStatus: 'Pending', name: approvalModalLead.leadName, url: approvalModalLead.profileUrl }, `Request Approval sent to ${approvalModalLead.leadName}`);
    setApprovalModalLead(null); setApprovalEmail('');
  };


  return (
    <div style={styles.container as any} className={`bg-gradient-animate ${isDark ? 'dark' : ''}`}>
      <FullScreenLoader isOpen={loading} isDark={isDark} />
      {notification && <NotificationToast notification={notification} onClose={() => setNotification(null)} />}
      
      <PinModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onSubmit={handleLoginSuccess} isDark={isDark} styles={styles} />
      <ConfirmModal isOpen={confirmDialog.isOpen} onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })} onConfirm={confirmDialog.onConfirm} title={confirmDialog.title} message={confirmDialog.message} confirmText={confirmDialog.confirmText} confirmColor={confirmDialog.confirmColor} icon={confirmDialog.icon} isDark={isDark} styles={styles} />

      <AnimatedModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingLead(null); }} styles={styles} contentStyle={{ width: '600px', maxWidth: '95vw' }}>
         <div style={{display:'flex', justifyContent:'space-between', marginBottom:'16px'}}>
            <h3 style={{margin:0, fontSize: '18px', fontWeight: 800}}>{editingLead ? 'Edit Data' : 'New Data'} ({activeModule})</h3>
            <button onClick={() => { setIsModalOpen(false); setEditingLead(null); }} style={{background:'none', border:'none', cursor:'pointer', color:'#94a3b8', display: 'flex'}}><X size={20}/></button>
         </div>
         <InlineAddEditForm initialData={editingLead} onSubmit={handleFormSubmit} onCancel={() => { setIsModalOpen(false); setEditingLead(null); }} isDark={isDark} styles={styles} />
      </AnimatedModal>

      <AnimatedModal isOpen={!!approvalModalLead} onClose={() => setApprovalModalLead(null)} styles={styles} contentStyle={{ width: '380px' }}>
         <div style={{display:'flex', justifyContent:'space-between', marginBottom:'12px'}}><h3 style={{margin:0, fontSize: '16px', fontWeight: 800}}>Request Approval</h3><button onClick={() => setApprovalModalLead(null)} style={{background:'none', border:'none', cursor:'pointer', color:'#94a3b8', display: 'flex'}}><X size={18}/></button></div>
         <form onSubmit={handleRequestApproval}>
            <input type="email" required autoFocus value={approvalEmail} onChange={(e) => setApprovalEmail(e.target.value)} placeholder="lead.email@example.com" style={{...styles.input as any, marginBottom: '16px', width: '100%', boxSizing: 'border-box'}} />
            <button type="submit" className="btn-glow" style={{...styles.btnPrimary as any, width: '100%'}}>Kirim Request</button>
         </form>
      </AnimatedModal>

      <AnimatedModal isOpen={!!declineModalLead} onClose={() => setDeclineModalLead(null)} styles={styles} contentStyle={{ width: '400px' }}>
         <div style={{display:'flex', justifyContent:'space-between', marginBottom:'12px'}}><h3 style={{margin:0, fontSize: '16px', fontWeight: 800}}>Tolak Request</h3><button onClick={() => setDeclineModalLead(null)} style={{background:'none', border:'none', cursor:'pointer', color:'#94a3b8', display: 'flex'}}><X size={18}/></button></div>
         <form onSubmit={(e) => { e.preventDefault(); if (declineModalLead) handleAdminApprovalAction(declineModalLead, 'Decline', declineReason); setDeclineModalLead(null); }}>
            <textarea required autoFocus value={declineReason} onChange={(e) => setDeclineReason(e.target.value)} placeholder="Alasan penolakan..." style={{...styles.input as any, marginBottom: '16px', width: '100%', height: '70px', resize: 'none', boxSizing: 'border-box'}} />
            <button type="submit" className="btn-glow" style={{...styles.btnPrimary as any, backgroundColor: '#ef4444', width: '100%'}}>Reject & Beri Alasan</button>
         </form>
      </AnimatedModal>

      {/* Mobile Menu */}
      {isMobile && isMobileMenuOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, backdropFilter: 'blur(4px)' }} onClick={() => setIsMobileMenuOpen(false)}>
           <div style={{ width: '260px', height: '100%', backgroundColor: isDark ? '#0f172a' : '#ffffff', padding: '20px 0', display: 'flex', flexDirection: 'column', animation: 'slideInLeft 0.3s forwards' }} onClick={e => e.stopPropagation()}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px', marginBottom: '20px'}}>
                 <h2 style={{margin: 0, color: isDark ? '#fff' : '#2563eb', fontSize: '18px', fontWeight: 800}}>Menu Utama</h2>
                 <button onClick={() => setIsMobileMenuOpen(false)} style={{background:'none', border:'none', color: isDark?'#fff':'#000', cursor:'pointer', display: 'flex'}}><X size={20}/></button>
              </div>
              <div style={{padding: '0 16px', marginBottom: '12px'}}>
                 <label style={{fontSize: '11px', fontWeight: 700, color: isDark ? '#94a3b8' : '#64748b', textTransform: 'uppercase', letterSpacing: '1px'}}>Pilih Modul Database</label>
                 <select value={activeModule} onChange={(e) => { setActiveModule(e.target.value as any); setIsMobileMenuOpen(false); }} style={{...styles.input as any, width: '100%', marginTop: '6px', fontSize: '13px', fontWeight: 700, background: isDark?'rgba(255,255,255,0.05)':'#eff6ff', color: isDark?'white':'#1e3a8a'}}>
                    <option value="Marketing Tracker">Marketing Tracker</option>
                    <option value="ATS">ATS</option>
                    <option value="Resilio Partners">Resilio Partners</option>
                 </select>
              </div>
              <div style={{display:'flex', flexDirection:'column', gap:'4px', padding: '0 16px'}}>
                <button onClick={() => { setActiveTab('daily'); setIsMobileMenuOpen(false); }} style={{...styles.tab(activeTab === 'daily'), borderRadius:'8px', border:'none', background: activeTab==='daily' ? (isDark?'rgba(37,99,235,0.2)':'#eff6ff') : 'transparent'}}><FileText size={16} /> Daily Log</button>
                <button onClick={() => { setActiveTab('marketers'); setIsMobileMenuOpen(false); }} style={{...styles.tab(activeTab === 'marketers'), borderRadius:'8px', border:'none', background: activeTab==='marketers' ? (isDark?'rgba(37,99,235,0.2)':'#eff6ff') : 'transparent'}}><Users size={16} /> Teams / Marketers</button>
                <button onClick={() => { setActiveTab('influencer'); setIsMobileMenuOpen(false); }} style={{...styles.tab(activeTab === 'influencer'), borderRadius:'8px', border:'none', background: activeTab==='influencer' ? (isDark?'rgba(37,99,235,0.2)':'#eff6ff') : 'transparent'}}><CheckSquare size={16} /> Source Stats</button>
                <button onClick={() => { setActiveTab('kpi'); setIsMobileMenuOpen(false); }} style={{...styles.tab(activeTab === 'kpi'), borderRadius:'8px', border:'none', background: activeTab==='kpi' ? (isDark?'rgba(37,99,235,0.2)':'#eff6ff') : 'transparent'}}><BarChart2 size={16} /> Dashboard KPI</button>
                <div style={{borderTop: isDark?'1px solid rgba(255,255,255,0.1)':'1px solid #e2e8f0', margin: '10px 0'}}></div>
                <button onClick={handleTabAdminClick} style={{...styles.tab(activeTab === 'admin'), borderRadius:'8px', border:'none', color: isAdmin ? '#10b981' : (isDark?'#94a3b8':'#64748b'), background: activeTab==='admin' ? (isDark?'rgba(16,185,129,0.1)':'#ecfdf5') : 'transparent'}}>{isAdmin ? <Shield size={16} /> : <Lock size={16} />} Admin Dashboard</button>
              </div>
           </div>
        </div>
      )}

      {/* --- HEADER --- */}
      <div style={styles.header}>
        <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
           {isMobile && <button onClick={() => setIsMobileMenuOpen(true)} style={{background:'none', border:'none', color: isDark ? 'white' : 'black'}}><MenuIcon size={20} /></button>}
           <div style={{background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(37, 99, 235, 0.1)', color: isDark ? 'white' : '#2563eb', padding: '8px', borderRadius: '8px', display: isMobile ? 'none' : 'flex'}}>
             <Layers size={18} />
           </div>
           <div>
             <select value={activeModule} onChange={(e) => setActiveModule(e.target.value as any)} style={{fontSize: isMobile ? '15px' : '18px', margin:0, fontWeight:800, background: 'transparent', color: isDark ? 'white' : '#0f172a', border: 'none', outline: 'none', cursor: 'pointer', appearance: 'none', paddingRight: '4px', transition: 'all 0.3s'}}>
               <option value="Marketing Tracker">Marketing Tracker ▾</option>
               <option value="ATS">ATS ▾</option>
               <option value="Resilio Partners">Resilio Partners ▾</option>
             </select>
             <div style={{fontSize:'10px', opacity:0.8, display:'flex', alignItems:'center', gap:'4px', marginTop: '2px', fontWeight: 600}}>
               <span style={{width:'6px', height:'6px', borderRadius:'50%', backgroundColor:'#10b981', boxShadow: '0 0 6px #10b981'}}></span> Online Sync
             </div>
           </div>
        </div>
        
        <div style={{display:'flex', gap:'8px'}}>
          {!isMobile && (
             <button className="btn-glow" onClick={() => isAdmin ? handleLogoutClick() : setIsLoginModalOpen(true)} style={{background: isAdmin ? '#ef4444' : '#2563eb', border:'none', color:'white', borderRadius:'8px', padding:'6px 12px', fontSize:'12px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px'}}>
                {isAdmin ? <><Lock size={14}/> Logout</> : <><Shield size={14}/> Admin</>}
             </button>
          )}
          <button className="btn-glow" onClick={() => fetchData(true)} style={{background: isDark ? 'rgba(255,255,255,0.1)' : 'white', border: isDark ? 'none' : '1px solid #e2e8f0', color: isDark ? 'white' : '#334155', borderRadius:'8px', padding:'6px 10px', cursor:'pointer', display: 'flex', boxShadow: '0 2px 5px rgba(0,0,0,0.05)'}} title="Refresh Data">
            <RefreshCw size={16} />
          </button>
          <button className="btn-glow" onClick={() => setIsDark(!isDark)} style={{background: isDark ? 'rgba(255,255,255,0.1)' : 'white', border: isDark ? 'none' : '1px solid #e2e8f0', color: isDark ? 'white' : '#334155', borderRadius:'8px', padding:'6px 12px', fontSize:'12px', cursor: 'pointer', fontWeight: 600, boxShadow: '0 2px 5px rgba(0,0,0,0.05)'}}>
             {isDark ? 'Light' : 'Dark'}
          </button>
        </div>
      </div>

      {/* --- TAB BAR (Desktop) --- */}
      <div style={styles.tabBar} className="fade-in-up">
        <div onClick={() => setActiveTab('daily')} style={styles.tab(activeTab === 'daily')}><FileText size={16} /> Daily Log</div>
        <div onClick={() => setActiveTab('marketers')} style={styles.tab(activeTab === 'marketers')}><Users size={16} /> Teams / Marketers</div>
        <div onClick={() => setActiveTab('influencer')} style={styles.tab(activeTab === 'influencer')}><CheckSquare size={16} /> Source Stats</div>
        <div onClick={() => setActiveTab('kpi')} style={styles.tab(activeTab === 'kpi')}><BarChart2 size={16} /> Dashboard KPI</div>
        
        <div onClick={handleTabAdminClick} style={{...styles.tab(activeTab === 'admin'), marginLeft: 'auto', color: isAdmin ? '#10b981' : (isDark?'#94a3b8':'#64748b')}}>
           {isAdmin ? <Shield size={16} /> : <Lock size={16} />} Admin Dashboard
        </div>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div style={styles.content}>
        
        {/* TAB 1: DAILY LOG / ADMIN */}
        {(activeTab === 'daily' || (activeTab === 'admin' && isAdmin)) && (
          <div className="fade-in-up delay-100">
            <div style={{...styles.card as any, marginBottom: '16px'}} className="hover-card">
              <div style={{display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'12px', alignItems: 'flex-end'}}>
                 
                 <div style={{display:'flex', gap:'8px', flex:1, flexWrap: 'wrap', alignItems: 'center', width: '100%'}}>
                    <div style={{width: '100%', marginBottom: '4px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '8px'}}>
                       <h2 style={{fontSize: isMobile ? '16px' : '18px', margin:0, fontWeight: 800, color: activeTab === 'admin' ? '#10b981' : (isDark ? 'white' : '#0f172a')}}>
                          {activeTab === 'admin' ? `Admin Panel` : `Records`}
                       </h2>
                       
                       {/* Dropdown Pintasan Database Khusus Area Dalam Admin */}
                       {activeTab === 'admin' && (
                         <div style={{display: 'flex', alignItems: 'center', gap: '6px', background: isDark?'rgba(0,0,0,0.2)':'rgba(0,0,0,0.03)', padding: '4px 8px', borderRadius: '6px'}}>
                            <Layers size={14} color={isDark ? "#9ca3af" : "#64748b"} />
                            <span style={{fontSize: '11px', fontWeight: 700, color: isDark ? '#9ca3af' : '#64748b', textTransform: 'uppercase'}}>DB:</span>
                            <select 
                               value={activeModule} 
                               onChange={(e) => setActiveModule(e.target.value as any)}
                               style={{
                                  border: 'none', background: 'transparent', outline: 'none', 
                                  color: '#10b981', 
                                  fontWeight: 800, fontSize: '13px', cursor: 'pointer',
                                  appearance: 'none', paddingRight: '4px'
                               }}
                            >
                               <option value="Marketing Tracker">Marketing Tracker ▾</option>
                               <option value="ATS">ATS ▾</option>
                               <option value="Resilio Partners">Resilio Partners ▾</option>
                            </select>
                         </div>
                       )}
                    </div>

                    <div style={{...styles.input as any, display:'flex', alignItems:'center', padding:'0 8px', flex: isMobile ? '1 1 100%' : '1 1 180px'}}>
                       <SearchIcon size={14} color={isDark ? "#9ca3af" : "#64748b"}/>
                       <input placeholder="Search Name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{border:'none', background:'transparent', padding:'6px', outline:'none', color: isDark?'white':'black', width:'100%', fontSize: '12px', fontFamily: 'inherit'}} />
                    </div>
                    
                    <div style={{...styles.input as any, display:'flex', alignItems:'center', padding:'0 8px', flex: isMobile ? '1 1 45%' : '0 1 auto'}}>
                       <span style={{fontSize:'11px', color: isDark ? '#9ca3af' : '#64748b', marginRight:'6px', fontWeight: 600}}>Start:</span>
                       <input type="date" value={dateRange.start} onChange={(e) => setDateRange({...dateRange, start: e.target.value})} style={{border:'none', background:'transparent', padding:'6px 0', outline:'none', color: isDark?'white':'black', fontSize: '12px', fontFamily: 'inherit', width: '100%'}} />
                    </div>

                    <div style={{...styles.input as any, display:'flex', alignItems:'center', padding:'0 8px', flex: isMobile ? '1 1 45%' : '0 1 auto'}}>
                       <span style={{fontSize:'11px', color: isDark ? '#9ca3af' : '#64748b', marginRight:'6px', fontWeight: 600}}>End:</span>
                       <input type="date" value={dateRange.end} onChange={(e) => setDateRange({...dateRange, end: e.target.value})} style={{border:'none', background:'transparent', padding:'6px 0', outline:'none', color: isDark?'white':'black', fontSize: '12px', fontFamily: 'inherit', width: '100%'}} />
                    </div>

                    <div style={{ flex: isMobile ? '1 1 100%' : '1 1 160px' }}>
                      <SearchableDropdown value={marketerFilter} onChange={setMarketerFilter} options={availableMarketers} placeholder="All PIC Email" isDark={isDark} />
                    </div>
                 </div>

                 {/* Tombol Action */}
                 <div style={{display: 'flex', gap: '8px', height: 'fit-content', width: isMobile ? '100%' : 'auto'}}>
                    <button className="btn-glow" onClick={handleExportCSV} style={{...styles.btnPrimary as any, backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'white', color: isDark ? 'white' : '#0f172a', border: isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid #e2e8f0', flex: isMobile ? 1 : 'none'}}>
                      <Download size={14} /> Export
                    </button>
                    <button className="btn-glow" onClick={() => { setEditingLead(null); setIsModalOpen(true); }} style={{...styles.btnPrimary as any, flex: isMobile ? 1 : 'none'}}>
                      + New Data
                    </button>
                 </div>
              </div>
            </div>

            {/* KPI KHUSUS ADMIN */}
            {activeTab === 'admin' && (
              <div style={{display:'grid', gridTemplateColumns: isMobile?'1fr 1fr':'repeat(4, 1fr)', gap:'10px', marginBottom: '16px'}}>
                 <div style={styles.card} className="hover-card fade-in-up delay-100">
                    <div style={{fontSize:'10px', color:'#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px'}}>Filtered Leads</div>
                    <div style={{fontSize:'20px', fontWeight:800, marginTop: '2px'}}>{adminKpiStats.total}</div>
                 </div>
                 <div style={styles.card} className="hover-card fade-in-up delay-200">
                    <div style={{fontSize:'10px', color:'#d97706', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px'}}>Pending</div>
                    <div style={{fontSize:'20px', fontWeight:800, color: '#d97706', marginTop: '2px'}}>{adminKpiStats.pending}</div>
                 </div>
                 <div style={styles.card} className="hover-card fade-in-up delay-300">
                    <div style={{fontSize:'10px', color:'#10b981', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px'}}>Approved</div>
                    <div style={{fontSize:'20px', fontWeight:800, color: '#10b981', marginTop: '2px'}}>{adminKpiStats.approved}</div>
                 </div>
                 <div style={styles.card} className="hover-card fade-in-up delay-300">
                    <div style={{fontSize:'10px', color:'#ef4444', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px'}}>Declined</div>
                    <div style={{fontSize:'20px', fontWeight:800, color: '#ef4444', marginTop: '2px'}}>{adminKpiStats.declined}</div>
                 </div>
              </div>
            )}

            {/* TABEL DATA PENGGUNA */}
            <div style={{...styles.card as any, padding: 0}} className="table-container fade-in-up delay-200">
               <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={{...styles.th, textAlign: 'center'}}>No.</th>
                      <th style={styles.th}>Date</th>
                      <th style={styles.th}>Lead Name</th>
                      <th style={styles.th}>Drive Proof</th> 
                      <th style={styles.th}>Lead Email</th>
                      <th style={styles.th}>Approval / Action</th> 
                      <th style={styles.th}>Status</th>
                      <th style={styles.th}>Industry</th>
                      <th style={styles.th}>Source</th>
                      <th style={styles.th}>Template</th>
                      <th style={styles.th}>Type</th>
                      <th style={styles.th}>Notes</th>
                      <th style={styles.th}>PIC Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedLogs.length === 0 ? (
                       <tr><td colSpan={13} style={{padding:'40px', textAlign:'center', color:'#64748b'}}>Tidak ada data di modul {activeModule}.</td></tr>
                    ) : (
                       paginatedLogs.map((row, index) => (
                         <tr key={row.id} className="table-row">
                           <td style={{...styles.td, textAlign: 'center', color: isDark ? '#94a3b8' : '#64748b', fontWeight: 600}}>
                              {(currentPage - 1) * itemsPerPage + index + 1}
                           </td>
                           <td style={{...styles.td, whiteSpace: 'nowrap'}}>{row.date}</td>
                           <td style={styles.td}><span style={{fontWeight: 700, display: 'inline-block', whiteSpace: 'nowrap'}}>{row.leadName}</span></td>
                           <td style={{...styles.td, textAlign: 'center'}}>{row.profileUrl && <a href={row.profileUrl} target="_blank" rel="noreferrer" style={{color:'#2563eb', display: 'inline-flex', alignItems: 'center', padding: '4px', borderRadius: '6px', background: isDark?'rgba(37,99,235,0.1)':'#eff6ff', transition: 'all 0.2s'}} className="hover-card"><LinkIcon size={12}/></a>}</td>
                           <td style={styles.td}>{row.email || <span style={{color: isDark?'#475569':'#cbd5e1', fontStyle:'italic'}}>-</span>}</td>
                           
                           <td style={{...styles.td, whiteSpace: 'nowrap'}}>
                              {activeTab === 'admin' ? (
                                 <div style={{display:'flex', gap:'6px', alignItems: 'center'}}>
                                   <button onClick={() => handleApproveClick(row)} style={{...styles.actionBtn, backgroundColor: isDark ? 'rgba(16,185,129,0.1)' : '#dcfce7', color: '#10b981', padding: '4px 6px'}} title="Approve"><CheckSquare size={12} /> <span style={{marginLeft:'4px', fontSize:'10px', fontWeight:700}}>Approve</span></button>
                                   <button onClick={() => handleDeclineClick(row)} style={{...styles.actionBtn, backgroundColor: isDark ? 'rgba(239,68,68,0.1)' : '#fee2e2', color: '#ef4444', padding: '4px 6px'}} title="Decline"><X size={12} /> <span style={{marginLeft:'4px', fontSize:'10px', fontWeight:700}}>Decline</span></button>
                                 </div>
                              ) : (
                                 row.status === 'New' ? (
                                    row.approvalStatus === 'Declined' ? (
                                       <div style={{display:'flex', flexDirection: 'column', gap:'2px'}}>
                                          <span style={{color: '#ef4444', fontSize: '11px', fontWeight: 700}}>Declined</span>
                                          <button onClick={() => setApprovalModalLead(row)} style={{fontSize:'9px', padding: '2px 6px', borderRadius:'4px', background: isDark?'rgba(255,255,255,0.1)':'#f1f5f9', color:isDark?'white':'#0f172a', border:isDark?'1px solid rgba(255,255,255,0.1)':'1px solid #e2e8f0', cursor:'pointer', whiteSpace: 'nowrap', fontWeight: 600}}>Req Again</button>
                                       </div>
                                    ) : (
                                       <span style={{color: '#d97706', fontSize: '11px', fontWeight: 700, display: 'inline-block', whiteSpace: 'nowrap'}}>Pending Approval...</span>
                                    )
                                 ) : <span style={{color:'#10b981', fontSize:'11px', fontWeight: 700, display: 'inline-block', whiteSpace: 'nowrap'}}>Approved</span>
                              )}

                              {isAdmin && (
                                 <div style={{display:'flex', gap:'6px', alignItems: 'center', marginTop: '8px', paddingTop: '8px', borderTop: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)'}}>
                                    <button onClick={() => {setEditingLead(row); setIsModalOpen(true);}} style={{...styles.actionBtn, backgroundColor: isDark ? 'rgba(37,99,235,0.1)' : '#eff6ff', color: '#2563eb'}} title="Edit Log"><Edit size={12} /></button>
                                    <button onClick={() => handleDeleteClick(row)} style={{...styles.actionBtn, backgroundColor: isDark ? 'rgba(239,68,68,0.1)' : '#fee2e2', color: '#ef4444'}} title="Delete Log"><Trash2 size={12} /></button>
                                 </div>
                              )}
                           </td>

                           <td style={{...styles.td, whiteSpace: 'nowrap'}}>
                             <span style={{
                               display: 'inline-block', whiteSpace: 'nowrap',
                               padding:'4px 8px', borderRadius:'12px', fontSize:'10px', fontWeight:700,
                               backgroundColor: String(row.status).toLowerCase().includes('deal')||String(row.status).toLowerCase().includes('signed') ? (isDark ? 'rgba(16,185,129,0.1)' : '#dcfce7') : (row.status==='In Progress' ? (isDark ? 'rgba(37,99,235,0.1)' : '#dbeafe') : (isDark ? 'rgba(255,255,255,0.1)' : '#f1f5f9')),
                               color: String(row.status).toLowerCase().includes('deal')||String(row.status).toLowerCase().includes('signed') ? '#10b981' : (row.status==='In Progress' ? '#2563eb' : (isDark ? '#94a3b8' : '#64748b')),
                             }}>{row.status}</span>
                           </td>
                           <td style={{...styles.td, whiteSpace: 'nowrap'}}>{row.industry}</td>
                           <td style={{...styles.td, whiteSpace: 'nowrap'}}>{row.source}</td>
                           <td style={{...styles.td, whiteSpace: 'nowrap'}}>{row.template}</td>
                           <td style={{...styles.td, whiteSpace: 'nowrap'}}>{row.interactionType}</td>
                           <td style={{...styles.td, color: isDark ? '#cbd5e1' : '#475569', maxWidth: '160px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}} title={row.notes}>{row.notes}</td>
                           <td style={{...styles.td, whiteSpace: 'nowrap', fontWeight: 600}}>{row.marketer}</td>
                         </tr>
                       ))
                    )}
                  </tbody>
               </table>
            </div>
            
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', flexWrap: 'wrap', gap: '8px'}}>
               <div style={{fontSize: '12px', color: isDark ? '#94a3b8' : '#64748b', display: 'flex', alignItems: 'center', fontWeight: 500}}>
                  Showing 
                  <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} style={{margin: '0 8px', padding: '4px 8px', borderRadius: '6px', border: isDark?'1px solid #475569':'1px solid #cbd5e1', background: isDark?'rgba(15,23,42,0.5)':'white', color: isDark?'white':'black', fontFamily: 'inherit', fontWeight: 600, fontSize: '11px'}}>
                     <option value={25}>25</option><option value={50}>50</option><option value={75}>75</option><option value={100}>100</option>
                  </select> 
                  rows (Total: <span style={{fontWeight: 800, marginLeft: '4px', color: isDark?'white':'black'}}>{filteredLogs.length}</span>)
               </div>
               <div style={{display: 'flex', gap: '6px', alignItems: 'center'}}>
                  <button className="btn-glow" disabled={currentPage === 1} onClick={() => setCurrentPage(c => c - 1)} style={{padding: '6px 10px', borderRadius: '6px', border: isDark?'1px solid rgba(255,255,255,0.1)':'1px solid #e2e8f0', background: currentPage===1 ? 'transparent' : (isDark?'rgba(255,255,255,0.05)':'white'), color: currentPage===1 ? (isDark?'#475569':'#94a3b8') : (isDark?'white':'#0f172a'), cursor: currentPage===1 ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: '11px'}}>Prev</button>
                  <span style={{fontSize: '11px', margin: '0 4px', fontWeight: 600}}>Page {currentPage} of {totalPages || 1}</span>
                  <button className="btn-glow" disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(c => c + 1)} style={{padding: '6px 10px', borderRadius: '6px', border: isDark?'1px solid rgba(255,255,255,0.1)':'1px solid #e2e8f0', background: (currentPage === totalPages || totalPages === 0) ? 'transparent' : (isDark?'rgba(255,255,255,0.05)':'white'), color: (currentPage === totalPages || totalPages === 0) ? (isDark?'#475569':'#94a3b8') : (isDark?'white':'#0f172a'), cursor: (currentPage === totalPages || totalPages === 0) ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: '11px'}}>Next</button>
               </div>
            </div>
          </div>
        )}

        {/* ADMIN LOCKED VIEW */}
        {activeTab === 'admin' && !isAdmin && (
           <div className="fade-in-up" style={{textAlign: 'center', padding: '60px 20px'}}>
              <div style={{background: isDark?'rgba(239,68,68,0.1)':'#fee2e2', width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', boxShadow: '0 0 20px rgba(239,68,68,0.2)'}}>
                <Lock size={32} color="#ef4444" />
              </div>
              <h2 style={{color: isDark?'white':'#0f172a', marginBottom: '8px', fontSize: '20px', fontWeight: 800}}>Locked Access</h2>
              <p style={{color: isDark?'#94a3b8':'#64748b', marginBottom: '20px', fontSize: '13px'}}>You must log in as admin to view and approve leads.</p>
              <button className="btn-glow" onClick={() => setIsLoginModalOpen(true)} style={{...styles.btnPrimary as any, margin: '0 auto', padding: '10px 24px', fontSize: '13px', borderRadius: '8px'}}>Login Admin</button>
           </div>
        )}

        {/* TAB: MARKETERS */}
        {activeTab === 'marketers' && (
           <div className="fade-in-up delay-100">
              <div style={{display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', marginBottom: '16px', gap: '12px'}}>
                 <h2 style={{fontSize: isMobile ? '16px' : '18px', margin:0, fontWeight: 800}}>Teams Performance</h2>
                 <div style={{...styles.input as any, display:'flex', alignItems:'center', padding:'0 8px', flex: isMobile ? '1 1 100%' : '0 1 200px', width: isMobile ? '100%' : 'auto'}}>
                    <SearchIcon size={14} color={isDark ? "#9ca3af" : "#64748b"}/>
                    <input placeholder="Search PIC Email..." value={marketerSearchQuery} onChange={(e) => setMarketerSearchQuery(e.target.value)} style={{border:'none', background:'transparent', padding:'6px', outline:'none', color: isDark?'white':'black', width:'100%', fontSize: '12px', fontFamily:'inherit'}} />
                 </div>
              </div>
              
              <div style={{...styles.card as any, padding: 0}} className="table-container hover-card">
                <table style={styles.table}>
                   <thead>
                     <tr>
                       <th style={styles.th}>PIC Email</th>
                       <th style={styles.th}>Total Leads</th>
                       <th style={styles.th}>Direct Asks</th>
                       <th style={styles.th}>Deals / Signed</th>
                       <th style={styles.th}>Conversion Rate</th>
                       <th style={styles.th}>Status</th>
                       <th style={styles.th}>Last Update</th>
                     </tr>
                   </thead>
                   <tbody>
                     {marketersStatsList.map((m, idx) => (
                       <tr key={idx} className="table-row">
                         <td style={{...styles.td, fontWeight:700, whiteSpace: 'nowrap'}}>{m.name}</td>
                         <td style={styles.td}>{m.totalLeads}</td>
                         <td style={styles.td}>{m.directAsks}</td>
                         <td style={styles.td}>{m.deals}</td>
                         <td style={{...styles.td, color: '#d97706', fontWeight: 800}}>{m.conversionRate}%</td>
                         <td style={styles.td}>
                            <span style={{display: 'inline-block', whiteSpace: 'nowrap', padding: '4px 10px', borderRadius: '16px', fontSize: '10px', fontWeight: 700, backgroundColor: m.status === 'Active' ? (isDark ? 'rgba(16,185,129,0.1)' : '#dcfce7') : (isDark ? 'rgba(239,68,68,0.1)' : '#fee2e2'), color: m.status === 'Active' ? '#10b981' : '#ef4444'}}>
                               {m.status}
                            </span>
                         </td>
                         <td style={{...styles.td, color: isDark ? '#94a3b8' : '#64748b', whiteSpace: 'nowrap'}}>{m.lastUpdate || '-'}</td>
                       </tr>
                     ))}
                     {marketersStatsList.length === 0 && (
                        <tr><td colSpan={7} style={{padding:'40px', textAlign:'center', color:'#64748b'}}>Belum ada data marketer.</td></tr>
                     )}
                   </tbody>
                </table>
              </div>
           </div>
        )}

        {/* TAB: INFLUENCER */}
        {activeTab === 'influencer' && (
           <div className="fade-in-up delay-100">
              <h2 style={{fontSize: isMobile ? '16px' : '18px', marginBottom:'16px', fontWeight: 800}}>Source / Platform Stats</h2>
              <div style={{...styles.card as any, padding: 0}} className="table-container hover-card">
                <table style={styles.table}>
                   <thead>
                     <tr>
                       <th style={styles.th}>Source / Platform Name</th>
                       <th style={styles.th}>Total Leads Generated</th>
                       <th style={styles.th}>Performance Rating</th>
                     </tr>
                   </thead>
                   <tbody>
                     {globalKpiStats.postPerformance?.map((item, idx) => (
                       <tr key={idx} className="table-row">
                         <td style={{...styles.td, whiteSpace: 'nowrap', fontWeight: 600}}>{item.source}</td>
                         <td style={{...styles.td, fontSize:'14px', fontWeight:'800'}}>{item.count}</td>
                         <td style={styles.td}>
                            <span style={{
                               display: 'inline-block', whiteSpace: 'nowrap',
                               padding:'4px 12px', borderRadius:'16px', fontSize:'10px', fontWeight:700, letterSpacing: '0.5px',
                               backgroundColor: item.rating==='Excellent' ? (isDark?'rgba(16,185,129,0.1)':'#dcfce7') : (item.rating==='Good' ? (isDark?'rgba(37,99,235,0.1)':'#dbeafe') : (isDark?'rgba(217,119,6,0.1)':'#fef3c7')),
                               color: item.rating==='Excellent' ? '#10b981' : (item.rating==='Good' ? '#2563eb' : '#d97706')
                            }}>{item.rating}</span>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                </table>
              </div>
           </div>
        )}

        {/* TAB: KPI DASHBOARD */}
        {activeTab === 'kpi' && (
           <div style={{display:'grid', gridTemplateColumns: isMobile?'1fr 1fr':'repeat(4, 1fr)', gap:'12px'}} className="fade-in-up delay-100">
              <div style={{gridColumn: '1 / -1', background: isDark?'rgba(59,130,246,0.1)':'#eff6ff', padding: '12px 16px', borderRadius: '10px', fontSize: '11px', color: isDark?'#93c5fd':'#1e40af', borderLeft: '4px solid #3b82f6', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500}}>
                 <AlertCircle size={16} />
                 <span>KPI data is calculated <b>automatically</b> based on the <b>Date Range</b> and <b>PIC Email</b> filters.</span>
              </div>
              <div style={styles.card} className="hover-card fade-in-up delay-100">
                 <div style={{fontSize:'10px', textTransform:'uppercase', color: isDark?'#94a3b8':'#64748b', fontWeight: 700, letterSpacing: '0.5px'}}>Total Processed</div>
                 <div style={{fontSize:'24px', fontWeight:800, marginTop: '6px'}}>{globalKpiStats.totalLeads}</div>
              </div>
              <div style={styles.card} className="hover-card fade-in-up delay-200">
                 <div style={{fontSize:'10px', textTransform:'uppercase', color:'#3b82f6', fontWeight: 700, letterSpacing: '0.5px'}}>Direct Asks</div>
                 <div style={{fontSize:'24px', fontWeight:800, color: '#3b82f6', marginTop: '6px'}}>{globalKpiStats.directAskCount}</div>
              </div>
              <div style={styles.card} className="hover-card fade-in-up delay-300">
                 <div style={{fontSize:'10px', textTransform:'uppercase', color:'#10b981', fontWeight: 700, letterSpacing: '0.5px'}}>Deals / Signed</div>
                 <div style={{fontSize:'24px', fontWeight:800, color: '#10b981', marginTop: '6px'}}>{globalKpiStats.conversionCount}</div>
              </div>
              <div style={styles.card} className="hover-card fade-in-up delay-400">
                 <div style={{display: 'flex', alignItems: 'center', gap: '6px', fontSize:'10px', textTransform:'uppercase', color:'#d97706', fontWeight: 700, letterSpacing: '0.5px'}}>
                    <TrendingUp size={14} /> Conversion Rate
                 </div>
                 <div style={{fontSize:'24px', fontWeight:800, color: '#d97706', marginTop: '6px'}}>{conversionRate}%</div>
              </div>
           </div>
        )}

      </div>
    </div>
  );
}