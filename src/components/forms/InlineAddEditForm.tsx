import React, { useEffect, useState } from 'react';

export default function InlineAddEditForm({ initialData, onSubmit, onCancel, isDark, styles }: any) {
  const [formData, setFormData] = useState<any>({});

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
      marketer: initialData?.marketer || localStorage.getItem('savedMarketerEmail') || 'admin@swakarsadigital.com',
      approvalStatus: initialData?.approvalStatus || 'None'
    });
  }, [initialData]);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    if (!initialData && name === 'status') return;
    setFormData((prev: any) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!initialData && formData.marketer) {
        localStorage.setItem('savedMarketerEmail', formData.marketer);
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div><label style={{ fontSize: '13px', color: isDark ? '#d1d5db' : '#4b5563', marginBottom: '6px', display: 'block', fontWeight: 500 }}>Contact Date</label><input type="date" name="rawDateIso" value={formData.rawDateIso || ''} onChange={handleChange} required style={{...styles.input, width: '100%', boxSizing: 'border-box'}} /></div>
        <div><label style={{ fontSize: '13px', color: isDark ? '#d1d5db' : '#4b5563', marginBottom: '6px', display: 'block', fontWeight: 500 }}>Name</label><input type="text" name="name" value={formData.name || ''} onChange={handleChange} required style={{...styles.input, width: '100%', boxSizing: 'border-box'}} /></div>
        {initialData && ( <div>
   <label style={{ fontSize: '12px', color: isDark ? '#d1d5db' : '#4b5563', marginBottom: '6px', display: 'block', fontWeight: 600 }}>Lead / Target Email</label>
   <input type="email" name="email" value={formData.email || ''} onChange={handleChange} placeholder="Optional" style={{...styles.input, width: '100%', boxSizing: 'border-box'}} />
</div> )}
        <div><label style={{ fontSize: '13px', color: isDark ? '#d1d5db' : '#4b5563', marginBottom: '6px', display: 'block', fontWeight: 500 }}>Proof / Document URL</label><input type="text" name="url" value={formData.url || ''} onChange={handleChange} style={{...styles.input, width: '100%', boxSizing: 'border-box'}} /></div>
        <div><label style={{ fontSize: '13px', color: isDark ? '#d1d5db' : '#4b5563', marginBottom: '6px', display: 'block', fontWeight: 500 }}>Industry / Role</label><input type="text" name="industry" value={formData.industry || ''} onChange={handleChange} style={{...styles.input, width: '100%', boxSizing: 'border-box'}} /></div>
        <div><label style={{ fontSize: '13px', color: isDark ? '#d1d5db' : '#4b5563', marginBottom: '6px', display: 'block', fontWeight: 500 }}>PIC Email</label><input type="email" name="marketer" placeholder="email@domain.com" value={formData.marketer || ''} onChange={handleChange} required style={{...styles.input, width: '100%', boxSizing: 'border-box'}} /></div>
        <div><label style={{ fontSize: '13px', color: isDark ? '#d1d5db' : '#4b5563', marginBottom: '6px', display: 'block', fontWeight: 500 }}>Source / Influencer</label><input type="text" name="source" value={formData.source || ''} onChange={handleChange} style={{...styles.input, width: '100%', boxSizing: 'border-box'}} /></div>
        <div><label style={{ fontSize: '13px', color: isDark ? '#d1d5db' : '#4b5563', marginBottom: '6px', display: 'block', fontWeight: 500 }}>Template Used</label><input type="text" name="template" value={formData.template || ''} onChange={handleChange} style={{...styles.input, width: '100%', boxSizing: 'border-box'}} /></div>
        <div>
          <label style={{ fontSize: '13px', color: isDark ? '#d1d5db' : '#4b5563', marginBottom: '6px', display: 'block', fontWeight: 500 }}>Interaction Type</label>
          <select name="interactionType" value={formData.interactionType || ''} onChange={handleChange} style={{...styles.input, width: '100%', boxSizing: 'border-box', appearance: 'auto'}}><option value="">-- Pilih --</option><option value="Direct Ask">Direct Ask</option><option value="Soft Sell">Soft Sell</option><option value="Inbound">Inbound</option></select>
        </div>
        <div>
          <label style={{ fontSize: '13px', color: isDark ? '#d1d5db' : '#4b5563', marginBottom: '6px', display: 'block', fontWeight: 500 }}>Status Conversion</label>
          {initialData ? ( <select name="status" value={formData.status || ''} onChange={handleChange} style={{...styles.input, width: '100%', boxSizing: 'border-box', appearance: 'auto'}}><option value="New">New</option><option value="In Progress">In Progress</option><option value="Deal / Signed">Deal / Signed</option><option value="Drop">Drop</option></select> ) : ( <input type="text" name="status" value="New" readOnly style={{...styles.input, width: '100%', boxSizing: 'border-box', backgroundColor: isDark ? '#4b5563' : '#e5e7eb', color: isDark ? '#9ca3af' : '#6b7280', cursor: 'not-allowed'}} /> )}
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
         <div><label style={{ fontSize: '13px', color: isDark ? '#d1d5db' : '#4b5563', marginBottom: '6px', display: 'block', fontWeight: 500 }}>Response Time</label><input type="text" name="responseTime" value={formData.responseTime || ''} onChange={handleChange} placeholder="e.g. 5 Mins" style={{...styles.input, width: '100%', boxSizing: 'border-box'}} /></div>
         <div style={{ display: 'flex', alignItems: 'center', paddingTop: '20px' }}><label style={{ fontSize: '14px', color: isDark ? '#f3f4f6' : '#111827', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600 }}><input type="checkbox" name="tagged" checked={formData.tagged || false} onChange={handleChange} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />Tag Jonathan?</label></div>
      </div>

      <div><label style={{ fontSize: '13px', color: isDark ? '#d1d5db' : '#4b5563', marginBottom: '6px', display: 'block', fontWeight: 500 }}>Notes / Feedback</label><textarea name="notes" value={formData.notes || ''} onChange={handleChange} style={{ ...styles.input, width: '100%', height: '80px', resize: 'none', boxSizing: 'border-box' }} /></div>

      <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
        <button type="button" onClick={onCancel} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: isDark ? '1px solid #4b5563' : '1px solid #d1d5db', background: 'transparent', color: isDark ? 'white' : '#111827', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
        <button type="submit" style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: '#0284c7', color: 'white', fontWeight: 600, cursor: 'pointer' }}>{initialData ? 'Update Data' : 'Save New Data'}</button>
      </div>
    </form>
  );
}