'use client';
import { useEffect, useState, useRef } from 'react';
import { FolderOpen, Upload, FileText, Trash2, Eye, Download, Loader2 } from 'lucide-react';
import { apiGetDocuments, apiUploadDocument, apiDeleteDocument } from '@/lib/apiClient';

interface Doc { id:string; name:string; category:string; size:string; mimeType:string; createdAt:string; }
const CATS = ['All','GST','Identity','Registration','License','Tax','Other'];

function formatDate(d: string) {
  try { return new Date(d).toLocaleDateString('en-IN'); } catch { return d; }
}

export default function DocumentsPage() {
  const [docs,     setDocs]     = useState<Doc[]>([]);
  const [filter,   setFilter]   = useState('All');
  const [drag,     setDrag]     = useState(false);
  const [uploading,setUploading]= useState(false);
  const [loading,  setLoading]  = useState(true);
  const [catPick,  setCatPick]  = useState('Other');
  const [uploadErr,setUploadErr]= useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = docs.filter(d => filter === 'All' || d.category === filter);

  useEffect(() => {
    apiGetDocuments()
      .then(setDocs)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true); setUploadErr('');
    try {
      for (const file of Array.from(files)) {
        if (file.size > 10 * 1024 * 1024) { setUploadErr('Max file size is 10 MB'); continue; }
        const doc = await apiUploadDocument(file, catPick);
        setDocs(prev => [{ ...doc } as Doc, ...prev]);
      }
    } catch (err: any) {
      setUploadErr(err.message || 'Upload failed');
    } finally { setUploading(false); }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiDeleteDocument(id);
      setDocs(prev => prev.filter(d => d.id !== id));
    } catch (err: any) {
      alert(err.message || 'Delete failed');
    }
  };

  const storageUsed = () => {
    // approximate
    const total = docs.reduce((acc, d) => acc + parseFloat(d.size), 0);
    return isNaN(total) ? '—' : `~${total.toFixed(0)} KB`;
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
          { l:'Total Documents', v:docs.length,                               c:'var(--accent)' },
          { l:'Categories',      v:new Set(docs.map(d=>d.category)).size,     c:'var(--cyan)'  },
          { l:'Approx Storage',  v:storageUsed(),                              c:'var(--green)' },
        ].map(({ l, v, c }) => (
          <div key={l} style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:14, padding:'18px 20px', textAlign:'center' }}>
            <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:28, fontWeight:800, color:c, lineHeight:1 }}>{v}</p>
            <p style={{ fontSize:12.5, color:'var(--text2)', marginTop:6 }}>{l}</p>
          </div>
        ))}
      </div>

      {/* Category for upload */}
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }} className="animate-fade-up delay-125">
        <p style={{ fontSize:13, color:'var(--text2)', fontWeight:500 }}>Upload as:</p>
        {CATS.filter(c => c !== 'All').map(c => (
          <button key={c} onClick={() => setCatPick(c)}
            style={{ padding:'5px 12px', borderRadius:99, fontSize:12, fontWeight:600, cursor:'pointer', outline:'none', border:`1px solid ${catPick===c ? 'var(--accent)' : 'var(--border)'}`, background:catPick===c ? 'var(--accent)' : 'transparent', color:catPick===c ? '#fff' : 'var(--text2)', transition:'all 0.15s' }}>
            {c}
          </button>
        ))}
      </div>

      {/* Drop zone */}
      <div className="animate-fade-up delay-150"
        style={{ border:`2px dashed ${drag ? 'var(--accent)' : 'var(--border)'}`, background: drag ? 'rgba(91,94,244,0.06)' : 'var(--card)', borderRadius:16, padding:'36px 24px', textAlign:'center', cursor:'pointer', marginBottom:24, transition:'all 0.18s' }}
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); handleUpload(e.dataTransfer.files); }}
        onClick={() => fileRef.current?.click()}>
        <input ref={fileRef} type="file" multiple hidden onChange={e => handleUpload(e.target.files)} />
        {uploading ? (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
            <Loader2 size={28} color="var(--accent)" style={{ animation:'spin 0.8s linear infinite' }} />
            <p style={{ fontSize:14, fontWeight:500, color:'var(--accent)' }}>Uploading to MongoDB…</p>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
            <div style={{ width:48, height:48, borderRadius:14, background:'rgba(91,94,244,0.12)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Upload size={22} color="var(--accent)" />
            </div>
            <div>
              <p style={{ fontSize:14, fontWeight:600, color:'var(--text1)' }}>Drop files here or click to upload</p>
              <p style={{ fontSize:12, color:'var(--text3)', marginTop:4 }}>PDF, JPG, PNG · Max 10 MB · Will be saved as: <strong style={{ color:'var(--accent)' }}>{catPick}</strong></p>
            </div>
          </div>
        )}
      </div>

      {uploadErr && (
        <div style={{ padding:'10px 14px', borderRadius:10, background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.22)', color:'var(--red)', fontSize:13, marginBottom:16 }}>{uploadErr}</div>
      )}

      {/* Category filter */}
      <div style={{ display:'flex', gap:8, marginBottom:18, flexWrap:'wrap' }} className="animate-fade-up delay-200">
        {CATS.map(c => (
          <button key={c} onClick={() => setFilter(c)}
            style={{ padding:'5px 14px', borderRadius:99, fontSize:12.5, fontWeight:600, cursor:'pointer', outline:'none', border:`1px solid ${filter===c ? 'var(--accent)' : 'var(--border)'}`, background:filter===c ? 'var(--accent)' : 'transparent', color:filter===c ? '#fff' : 'var(--text2)', transition:'all 0.15s' }}>
            {c}{c==='All' ? ` (${docs.length})` : ''}
          </button>
        ))}
      </div>

      {/* Doc list */}
      {loading ? (
        <div style={{ textAlign:'center', padding:'60px 0' }}>
          <Loader2 size={28} color="var(--accent)" style={{ display:'block', margin:'0 auto 12px', animation:'spin 0.8s linear infinite' }} />
          <p style={{ fontSize:13, color:'var(--text2)' }}>Loading documents…</p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {filtered.map(doc => (
            <div key={doc.id} style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 16px', borderRadius:14, background:'var(--card)', border:'1px solid var(--border)' }}>
              <div style={{ width:40, height:40, borderRadius:10, background:'rgba(91,94,244,0.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <FileText size={18} color="var(--accent)" />
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ fontSize:14, fontWeight:500, color:'var(--text1)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{doc.name}</p>
                <div style={{ display:'flex', gap:8, marginTop:4, flexWrap:'wrap' }}>
                  <span className="badge badge-indigo">{doc.category}</span>
                  <span style={{ fontSize:11.5, color:'var(--text3)' }}>{doc.size}</span>
                  <span style={{ fontSize:11.5, color:'var(--text3)' }}>{formatDate(doc.createdAt)}</span>
                </div>
              </div>
              <div style={{ display:'flex', gap:6, flexShrink:0 }}>
                <button style={{ width:32, height:32, borderRadius:9, background:'var(--bg3)', border:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'var(--text2)' }}
                  title="Preview (open original)" onClick={() => alert('Preview: ' + doc.name)}>
                  <Eye size={13} />
                </button>
                <button style={{ width:32, height:32, borderRadius:9, background:'var(--bg3)', border:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'var(--text2)' }}
                  title="Download" onClick={() => alert('Download: contact admin for file retrieval')}>
                  <Download size={13} />
                </button>
                <button onClick={() => handleDelete(doc.id)}
                  style={{ width:32, height:32, borderRadius:9, background:'var(--bg3)', border:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'var(--text2)' }}
                  title="Delete"
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color='var(--red)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color='var(--text2)'; }}>
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && !loading && (
            <div style={{ textAlign:'center', padding:'60px 0', background:'var(--card)', border:'1px solid var(--border)', borderRadius:16 }}>
              <FolderOpen size={36} color="var(--text3)" style={{ display:'block', margin:'0 auto 12px' }} />
              <p style={{ fontSize:15, fontWeight:600, color:'var(--text1)' }}>No documents yet</p>
              <p style={{ fontSize:13, color:'var(--text2)', marginTop:5 }}>Upload your first document above</p>
            </div>
          )}
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
    </div>
  );
}
