import React, { useState, useEffect, useRef } from 'react';
import chargeService from '../services/chargeService';
import LoadingSpinner from '../components/common/LoadingSpinner';

// ─────────────────────────────────────────────
// ChurchMap — Google Maps component
// Lives inside this file so nothing extra to import
// ─────────────────────────────────────────────
const ChurchMap = ({ charges }) => {
  const mapRef         = useRef(null);   // the div Google Maps renders into
  const mapInstanceRef = useRef(null);   // keeps the map object alive between renders

  // STEP 1 — load the Google Maps script once when the page first opens
  useEffect(() => {
    // If Maps is already loaded from a previous visit, just init immediately
    if (window.google && window.google.maps) {
      initMap();
      return;
    }

    // Don't add the script tag twice
    if (document.getElementById('google-maps-script')) return;

    const script = document.createElement('script');
    script.id    = 'google-maps-script';
    // 👇 Your API key is read from the .env file (VITE_GOOGLE_MAPS_API_KEY=your_key_here)
    script.src   = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&callback=__initGoogleMap`;
    script.async = true;
    script.defer = true;

    // Google calls this global function when the script finishes loading
    window.__initGoogleMap = initMap;
    document.head.appendChild(script);
  }, []);

  // STEP 2 — when the list of churches arrives from the backend, add their pins
  useEffect(() => {
    if (mapInstanceRef.current && charges.length > 0) {
      addMarkers(mapInstanceRef.current, charges);
    }
  }, [charges]);

  // Creates the map centred on South Africa
  const initMap = () => {
    if (!mapRef.current) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: -28.4793, lng: 24.6727 }, // centre of South Africa
      zoom: 6,
      // Custom map style to match the site's green/gold colours
      styles: [
        { featureType: 'all',   elementType: 'geometry',   stylers: [{ color: '#e8f4f0' }] },
        { featureType: 'water', elementType: 'geometry',   stylers: [{ color: '#b3d4cc' }] },
        { featureType: 'road',  elementType: 'geometry',   stylers: [{ color: '#ffffff' }] },
        { featureType: 'poi',   elementType: 'labels.text', stylers: [{ color: '#6b8070' }] },
      ],
    });

    mapInstanceRef.current = map;

    // If church data was already loaded before the map script finished, add pins now
    if (charges.length > 0) addMarkers(map, charges);
  };

  // Places a gold pin on the map for every church that has coordinates
  const addMarkers = (map, churchList) => {
    const bounds = new window.google.maps.LatLngBounds();
    let hasAnyPin = false;

    churchList
      .filter(c => c.latitude && c.longitude) // skip churches with no coordinates
      .forEach(charge => {
        const position = { lat: Number(charge.latitude), lng: Number(charge.longitude) };
        hasAnyPin = true;

        // Gold circle pin matching the site colours
        const marker = new window.google.maps.Marker({
          position,
          map,
          title: charge.chargeName,
          icon: {
            path:        window.google.maps.SymbolPath.CIRCLE,
            scale:       10,
            fillColor:   '#c9a84c',  // gold
            fillOpacity: 1,
            strokeColor: '#0d2b1a',  // dark green
            strokeWeight: 2,
          },
        });

        // Popup card when a pin is clicked
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="font-family:'Lato',sans-serif; padding:8px 4px; min-width:200px">
              <h4 style="font-family:Georgia,serif; color:#0d2b1a; margin:0 0 6px; font-size:15px">
                ${charge.chargeName}
              </h4>
              <p style="color:#6b8070; font-size:13px; margin:0 0 4px">📍 ${charge.city || ''}</p>
              ${charge.pastorName || charge.ministerName
                ? `<p style="color:#6b8070; font-size:13px; margin:0 0 4px">👤 ${charge.pastorName || charge.ministerName}</p>`
                : ''}
              ${charge.serviceTime || charge.serviceTimes
                ? `<p style="color:#6b8070; font-size:13px; margin:0">🕐 ${charge.serviceTime || charge.serviceTimes}</p>`
                : ''}
              <a href="https://maps.google.com/?q=${charge.latitude},${charge.longitude}"
                target="_blank"
                style="display:inline-block; margin-top:10px; background:#c9a84c; color:#0d2b1a;
                       padding:6px 14px; border-radius:4px; text-decoration:none;
                       font-size:12px; font-weight:700; font-family:'Lato',sans-serif">
                Get Directions
              </a>
            </div>
          `,
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });

        bounds.extend(position);
      });

    // Zoom the map to fit all the church pins
    if (hasAnyPin) map.fitBounds(bounds);
  };

  return (
    <div
      ref={mapRef}
      style={{
        width:        '100%',
        height:       320,
        borderRadius: '12px 12px 0 0',
        background:   '#d4e8dc', // shows while map is loading
      }}
    />
  );
};


// ─────────────────────────────────────────────
// ChargesPage — the main Church Finder page
// ─────────────────────────────────────────────
const ChargesPage = () => {
  const [charges,         setCharges]         = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [error,           setError]           = useState(null);
  const [selectedArea,    setSelectedArea]    = useState('ALL');
  const [searchTerm,      setSearchTerm]      = useState('');
  const [selected,        setSelected]        = useState(null);
  const [selectedService, setSelectedService] = useState('ALL');
  const [savedSearch,     setSavedSearch]     = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  // Load all churches from the backend on page open
  useEffect(() => {
    const loadCharges = async () => {
      try {
        setLoading(true);
        const data = await chargeService.getAll({ page: 0, size: 100 });
        setCharges(data.content || data || []);
      } catch {
        setError('Unable to load churches. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    loadCharges();
  }, []);

  // Build filter pill list from whatever areas exist in the data
  const areas        = ['ALL', ...new Set(charges.map(c => c.area || c.district || c.region).filter(Boolean))];
  const serviceTypes = ['ALL', 'Sunday Morning', 'Sunday Evening', 'Midweek'];

  // Filter the church list based on what the user has selected
  const filtered = charges.filter(c => {
    const matchArea    = selectedArea === 'ALL' || (c.area || c.district || c.region) === selectedArea;
    const matchSearch  = !searchTerm
      || c.chargeName.toLowerCase().includes(searchTerm.toLowerCase())
      || (c.city        || '').toLowerCase().includes(searchTerm.toLowerCase())
      || (c.pastorName  || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchArea && matchSearch;
  });

  return (
    <div style={{ fontFamily: "'Lato',sans-serif", paddingTop: 64 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap');
        .charge-card { background:#fff; border-radius:12px; border:1px solid rgba(0,0,0,.07); overflow:hidden; transition:all .3s; cursor:pointer; }
        .charge-card:hover { transform:translateY(-4px); box-shadow:0 16px 40px rgba(26,71,49,.13); }
        .filter-btn { padding:9px 18px; border-radius:20px; border:1px solid rgba(26,71,49,.2); background:#fff; font-family:'Lato',sans-serif; font-size:12px; cursor:pointer; transition:all .2s; color:#3d5247; }
        .filter-btn.active { background:#1a4731; color:#fff; border-color:#1a4731; }
        .filter-btn:hover:not(.active) { border-color:#1a4731; color:#1a4731; }
      `}</style>

      {/* ── HERO ── */}
      <div style={{ background: 'linear-gradient(150deg,#071812,#0d2b1a 50%,#1a4731)', padding: '120px 24px 80px', textAlign: 'center' }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.24em', color: '#c9a84c', display: 'block', marginBottom: 12 }}>
          MOKONE YPD CONFERENCE
        </span>
        <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 'clamp(2.4rem,5vw,4rem)', fontWeight: 700, color: '#fff', lineHeight: 1.1, marginBottom: 16 }}>
          Find Your Church
        </h1>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,.6)', lineHeight: 1.8, maxWidth: 500, margin: '0 auto 36px' }}>
          Use the filters below to quickly locate an AME congregation in your area.
        </p>

        {/* Stats bar */}
        {!loading && !error && (
          <div style={{ display: 'inline-flex', gap: 0, background: 'rgba(255,255,255,.06)', border: '1px solid rgba(201,168,76,.2)', borderRadius: 10, padding: '4px', marginTop: 28 }}>
            {[
              [charges.length,                                                    'Churches'],
              [areas.length - 1,                                                  'Areas'],
              [charges.reduce((s, c) => s + (c.memberCount || 0), 0) + '+',      'Members'],
            ].map(([v, l], i) => (
              <div key={i} style={{ padding: '14px 28px', borderRight: i < 2 ? '1px solid rgba(201,168,76,.15)' : '' }}>
                <div style={{ fontFamily: 'Georgia,serif', fontSize: 26, fontWeight: 700, color: '#c9a84c', lineHeight: 1 }}>{v}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,.45)', letterSpacing: '.1em', marginTop: 3 }}>{l}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── STICKY FILTER BAR ── */}
      <div style={{ background: '#fff', borderBottom: '1px solid rgba(0,0,0,.08)', padding: '28px 24px', position: 'sticky', top: 64, zIndex: 10 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 18, alignItems: 'center' }}>
            {/* Search box */}
            <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
              <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b8070" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                placeholder="Search by church name, city or pastor..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '11px 14px 11px 38px', border: '1.5px solid rgba(26,71,49,.2)', borderRadius: 8, fontSize: 14, outline: 'none', fontFamily: "'Lato',sans-serif", boxSizing: 'border-box' }}
              />
            </div>

            {/* Service type dropdown */}
            <select
              value={selectedService}
              onChange={e => setSelectedService(e.target.value)}
              style={{ padding: '11px 16px', border: '1.5px solid rgba(26,71,49,.2)', borderRadius: 8, fontSize: 14, color: '#3d5247', fontFamily: "'Lato',sans-serif", background: '#fff', cursor: 'pointer' }}>
              <option value="ALL">Service Type: All</option>
              {serviceTypes.slice(1).map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            {/* Save / Reset */}
            <button
              onClick={() => setSavedSearch(true)}
              style={{ padding: '11px 22px', background: savedSearch ? '#c9a84c' : 'transparent', border: '1.5px solid #c9a84c', borderRadius: 8, color: savedSearch ? '#0d2b1a' : '#7d5b00', fontFamily: "'Lato',sans-serif", fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all .2s', whiteSpace: 'nowrap' }}>
              {savedSearch ? '✓ Saved' : 'Save Search'}
            </button>
            <button
              onClick={() => { setSelectedArea('ALL'); setSearchTerm(''); setSelectedService('ALL'); setSavedSearch(false); }}
              style={{ padding: '11px 22px', background: 'transparent', border: '1.5px solid rgba(0,0,0,.15)', borderRadius: 8, color: '#6b8070', fontFamily: "'Lato',sans-serif", fontSize: 13, cursor: 'pointer' }}>
              Reset
            </button>
          </div>

          {/* Area filter pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.15em', color: '#6b8070', marginRight: 4 }}>AREA:</span>
            {areas.map(a => (
              <button key={a} className={`filter-btn${selectedArea === a ? ' active' : ''}`} onClick={() => setSelectedArea(a)}>
                {a}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── CHURCH MAP SECTION ── */}
      <div style={{ background: 'linear-gradient(135deg,#e8f4f0,#d4e8dc)', padding: '0 24px', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 0 0' }}>

          {/* Map header row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 24, marginBottom: 40 }}>
            <div>
              <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 26, color: '#0d2b1a', marginBottom: 10 }}>Church Map</h2>
              <p style={{ fontSize: 14, color: '#6b8070', lineHeight: 1.7 }}>
                Click any gold pin to see church details. Click "Get Directions" to open Google Maps.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 20 }}>
              <div style={{ flex: 1, background: '#fff', borderRadius: 8, padding: '16px', border: '1px solid rgba(26,71,49,.12)' }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', color: '#c9a84c', marginBottom: 6 }}>VIEW</div>
                <p style={{ fontSize: 12, color: '#6b8070' }}>Click a gold pin to see church info</p>
              </div>
              <div style={{ flex: 1, background: '#fff', borderRadius: 8, padding: '16px', border: '1px solid rgba(26,71,49,.12)' }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', color: '#c9a84c', marginBottom: 6 }}>DIRECTIONS</div>
                <p style={{ fontSize: 12, color: '#6b8070' }}>Opens Google Maps with one click</p>
              </div>
            </div>
          </div>

          {/* ↓↓↓ THIS IS WHERE THE REAL MAP RENDERS ↓↓↓ */}
          <ChurchMap charges={charges} />

        </div>
      </div>

      {/* ── CHURCH CARDS ── */}
      <section style={{ background: '#f7f9f7', padding: '60px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.22em', color: '#c9a84c', display: 'block', marginBottom: 8 }}>CHURCH DETAILS</span>
              <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 'clamp(1.6rem,3vw,2.2rem)', fontWeight: 700, color: '#0d2b1a' }}>
                {loading ? 'Loading...' : `${filtered.length} Church${filtered.length !== 1 ? 'es' : ''} Found`}
              </h2>
            </div>
          </div>

          {/* Loading state */}
          {loading && <LoadingSpinner />}

          {/* Error state */}
          {error && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#c0392b' }}>
              <p style={{ fontSize: 15 }}>{error}</p>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>⛪</div>
              <h3 style={{ fontFamily: 'Georgia,serif', fontSize: 22, color: '#0d2b1a', marginBottom: 10 }}>No churches found</h3>
              <p style={{ color: '#6b8070', fontSize: 14 }}>Try adjusting your filters.</p>
            </div>
          )}

          {/* Church cards grid */}
          {!loading && !error && filtered.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 24 }}>
              {filtered.map(charge => (
                <div
                  key={charge.chargeId}
                  className="charge-card"
                  onClick={() => setSelected(selected?.chargeId === charge.chargeId ? null : charge)}>

                  {/* Card header */}
                  <div style={{ background: 'linear-gradient(135deg,#1a4731,#40916c)', padding: '22px 24px', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: 14, right: 14, background: 'rgba(201,168,76,.2)', border: '1px solid rgba(201,168,76,.4)', color: '#c9a84c', fontSize: 10, fontWeight: 700, letterSpacing: '.12em', padding: '4px 10px', borderRadius: 3 }}>
                      {charge.area || charge.district || charge.region || '—'}
                    </div>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,.1)', border: '2px solid rgba(201,168,76,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.8" strokeLinecap="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                      </svg>
                    </div>
                    <h3 style={{ fontFamily: 'Georgia,serif', fontSize: 19, fontWeight: 600, color: '#fff', lineHeight: 1.25 }}>{charge.chargeName}</h3>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,.55)', marginTop: 4 }}>📍 {charge.city}</p>
                  </div>

                  {/* Card body */}
                  <div style={{ padding: '20px 24px 24px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
                      {[
                        ['Pastor',  charge.pastorName  || charge.ministerName || '—'],
                        ['Members', charge.memberCount  ? `${charge.memberCount}+ members` : '—'],
                        ['Service', charge.serviceTime  || charge.serviceTimes || '—'],
                        ['Status',  charge.status       || (charge.isActive ? 'Active' : 'Inactive')],
                      ].map(([l, v]) => (
                        <div key={l}>
                          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em', color: '#c9a84c', marginBottom: 3 }}>{l}</div>
                          <div style={{ fontSize: 13, color: '#0d2b1a' }}>{v}</div>
                        </div>
                      ))}
                    </div>

                    {/* Expanded contact info — only shows when card is clicked */}
                    {selected?.chargeId === charge.chargeId && (
                      <div style={{ borderTop: '1px solid rgba(0,0,0,.07)', paddingTop: 14, marginBottom: 14 }}>
                        {[
                          ['📞', charge.phone        || charge.contactPhone],
                          ['📧', charge.email        || charge.contactEmail],
                          ['🌐', charge.websiteUrl],
                        ].filter(([, v]) => v).map(([icon, val]) => (
                          <div key={val} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                            <span style={{ fontSize: 14 }}>{icon}</span>
                            <span style={{ fontSize: 13, color: '#3d5247' }}>{val}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Action buttons */}
                    <div style={{ display: 'flex', gap: 10 }}>
                      <a
                        href={
                          charge.latitude && charge.longitude
                            ? `https://maps.google.com/?q=${charge.latitude},${charge.longitude}`
                            : `https://maps.google.com/?q=${encodeURIComponent(charge.chargeName + ' ' + (charge.city || ''))}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        style={{ flex: 1, textAlign: 'center', background: '#c9a84c', color: '#0d2b1a', padding: '10px', borderRadius: 6, textDecoration: 'none', fontSize: 12, fontWeight: 700, letterSpacing: '.06em' }}>
                        Directions
                      </a>
                      <button
                        onClick={e => { e.stopPropagation(); setSelected(selected?.chargeId === charge.chargeId ? null : charge); }}
                        style={{ flex: 1, textAlign: 'center', background: 'transparent', border: '1.5px solid #1a4731', color: '#1a4731', padding: '10px', borderRadius: 6, fontSize: 12, fontWeight: 700, letterSpacing: '.06em', cursor: 'pointer', transition: 'all .2s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#1a4731'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#1a4731'; }}>
                        {selected?.chargeId === charge.chargeId ? 'Less Info' : 'View Details'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ChargesPage;
