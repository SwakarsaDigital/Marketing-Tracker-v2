export const LXStyles = (isDark: boolean, isMobile: boolean) => ({
  container: { 
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', 
    fontSize: '14px', 
    color: isDark ? '#f9fafb' : '#333', 
    height: '100vh', 
    width: '100vw', 
    display: 'flex', 
    flexDirection: 'column' as const, 
    backgroundColor: isDark ? '#111827' : '#f9fafb', 
    overflow: 'hidden'
  },
  header: { 
    backgroundColor: '#166534', 
    color: 'white', 
    padding: isMobile ? '12px 16px' : '15px 20px', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    zIndex: 20,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  tabBar: { 
    display: isMobile ? 'none' : 'flex', 
    borderBottom: isDark ? '1px solid #374151' : '1px solid #e5e7eb', 
    backgroundColor: isDark ? '#1f2937' : 'white', 
    overflowX: 'auto' as const
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
    transition: 'all 0.2s ease', 
    whiteSpace: 'nowrap' as const
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
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
    borderRadius: '8px', 
    overflow: 'hidden'
  },
  th: { 
    padding: '12px', 
    borderBottom: isDark ? '1px solid #374151' : '1px solid #e5e7eb', 
    backgroundColor: isDark ? '#374151' : '#f9fafb', 
    textAlign: 'left' as const, 
    fontSize: '12px', 
    fontWeight: 700, 
    color: isDark ? '#d1d5db' : '#4b5563', 
    whiteSpace: 'nowrap' as const 
  },
  td: { 
    padding: '10px 12px', 
    borderBottom: isDark ? '1px solid #374151' : '1px solid #e5e7eb', 
    fontSize: '13px', 
    color: isDark ? '#e5e7eb' : '#333'
  },
  input: { 
    width: '100%', 
    padding: '10px', 
    border: isDark ? '1px solid #4b5563' : '1px solid #d1d5db', 
    borderRadius: '6px', 
    boxSizing: 'border-box' as const, 
    backgroundColor: isDark ? '#374151' : 'white',
    color: isDark ? '#fff' : '#000', 
    outline: 'none', 
    fontFamily: 'inherit'
  },
  card: { 
    backgroundColor: isDark ? '#1f2937' : 'white', 
    padding: '20px', 
    borderRadius: '12px', 
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)', 
    border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
    display: 'flex', 
    flexDirection: 'column' as const, 
    justifyContent: 'center'
  },
  btnPrimary: {
    backgroundColor:'#166534', 
    color:'white', 
    border:'none', 
    padding:'10px 20px', 
    borderRadius:'8px', 
    cursor:'pointer', 
    fontWeight:600, 
    display: 'flex', 
    alignItems: 'center', 
    gap: '8px',
    transition: 'background-color 0.2s', 
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  modalOverlay: {
    position: 'fixed' as const, 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    backdropFilter: 'blur(4px)',
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    zIndex: 1000
  },
  modalContent: {
    backgroundColor: isDark ? '#1f2937' : 'white', 
    padding: '24px', 
    borderRadius: '16px', 
    width: '450px', 
    maxWidth: '95%',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', 
    maxHeight: '90vh', 
    overflowY: 'auto' as const,
    border: isDark ? '1px solid #374151' : 'none'
  },
  actionBtn: {
    padding: '6px', 
    borderRadius: '6px', 
    border: 'none', 
    cursor: 'pointer', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    transition: 'background 0.2s'
  }
});