'use client';
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import Link from 'next/link';

export default function New(){
  const r=useRouter();
  const [content,setContent]=useState('');
  const [s,setS]=useState(false);
  const [e,setE]=useState('');

  async function sub(ev:React.FormEvent){
    ev.preventDefault();
    if(!content.trim()){setE('Tell us what you want built.');return}
    setS(true);setE('');
    const res=await fetch('/api/posts',{
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({content:content.trim()})
    });
    if(res.ok){const d=await res.json();r.push('/posts/'+d.id)}
    else setE('Something went wrong.');
    setS(false);
  }

  return(
    <main className="max-w-2xl mx-auto py-12 lg:py-16" style={{padding:'30px 20px',maxWidth:'900px'}}>
      <Link href="/" className="inline-flex items-center gap-1.5 text-[13px] text-[#665c56] hover:text-[#a8573e] mb-10 lg:mb-12 transition-colors italic">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        Back to the wall
      </Link>

      <header className="mb-10 lg:mb-12">
        <p className="text-[11px] font-semibold uppercase text-[#a8573e] tracking-[0.8px] mb-3">Submit an idea</p>
        <h1 className="serif font-bold text-[#1a1a1a] leading-[115%] tracking-[1px]"
          style={{fontSize:'clamp(28px,4vw,38px)',marginBottom:'16px'}}>What should exist?</h1>
        <p className="text-[#665c56] leading-[160%] font-light italic"
          style={{fontSize:'clamp(14px,1.5vw,16px)'}}>
          Describe the problem. Who it&apos;s for. What&apos;s missing today. We&apos;ll shape the rest.
        </p>
      </header>

      <form onSubmit={sub} className="space-y-6">
        <textarea rows={12} value={content} onChange={v=>setContent(v.target.value)}
          placeholder={`Tell us everything. For example:\n\nI need an app that lets freelancers automatically generate and track invoices. Right now I spend hours every month doing this manually in Excel, and none of the existing tools handle multi-currency in a simple way. The app should feel like a calm, minimal notebook — not a bloated accounting tool.`}
          className="w-full resize-none font-light text-[#1a1a1a] placeholder-[#a9a39b] leading-[170%] focus:ring-0 outline-none transition-all duration-200"
          style={{
            padding:'16px 20px',fontSize:'clamp(14px,1.5vw,16px)',
            background:'#fdfaf5',border:'1px solid #c9beb4',borderRadius:'8px',
            lineHeight:'170%'
          }}
        />
        {e&&<p className="text-[13px] text-[#a8573e] italic">{e}</p>}
        <button disabled={s} className="w-full py-[14px] rounded-md text-[15px] font-semibold text-white transition-all duration-200"
          style={{background:'#a8573e',boxShadow:'0 2px 8px rgba(168,87,62,0.18)'}}
          onMouseEnter={e=>e.currentTarget.style.background='#b9684c'}
          onMouseLeave={e=>e.currentTarget.style.background='#a8573e'}>
          {s?'Pinning to the wall...':'Pin this spark'}
        </button>
      </form>
    </main>
  );
}
