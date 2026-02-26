import React, { useState, useEffect } from 'react';

// Jika Anda memindahkan tipe ini ke file tersendiri (misal src/types/index.ts), 
// Anda bisa mengimpornya. Untuk saat ini, saya definisikan di sini agar lengkap.
interface DailyLog {
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

interface AddLeadFormProps {
  styles: any;
  initialData: DailyLog | null;
  onSubmit: (data: any) => void;
  isMobile: boolean;
}

export function AddLeadForm({ styles, initialData, onSubmit, isMobile }: AddLeadFormProps) {
  const [formData, setFormData] = useState({
    rowNumber: 0, 
    rawDateIso: new Date().toISOString().slice(0, 10), 
    name: '', url: '', industry: 'IT/Tech', source: '', 
    template: 'ATS Story', interactionType: 'Direct Ask', 
    tagged: true, notes: '', marketer: '', status: 'New', responseTime: '-',
    email: '', approvalStatus: 'None'
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        rowNumber: initialData.rowNumber,
        rawDateIso: initialData.rawDateIso || new Date().toISOString().slice(0, 10),
        name: initialData.leadName, url: initialData.profileUrl, industry: initialData.industry,
        source: initialData.source, template: initialData.template, interactionType: initialData.interactionType,
        tagged: initialData.tagged, notes: initialData.notes, marketer: initialData.marketer,
        status: initialData.status, responseTime: initialData.responseTime,
        email: initialData.email, approvalStatus: initialData.approvalStatus
      });
    } else {
      const savedMarketer = localStorage.getItem('savedMarketerName');
      if (savedMarketer) {
         setFormData(prev => ({ ...prev, marketer: savedMarketer }));
      }
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    setFormData({...formData, [target.name]: value});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.marketer) {
       localStorage.setItem('savedMarketerName', formData.marketer);
    }
    onSubmit(formData);
  };

  // Gunakan isMobile untuk mengatur Grid Layout Form (1 Kolom vs 2 Kolom)
  const gridTemplate = isMobile ? '1fr' : '1fr 1fr';

  return (
    <form onSubmit={handleSubmit} style={{display:'flex', flexDirection:'column', gap:'16px'}}>
       <div style={{display:'grid', gridTemplateColumns: gridTemplate, gap: '12px'}}>
         <div>
           <label style={{display:'block', fontSize:'13px', marginBottom:'6px', color: '#6b7280', fontWeight: 500}}>Tanggal</label>
           <input required type="date" name="rawDateIso" value={formData.rawDateIso} onChange={handleChange} style={styles.input} />
         </div>
         <div>
            <label style={{display:'block', fontSize:'13px', marginBottom:'6px', color: '#6b7280', fontWeight: 500}}>Marketer Name</label>
            <input required name="marketer" value={formData.marketer} onChange={handleChange} style={styles.input} placeholder="Your Name" />
         </div>
       </div>

       <div>
         <label style={{display:'block', fontSize:'13px', marginBottom:'6px', color: '#6b7280', fontWeight: 500}}>Lead Name</label>
         <input required name="name" value={formData.name} onChange={handleChange} style={styles.input} placeholder="e.g. John Doe" />
       </div>
       <div>
         <label style={{display:'block', fontSize:'13px', marginBottom:'6px', color: '#6b7280', fontWeight: 500}}>Bukti Google Drive (Link)</label>
         <input required type="url" name="url" value={formData.url} onChange={handleChange} style={styles.input} placeholder="https://drive.google.com/..." />
       </div>
       
       <div style={{display:'grid', gridTemplateColumns: gridTemplate, gap: '12px'}}>
         <div>
           <label style={{display:'block', fontSize:'13px', marginBottom:'6px', color: '#6b7280', fontWeight: 500}}>Industry</label>
           <input name="industry" value={formData.industry} onChange={handleChange} style={styles.input} placeholder="IT, Finance..." />
         </div>
         <div>
           <label style={{display:'block', fontSize:'13px', marginBottom:'6px', color: '#6b7280', fontWeight: 500}}>Source / Post</label>
           <input name="source" placeholder="e.g. Viral Post #1" value={formData.source} onChange={handleChange} style={styles.input} />
         </div>
       </div>
       
       <div style={{display:'grid', gridTemplateColumns: gridTemplate, gap: '12px'}}>
         <div>
            <label style={{display:'block', fontSize:'13px', marginBottom:'6px', color: '#6b7280', fontWeight: 500}}>Type</label>
            <select name="interactionType" value={formData.interactionType} onChange={handleChange} style={styles.input}>
               <option>Direct Ask</option>
               <option>Offered</option>
            </select>
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
       </div>

       {initialData && (
          <div>
            <label style={{display:'block', fontSize:'13px', marginBottom:'6px', color: '#6b7280', fontWeight: 500}}>Lead Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} style={styles.input} placeholder="Belum ada email dari marketer" />
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
         <textarea name="notes" value={formData.notes} onChange={handleChange} style={{...styles.input, height:'60px', fontFamily: 'inherit'}} placeholder="Any additional details..." />
       </div>
       
       <button type="submit" style={{...styles.btnPrimary, justifyContent:'center', marginTop:'8px', padding: '12px'}}>
         {initialData ? 'Update Lead' : 'Save Lead'}
       </button>
    </form>
  );
}