export const LXStyles = (isDark: boolean, isMobile: boolean) => ({
  container: { 
    color: isDark ? '#f8fafc' : '#0f172a',
    transition: 'color 0.3s ease',
    overflowX: 'hidden'
  },
  header: { 
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
    padding: isMobile ? '10px 16px' : '12px 24px', 
    backgroundColor: isDark ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.9)', 
    backdropFilter: 'blur(16px)', 
    WebkitBackdropFilter: 'blur(16px)',
    borderBottom: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)',
    position: 'sticky' as const, top: 0, zIndex: 50
  },
  tabBar: { 
    display: isMobile ? 'none' : 'flex', 
    backgroundColor: isDark ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.9)', 
    backdropFilter: 'blur(16px)', 
    borderBottom: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)',
    padding: '0 24px', overflowX: 'auto' as const,
    position: 'sticky' as const, top: '56px', zIndex: 40
  },
  tab: (active: boolean) => ({ 
    padding: '12px 16px', cursor: 'pointer', fontSize: '13px',
    borderBottom: active ? '2px solid #2563eb' : '2px solid transparent', 
    color: active ? (isDark ? '#60a5fa' : '#2563eb') : (isDark ? '#94a3b8' : '#64748b'), 
    fontWeight: active ? 700 : 500, 
    display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' as const,
    transition: 'all 0.3s ease'
  }),
  content: { 
    padding: isMobile ? '12px' : '20px', 
    maxWidth: '1440px', margin: '0 auto', 
    width: '100%', boxSizing: 'border-box' as const 
  },
  card: { 
    backgroundColor: isDark ? 'rgba(30, 41, 59, 0.6)' : 'rgba(255, 255, 255, 0.7)', 
    backdropFilter: 'blur(12px)',
    borderRadius: '10px', padding: isMobile ? '12px' : '16px', 
    boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.2)' : '0 4px 20px rgba(0,0,0,0.03)', 
    border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(255,255,255,1)',
  },
  table: { width: '100%', borderCollapse: 'collapse' as const, fontSize: isMobile ? '11px' : '12px' },
  th: { 
    textAlign: 'left' as const, padding: isMobile ? '8px 10px' : '10px 14px', 
    borderBottom: isDark ? '2px solid rgba(255,255,255,0.1)' : '2px solid rgba(0,0,0,0.05)', 
    backgroundColor: isDark ? 'rgba(30,41,59, 0.5)' : 'rgba(248,250,252, 0.8)',
    color: isDark ? '#94a3b8' : '#64748b', 
    fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.5px', 
    fontSize: isMobile ? '10px' : '11px', whiteSpace: 'nowrap' as const 
  },
  td: { 
    padding: isMobile ? '8px 10px' : '10px 14px', fontSize: isMobile ? '11px' : '12px',
    borderBottom: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)', 
  },
  input: { 
    padding: isMobile ? '8px 10px' : '8px 12px', borderRadius: '6px', fontSize: isMobile ? '12px' : '13px',
    border: isDark ? '1px solid #475569' : '1px solid #cbd5e1', 
    backgroundColor: isDark ? 'rgba(15, 23, 42, 0.5)' : '#ffffff', 
    color: isDark ? 'white' : 'black', outline: 'none', fontFamily: 'inherit', 
    transition: 'all 0.3s ease', width: '100%', boxSizing: 'border-box' as const,
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
  },
  btnPrimary: { 
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', 
    padding: isMobile ? '8px 12px' : '8px 16px', borderRadius: '6px', fontSize: isMobile ? '12px' : '13px',
    backgroundColor: '#2563eb', color: 'white', border: 'none', cursor: 'pointer', 
    fontWeight: 600
  },
  actionBtn: { 
    border: 'none', cursor: 'pointer', borderRadius: '4px', padding: isMobile ? '4px' : '6px', 
    display: 'flex', alignItems: 'center', justifyContent: 'center'
  }
});