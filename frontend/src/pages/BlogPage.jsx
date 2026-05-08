import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import blogService from '../services/blogService';
import BlogCard from '../components/blog/BlogCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const BlogPage = () => {
  const [posts,            setPosts]            = useState([]);
  const [loading,          setLoading]          = useState(true);
  const [error,            setError]            = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchTerm,       setSearchTerm]       = useState('');

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await blogService.getAll({ page:0, size:50 });
        setPosts(data.content || data || []);
      } catch {
        setError('Unable to load posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const categories = ['ALL','SERMON','ANNOUNCEMENT','TESTIMONY','NEWS','RESOURCE','DEVOTIONAL','YOUTH','COMMUNITY'];
  const CAT_STYLE  = { SERMON:{bg:'rgba(37,96,64,.1)',text:'#256040'}, ANNOUNCEMENT:{bg:'rgba(201,168,76,.15)',text:'#7d5b00'}, TESTIMONY:{bg:'rgba(180,60,60,.08)',text:'#8a2020'}, NEWS:{bg:'rgba(30,80,140,.08)',text:'#1e508c'}, RESOURCE:{bg:'rgba(60,60,180,.08)',text:'#3c3cb4'} };
  const ACCENT     = { SERMON:'#1a4731', ANNOUNCEMENT:'#c9a84c', TESTIMONY:'#7a2020', NEWS:'#1e508c', RESOURCE:'#3c3cb4' };

  const filtered = posts.filter(p => {
    const matchCat    = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchSearch = !searchTerm || p.title.toLowerCase().includes(searchTerm.toLowerCase()) || (p.excerpt||'').toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  // Helper — turns a relative /api/v1/media/files/... URL into an absolute URL
  const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `http://localhost:8080${url}`;
  };

  const formatDate = d => new Date(d).toLocaleDateString('en-ZA', { year:'numeric', month:'long', day:'numeric' });

  const featured = posts[0] || null;

  return (
    <div style={{ fontFamily:"'Lato',sans-serif", paddingTop:64 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Lato:wght@300;400;700&display=swap');
        .blog-card{background:#fff;border-radius:12px;border:1px solid rgba(0,0,0,.07);overflow:hidden;transition:all .3s;}
        .blog-card:hover{transform:translateY(-4px);box-shadow:0 16px 40px rgba(26,71,49,.12);}
        .cat-pill{padding:8px 18px;border-radius:20px;font-family:'Lato',sans-serif;font-size:12px;cursor:pointer;transition:all .2s;border:1px solid rgba(26,71,49,.2);background:#fff;color:#3d5247;}
        .cat-pill.active{background:#1a4731;color:#fff;border-color:#1a4731;}
        .cat-pill:hover:not(.active){border-color:#1a4731;}`}</style>

      {/* HERO */}
      <div style={{ background:'linear-gradient(150deg,#071812,#0d2b1a 50%,#1a4731)', padding:'120px 24px 80px', textAlign:'center' }}>
        <span style={{ fontFamily:'Lato,sans-serif', fontSize:10, fontWeight:700, letterSpacing:'.24em', color:'#c9a84c', display:'block', marginBottom:12 }}>FROM THE COMMUNITY</span>
        <h1 style={{ fontFamily:'Georgia,serif', fontSize:'clamp(2.4rem,5vw,4rem)', fontWeight:700, color:'#fff', lineHeight:1.1, marginBottom:16 }}>Blog & Resources</h1>
        <p style={{ fontFamily:'Lato,sans-serif', fontSize:15, color:'rgba(255,255,255,.6)', maxWidth:500, margin:'0 auto', lineHeight:1.8 }}>
          Sermons, announcements, testimonies and resources from our community.
        </p>
      </div>

      {/* FEATURED POST */}
      {featured && (
      <section style={{ background:'#f7f9f7', padding:'60px 24px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <span style={{ fontFamily:'Lato,sans-serif', fontSize:10, fontWeight:700, letterSpacing:'.22em', color:'#c9a84c', display:'block', marginBottom:20 }}>FEATURED</span>
          <div style={{ background:'#fff', borderRadius:14, overflow:'hidden', border:'1px solid rgba(0,0,0,.07)', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))' }}>
            <div style={{ 
              background: featured.featuredImageUrl 
                ? `url(${featured.featuredImageUrl.startsWith('http') ? featured.featuredImageUrl : 'http://localhost:8080' + featured.featuredImageUrl}) center/cover no-repeat`
                : 'linear-gradient(135deg,#1a4731,#40916c)', 
              minHeight:280, display:'flex', alignItems:'center', justifyContent:'center', padding:40 
            }}>
              {!featured.featuredImageUrl && (
                <span style={{ fontFamily:'Georgia,serif', fontSize:80, color:'rgba(255,255,255,.12)', fontStyle:'italic' }}>✝</span>
              )}
            </div>
            <div style={{ padding:'36px 40px' }}>
              <span style={{ fontSize:10, fontWeight:700, letterSpacing:'.16em', padding:'4px 12px', borderRadius:3, background:CAT_STYLE[featured.category]?.bg, color:CAT_STYLE[featured.category]?.text }}>
                {featured.category}
              </span>
              <h2 style={{ fontFamily:'Georgia,serif', fontSize:'clamp(1.4rem,2.5vw,2rem)', fontWeight:700, color:'#0d2b1a', lineHeight:1.3, margin:'14px 0 12px' }}>{featured.title}</h2>
              <p style={{ fontSize:14, color:'#6b8070', lineHeight:1.8, marginBottom:20 }}>{featured.excerpt}</p>
              <div style={{ display:'flex', gap:12, alignItems:'center', marginBottom:24, flexWrap:'wrap' }}>
                <div style={{ width:36, height:36, borderRadius:'50%', background:'#1a4731', border:'2px solid #c9a84c', display:'flex', alignItems:'center', justifyContent:'center', color:'#c9a84c', fontWeight:700, fontSize:12, fontFamily:'Georgia,serif', flexShrink:0 }}>
                  {(featured.authorName || 'A').split(' ').map(w=>w[0]).join('').slice(0,2)}
                </div>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:'#0d2b1a' }}>{featured.authorName}</div>
                  <div style={{ fontSize:11, color:'#6b8070' }}>{formatDate(featured.publishedAt)} · {featured.readTime} read</div>
                </div>
              </div>
              <Link to={`/blog/${featured.postId}`}
                style={{ display:'inline-block', background:'#c9a84c', color:'#0d2b1a', padding:'12px 28px', borderRadius:6, textDecoration:'none', fontSize:12, fontWeight:700, letterSpacing:'.08em', transition:'background .2s' }}
                onMouseEnter={e=>e.target.style.background='#e0c060'} onMouseLeave={e=>e.target.style.background='#c9a84c'}>
                READ ARTICLE
              </Link>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* FILTER + GRID */}
      <section style={{ background:'#fff', padding:'0 24px 80px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ background:'#fff', borderBottom:'1px solid rgba(0,0,0,.07)', padding:'20px 0', position:'sticky', top:64, zIndex:9, display:'flex', gap:12, flexWrap:'wrap', alignItems:'center', marginBottom:36 }}>
            <div style={{ position:'relative', flex:1, minWidth:200 }}>
              <svg style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)' }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6b8070" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input placeholder="Search posts..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)}
                style={{ width:'100%', padding:'10px 14px 10px 36px', border:'1.5px solid rgba(26,71,49,.2)', borderRadius:8, fontSize:14, outline:'none', fontFamily:"'Lato',sans-serif", boxSizing:'border-box' }} />
            </div>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {categories.map(c => (
                <button key={c} className={`cat-pill${selectedCategory===c?' active':''}`} onClick={()=>setSelectedCategory(c)}>{c}</button>
              ))}
            </div>
          </div>

          <p style={{ fontSize:13, color:'#6b8070', marginBottom:28 }}>
            Showing <strong style={{ color:'#0d2b1a' }}>{filtered.length}</strong> post{filtered.length!==1?'s':''}
          </p>

          {loading ? (
            <LoadingSpinner />
          ) : filtered.length === 0 ? (
            <div style={{ textAlign:'center', padding:'80px 0' }}>
              <div style={{ fontSize:48, color:'#c9a84c', marginBottom:14 }}>📖</div>
              <h3 style={{ fontFamily:'Georgia,serif', fontSize:22, color:'#0d2b1a', marginBottom:10 }}>No posts found</h3>
              <p style={{ color:'#6b8070' }}>Try adjusting your search or filter.</p>
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:28 }}>
              {filtered.map((post, i) => (
                <article key={post.postId} className="blog-card">
                  <div style={{ height:5, background:ACCENT[post.category]||'#1a4731' }} />
                  <div style={{ 
                    height:160, 
                    background: post.featuredImageUrl 
                      ? `url(${getImageUrl(post.featuredImageUrl)}) center/cover no-repeat`
                      : i%3===0 ? 'linear-gradient(135deg,#1a4731,#40916c)' 
                      : i%3===1 ? 'linear-gradient(135deg,#7d5b00,#c9a84c)' 
                      : 'linear-gradient(135deg,#256040,#3a7d56)',
                    display:'flex', alignItems:'center', justifyContent:'center' 
                  }}>
                    {!post.featuredImageUrl && (
                      <span style={{ fontFamily:'Georgia,serif', fontSize:52, color:'rgba(255,255,255,.15)', fontStyle:'italic' }}>
                        {post.category==='SERMON'?'✝':post.category==='ANNOUNCEMENT'?'✦':post.category==='TESTIMONY'?'❝':'◈'}
                      </span>
                    )}
                  </div>
                  <div style={{ padding:'22px 24px 26px' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
                      <span style={{ fontSize:10, fontWeight:700, letterSpacing:'.14em', padding:'4px 10px', borderRadius:3, background:CAT_STYLE[post.category]?.bg, color:CAT_STYLE[post.category]?.text }}>{post.category}</span>
                      <span style={{ fontSize:12, color:'#aaa' }}>{post.readTime} read</span>
                    </div>
                    <h3 style={{ fontFamily:'Georgia,serif', fontSize:19, fontWeight:600, color:'#0d2b1a', lineHeight:1.35, marginBottom:10 }}>{post.title}</h3>
                    <p style={{ fontSize:13, color:'#6b8070', lineHeight:1.75, marginBottom:18 }}>{post.excerpt}</p>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', borderTop:'1px solid rgba(0,0,0,.06)', paddingTop:14 }}>
                      <div style={{ fontSize:12, color:'#3d5247' }}>
                        <strong>{post.authorName}</strong> · {formatDate(post.publishedAt)}
                      </div>
                      <Link to={`/blog/${post.postId}`} style={{ color:'#1a4731', textDecoration:'none', fontSize:13, fontWeight:700, display:'flex', alignItems:'center', gap:4 }}>
                        Read →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            )}
        </div>
      </section>
    </div>
  );
};

export default BlogPage;