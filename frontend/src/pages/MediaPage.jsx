import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import mediaService from '../services/mediaService';
import LoadingSpinner from '../components/common/LoadingSpinner';

const MediaPage = () => {
  const [activeTab, setActiveTab] = useState('PHOTOS');
  const [lightbox, setLightbox]   = useState(null);
  const [media, setMedia]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

 // ══════════════════════════════════════════════════════════════
  // LOAD MEDIA FROM API
  // ══════════════════════════════════════════════════════════════
  
  useEffect(() => {
    const loadMedia = async () => {
      try {
        setLoading(true);
        const data = await mediaService.getAll();
        setMedia(Array.isArray(data) ? data : data.content || []);
      } catch (err) {
        console.error('Failed to load media:', err);
        setError('Failed to load media. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadMedia();
  }, []);

  // ══════════════════════════════════════════════════════════════
  // FILTER BY TAB
  // ══════════════════════════════════════════════════════════════
  
  const photos = media.filter(m => m.mediaType === 'IMAGE');
  const videos = media.filter(m => m.mediaType === 'VIDEO');
  const audios = media.filter(m => m.mediaType === 'AUDIO' || m.mediaType === 'DOCUMENT');
  
  const current = activeTab === 'PHOTOS' ? photos :
                  activeTab === 'VIDEOS' ? videos : audios;

  // ══════════════════════════════════════════════════════════════
  // GET MEDIA URL
  // ══════════════════════════════════════════════════════════════
  
  const getMediaUrl = (item) => {
    if (item.isYoutubeVideo) {
      return item.youtubeThumbnail;
    }
    return item.fileUrl;
  };

  // Add this helper at the top of AdminMedia.jsx and MediaPage.jsx
  const getImageUrl = (url) => {
    if (!url) return null;
    // If already full URL, return as-is
    if (url.startsWith('http')) return url;
    // If relative, prepend backend base URL
    return `http://localhost:8080${url}`;
  };

  // ══════════════════════════════════════════════════════════════
  // ── Handle video click ────────────────────────────────────────
  // YouTube videos open YouTube directly; local videos open lightbox
  // ══════════════════════════════════════════════════════════════

  const handleCardClick = (item) => {
    if (item.isYoutubeVideo && item.youtubeWatchUrl) {
      window.open(item.youtubeWatchUrl, '_blank', 'noopener,noreferrer');
    } else {
      setLightbox(item);
    }
  };

  return (
    <div style={{ fontFamily: "'Lato',sans-serif", paddingTop: 64 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Lato:wght@300;400;700&display=swap');
        .media-card {
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          transition: all .3s;
        }
        .media-card:hover {
          transform: scale(1.02);
          box-shadow: 0 16px 40px rgba(0,0,0,.25);
        }
        .tab-btn {
          padding: 12px 28px;
          border: none;
          font-family: 'Lato',sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: .08em;
          cursor: pointer;
          transition: all .25s;
          border-bottom: 3px solid transparent;
        }
        .tab-btn.active {
          color: #1a4731;
          border-bottom-color: #c9a84c;
          background: transparent;
        }
        .tab-btn:not(.active) {
          color: #6b8070;
          background: transparent;
        }
        .tab-btn:hover:not(.active) {
          color: #1a4731;
        }
      `}</style>

      {/* ══════════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════ */}
      
      <div style={{
        background: 'linear-gradient(150deg,#071812,#0d2b1a 50%,#1a4731)',
        padding: '120px 24px 80px',
        textAlign: 'center'
      }}>
        <span style={{
          fontFamily: 'Lato,sans-serif',
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '.24em',
          color: '#c9a84c',
          display: 'block',
          marginBottom: 12
        }}>
          MOKONE YPD CONFERENCE
        </span>
        <h1 style={{
          fontFamily: 'Georgia,serif',
          fontSize: 'clamp(2.4rem,5vw,4rem)',
          fontWeight: 700,
          color: '#fff',
          lineHeight: 1.1,
          marginBottom: 16
        }}>
          Moments of Worship
        </h1>
        <p style={{
          fontFamily: 'Lato,sans-serif',
          fontSize: 15,
          color: 'rgba(255,255,255,.6)',
          maxWidth: 540,
          margin: '0 auto',
          lineHeight: 1.8
        }}>
          Explore our vibrant photo gallery, inspiring videos and faithful content
          highlighting special church events, community gatherings and worship services.
        </p>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          MASONRY PHOTO HIGHLIGHT (First 6 photos)
      ══════════════════════════════════════════════════════════════ */}
      
      {photos.length > 0 && (
        <section style={{ background: '#0d2b1a', padding: '0' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4,1fr)',
            gridTemplateRows: '200px 200px',
            gap: 3
          }}>
            {photos.slice(0, 6).map((m, i) => (
              <div
                key={m.mediaId}
                onClick={() => handleCardClick(m)}
                className="media-card"
                style={{
                  borderRadius: 0,
                  background: 'linear-gradient(135deg,#1a4731,#40916c)',
                  gridColumn: i === 0 ? 'span 2' : i === 3 ? 'span 2' : 'span 1',
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: 16,
                  // backgroundImage: m.fileUrl ? `url(${m.fileUrl})` : 'linear-gradient(135deg,#1a4731,#40916c)',
                  backgroundImage: getMediaUrl(m) ? `url(${getMediaUrl(m)})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative'
                }}
              >
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,.6) 0%, transparent 50%)'
                }} />
                <span style={{
                  fontFamily: 'Georgia,serif',
                  fontSize: 13,
                  color: 'rgba(255,255,255,.85)',
                  fontStyle: 'italic',
                  position: 'relative',
                  zIndex: 1
                }}>
                  {m.title}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════
          TABS
      ══════════════════════════════════════════════════════════════ */}
      
      <div style={{
        background: '#fff',
        borderBottom: '1px solid rgba(0,0,0,.08)',
        position: 'sticky',
        top: 64,
        zIndex: 10
      }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          gap: 0
        }}>
          {[
            ['PHOTOS', '🖼️ Moments of Worship'],
            ['VIDEOS', '🎬 Inspiring Faith Content'],
            ['AUDIO', '🎵 Faithful Soundtrack']
          ].map(([t, l]) => (
            <button
              key={t}
              className={`tab-btn${activeTab === t ? ' active' : ''}`}
              onClick={() => setActiveTab(t)}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          CONTENT GRID
      ══════════════════════════════════════════════════════════════ */}
      
      <section style={{
        background: '#f7f9f7',
        padding: '60px 24px 80px'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ marginBottom: 32 }}>
            <h2 style={{
              fontFamily: 'Georgia,serif',
              fontSize: 'clamp(1.6rem,3vw,2.2rem)',
              fontWeight: 700,
              color: '#0d2b1a',
              marginBottom: 10
            }}>
              {activeTab === 'PHOTOS' ? 'Moments of Worship' :
               activeTab === 'VIDEOS' ? 'Inspiring Faith Content' :
               'Faithful Soundtrack'}
            </h2>
            <p style={{
              fontSize: 14,
              color: '#6b8070',
              lineHeight: 1.7,
              maxWidth: 540
            }}>
              {activeTab === 'PHOTOS' ? 'Experience the heart of Mokone YPD through these cherished moments.' :
               activeTab === 'VIDEOS' ? 'Dive into our video library featuring sermons, testimonials and educational content.' :
               'Listen to uplifting audio sermons, prayers and gospel music.'}
            </p>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <div style={{
              textAlign: 'center',
              padding: '60px',
              color: '#c0392b'
            }}>
              {error}
            </div>
          ) : current.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px',
              color: '#aaa'
            }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>
                {activeTab === 'PHOTOS' ? '🖼️' :
                 activeTab === 'VIDEOS' ? '🎬' : '🎵'}
              </div>
              <p>No {activeTab.toLowerCase()} available yet. Check back soon!</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))',
              gap: 20
            }}>
              {current.map(item => (
                <div
                  key={item.mediaId}
                  className="media-card"
                  onClick={() => setLightbox(item)}
                  style={{
                    background: '#fff',
                    aspectRatio: '4/3',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    overflow: 'hidden'
                  }}
                >
                  {/* Media Display */}
                  <div style={{
                    flex: 1,
                    background: item.isYoutubeVideo && item.youtubeThumbnail
                      ? `url(${item.youtubeThumbnail})`
                      : !item.isYoutubeVideo && item.fileUrl
                      ? `url(${item.fileUrl})`
                      : 'linear-gradient(135deg,#1a4731,#40916c)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {/* Play button for videos */}
                    {item.mediaType === 'VIDEO' && (
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(0,0,0,.3)'
                      }}>
                        <div style={{
                          width: 56,
                          height: 56,
                          borderRadius: '50%',
                          background: 'rgba(201,168,76,.25)',
                          border: '2px solid rgba(201,168,76,.6)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                            <polygon points="10 8 16 12 10 16 10 8" />
                          </svg>
                        </div>
                      </div>
                    )}

                    {/* Category Badge */}
                    <div style={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      background: 'rgba(0,0,0,.65)',
                      padding: '4px 10px',
                      borderRadius: 3,
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: '.1em',
                      color: 'rgba(255,255,255,.85)'
                    }}>
                      {item.category}
                    </div>

                    {/* YouTube Badge */}
                    {item.isYoutubeVideo && (
                      <div style={{
                        position: 'absolute',
                        bottom: 8,
                        right: 8,
                        background: '#c0392b',
                        color: '#fff',
                        fontSize: 10,
                        fontWeight: 700,
                        padding: '4px 8px',
                        borderRadius: 3,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4
                      }}>
                         ▶  YouTube
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{
                    padding: 16,
                    background: '#fff'
                  }}>
                    <div style={{
                      fontFamily: 'Georgia,serif',
                      fontSize: 14,
                      color: '#0d2b1a',
                      fontWeight: 600,
                      marginBottom: 4,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {item.title}
                    </div>
                    {item.description && (
                      <p style={{
                        fontSize: 11,
                        color: '#6b8070',
                        lineHeight: 1.5,
                        maxHeight: 32,
                        overflow: 'hidden'
                      }}>
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          LIGHTBOX MODAL
      ══════════════════════════════════════════════════════════════ */}
      
      {lightbox && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,.85)',
            zIndex: 300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24
          }}
          onClick={() => setLightbox(null)}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 14,
              maxWidth: 900,
              width: '100%',
              overflow: 'hidden'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 20px',
              borderBottom: '1px solid rgba(0,0,0,.07)'
            }}>
              <h3 style={{
                fontFamily: 'Georgia,serif',
                fontSize: 19,
                color: '#0d2b1a'
              }}>
                {lightbox.title}
              </h3>
              <button
                onClick={() => setLightbox(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 22,
                  cursor: 'pointer',
                  color: '#6b8070'
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '0' }}>
              {lightbox.isYoutubeVideo && lightbox.youtubeEmbedUrl ? (
                <iframe
                  src={`${lightbox.youtubeEmbedUrl}?autoplay=1`}
                  title={lightbox.title}
                  style={{
                    width: '100%',
                    height: 500,
                    border: 'none'
                  }}
                  allowFullScreen
                />
              ) : lightbox.mediaType === 'VIDEO' ? (
                <video
                  controls
                  autoPlay
                  style={{
                    width: '100%',
                    height: 500,
                    background: '#000'
                  }}
                >
                  <source src={lightbox.fileUrl} type={lightbox.fileType} />
                  Your browser does not support the video tag.
                </video>
              ) : lightbox.mediaType === 'IMAGE' ? (
                <img
                  src={lightbox.fileUrl}
                  alt={lightbox.title}
                  style={{
                    width: '100%',
                    maxHeight: 600,
                    objectFit: 'contain',
                    background: '#000'
                  }}
                />
              ) : (
                <div style={{
                  height: 400,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#f7f9f7'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 64, marginBottom: 16 }}>📄</div>
                    <p style={{ color: '#6b8070' }}>
                      <a
                        href={lightbox.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#1a4731', fontWeight: 700 }}
                      >
                        Download File
                      </a>
                    </p>
                  </div>
                </div>
              )}

              {lightbox.description && (
                <div style={{ padding: '20px 24px' }}>
                  <p style={{
                    fontSize: 13,
                    color: '#6b8070',
                    lineHeight: 1.6
                  }}>
                    {lightbox.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaPage;