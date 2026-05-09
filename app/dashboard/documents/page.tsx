'use client';
import { useState } from 'react';
import { FolderOpen, Upload, FileText, Trash2, Eye, Download } from 'lucide-react';

interface Doc { id:string; name:string; category:string; size:string; date:string; }
const INITIAL: Doc[] = [
  { id:'1', name:'GST Certificate.pdf',   category:'GST',          size:'245 KB', date:'2024-03-15' },
  { id:'2', name:'PAN Card.pdf',          category:'Identity',     size:'180 KB', date:'2024-01-10' },
  { id:'3', name:'MSME Certificate.pdf',  category:'Registration', size:'320 KB', date:'2024-02-20' },
];
const CATS = ['All','GST','Identity','Registration','License','Tax','Other'];

export default function DocumentsPage() {
  const [docs,     setDocs]     = useState<Doc[]>(INITIAL);
  const [filter,   setFilter]   = useState('All');
  const [drag,     setDrag]     = useState(false);
  const [uploading,setUploading]= useState(false);
  const filtered = docs.filter(d => filter === 'All' || d.category === filter);

  const handleUpload = async (files: FileList | null) => {
    if (!files) return;
    setUploading(true);
    await new Promise(r => setTimeout(r, 1100));
    setDocs(prev => [...prev, ...Array.from(files).map((f,i) => ({
      id: Date.now()+i+'', name:f.name, category:'Other',
      size:`${Math.round(f.size/1024)||1} KB`, date:new Date().toISOString().split('T')[0],
    }))]);
    setUploading(false);
  };

  return (
    <div className="page-content">
      {/* Header */}
      <div style={{ marginBottom:28 }} className="animate-fade-up">
        <h1 className="page-title"><FolderOpen size={22} color="var(--cyan)" /> Document Vault</h1>
        <p className="page-subtitle">Securely store all your business documents</p>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:24 }} className="animate-fade-up delay-100">
        {[
          { l:'Total Documents', v:docs.length,                           c:'var(--accent)' },
          { l:'Categories',      v:new Set(docs.map(d=>d.category)).size, c:'var(--cyan)'  },
          { l:'Storage Used',    v:'1.2 MB',                              c:'var(--green)' },
        ].map(({l,v,c}) => (
          <div key={l} style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:14, padding:'18px 20px', textAlign:'center' }}>
            <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:28, fontWeight:800, color:c, lineHeight:1 }}>{v}</p>
            <p style={{ fontSize:12.5, color:'var(--text2)', marginTop:6 }}>{l}</p>
          </div>
        ))}
      </div>

      {/* Drop zone */}
      <div className="animate-fade-up delay-150"
        style={{ border:`2px dashed ${drag ? 'var(--accent)' : 'var(--border)'}`, background: drag ? 'rgba(91,94,244,0.06)' : 'var(--card)', borderRadius:16, padding:'36px 24px', textAlign:'center', cursor:'pointer', marginBottom:24, transition:'all 0.18s' }}
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); handleUpload(e.dataTransfer.files); }}
        onClick={() => document.getElementById('file-input')?.click()}>
        <input id="file-input" type="file" multiple hidden onChange={e => handleUpload(e.target.files)} />
        {uploading ? (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
            <div style={{ width:32, height:32, borderRadius:'50%', border:'3px solid rgba(91,94,244,0.3)', borderTopColor:'var(--accent)', animation:'spin 0.8s linear infinite' }} />
            <p style={{ fontSize:14, fontWeight:500, color:'var(--accent)' }}>Uploading…</p>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
            <div style={{ width:48, height:48, borderRadius:14, background:'rgba(91,94,244,0.12)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Upload size={22} color="var(--accent)" />
            </div>
            <div>
              <p style={{ fontSize:14, fontWeight:600, color:'var(--text1)' }}>Drop files here or click to upload</p>
              <p style={{ fontSize:12, color:'var(--text3)', marginTop:4 }}>PDF, JPG, PNG · Max 10 MB per file</p>
            </div>
          </div>
        )}
      </div>

      {/* Category filter */}
      <div style={{ display:'flex', gap:8, marginBottom:18, flexWrap:'wrap' }} className="animate-fade-up delay-200">
        {CATS.map(c => (
          <button key={c} onClick={() => setFilter(c)}
            style={{ padding:'5px 14px', borderRadius:99, fontSize:12.5, fontWeight:600, cursor:'pointer', outline:'none', border:`1px solid ${filter===c ? 'var(--accent)' : 'var(--border)'}`, background:filter===c ? 'var(--accent)' : 'transparent', color:filter===c ? '#fff' : 'var(--text2)', transition:'all 0.15s' }}>
            {c}
          </button>
        ))}
      </div>

      {/* Doc list */}
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {filtered.map(doc => (
          <div key={doc.id} className="animate-fade-up"
            style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 16px', borderRadius:14, background:'var(--card)', border:'1px solid var(--border)', transition:'border-color 0.18s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border2)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'; }}>
            <div style={{ width:40, height:40, borderRadius:10, background:'rgba(91,94,244,0.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <FileText size={18} color="var(--accent)" />
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <p style={{ fontSize:14, fontWeight:500, color:'var(--text1)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{doc.name}</p>
              <div style={{ display:'flex', gap:8, marginTop:4, flexWrap:'wrap' }}>
                <span className="badge badge-indigo">{doc.category}</span>
                <span style={{ fontSize:11.5, color:'var(--text3)' }}>{doc.size}</span>
                <span style={{ fontSize:11.5, color:'var(--text3)' }}>{doc.date}</span>
              </div>
            </div>
            <div style={{ display:'flex', gap:6, flexShrink:0 }}>
              {[Eye, Download].map((Icon, j) => (
                <button key={j} style={{ width:32, height:32, borderRadius:9, background:'var(--bg3)', border:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'var(--text2)', transition:'all 0.15s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text1)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text2)'; }}>
                  <Icon size={13} />
                </button>
              ))}
              <button onClick={() => setDocs(p => p.filter(d => d.id !== doc.id))}
                style={{ width:32, height:32, borderRadius:9, background:'var(--bg3)', border:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'var(--text2)', transition:'all 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--red)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text2)'; }}>
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign:'center', padding:'60px 0', background:'var(--card)', border:'1px solid var(--border)', borderRadius:16 }}>
            <FolderOpen size={36} color="var(--text3)" style={{ display:'block', margin:'0 auto 12px' }} />
            <p style={{ fontSize:15, fontWeight:600, color:'var(--text1)' }}>No documents</p>
            <p style={{ fontSize:13, color:'var(--text2)', marginTop:5 }}>Upload your first document above</p>
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform:rotate(360deg); }}`}</style>
    </div>
  );
}
