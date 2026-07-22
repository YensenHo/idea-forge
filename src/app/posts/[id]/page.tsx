'use client';
import { useEffect, useState, use } from 'react';
import Link from 'next/link';

interface C { id: number; author_name: string; content: string; created_at: string }
interface P {
  id: number; title: string; description: string; target_user: string;
  pain_points: string; tags: string; bounty: number;
  upvotes: number; claimed_by: string | null; app_url: string | null;
  created_at: string; delivered_at: string | null; comments: C[]
}

export default function Detail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [p, setP] = useState<P | null>(null);
  const [L, setL] = useState(true);
  const [c, setC] = useState(''); const [n, setN] = useState(''); const [S, setS] = useState(false);
  const [sh, setSh] = useState(false); const [bn, setBn] = useState(''); const [au, setAu] = useState('');
  const [delivering, setDelivering] = useState(false);

  function R() { fetch('/api/posts/'+id).then(r=>r.json()).then(d=>{setP(d);setL(false);}) }
  useEffect(()=>{R()},[id]);

  async function up() { await fetch('/api/posts/'+id+'/upvote',{method:'POST'}); R() }
  async function cm(ev: React.FormEvent) { ev.preventDefault(); if(!c.trim())return; setS(true); await fetch('/api/posts/'+id+'/comments',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({content:c,author_name:n})}); setC(''); setS(false); R() }
  async function cl(ev: React.FormEvent) { ev.preventDefault(); await fetch('/api/posts/'+id+'/claim',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({builder_name:bn,app_url:au})}); setSh(false); R() }
  async function deliver() {
    const url = prompt('请输入交付链接（App 地址或演示链接）：');
    if (!url) return;
    setDelivering(true);
    await fetch('/api/posts/'+id+'/deliver',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({app_url:url})});
    setDelivering(false);
    R();
  }

  if(L) return(<div className="max-w-[900px] mx-auto py-20 space-y-4" style={{padding:'60px 40px'}}>{[1,2].map(i=><div key={i} className="card-pinned relative overflow-hidden" style={{padding:'24px'}}><div className="skeleton h-6 w-2/3"/><div className="skeleton h-4 w-full"/></div>)}</div>);
  if(!p) return(<div className="text-center py-28 serif text-xl text-[#665c56] italic">这个想法已经随风飘走了。</div>);

  let ts: string[] = []; try { ts = JSON.parse(p.tags) } catch {}
  const delivered = !!p.delivered_at;

  return(
    <main className="max-w-[900px] mx-auto" style={{padding:'30px 20px'}}>
      <Link href="/" className="inline-flex items-center gap-1.5 text-[13px] text-[#665c56] hover:text-[#a8573e] mb-10 lg:mb-12 transition-colors italic">
        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg><span className="whitespace-nowrap">返回广场</span>
      </Link>

      <article>
        {ts.length>0 && <p className="text-[11px] font-semibold uppercase text-[#a8573e] tracking-[0.8px] mb-2.5">{ts[0]}</p>}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-5">
          <h1 className="serif font-bold text-[#1a1a1a] leading-[115%]" style={{fontSize:'clamp(28px,3.5vw,38px)'}}>{p.title}</h1>
          <div className="shrink-0 flex items-center gap-3">
            {delivered ? (
              <span className="inline-flex items-center gap-2 px-4 py-2 text-[14px] font-medium text-[#665c56] rounded-md"
                style={{background:'#f3ede4'}}>
                ✓ {p.claimed_by} 已交付{p.app_url && <a href={p.app_url} target="_blank" rel="noopener" className="ml-2 text-[#a8573e] underline text-[12px]">查看作品</a>}
              </span>
            ) : p.claimed_by ? (
              <>
                <span className="inline-flex items-center gap-2 px-4 py-2 text-[14px] font-medium text-[#665c56] rounded-md"
                  style={{background:'#f3ede4'}}>
                  {p.claimed_by} 正在制作
                </span>
                <button onClick={deliver} disabled={delivering}
                  className="px-[22px] py-2 text-[14px] font-semibold text-white rounded-md transition-all"
                  style={{background:'#a8573e'}}>
                  {delivering?'交付中...':'标记交付'}
                </button>
              </>
            ) : (
              <button onClick={()=>setSh(!sh)} className="px-[26px] py-3 text-[15px] font-semibold text-white rounded-md transition-all duration-200"
                style={{background:'#a8573e',boxShadow:'0 2px 8px rgba(168,87,62,0.18)'}}
                onMouseEnter={v=>v.currentTarget.style.background='#b9684c'}
                onMouseLeave={v=>v.currentTarget.style.background='#a8573e'}>
                {p.bounty>0?'接单赚 ¥'+p.bounty:'我来实现'}
              </button>
            )}
          </div>
        </div>
        <p className="text-[13px] text-[#665c56] mb-6">{fmt(p.created_at)}</p>

        {sh && !p.claimed_by && (
          <div className="card-pinned relative overflow-hidden mb-12" style={{padding:'24px'}}>
            <p className="serif text-lg italic text-[#1a1a1a] mb-4">太棒了！你的名字是？</p>
            <form onSubmit={cl} className="space-y-4">
              <input value={bn} onChange={v=>setBn(v.target.value)} placeholder="你的名字"
                className="w-full px-3 py-3 text-[14px] text-[#1a1a1a] placeholder-[#a9a39b] rounded outline-none transition-all"
                style={{border:'1px solid #c9beb4',marginBottom:'16px'}}/>
              <input value={au} onChange={v=>setAu(v.target.value)} placeholder="作品链接（完成后更新）"
                className="w-full px-3 py-3 text-[14px] text-[#1a1a1a] placeholder-[#a9a39b] rounded outline-none transition-all"
                style={{border:'1px solid #c9beb4',marginBottom:'16px'}}/>
              <div className="flex gap-3">
                <button className="px-[22px] py-2.5 text-[14px] text-white rounded-md font-medium transition-all"
                  style={{background:'#a8573e'}}>
                  {p.bounty>0?'确认接单（赏金 ¥'+p.bounty+'）':'确认认领'}
                </button>
                <button type="button" onClick={()=>setSh(false)}
                  className="px-[22px] py-2.5 text-[14px] text-[#665c56] font-medium italic hover:text-[#a8573e] transition-colors">算了</button>
              </div>
            </form>
          </div>
        )}

        {p.app_url && !delivered && (
          <a href={p.app_url} target="_blank" rel="noopener"
            className="inline-flex items-center gap-2 mb-8 px-5 py-3 text-[14px] font-semibold text-white rounded-md transition-all"
            style={{background:'#a8573e',boxShadow:'0 2px 8px rgba(168,87,62,0.18)'}}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
            查看作品
          </a>
        )}

        <div className="text-[#1a1a1a] leading-[170%] font-light whitespace-pre-wrap"
          style={{fontSize:'clamp(14px,1.5vw,16px)',marginBottom:'40px'}}>
          {p.description}
        </div>

        {/* Target user & pain points if AI-analyzed */}
        {(p.target_user || p.pain_points) && (
          <div className="card-pinned relative overflow-hidden mb-10" style={{padding:'20px 24px'}}>
            {p.target_user && (
              <div className="mb-3">
                <span className="text-[11px] font-semibold uppercase text-[#a8573e] tracking-[0.8px]">目标用户</span>
                <p className="text-[14px] text-[#665c56] mt-1">{p.target_user}</p>
              </div>
            )}
            {p.pain_points && (
              <div>
                <span className="text-[11px] font-semibold uppercase text-[#a8573e] tracking-[0.8px]">核心痛点</span>
                <p className="text-[14px] text-[#665c56] mt-1">{p.pain_points}</p>
              </div>
            )}
          </div>
        )}

        <div style={{height:'1.2px',background:'#d9c9bc',width:'100%',margin:'40px 0'}} />

        <div className="flex items-center gap-4 lg:gap-6 pb-6 flex-nowrap">
          <button onClick={up} className="flex items-center gap-1.5 text-[14px] text-[#665c56] hover:text-[#a8573e] transition-colors whitespace-nowrap">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
            {p.upvotes}
          </button>
          <span className="flex items-center gap-1.5 text-[14px] text-[#665c56] whitespace-nowrap">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
            {p.comments?.length||0} 条回应
          </span>
          <span className="text-[12px] text-[#665c56] ml-auto italic">{fmt(p.created_at)}</span>
        </div>
      </article>

      <section style={{marginBottom:'48px'}}>
        <h2 className="serif font-semibold text-[#1a1a1a] mb-6" style={{fontSize:'clamp(20px,2.5vw,24px)'}}>
          回应（{p.comments?.length||0}）
        </h2>
        {(!p.comments||p.comments.length===0)?(
          <div className="text-center py-14 card-pinned relative overflow-hidden" style={{padding:'18px'}}>
            <p className="serif text-lg italic text-[#665c56] mb-1">还没有回应</p>
            <p className="text-[14px] text-[#665c56] font-light">来第一个回应吧。</p>
          </div>
        ):(
          <div className="space-y-4 mb-8">
            {p.comments.map(cm=>(<div key={cm.id} className="card-pinned relative overflow-hidden" style={{padding:'18px'}}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center serif text-[#a8573e] text-sm font-bold italic"
                  style={{background:'rgba(168,87,62,0.1)'}}>{cm.author_name.charAt(0)}</div>
                <span className="text-[14px] font-semibold text-[#1a1a1a]">{cm.author_name}</span>
                <span className="text-[11px] text-[#665c56] italic">{fmt(cm.created_at)}</span>
              </div>
              <p className="text-[14px] text-[#665c56] leading-[160%] ml-11 font-light">{cm.content}</p>
            </div>))}
          </div>
        )}
        <form onSubmit={cm} className="card-pinned relative overflow-hidden" style={{padding:'24px'}}>
          <input value={n} onChange={v=>setN(v.target.value)} placeholder="你的名字（选填）"
            className="w-full px-3 py-3 text-[14px] text-[#1a1a1a] placeholder-[#a9a39b] bg-transparent border-0 border-b outline-none transition-all mb-4"
            style={{borderColor:'#c9beb4'}}/>
          <textarea rows={3} value={c} onChange={v=>setC(v.target.value)} placeholder="你有什么想法？"
            className="w-full px-3 py-3 text-[14px] text-[#1a1a1a] placeholder-[#a9a39b] bg-transparent rounded resize-none outline-none transition-all mb-4"
            style={{border:'1px solid #c9beb4',lineHeight:'160%'}}/>
          <div className="flex justify-end">
            <button disabled={S||!c.trim()} className="px-[22px] py-2.5 text-[14px] text-white rounded-md font-medium disabled:opacity-20 transition-all"
              style={{background:'#a8573e'}}>回应</button>
          </div>
        </form>
      </section>
    </main>
  );
}
function fmt(s:string):string{const d=new Date(s+'Z'),df=Date.now()-d.getTime();const m=Math.floor(df/6e4),h=Math.floor(df/36e5),D=Math.floor(df/864e5);if(m<1)return'just now';if(m<60)return m+'m ago';if(h<24)return h+'h ago';if(D<7)return D+'d ago';return d.toLocaleDateString('en-US')}
