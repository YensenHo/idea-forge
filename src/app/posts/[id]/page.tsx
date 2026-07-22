'use client';
import {useEffect,useState,use} from 'react';
import Link from 'next/link';
interface C{id:number;author_name:string;content:string;created_at:string}
interface P{id:number;title:string;description:string;target_user:string;pain_points:string;tags:string;upvotes:number;claimed_by:string|null;app_url:string|null;created_at:string;comments:C[]}

export default function Detail({params}:{params:Promise<{id:string}>}){
  const{id}=use(params);const[p,setP]=useState<P|null>(null);const[L,setL]=useState(true);
  const[c,setC]=useState('');const[n,setN]=useState('');const[S,setS]=useState(false);
  const[sh,setSh]=useState(false);const[bn,setBn]=useState('');const[au,setAu]=useState('');

  function R(){fetch('/api/posts/'+id).then(r=>r.json()).then(d=>{setP(d);setL(false)})}
  useEffect(()=>{R()},[id]);
  async function up(){await fetch('/api/posts/'+id+'/upvote',{method:'POST'});R()}
  async function cm(ev:React.FormEvent){ev.preventDefault();if(!c.trim())return;setS(true);await fetch('/api/posts/'+id+'/comments',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({content:c,author_name:n})});setC('');setS(false);R()}
  async function cl(ev:React.FormEvent){ev.preventDefault();await fetch('/api/posts/'+id+'/claim',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({builder_name:bn,app_url:au})});setSh(false);R()}

  if(L)return(<div className="max-w-[900px] mx-auto py-20 space-y-4" style={{padding:'60px 40px'}}>{[1,2].map(i=><div key={i} className="card-pinned relative overflow-hidden" style={{padding:'24px'}}><div className="skeleton h-6 w-2/3"/><div className="skeleton h-4 w-full"/></div>)}</div>);
  if(!p)return(<div className="text-center py-28 serif text-xl text-[#665c56] italic">This spark has drifted away.</div>);

  let ts:string[]=[];try{ts=JSON.parse(p.tags)}catch{}

  return(
    <main className="max-w-[900px] mx-auto" style={{padding:'30px 20px'}}>
      <Link href="/" className="inline-flex items-center gap-1.5 text-[13px] text-[#665c56] hover:text-[#a8573e] mb-10 lg:mb-12 transition-colors italic">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>Back to the wall
      </Link>

      <article>
        {ts.length>0&&<p className="text-[11px] font-semibold uppercase text-[#a8573e] tracking-[0.8px] mb-2.5">{ts[0]}</p>}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-5">
          <h1 className="serif font-bold text-[#1a1a1a] leading-[115%]" style={{fontSize:'clamp(28px,3.5vw,38px)'}}>{p.title}</h1>
          <div className="shrink-0">
            {p.claimed_by?(
              <span className="inline-flex items-center gap-2 px-4 py-2 text-[14px] font-medium text-[#665c56] bg-[#f3ede4] rounded-md">Claimed by {p.claimed_by}</span>
            ):(
              <button onClick={()=>setSh(!sh)} className="px-[26px] py-3 text-[15px] font-semibold text-white rounded-md transition-all duration-200"
                style={{background:'#a8573e',boxShadow:'0 2px 8px rgba(168,87,62,0.18)'}}
                onMouseEnter={v=>v.currentTarget.style.background='#b9684c'}
                onMouseLeave={v=>v.currentTarget.style.background='#a8573e'}>I&apos;ll forge this</button>
            )}
          </div>
        </div>
        <p className="text-[13px] text-[#665c56] mb-6">{fmt(p.created_at)}</p>

        {sh&&!p.claimed_by&&(
          <div className="card-pinned relative overflow-hidden mb-12" style={{padding:'24px'}}>
            <p className="serif text-lg italic text-[#1a1a1a] mb-4">Wonderful. Who shall we credit?</p>
            <form onSubmit={cl} className="space-y-4">
              <input value={bn} onChange={v=>setBn(v.target.value)} placeholder="Your name"
                className="w-full px-3 py-3 text-[14px] text-[#1a1a1a] placeholder-[#a9a39b] rounded outline-none transition-all"
                style={{border:'1px solid #c9beb4',marginBottom:'16px'}}/>
              <input value={au} onChange={v=>setAu(v.target.value)} placeholder="A link to your creation (when ready)"
                className="w-full px-3 py-3 text-[14px] text-[#1a1a1a] placeholder-[#a9a39b] rounded outline-none transition-all"
                style={{border:'1px solid #c9beb4',marginBottom:'16px'}}/>
              <div className="flex gap-3">
                <button className="px-[22px] py-2.5 text-[14px] text-white rounded-md font-medium transition-all"
                  style={{background:'#a8573e'}}>Claim this spark</button>
                <button type="button" onClick={()=>setSh(false)}
                  className="px-[22px] py-2.5 text-[14px] text-[#665c56] font-medium italic hover:text-[#a8573e] transition-colors">Never mind</button>
              </div>
            </form>
          </div>
        )}

        {p.app_url&&(
          <a href={p.app_url} target="_blank" rel="noopener"
            className="inline-flex items-center gap-2 mb-8 px-5 py-3 text-[14px] font-semibold text-white rounded-md transition-all"
            style={{background:'#a8573e',boxShadow:'0 2px 8px rgba(168,87,62,0.18)'}}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
            See what was built
          </a>
        )}

        <div className="text-[#1a1a1a] leading-[170%] font-light whitespace-pre-wrap"
          style={{fontSize:'clamp(14px,1.5vw,16px)',marginBottom:'40px'}}>
          {p.description}
        </div>

        <div style={{height:'1.2px',background:'#d9c9bc',width:'100%',margin:'40px 0'}} />

        <div className="flex items-center gap-6 pb-6">
          <button onClick={up} className="flex items-center gap-1.5 text-[14px] text-[#665c56] hover:text-[#a8573e] transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
            {p.upvotes}
          </button>
          <span className="flex items-center gap-1.5 text-[14px] text-[#665c56]">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
            {p.comments?.length||0} responses
          </span>
          <span className="text-[12px] text-[#665c56] ml-auto italic">{fmt(p.created_at)}</span>
        </div>
      </article>

      <section style={{marginBottom:'48px'}}>
        <h2 className="serif font-semibold text-[#1a1a1a] mb-6" style={{fontSize:'clamp(20px,2.5vw,24px)'}}>
          Responses ({p.comments?.length||0})
        </h2>
        {(!p.comments||p.comments.length===0)?(
          <div className="text-center py-14 card-pinned relative overflow-hidden" style={{padding:'18px'}}>
            <p className="serif text-lg italic text-[#665c56] mb-1">Silence, for now.</p>
            <p className="text-[14px] text-[#665c56] font-light">Be the first to respond.</p>
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
          <input value={n} onChange={v=>setN(v.target.value)} placeholder="Your name (optional)"
            className="w-full px-3 py-3 text-[14px] text-[#1a1a1a] placeholder-[#a9a39b] bg-transparent border-0 border-b outline-none transition-all mb-4"
            style={{borderColor:'#c9beb4'}}/>
          <textarea rows={3} value={c} onChange={v=>setC(v.target.value)} placeholder="What do you think?"
            className="w-full px-3 py-3 text-[14px] text-[#1a1a1a] placeholder-[#a9a39b] bg-transparent rounded resize-none outline-none transition-all mb-4"
            style={{border:'1px solid #c9beb4',lineHeight:'160%'}}/>
          <div className="flex justify-end">
            <button disabled={S||!c.trim()} className="px-[22px] py-2.5 text-[14px] text-white rounded-md font-medium disabled:opacity-20 transition-all"
              style={{background:'#a8573e'}}>Respond</button>
          </div>
        </form>
      </section>
    </main>
  );
}
function fmt(s:string):string{const d=new Date(s+'Z'),df=Date.now()-d.getTime();const m=Math.floor(df/6e4),h=Math.floor(df/36e5),D=Math.floor(df/864e5);if(m<1)return'just now';if(m<60)return m+'m ago';if(h<24)return h+'h ago';if(D<7)return D+'d ago';return d.toLocaleDateString('en-US')}
