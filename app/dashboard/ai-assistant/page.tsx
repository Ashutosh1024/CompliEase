'use client';
import { useState, useRef, useEffect } from 'react';
import { getProfile, getChatHistory, saveChatHistory } from '@/lib/store';
import { getAIResponse } from '@/lib/compliance-data';
import { ChatMessage, BusinessProfile } from '@/lib/types';
import { Bot, Send, RefreshCw, Sparkles } from 'lucide-react';

const SUGGESTED = [
  'Do I need GST registration?', 'How to get Mudra loan?',
  'What is Udyam registration?', 'Which licenses do I need?',
  'When is GST filing due?', 'Tell me about PMEGP', 'How to file ITR?',
];

const WELCOME: ChatMessage = {
  id: 'welcome', role: 'assistant', timestamp: new Date(),
  content: "Hello! 👋 I'm your **AI Business Compliance Assistant**.\n\nI can help with:\n- 📋 GST registration & filing\n- 🏛️ Government schemes (Mudra, PMEGP)\n- 📄 MSME/Udyam registration\n- 🏪 Shop Act, FSSAI, Trade License\n- 📅 Tax deadlines & filings\n\nWhat would you like to know?",
};

function Bubble({ msg }: { msg: ChatMessage }) {
  const isAI = msg.role === 'assistant';
  const format = (t: string) => t.split('\n').map((l, i) => {
    const html = l.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return <p key={i} style={{ minHeight: l === '' ? '10px' : undefined, fontSize: 13.5, lineHeight: 1.65, color: isAI ? 'var(--text1)' : '#fff' }} dangerouslySetInnerHTML={{ __html: html }} />;
  });
  return (
    <div style={{ display: 'flex', gap: 10, flexDirection: isAI ? 'row' : 'row-reverse', animation: 'fadeUp 0.3s ease both' }}>
      {isAI && (
        <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg,#5b5ef4,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
          <Bot size={15} color="#fff" />
        </div>
      )}
      <div style={{ maxWidth: '78%', padding: '10px 14px', borderRadius: isAI ? '4px 16px 16px 16px' : '16px 4px 16px 16px', background: isAI ? 'var(--card)' : 'linear-gradient(135deg,#5b5ef4,#7c3aed)', border: isAI ? '1px solid var(--border)' : 'none' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>{format(msg.content)}</div>
        <p style={{ fontSize: 10.5, marginTop: 6, color: isAI ? 'var(--text3)' : 'rgba(255,255,255,0.55)' }}>
          {new Date(msg.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}

function Typing() {
  return (
    <div style={{ display: 'flex', gap: 10 }}>
      <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg,#5b5ef4,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Bot size={15} color="#fff" />
      </div>
      <div style={{ padding: '12px 16px', borderRadius: '4px 16px 16px 16px', background: 'var(--card)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 5 }}>
        <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
      </div>
    </div>
  );
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input,    setInput]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [profile,  setProfile]  = useState<BusinessProfile | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const p = getProfile(); setProfile(p);
    const h = getChatHistory();
    if (h.length) setMessages([WELCOME, ...h]);
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  const send = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');
    const user: ChatMessage = { id: Date.now().toString(), role: 'user', content: msg, timestamp: new Date() };
    setMessages(p => [...p, user]);
    setLoading(true);
    await new Promise(r => setTimeout(r, 800 + Math.random() * 500));
    const reply = getAIResponse(msg, profile);
    const ai: ChatMessage = { id: (Date.now() + 1).toString(), role: 'assistant', content: reply, timestamp: new Date() };
    setMessages(p => { const u = [...p, ai]; saveChatHistory(u.filter(m => m.id !== 'welcome')); return u; });
    setLoading(false);
    inputRef.current?.focus();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '24px 24px 20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#5b5ef4,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bot size={20} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 18, fontWeight: 700, color: 'var(--text1)' }}>AI Compliance Assistant</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--green)', display: 'inline-block', boxShadow: '0 0 8px var(--green)' }} />
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--green)' }}>Online · MSME Expert</span>
            </div>
          </div>
        </div>
        <button onClick={() => { setMessages([WELCOME]); saveChatHistory([]); }} className="btn btn-secondary" style={{ gap: 7, fontSize: 13 }}>
          <RefreshCw size={14} /> Clear
        </button>
      </div>

      {/* Suggestions */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 10, marginBottom: 14, scrollbarWidth: 'none', flexShrink: 0 }}>
        {SUGGESTED.map(q => (
          <button key={q} onClick={() => send(q)} disabled={loading}
            style={{ flexShrink: 0, padding: '6px 14px', borderRadius: 99, fontSize: 12, fontWeight: 500, cursor: 'pointer', border: '1px solid rgba(91,94,244,0.3)', background: 'transparent', color: 'var(--accent)', transition: 'background 0.15s', display: 'flex', alignItems: 'center', gap: 5 }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(91,94,244,0.1)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}>
            <Sparkles size={10} /> {q}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14, paddingRight: 4, marginBottom: 14 }}>
        {messages.map(m => <Bubble key={m.id} msg={m} />)}
        {loading && <Typing />}
        <div ref={bottomRef} />
      </div>

      {/* Context */}
      {profile && (
        <div style={{ marginBottom: 12, padding: '8px 14px', borderRadius: 10, background: 'var(--bg3)', border: '1px solid var(--border)', fontSize: 12, color: 'var(--text2)', flexShrink: 0 }}>
          <span style={{ fontWeight: 600, color: 'var(--accent)' }}>Context:</span> {profile.businessName} · {profile.industryCategory} · {profile.state}
        </div>
      )}

      {/* Input */}
      <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
        <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
          placeholder="Ask about GST, licenses, schemes, deadlines…"
          disabled={loading} className="input" style={{ flex: 1, fontSize: 14 }} />
        <button onClick={() => send()} disabled={!input.trim() || loading}
          className="btn btn-primary" style={{ width: 46, height: 46, padding: 0, borderRadius: 12, flexShrink: 0 }}>
          <Send size={17} />
        </button>
      </div>

      <style>{`@keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }`}</style>
    </div>
  );
}
