'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

interface P {
  id: number; title: string; description: string; tags: string;
  upvotes: number; comment_count: number; claimed_by: string | null;
  app_url: string | null; created_at: string; bounty: number;
  delivered_at: string | null;
}

const ALL_TAGS = ['生产力','AI','社交','健康','教育','生活方式','开发工具','职业发展','内容消费','社区','共享经济','远程办公','本地生活','心理健康','宠物','学习','协作','金融','游戏','音乐','旅行'];

function HandDrawnLine({width,className}:{width?:string,className?:string}) {
  return (
    <svg className={className} width={width||'60%'} height="8" viewBox="0 0 200 8" fill="none">
      <path className="hand-line draw-anim" d="M3,4.2 Q25,1 55,4.5 Q80,7 110,4 Q140,1.5 165,4.8 Q180,6 197,4"/>
    </svg>
  );
}

export default function Home(){
  const [posts, setPosts] = useState<P[]>([]);
  const [sort, setSort] = useState<'hot'|'new'>('hot');
  const [tag, setTag] = useState('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ sort });
    if (tag) params.set('tag', tag);
    if (search) params.set('search', search);
    fetch('/api/posts?' + params.toString())
      .then(r => r.json())
      .then(d => { setPosts(d); setLoading(false); });
  }, [sort, tag, search]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  return (
    <main className="max-w-6xl mx-auto">
      {/* === Hero === */}
      <section className="min-h-[40vh] lg:min-h-[50vh] px-5 lg:px-[60px] flex flex-col justify-center"
        style={{display:'grid',alignItems:'center'}}>
        <div className="flex-1 max-w-[580px]" style={{paddingTop:'60px'}}>
          <HandDrawnLine className="mb-4" />
          <h1 className="serif font-bold text-[#1a1a1a] leading-[110%] tracking-[1px]"
            style={{fontSize:'clamp(32px,4.5vw,48px)',marginBottom:'20px'}}>
            Trade Sparks,<br/>
            <span className="italic font-medium text-[#a8573e]"
              style={{fontSize:'clamp(28px,4vw,42px)'}}>Not Templates</span>
          </h1>
          <HandDrawnLine className="mb-5" />
          <p className="text-[#665c56] leading-[160%] font-light max-w-[520px]"
            style={{fontSize:'clamp(14px,1.5vw,16px)',marginBottom:'32px'}}>
            IdeaForge — 悬赏创意广场：发布你的 App 想法并设置赏金，Builder 认领制作、交付拿钱。
          </p>

          {/* Search bar */}
          <form onSubmit={e => { e.preventDefault(); setSearch(searchInput.trim()); }}
            className="flex items-center gap-2 max-w-[480px] mb-4">
            <input value={searchInput} onChange={e => setSearchInput(e.target.value)}
              placeholder="搜索想法..."
              className="flex-1 px-4 py-2.5 text-[14px] text-[#1a1a1a] placeholder-[#a9a39b] rounded-lg outline-none transition-all"
              style={{border:'1px solid #c9beb4',background:'#fdfaf5'}}/>
            <button type="submit"
              className="px-5 py-2.5 text-[14px] font-medium text-white rounded-lg transition-all"
              style={{background:'#a8573e'}}>搜索</button>
            {(search || tag) && (
              <button type="button" onClick={() => { setSearch(''); setSearchInput(''); setTag(''); }}
                className="text-[12px] text-[#665c56] italic hover:text-[#a8573e] transition-colors">清除</button>
            )}
          </form>

          {/* Sort + Tags */}
          <div className="flex items-center flex-wrap gap-2">
            <span className="serif text-[#665c56] text-sm italic mr-1">浏览</span>
            <button onClick={()=>setSort('hot')}
              className="px-[14px] py-1.5 rounded text-[13px] font-medium transition-colors"
              style={sort==='hot'?{background:'#d9c9bc',color:'#1a1a1a'}:{color:'#665c56'}}>热门</button>
            <button onClick={()=>setSort('new')}
              className="px-[14px] py-1.5 rounded text-[13px] font-medium transition-colors"
              style={sort==='new'?{background:'#d9c9bc',color:'#1a1a1a'}:{color:'#665c56'}}>最新</button>
            <span className="text-[#c9beb4] mx-1">|</span>
            {ALL_TAGS.slice(0,8).map(t => (
              <button key={t} onClick={() => setTag(tag===t?'':t)}
                className="px-[10px] py-1 rounded text-[11px] font-medium transition-colors"
                style={tag===t?{background:'#a8573e',color:'#fff'}:{color:'#a8573e',border:'1px solid #d9c9bc'}}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Fixed Post button */}
      <Link href="/posts/new"
        className="hidden lg:flex fixed z-40 items-center justify-center"
        style={{
          right:'40px',top:'280px',width:'160px',padding:'18px 12px',
          borderRadius:'12px',background:'#a8573e',color:'#fff',
          fontSize:'15px',fontWeight:600,boxShadow:'0 4px 12px rgba(168,87,62,0.22)',
          transition:'0.2s ease'
        }}
        onMouseEnter={e=>{e.currentTarget.style.background='#b9684c';e.currentTarget.style.transform='scale(1.03)'}}
        onMouseLeave={e=>{e.currentTarget.style.background='#a8573e';e.currentTarget.style.transform='scale(1)'}}>
        发布悬赏
      </Link>

      <Link href="/posts/new"
        className="lg:hidden fixed z-40 flex items-center justify-center"
        style={{
          bottom:'30px',right:'20px',width:'130px',padding:'14px 8px',
          borderRadius:'12px',background:'#a8573e',color:'#fff',
          fontSize:'15px',fontWeight:600,boxShadow:'0 4px 12px rgba(168,87,62,0.22)'
        }}>
        发布悬赏
      </Link>

      {/* === Card Grid === */}
      <section style={{padding:'0 20px',margin:'40px 0 80px'}}
        className="lg:px-[60px] lg:mx-0">
        {tag && (
          <p className="text-[13px] text-[#665c56] italic mb-5">
            筛选标签：<span className="font-semibold text-[#a8573e]">{tag}</span>
            {posts.length > 0 && `（${posts.length} 个结果）`}
          </p>
        )}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-7 lg:gap-x-8 lg:gap-y-10">
            {[1,2,3,4].map(i=><div key={i} className="card-pinned relative overflow-hidden" style={{padding:'24px'}}><div className="skeleton h-5 w-2/3" style={{marginBottom:'12px'}}/><div className="skeleton h-4 w-full" style={{marginBottom:'10px'}}/><div className="skeleton h-4 w-1/2"/></div>)}
          </div>
        ) : posts.length===0 ? (
          <div className="flex flex-col items-center justify-center py-24 lg:py-32">
            <h2 className="serif text-[#4a4540] italic font-medium mb-4"
              style={{fontSize:'clamp(1.6rem,3.5vw,2.2rem)'}}>没有找到匹配的想法</h2>
            <p className="text-[#665c56] text-center max-w-md leading-relaxed font-light mb-9"
              style={{fontSize:'clamp(14px,1.5vw,16px)'}}>
              换个关键词试试，或者发布第一个悬赏吧。
            </p>
            <Link href="/posts/new" className="inline-block px-7 py-3 border border-[#1a1a1a] text-[#1a1a1a] text-[13px] font-medium rounded-full hover:bg-[#1a1a1a] hover:text-[#f8f5ee] transition-all duration-200">
              发布悬赏
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-7 lg:gap-x-8 lg:gap-y-10">
            {posts.map((p,i)=>{
              let tags:string[]=[];
              try{tags=JSON.parse(p.tags)}catch{}
              const delivered = !!p.delivered_at;
              return (
                <Link key={p.id} href={'/posts/'+p.id} className="block group animate-in"
                  style={{animationDelay:i*50+'ms'}}>
                  <article className="card-pinned relative overflow-hidden" style={{padding:'24px'}}>
                    {tags.length>0 && (
                      <p className="text-[11px] font-semibold uppercase text-[#a8573e] tracking-[0.8px]" style={{marginBottom:'12px'}}>
                        {tags[0]}
                      </p>
                    )}
                    <h3 className="serif font-semibold text-[20px] leading-[120%] text-[#1a1a1a] group-hover:text-[#a8573e] transition-colors"
                      style={{marginBottom:'10px'}}>
                      {p.title}
                    </h3>
                    <p className="text-[14px] font-normal leading-[160%] text-[#665c56] line-clamp-2"
                      style={{marginBottom:'20px'}}>
                      {p.description}
                    </p>
                    <div style={{height:'1px',background:'#d9c9bc',marginBottom:'14px',opacity:0.8}} />
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center gap-1 text-[12px] font-medium ${p.claimed_by?'text-[#665c56]':'text-[#a8573e]'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${delivered?'bg-[#665c56]':p.claimed_by?'bg-[#d9c9bc]':'bg-[#a8573e]'}`}/>
                        {delivered?'已交付':p.claimed_by?'已认领':'待认领'}
                      </span>
                      <div className="flex items-center gap-3 text-[12px] text-[#665c56]">
                        {p.bounty > 0 && <span className="font-bold text-[#a8573e]">¥{p.bounty}</span>}
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
