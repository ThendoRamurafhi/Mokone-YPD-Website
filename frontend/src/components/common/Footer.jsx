import React from 'react';
import { Link } from 'react-router-dom';

/* ── YPD SVG Logo — same style as Navigation, fixes the "broken logo" issue ── */
const YPDLogo = () => (
  <svg width="42" height="42" viewBox="0 0 42 42" fill="none" aria-label="AME YPD Logo">
    <circle cx="21" cy="21" r="20" fill="#0d2b1a" stroke="#c9a84c" strokeWidth="1.8"/>
    <circle cx="21" cy="21" r="15" fill="none" stroke="#c9a84c" strokeWidth="0.6" strokeDasharray="2 2"/>
    <text
      x="21" y="25"
      textAnchor="middle"
      fill="#c9a84c"
      fontSize="10"
      fontWeight="700"
      fontFamily="Georgia, 'Times New Roman', serif"
      letterSpacing="1"
    >
      YPD
    </text>
  </svg>
);

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: '#071812',
        borderTop: '1px solid rgba(201,168,76,0.15)',
        fontFamily: "'Lato', sans-serif",
        marginTop: 'auto',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 24px 28px' }}>

        {/* ── Main grid ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '48px',
            marginBottom: 48,
          }}
        >
          {/* Brand column */}
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <YPDLogo />
              <div>
                <div
                  style={{
                    fontFamily: 'Georgia, serif',
                    color: '#c9a84c',
                    fontSize: 16,
                    fontWeight: 600,
                    lineHeight: 1.1,
                  }}
                >
                  AME Church YPD
                </div>
                <div
                  style={{
                    color: 'rgba(255,255,255,0.35)',
                    fontSize: 9,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                  }}
                >
                  Young People's Division
                </div>
              </div>
            </div>

            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, lineHeight: 1.85, maxWidth: 240, marginBottom: 16 }}>
              The Young People's Division of the African Methodist Episcopal Church.
              Empowering youth and young adults to grow in faith, leadership, and community.
            </p>

            <p
              style={{
                fontFamily: 'Georgia, serif',
                fontStyle: 'italic',
                fontSize: 13,
                color: 'rgba(201,168,76,0.5)',
                marginBottom: 20,
              }}
            >
              "The kingdom of God is within you." — Luke 17:21
            </p>

            {/* Social links */}
            <div style={{ display: 'flex', gap: 10 }}>
              {['Facebook', 'Instagram', 'YouTube'].map(s => (
                <a
                  key={s}
                  href="#"
                  style={{
                    padding: '6px 12px',
                    border: '1px solid rgba(201,168,76,0.25)',
                    borderRadius: 4,
                    color: 'rgba(255,255,255,0.5)',
                    textDecoration: 'none',
                    fontSize: 11,
                    letterSpacing: '0.06em',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#c9a84c'; e.currentTarget.style.color = '#c9a84c'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.25)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 style={{ color: '#c9a84c', fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 20 }}>
              Quick Links
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[
                { label: 'Home',          to: '/'         },
                { label: 'About Us',      to: '/about'    },
                { label: 'Events',        to: '/events'   },
                { label: 'Blog',          to: '/blog'     },
                { label: 'Church Finder', to: '/charges'  },
                { label: 'Media',         to: '/media'    },
                { label: 'Structure',     to: '/structure'},
                { label: 'Contact',       to: '/contact'  },
              ].map(link => (
                <li key={link.to} style={{ marginBottom: 10 }}>
                  <Link
                    to={link.to}
                    style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'none', fontSize: 13, transition: 'color 0.2s' }}
                    onMouseEnter={e => e.target.style.color = '#c9a84c'}
                    onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.45)'}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 style={{ color: '#c9a84c', fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 20 }}>
              Community
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[
                { label: 'Register',        to: '/register' },
                { label: 'Login',           to: '/login'    },
                { label: 'Prayer Requests', to: '/contact'  },
                { label: 'Newsletter',      to: '/#newsletter' },
                { label: 'Volunteer',       to: '/contact'  },
              ].map(link => (
                <li key={link.label} style={{ marginBottom: 10 }}>
                  <Link
                    to={link.to}
                    style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'none', fontSize: 13, transition: 'color 0.2s' }}
                    onMouseEnter={e => e.target.style.color = '#c9a84c'}
                    onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.45)'}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 style={{ color: '#c9a84c', fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 20 }}>
              Contact Us
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[
                { icon: '📧', text: 'info@mokonypd.org' },
                { icon: '📞', text: '+27 12 345 6789'   },
                { icon: '📍', text: 'Pretoria, South Africa' },
                { icon: '🕐', text: 'Mon–Fri: 08:00–17:00' },
              ].map(item => (
                <li key={item.text} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
                  <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>{item.icon}</span>
                  <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, lineHeight: 1.5 }}>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.07)',
            paddingTop: 24,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 10,
          }}
        >
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12 }}>
            © {new Date().getFullYear()} AME Church Young People's Division. All rights reserved.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.18)', fontSize: 12 }}>
            Built for the Kingdom · Mokone YPD Conference
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
