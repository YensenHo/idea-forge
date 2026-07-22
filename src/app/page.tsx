'use client';
import { useEffect,useState } from 'react';
import Link from 'next/link';
interface P{id:number;title:string;description:string;tags:string;upvotes:number;comment_count:number;claimed_by:string|null;app_url:string|null;created_at:string}

function HandDrawnLine({width,className}:{width?:string,className?:string}) {
  return (
    <svg className={className} width={width||'60%'} height="8" viewBox="0 0 200 8" fill="none">
      <path className="hand-line draw-anim" d="M3,4.2 Q25,1 55,4.5 Q80,7 110,4 Q140,1.5 165,4.8 Q180,6 197,4"/>
    </svg>
  );
}

export default function Home(){
  const [posts,setPosts]=useState<P[]>([]);
  const [sort,setSort]=useState<'hot'|'new'>('hot');
  const [loading,setLoading]=useState(true);
  useEffect(()=>{fetch('/api/posts?sort='+sort).then(r=>r.json()).then(d=>{setPosts(d);setLoading(false)})},[sort]);

  return (
    <main className="max-w-6xl mx-auto">
      {/* === Hero === */}
      <section className="min-h-[60vh] lg:min-h-[72vh] px-5 lg:px-[60px] flex flex-col justify-center"
        style={{display:'grid',alignItems:'center'}}>
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-0">
          {/* Left: text block */}
          <div className="flex-1 max-w-[580px]"
            style={{paddingTop:'80px'}}>
            <HandDrawnLine className="mb-4" />
            <h1 className="serif font-bold text-[#1a1a1a] leading-[110%] tracking-[1px]"
              style={{fontSize:'clamp(36px,5vw,52px)',marginBottom:'24px'}}>
              Trade Sparks,<br/>
              <span className="italic font-medium text-[#a8573e]"
                style={{fontSize:'clamp(31px,4.5vw,48px)'}}>Not Templates</span>
            </h1>
            <HandDrawnLine className="mb-6" />
            <p className="text-[#665c56] leading-[160%] font-light max-w-[580px]"
              style={{fontSize:'clamp(14px,1.5vw,16px)',marginBottom:'40px'}}>
              IdeaForge — Creative spark exchange: Seekers post app concepts, Builders claim & build original works. Trade Sparks, Not Templates.
            </p>
            <div className="flex items-center flex-wrap gap-4"
              style={{padding:'12px 16px',border:'1px solid #c9beb4',borderRadius:'8px',background:'rgba(249,245,240,0.4)'}}>
              <div className="flex items-center gap-2">
                <span className="serif text-[#665c56] text-sm italic">Explore ideas</span>
                <div className="flex gap-1">
                  <button onClick={()=>setSort('hot')}
                    className="px-[14px] py-2 rounded text-[14px] font-medium transition-colors"
                    style={sort==='hot'?{background:'#d9c9bc',color:'#1a1a1a'}:{color:'#665c56'}}>Trending</button>
                  <button onClick={()=>setSort('new')}
                    className="px-[14px] py-2 rounded text-[14px] font-medium transition-colors"
                    style={sort==='new'?{background:'#d9c9bc',color:'#1a1a1a'}:{color:'#665c56'}}>Latest</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fixed Post button — desktop only */}
      <Link href="/posts/new"
        className="hidden lg:flex fixed z-40 items-center justify-center"
        style={{
          right:'40px',top:'320px',width:'160px',padding:'18px 12px',
          borderRadius:'12px',background:'#a8573e',color:'#fff',
          fontSize:'15px',fontWeight:600,boxShadow:'0 4px 12px rgba(168,87,62,0.22)',
          transition:'0.2s ease'
        }}
        onMouseEnter={e=>{e.currentTarget.style.background='#b9684c';e.currentTarget.style.transform='scale(1.03)'}}
        onMouseLeave={e=>{e.currentTarget.style.background='#a8573e';e.currentTarget.style.transform='scale(1)'}}>
        Post an idea
      </Link>

      {/* Mobile fixed button */}
      <Link href="/posts/new"
        className="lg:hidden fixed z-40 flex items-center justify-center"
        style={{
          bottom:'30px',right:'20px',width:'130px',padding:'14px 8px',
          borderRadius:'12px',background:'#a8573e',color:'#fff',
          fontSize:'15px',fontWeight:600,boxShadow:'0 4px 12px rgba(168,87,62,0.22)'
        }}>
        Post an idea
      </Link>

      {/* === Card Grid === */}
      <section style={{padding:'0 20px',margin:'60px 0'}}
        className="lg:px-[60px] lg:mx-0">
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-7 lg:gap-x-8 lg:gap-y-10">
            {[1,2,3,4].map(i=><div key={i} className="card-pinned relative overflow-hidden" style={{padding:'24px'}}><div className="skeleton h-5 w-2/3" style={{marginBottom:'12px'}}/><div className="skeleton h-4 w-full" style={{marginBottom:'10px'}}/><div className="skeleton h-4 w-1/2"/></div>)}
          </div>
        ) : posts.length===0 ? (
          <div className="flex flex-col items-center justify-center py-24 lg:py-32">
            <h2 className="serif text-[#4a4540] italic font-medium mb-4"
              style={{fontSize:'clamp(1.6rem,3.5vw,2.2rem)'}}>A blank canvas</h2>
            <p className="text-[#665c56] text-center max-w-md leading-relaxed font-light mb-9"
              style={{fontSize:'clamp(14px,1.5vw,16px)'}}>
              Every great app started as a fleeting thought scribbled on a napkin.<br/>
              Yours is waiting to be pinned to this wall.
            </p>
            <Link href="/posts/new" className="inline-block px-7 py-3 border border-[#1a1a1a] text-[#1a1a1a] text-[13px] font-medium rounded-full hover:bg-[#1a1a1a] hover:text-[#f8f5ee] transition-all duration-200">
              Pin the first idea
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-7 lg:gap-x-8 lg:gap-y-10">
            {posts.map((p,i)=>{
              let tags:string[]=[];
              try{tags=JSON.parse(p.tags)}catch{}
              return (
                <Link key={p.id} href={'/posts/'+p.id} className="block group animate-in"
                  style={{animationDelay:i*50+'ms'}}>
                  <article className="card-pinned relative overflow-hidden" style={{padding:'24px'}}>
                    {/* category tag */}
                    {tags.length>0 && (
                      <p className="text-[11px] font-semibold uppercase text-[#a8573e] tracking-[0.8px]" style={{marginBottom:'12px'}}>
                        {tags[0]}
                      </p>
                    )}
                    {/* title */}
                    <h3 className="serif font-semibold text-[20px] leading-[120%] text-[#1a1a1a] group-hover:text-[#a8573e] transition-colors"
                      style={{marginBottom:'10px'}}>
                      {p.title}
                    </h3>
                    {/* description */}
                    <p className="text-[14px] font-normal leading-[160%] text-[#665c56] line-clamp-2"
                      style={{marginBottom:'20px'}}>
                      {p.description}
                    </p>
                    {/* divider */}
                    <div style={{height:'1px',background:'#d9c9bc',marginBottom:'14px',opacity:0.8}} />
                    {/* bottom bar */}
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center gap-1 text-[12px] font-medium ${p.claimed_by?'text-[#665c56]':'text-[#a8573e]'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${p.claimed_by?'bg-[#665c56]':'bg-[#a8573e]'}`}/>
                        {p.claimed_by?'Claimed':'Open'}
                      </span>
                      <div className="flex items-center gap-3 text-[12px] text-[#665c56]">
                        <span className="flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                          {p.upvotes}
                        </span>
                        <span className="italic">{fmt(p.created_at)}</span>
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
function fmt(s:string):string{const d=new Date(s+'Z'),df=Date.now()-d.getTime();const m=Math.floor(df/6e4),h=Math.floor(df/36e5),D=Math.floor(df/864e5);if(m<1)return'just now';if(m<60)return m+'m ago';if(h<24)return h+'h ago';if(D<7)return D+'d ago';return d.toLocaleDateString('en-US')}
