'use client';
import Link from 'next/link';
import { HelpCircle, MessageSquare, BookOpen, Phone, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { useState } from 'react';

const FAQS = [
  { q:'How does the AI compliance assistant work?', a:"Our AI is trained on Indian business laws, GST rules, and government scheme eligibility. It understands your business profile and gives personalized, plain-English answers about compliance requirements." },
  { q:'Is my business data secure?', a:"Yes. Your data is stored locally on your device. We use encryption for all data in transit. We never share your data with third parties." },
  { q:'How do I get Udyam/MSME registration?', a:"Visit udyamregistration.gov.in. Enter your Aadhaar number, fill business details, and your certificate is issued instantly. It's free and takes about 10 minutes." },
  { q:'What happens if I miss a GST deadline?', a:"Late filing attracts ₹50/day (CGST) + ₹50/day (SGST) = ₹100/day penalty, max ₹5,000. Interest of 18% per annum on unpaid tax also applies." },
  { q:'Can I use this for multiple businesses?', a:"Currently one profile per account. Multi-business support is coming in the next update." },
  { q:'How is compliance score calculated?', a:"Score is based on completed registrations, timely filings, active licenses, and missing mandatory compliances — weighted by priority." },
];

const LINKS = [
  { name:'GST Portal',             url:'https://www.gst.gov.in'           },
  { name:'Udyam Registration',     url:'https://udyamregistration.gov.in' },
  { name:'Startup India',          url:'https://www.startupindia.gov.in'  },
  { name:'MCA21 Company Filing',   url:'https://www.mca.gov.in'           },
  { name:'FSSAI Food License',     url:'https://www.fssai.gov.in'         },
  { name:'Income Tax Portal',      url:'https://www.incometax.gov.in'     },
];

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number|null>(null);

  const CARDS = [
    { icon: MessageSquare, label:'AI Assistant',    desc:'Get instant answers',          color:'linear-gradient(135deg,#5b5ef4,#7c3aed)', href:'/dashboard/ai-assistant' },
    { icon: BookOpen,      label:'Knowledge Base',  desc:'Browse compliance guides',     color:'linear-gradient(135deg,#06b6d4,#3b82f6)', href:'#' },
    { icon: Phone,         label:'Contact Support', desc:'Email or call us',             color:'linear-gradient(135deg,#10b981,#059669)', href:'mailto:support@msmecopilot.in' },
  ];

  return (
    <div className="page-content" style={{ maxWidth:780 }}>
      <div style={{ marginBottom:28 }} className="animate-fade-up">
        <h1 className="page-title"><HelpCircle size={22} color="#a78bfa" /> Help & Support</h1>
        <p className="page-subtitle">We're here to help you manage compliance with ease</p>
      </div>

      {/* Quick cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:28 }} className="animate-fade-up delay-100">
        {CARDS.map(({ icon:Icon, label, desc, color, href }) => (
          <Link key={label} href={href}
            style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:12, padding:'22px 16px', borderRadius:16, background:'var(--card)', border:'1px solid var(--border)', textAlign:'center', textDecoration:'none', transition:'all 0.18s', cursor:'pointer' }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border2)'; (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'none'; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none'; }}>
            <div style={{ width:48, height:48, borderRadius:14, background:color, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Icon size={22} color="#fff" />
            </div>
            <div>
              <p style={{ fontSize:14, fontWeight:600, color:'var(--text1)' }}>{label}</p>
              <p style={{ fontSize:12, color:'var(--text2)', marginTop:3 }}>{desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* FAQs */}
      <div className="animate-fade-up delay-150" style={{ marginBottom:28 }}>
        <h2 style={{ fontSize:16, fontWeight:600, color:'var(--text1)', marginBottom:14 }}>Frequently Asked Questions</h2>
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {FAQS.map((faq, i) => (
            <div key={i} style={{ background:'var(--card)', border:`1px solid ${openFaq===i ? 'var(--border2)' : 'var(--border)'}`, borderRadius:14, overflow:'hidden', transition:'border-color 0.18s' }}>
              <button onClick={() => setOpenFaq(openFaq===i ? null : i)}
                style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 18px', background:'transparent', border:'none', cursor:'pointer', textAlign:'left' }}>
                <span style={{ fontSize:14, fontWeight:500, color:'var(--text1)', paddingRight:16 }}>{faq.q}</span>
                {openFaq===i
                  ? <ChevronUp size={15} color="var(--accent)" style={{ flexShrink:0 }} />
                  : <ChevronDown size={15} color="var(--text3)" style={{ flexShrink:0 }} />}
              </button>
              {openFaq===i && (
                <div style={{ padding:'0 18px 16px' }} className="anim-fade-in">
                  <p style={{ fontSize:13.5, color:'var(--text2)', lineHeight:1.65 }}>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Useful links */}
      <div className="animate-fade-up delay-200" style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:16, padding:'20px 24px' }}>
        <h2 style={{ fontSize:14, fontWeight:600, color:'var(--text1)', marginBottom:14 }}>Useful Government Portals</h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:8 }}>
          {LINKS.map(({ name, url }) => (
            <a key={name} href={url} target="_blank" rel="noopener noreferrer"
              style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'11px 14px', borderRadius:12, border:'1px solid var(--border)', textDecoration:'none', transition:'all 0.15s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border2)'; (e.currentTarget as HTMLAnchorElement).style.background = 'var(--bg3)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; }}>
              <span style={{ fontSize:13.5, fontWeight:500, color:'var(--text1)' }}>{name}</span>
              <ExternalLink size={12} color="var(--text3)" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
