'use client';
import { useEffect, useRef, useState } from 'react';
import { Send, Bot, User, Loader2, Lightbulb } from 'lucide-react';
import { apiChat, apiGetProfile, getToken } from '@/lib/apiClient';

interface Message { role: 'user'|'assistant'; content: string; }

const SUGGESTIONS = [
  'What is Udyam registration and how do I apply?',
  'When is my next GST return due?',
  'Am I eligible for Mudra loan?',
  'What are the GST rates for my business?',
  'How do I file GSTR-3B?',
  'What is the penalty for late GST filing?',
];

function renderMarkdown(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code style="background:rgba(91,94,244,0.12);padding:2px 6px;border-radius:5px;font-size:0.92em">$1</code>')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>')
    .replace(/^#{1,3}\s(.+)/gm, '<strong style="font-size:1.05em">$1</strong>');
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role:'assistant', content:'Hello! I\'m your MSME Compliance AI, powered by Groq. I can help you with GST, Udyam registration, government schemes, compliance deadlines, and all Indian business regulations. What would you like to know?' }
  ]);
  const [input,    setInput]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [profile,  setProfile]  = useState<Record<string,unknown> | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    apiGetProfile().then(p => { if (p) setProfile(p); }).catch(() => {});
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior:'smooth' });
  }, [messages, loading]);

  const send = async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput('');
    const userMsg: Message = { role:'user', content: msg };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const reply = await apiChat(msg, history, profile || undefined);
      setMessages(prev => [...prev, { role:'assistant', content: reply }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { role:'assistant', content: `Sorry, I encountered an error: ${err.message}. Please try again.` }]);
    } finally { setLoading(false); }
  };

  return (
    <div className="page-content" style={{ display:'flex', flexDirection:'column', height:'calc(100vh - 60px)', padding:0 }}>
      {/* Header */}
      <div style={{ padding:'20px 28px 16px', borderBottom:'1px solid var(--border)', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:40, height:40, borderRadius:12, background:'linear-gradient(135deg,#5b5ef4,#7c3aed)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 12px rgba(91,94,244,0.35)' }}>
            <Bot size={20} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:17, fontWeight:700, color:'var(--text1)', lineHeight:1.2 }}>MSME AI Assistant</h1>
            <p style={{ fontSize:12, color:'var(--green)', display:'flex', alignItems:'center', gap:5, marginTop:2 }}>
              <span style={{ width:7, height:7, borderRadius:'50%', background:'var(--green)', display:'inline-block' }} />
              Powered by Groq · {profile ? `Context: ${(profile as any).businessName}` : 'Online'}
            </p>
          </div>
        </div>
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div style={{ padding:'16px 28px', borderBottom:'1px solid var(--border)', flexShrink:0 }}>
          <p style={{ fontSize:12, color:'var(--text3)', marginBottom:10, display:'flex', alignItems:'center', gap:5 }}>
            <Lightbulb size={12} /> Quick questions:
          </p>
          <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
            {SUGGESTIONS.map(s => (
              <button key={s} onClick={() => send(s)}
                style={{ padding:'6px 14px', borderRadius:99, fontSize:12.5, fontWeight:500, cursor:'pointer', border:'1px solid var(--border)', background:'var(--bg3)', color:'var(--text2)', transition:'all 0.15s', outline:'none' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor='var(--accent)'; (e.currentTarget as HTMLButtonElement).style.color='var(--accent)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor='var(--border)'; (e.currentTarget as HTMLButtonElement).style.color='var(--text2)'; }}>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div style={{ flex:1, overflowY:'auto', padding:'20px 28px', display:'flex', flexDirection:'column', gap:16 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display:'flex', gap:12, flexDirection: m.role==='user' ? 'row-reverse' : 'row', alignItems:'flex-start' }}>
            <div style={{ width:34, height:34, borderRadius:10, background: m.role==='user' ? 'var(--accent)' : 'linear-gradient(135deg,#5b5ef4,#7c3aed)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              {m.role==='user' ? <User size={16} color="#fff" /> : <Bot size={16} color="#fff" />}
            </div>
            <div style={{ maxWidth:'75%', padding:'12px 16px', borderRadius: m.role==='user' ? '14px 4px 14px 14px' : '4px 14px 14px 14px', background: m.role==='user' ? 'var(--accent)' : 'var(--card)', border: m.role==='user' ? 'none' : '1px solid var(--border)', color: m.role==='user' ? '#fff' : 'var(--text1)', fontSize:13.5, lineHeight:1.65, wordBreak:'break-word' }}
              dangerouslySetInnerHTML={{ __html: m.role==='assistant' ? renderMarkdown(m.content) : m.content.replace(/\n/g,'<br/>') }} />
          </div>
        ))}
        {loading && (
          <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
            <div style={{ width:34, height:34, borderRadius:10, background:'linear-gradient(135deg,#5b5ef4,#7c3aed)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <Bot size={16} color="#fff" />
            </div>
            <div style={{ padding:'12px 18px', borderRadius:'4px 14px 14px 14px', background:'var(--card)', border:'1px solid var(--border)', display:'flex', alignItems:'center', gap:8 }}>
              <Loader2 size={14} color="var(--accent)" style={{ animation:'spin 0.8s linear infinite' }} />
              <span style={{ fontSize:13, color:'var(--text2)' }}>Thinking…</span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div style={{ padding:'16px 28px', borderTop:'1px solid var(--border)', flexShrink:0 }}>
        <div style={{ display:'flex', gap:10, alignItems:'flex-end' }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Ask about GST, compliance, government schemes… (Enter to send)"
            rows={1}
            style={{ flex:1, padding:'12px 14px', fontSize:14, color:'var(--text1)', background:'var(--input-bg)', border:'1px solid var(--input-border)', borderRadius:12, outline:'none', resize:'none', fontFamily:'inherit', lineHeight:1.5, minHeight:44, maxHeight:120 }}
            onFocus={e => { e.target.style.borderColor='var(--accent)'; e.target.style.boxShadow='0 0 0 3px rgba(91,94,244,0.15)'; }}
            onBlur={e  => { e.target.style.borderColor='var(--input-border)'; e.target.style.boxShadow='none'; }}
          />
          <button onClick={() => send()} disabled={!input.trim() || loading} className="btn btn-primary"
            style={{ padding:'12px 16px', borderRadius:12, flexShrink:0, opacity: !input.trim() || loading ? 0.5 : 1, transition:'opacity 0.15s' }}>
            <Send size={16} />
          </button>
        </div>
        <p style={{ fontSize:11.5, color:'var(--text3)', marginTop:8, textAlign:'center' }}>
          AI may make mistakes. Verify important compliance dates with official government portals.
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
    </div>
  );
}
