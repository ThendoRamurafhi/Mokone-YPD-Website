import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import blogService from '../services/blogService';
import LoadingSpinner from '../components/common/LoadingSpinner';

const CAT_STYLE = {
  SERMON:       { bg:'rgba(37,96,64,.1)',    text:'#256040' },
  ANNOUNCEMENT: { bg:'rgba(201,168,76,.15)', text:'#7d5b00' },
  TESTIMONY:    { bg:'rgba(180,60,60,.08)',  text:'#8a2020' },
  NEWS:         { bg:'rgba(30,80,140,.08)',  text:'#1e508c' },
  RESOURCE:     { bg:'rgba(60,60,180,.08)',  text:'#3c3cb4' },
  GENERAL:      { bg:'rgba(26,71,49,.08)',   text:'#1a4731' },
  DEVOTIONAL:   { bg:'rgba(107,33,168,.08)', text:'#6b21a8' },
  YOUTH:        { bg:'rgba(234,88,12,.08)',  text:'#ea580c' },
  COMMUNITY:    { bg:'rgba(22,163,74,.08)',  text:'#16a34a' },
};

const BlogPostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        // Try by ID first, fall back to slug
        const data = await blogService.getById(id);
        setPost(data);
      } catch {
        setError('Post not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-ZA', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

  const shareUrl = window.location.href;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const shareOnFacebook = () =>
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');

  const shareOnWhatsApp = () =>
    window.open(`https://wa.me/?text=${encodeURIComponent(post.title + ' — ' + shareUrl)}`, '_blank');

  const shareOnTwitter = () =>
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(shareUrl)}`, '_blank');

  if (loading) return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', minHeight:'60vh' }}>
      <LoadingSpinner />
    </div>
  );

  if (error || !post) return (
    <div style={{ textAlign:'center', padding:'120px 24px', fontFamily:'Georgia,serif' }}>
      <h2 style={{ color:'#c0392b', marginBottom:16 }}>Post not found</h2>
      <Link to="/blog" style={{ color:'#1a4731', fontWeight:700 }}>← Back to Blog</Link>
    </div>
  );

  const initials = (post.authorName || 'AME YPD')
    .split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  // Estimate read time
  const wordCount = (post.content || '').split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.round(wordCount / 200));

  return (
    <div style={{ fontFamily:"'Lato',sans-serif", paddingTop:64 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Lato:wght@300;400;700&display=swap');
        .share-btn { display:flex; align-items:center; gap:8px; padding:10px 18px; border-radius:6px; border:1.5px solid rgba(26,71,49,.2); background:#fff; color:#1a4731; font-family:'Lato',sans-serif; font-size:13px; font-weight:700; cursor:pointer; transition:all .2s; }
        .share-btn:hover { background:#1a4731; color:#fff; border-color:#1a4731; }
        .post-content p { margin-bottom:1.4em; }
        .post-content h2, .post-content h3 { font-family:'Georgia,serif'; color:#0d2b1a; margin:1.8em 0 0.8em; }
        .post-content blockquote { border-left:3px solid #c9a84c; margin:1.6em 0; padding:12px 20px; background:rgba(201,168,76,.06); font-style:italic; color:#3d5247; }
        .post-content ul, .post-content ol { padding-left:24px; margin-bottom:1.4em; }
        .post-content li { margin-bottom:0.5em; }
      `}</style>

      {/* ── HERO ── */}
      <div style={{
        background: post.featuredImageUrl
          ? `linear-gradient(to bottom, rgba(13,27,26,0.6), rgba(13,43,26,0.85)), url(${post.featuredImageUrl}) center/cover no-repeat`
          : 'linear-gradient(150deg,#071812,#0d2b1a 50%,#1a4731)',
        padding:'100px 24px 80px',
      }}>
        <div style={{ maxWidth:800, margin:'0 auto' }}>
          <Link to="/blog" style={{ color:'rgba(255,255,255,.6)', textDecoration:'none', fontSize:13, display:'inline-flex', alignItems:'center', gap:6, marginBottom:24, fontWeight:700, letterSpacing:'.06em' }}>
            ← BACK TO BLOG
          </Link>
          <div style={{ marginBottom:16 }}>
            <span style={{ fontSize:10, fontWeight:700, letterSpacing:'.16em', padding:'5px 12px', borderRadius:3, background:CAT_STYLE[post.category]?.bg || 'rgba(201,168,76,.15)', color:CAT_STYLE[post.category]?.text || '#c9a84c' }}>
              {post.category}
            </span>
          </div>
          <h1 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'clamp(2rem,5vw,3.4rem)', fontWeight:700, color:'#fff', lineHeight:1.15, marginBottom:20 }}>
            {post.title}
          </h1>
          {post.excerpt && (
            <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, color:'rgba(255,255,255,.7)', fontStyle:'italic', lineHeight:1.7, marginBottom:28, maxWidth:640 }}>
              {post.excerpt}
            </p>
          )}
          <div style={{ display:'flex', alignItems:'center', gap:14, flexWrap:'wrap' }}>
            <div style={{ width:44, height:44, borderRadius:'50%', background:'#1a4731', border:'2px solid #c9a84c', display:'flex', alignItems:'center', justifyContent:'center', color:'#c9a84c', fontWeight:700, fontSize:14, fontFamily:'Georgia,serif', flexShrink:0 }}>
              {initials}
            </div>
            <div>
              <div style={{ fontSize:14, fontWeight:700, color:'#fff' }}>{post.authorName || 'AME YPD Team'}</div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,.5)' }}>
                {post.publishedAt ? formatDate(post.publishedAt) : ''} · {readTime} min read
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ maxWidth:800, margin:'0 auto', padding:'60px 24px' }}>

        {/* Share bar */}
        <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginBottom:48, paddingBottom:32, borderBottom:'1px solid rgba(0,0,0,.08)' }}>
          <span style={{ fontSize:12, fontWeight:700, letterSpacing:'.12em', color:'#6b8070', alignSelf:'center', marginRight:4 }}>SHARE:</span>
          <button className="share-btn" onClick={shareOnFacebook}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
            Facebook
          </button>
          <button className="share-btn" onClick={shareOnWhatsApp}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            WhatsApp
          </button>
          <button className="share-btn" onClick={shareOnTwitter}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>
            Twitter/X
          </button>
          <button className="share-btn" onClick={handleCopyLink} style={{ background: copied ? '#1a4731' : '#fff', color: copied ? '#fff' : '#1a4731' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>

        {/* Post body */}
        <div
          className="post-content"
          style={{ fontSize:16, color:'#2d3f35', lineHeight:1.9, fontFamily:"'Lato',sans-serif" }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Bottom nav */}
        <div style={{ marginTop:60, paddingTop:32, borderTop:'1px solid rgba(0,0,0,.08)', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:16 }}>
          <Link to="/blog" style={{ color:'#1a4731', textDecoration:'none', fontSize:14, fontWeight:700, display:'flex', alignItems:'center', gap:6 }}>
            ← All Posts
          </Link>
          <div style={{ fontSize:13, color:'#aaa' }}>
            {post.viewCount || 0} view{post.viewCount !== 1 ? 's' : ''}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostDetail;
