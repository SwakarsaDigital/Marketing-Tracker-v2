import React, { useState, useEffect, useRef } from 'react';
import { SearchIcon } from '../icons/icons';

export const SearchableDropdown = ({ value, onChange, options, placeholder, isDark }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState(value);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => { 
    setSearch(value); 
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const filteredOptions = options.filter((opt: string) => 
    opt.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div 
      ref={wrapperRef} 
      style={{
        position: 'relative', 
        display: 'flex', 
        alignItems: 'center', 
        backgroundColor: isDark ? '#374151' : 'white', 
        border: isDark ? '1px solid #4b5563' : '1px solid #ddd', 
        borderRadius: '8px', 
        padding: '0 12px', 
        flex: '1 1 180px', 
        minWidth: '180px', 
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
      }}
    >
      <SearchIcon size={16} color="#9ca3af" />
      <input
        type="text"
        value={search}
        onClick={() => setIsOpen(true)}
        onChange={(e) => { 
          setSearch(e.target.value); 
          setIsOpen(true); 
          if(e.target.value === '') onChange(''); // Reset filter if cleared
        }}
        placeholder={placeholder}
        style={{ 
          border: 'none', 
          background: 'transparent', 
          padding: '10px', 
          outline: 'none', 
          color: isDark ? 'white' : 'black', 
          width: '100%', 
          fontSize: '13px' 
        }}
      />
      {isOpen && (
        <div 
          style={{ 
            position: 'absolute', 
            top: '100%', 
            left: 0, 
            right: 0, 
            backgroundColor: isDark ? '#1f2937' : 'white', 
            border: isDark ? '1px solid #374151' : '1px solid #ddd', 
            borderRadius: '8px', 
            marginTop: '4px', 
            maxHeight: '250px', 
            overflowY: 'auto', 
            zIndex: 50, 
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.2)' 
          }}
        >
          <div
            onClick={() => { onChange(''); setSearch(''); setIsOpen(false); }}
            style={{ 
              padding: '10px 12px', 
              cursor: 'pointer', 
              borderBottom: isDark ? '1px solid #374151' : '1px solid #eee', 
              color: isDark ? '#9ca3af' : '#6b7280', 
              fontSize: '13px', 
              fontWeight: 600 
            }}
          >
            Semua Marketer
          </div>
          {filteredOptions.length > 0 ? filteredOptions.map((opt: string) => (
            <div
              key={opt}
              onClick={() => { onChange(opt); setSearch(opt); setIsOpen(false); }}
              style={{ 
                padding: '10px 12px', 
                cursor: 'pointer', 
                borderBottom: isDark ? '1px solid #374151' : '1px solid #eee', 
                color: isDark ? 'white' : 'black', 
                fontSize: '13px' 
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = isDark ? '#374151' : '#f3f4f6')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              {opt}
            </div>
          )) : (
            <div style={{ padding: '10px 12px', fontSize: '13px', color: '#9ca3af' }}>
              Tidak ditemukan
            </div>
          )}
        </div>
      )}
    </div>
  );
};