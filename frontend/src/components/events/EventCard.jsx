import React from 'react';
import { useNavigate } from 'react-router-dom';

const CAT_STYLE = {
  CONFERENCE:  { bg:'rgba(26,86,160,.1)',   text:'#1a56a0' },
  YOUTH:       { bg:'rgba(107,33,168,.1)',  text:'#6b21a8' },
  COMMUNITY:   { bg:'rgba(26,102,64,.1)',   text:'#1a6640' },
  WORSHIP:     { bg:'rgba(146,64,14,.1)',   text:'#92400e' },
  EDUCATIONAL: { bg:'rgba(153,27,27,.1)',   text:'#991b1b' },
  FUNDRAISER:  { bg:'rgba(201,168,76,.15)', text:'#7d5b00' },
  OTHER:       { bg:'rgba(26,71,49,.1)',    text:'#1a4731' },
};

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const EventCard = ({ event }) => {
  const navigate = useNavigate();
  const cat = CAT_STYLE[event.category] || CAT_STYLE.OTHER;

  const day   = new Date(event.eventDate).getDate();
  const month = MONTHS[new Date(event.eventDate).getMonth()].toUpperCase();

  const spotsLeft = event.maxAttendees
    ? event.maxAttendees - (event.currentAttendees || 0)
    : null;

  const capacityPct = event.maxAttendees
    ? Math.min(100, Math.round(((event.currentAttendees || 0) / event.maxAttendees) * 100))
    : 0;

  const formatTime = t => {
    if (!t) return 'TBA';
    const parts = String(t).split(':');
    const hr = parseInt(parts[0], 10);
    const mn = parts[1] || '00';
    return `${hr % 12 || 12}:${mn} ${hr >= 12 ? 'PM' : 'AM'}`;
  };

  return (
    <div
      onClick={() => navigate(`/events/${event.eventId}`)}
      style={{
        background: '#fff',
        borderRadius: 12,
        border: '1px solid rgba(0,0,0,.07)',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all .3s',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 16px 40px rgba(26,71,49,.12)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* ── Header with date block ── */}
      <div style={{
        background: 'linear-gradient(135deg,#1a4731,#256040)',
        padding: '22px 22px 18px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}>
        <div>
          <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize: 48, fontWeight: 700, color: '#fff', lineHeight: 1 }}>
            {day}
          </div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.18em', color: '#c9a84c', marginTop: 2 }}>
            {month}
          </div>
        </div>
        <span style={{
          fontSize: 10, fontWeight: 700, letterSpacing: '.12em',
          padding: '4px 10px', borderRadius: 3,
          background: cat.bg, color: cat.text,
        }}>
          {event.category}
        </span>
      </div>

      {/* ── Body ── */}
      <div style={{ padding: '18px 22px 22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{
          fontFamily: "'Cormorant Garamond',Georgia,serif",
          fontSize: 19, fontWeight: 600, color: '#0d2b1a',
          lineHeight: 1.3, marginBottom: 8,
        }}>
          {event.title}
        </h3>

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 14 }}>
          <span style={{ fontSize: 12, color: '#6b8070', display: 'flex', alignItems: 'center', gap: 5 }}>
            🕐 {formatTime(event.eventTime)}
          </span>
          <span style={{ fontSize: 12, color: '#6b8070', display: 'flex', alignItems: 'center', gap: 5 }}>
            📍 {event.location || 'TBA'}
          </span>
        </div>

        {event.description && (
          <p style={{
            fontSize: 13, color: '#6b8070', lineHeight: 1.7, marginBottom: 16,
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {event.description}
          </p>
        )}

        {/* Capacity bar */}
        {event.maxAttendees && (
          <div style={{ marginBottom: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontSize: 11, color: '#6b8070' }}>Capacity</span>
              <span style={{
                fontSize: 11, fontWeight: 700,
                color: spotsLeft < 10 ? '#c0392b' : '#1a6640',
              }}>
                {spotsLeft} spot{spotsLeft !== 1 ? 's' : ''} left
              </span>
            </div>
            <div style={{ height: 4, background: 'rgba(26,71,49,.1)', borderRadius: 2 }}>
              <div style={{
                height: '100%',
                width: `${capacityPct}%`,
                background: capacityPct > 80 ? '#c0392b' : '#1a4731',
                borderRadius: 2,
                transition: 'width .4s',
              }} />
            </div>
          </div>
        )}

        {/* CTA */}
        <button
          style={{
            marginTop: 'auto',
            width: '100%',
            background: '#c9a84c',
            color: '#0d2b1a',
            border: 'none',
            padding: '12px',
            borderRadius: 6,
            fontFamily: "'Lato',sans-serif",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '.08em',
            cursor: 'pointer',
            transition: 'background .2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#e0c060'}
          onMouseLeave={e => e.currentTarget.style.background = '#c9a84c'}
        >
          VIEW DETAILS & RSVP →
        </button>
      </div>
    </div>
  );
};

export default EventCard;
