import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{ background:"var(--green-deep)", borderTop:"1px solid rgba(201,168,76,0.12)", padding:"72px 24px 32px" }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:48, marginBottom:56 }}>

          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center font-bold text-white text-sm">
                YPD
              </div>
              <span className="text-xl font-bold">AME Church YPD</span>
            </div>
            
            <p style={{ fontFamily:"'Lato',sans-serif", fontSize:13, color:"rgba(255,255,255,0.4)", lineHeight:1.85, maxWidth:240 }}>
              Building the next generation for the Kingdom. Join us in spiritual growth and community through Mokone YPD Conference.
            </p>
            <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:14, color:"rgba(201,168,76,0.5)", fontStyle:"italic", marginTop:16 }}>
              "The kingdom of God is within you." — Luke 17:21
            </p>
          </div>

         {[
            { title:"Navigate",   links:["Home","About Us","Events","Blog","Church Finder","Media","Structure","Contact"] },
            { title:"Community",  links:["Register","Login","Prayer Requests","Newsletter","Volunteer"] },
            { title:"Contact",    links:["info@mokonypd.org","+27 12 345 6789","Pretoria, South Africa","Mon–Fri: 08:00–17:00"] },
          ].map(col => (
            <div key={col.title}>
              <div style={{ fontFamily:"'Lato',sans-serif", fontSize:10, fontWeight:700, letterSpacing:"0.22em", color:"var(--gold)", marginBottom:20 }}>{col.title.toUpperCase()}</div>
              {col.links.map(link => (
                <div key={link} style={{ marginBottom:10 }}>
                  <a href="#" style={{ fontFamily:"'Lato',sans-serif", fontSize:13, color:"rgba(255,255,255,0.45)", textDecoration:"none", transition:"color 0.2s" }}
                    onMouseEnter={e=>e.target.style.color="var(--gold)"}
                    onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.45)"}>
                    {link}
                  </a>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div style={{ borderTop:"1px solid rgba(255,255,255,0.06)", paddingTop:24, display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
          <p style={{ fontFamily:"'Lato',sans-serif", fontSize:12, color:"rgba(255,255,255,0.25)" }}>
            © {new Date().getFullYear()} AME Church Young People's Division. All rights reserved.
          </p>
          <p style={{ fontFamily:"'Lato',sans-serif", fontSize:12, color:"rgba(255,255,255,0.18)" }}>
            Built for the Kingdom · Mokone YPD Conference
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;