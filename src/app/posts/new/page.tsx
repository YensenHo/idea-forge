'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function New(){
  const r = useRouter();
  const [content, setContent] = useState('');
  const [bounty, setBounty] = useState('');
  const [s, setS] = useState(false);
  const [e, setE] = useState('');

  async function sub(ev: React.FormEvent){
    ev.preventDefault();
    if(!content.trim()){ setE('请描述你的想法。'); return }
    setS(true); setE('');
    const res = await fetch('/api/posts', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ content: content.trim(), bounty: Number(bounty) || 0 })
    });
    if(res.ok){ const d = await res.json(); r.push('/posts/'+d.id) }
    else setE('发布失败，请重试。');
    setS(false);
  }

  return(
    <main className="max-w-2xl mx-auto" style={{padding:'30px 20px',maxWidth:'700px'}}>
      <Link href="/" className="inline-flex items-center gap-1.5 text-[13px] text-[#665c56] hover:text-[#a8573e] mb-10 lg:mb-12 transition-colors italic">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        返回广场
      </Link>

      <header className="mb-10 lg:mb-12">
        <p className="text-[11px] font-semibold uppercase text-[#a8573e] tracking-[0.8px] mb-3">发布悬赏</p>
        <h1 className="serif font-bold text-[#1a1a1a] leading-[115%] tracking-[1px]"
          style={{fontSize:'clamp(28px,4vw,38px)',marginBottom:'16px'}}>你想让什么被创造出来？</h1>
        <p className="text-[#665c56] leading-[160%] font-light italic"
          style={{fontSize:'clamp(14px,1.5vw,16px)'}}>
          描述你的想法。为谁解决什么问题？现有方案差在哪？越具体越好。
        </p>
      </header>

      <form onSubmit={sub} className="space-y-6">
        <textarea rows={12} value={content} onChange={v=>setContent(v.target.value)}
          placeholder={`尽量详细地描述。例如：\n\n我需要一个帮助独立开发者管理多项目时间线的工具。我现在同时维护 3 个项目，经常搞混每个项目的进度和截止日期。市面上有 Jira 和 Notion，但都太重了，我只想要一个极简的甘特图 + 提醒功能。目标用户是像我一样的 solo maker。`}
          className="w-full resize-none font-light text-[#1a1a1a] placeholder-[#a9a39b] leading-[170%] focus:ring-0 outline-none transition-all duration-200"
          style={{
            padding:'16px 20px',fontSize:'clamp(14px,1.5vw,16px)',
            background:'#fdfaf5',border:'1px solid #c9beb4',borderRadius:'8px',
            lineHeight:'170%'
          }}
        />

        {/* Bounty input */}
        <div className="card-pinned relative overflow-hidden" style={{padding:'20px 24px'}}>
          <p className="text-[13px] font-semibold text-[#1a1a1a] mb-1">设置赏金（可选）</p>
          <p className="text-[12px] text-[#665c56] font-light mb-3">有赏金的需求更容易被 Builder 认领</p>
          <div className="flex items-center gap-2">
            <span className="text-[18px] text-[#a8573e] font-bold">¥</span>
            <input type="number" min="0" step="1" value={bounty}
              onChange={v => setBounty(v.target.value)}
              placeholder="输入金额，如 500"
              className="w-48 px-4 py-2.5 text-[15px] font-medium text-[#1a1a1a] placeholder-[#a9a39b] rounded-lg outline-none transition-all"
              style={{border:'1px solid #c9beb4',background:'#fdfaf5'}}/>
            <span className="text-[13px] text-[#665c56] font-light">元</span>
          </div>
        </div>

        {e && <p className="text-[13px] text-[#a8573e] italic">{e}</p>}
        <button disabled={s} className="w-full py-[14px] rounded-md text-[15px] font-semibold text-white transition-all duration-200"
          style={{background:'#a8573e',boxShadow:'0 2px 8px rgba(168,87,62,0.18)'}}
          onMouseEnter={e=>e.currentTarget.style.background='#b9684c'}
          onMouseLeave={e=>e.currentTarget.style.background='#a8573e'}>
          {s?'发布中...':bounty?'发布悬赏 ¥'+Number(bounty).toFixed(0):'发布想法'}
        </button>
      </form>
    </main>
  );
}
