import React from "react";

const BeeSVG = () => (
  <svg width="52" height="52" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="30" cy="33" rx="11" ry="14" fill="#f5b800"/>
    <rect x="19" y="30" width="22" height="4" rx="2" fill="#1a1a1a" opacity={0.55}/>
    <rect x="19" y="37" width="22" height="4" rx="2" fill="#1a1a1a" opacity={0.45}/>
    <circle cx="30" cy="19" r="7" fill="#f5b800"/>
    <circle cx="27" cy="18" r="1.5" fill="#1a1a1a"/>
    <circle cx="33" cy="18" r="1.5" fill="#1a1a1a"/>
    <line x1="27" y1="12" x2="22" y2="7" stroke="#f5b800" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="21.5" cy="6.5" r="1.5" fill="#f5b800"/>
    <line x1="33" y1="12" x2="38" y2="7" stroke="#f5b800" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="38.5" cy="6.5" r="1.5" fill="#f5b800"/>
    <ellipse cx="17" cy="25" rx="9" ry="5" fill="rgba(255,255,255,0.65)" transform="rotate(-20 17 25)"/>
    <ellipse cx="15" cy="31" rx="7" ry="4" fill="rgba(255,255,255,0.45)" transform="rotate(-15 15 31)"/>
    <ellipse cx="43" cy="25" rx="9" ry="5" fill="rgba(255,255,255,0.65)" transform="rotate(20 43 25)"/>
    <ellipse cx="45" cy="31" rx="7" ry="4" fill="rgba(255,255,255,0.45)" transform="rotate(15 45 31)"/>
    <path d="M30 2 L50 30 L30 58 L10 30 Z" stroke="#f5b800" strokeWidth="1.5" fill="none" opacity={0.4}/>
  </svg>
);

const FloatingBee = ({ style }) => (
  <svg
    width="40" height="40" viewBox="0 0 40 40"
    xmlns="http://www.w3.org/2000/svg"
    style={{ position: "absolute", pointerEvents: "none", zIndex: 5, ...style }}
  >
    <ellipse cx="20" cy="23" rx="7" ry="9" fill="#f5b800"/>
    <rect x="13" y="21" width="14" height="3" rx="1.5" fill="#222" opacity={0.5}/>
    <rect x="13" y="26" width="14" height="3" rx="1.5" fill="#222" opacity={0.4}/>
    <circle cx="20" cy="13" r="5" fill="#f5b800"/>
    <circle cx="18" cy="12" r="1" fill="#222"/>
    <circle cx="22" cy="12" r="1" fill="#222"/>
    <ellipse cx="11" cy="17" rx="6" ry="3.5" fill="rgba(255,255,255,0.7)" transform="rotate(-25 11 17)"/>
    <ellipse cx="29" cy="17" rx="6" ry="3.5" fill="rgba(255,255,255,0.7)" transform="rotate(25 29 17)"/>
  </svg>
);

export default function Landing() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Nunito+Sans:wght@400;600&display=swap');

        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(-4deg); }
          50%       { transform: translateY(-14px) rotate(4deg); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .bee-1 { animation: float 6s ease-in-out infinite 0s; }
        .bee-2 { animation: float 6s ease-in-out infinite -2s; }
        .bee-3 { animation: float 6s ease-in-out infinite -4s; }
        .bee-4 { animation: float 6s ease-in-out infinite -1s; }
        .hero-content { animation: fadeUp 0.9s ease both; }
        .btn-primary:hover, .btn-secondary:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .btn-primary, .btn-secondary {
          transition: transform 0.2s, box-shadow 0.2s;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      {/* ── HERO SECTION ── */}
      <section style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "linear-gradient(175deg, #176a7e 0%, #1e8ca4 30%, #2aabca 65%, #1e8ca4 100%)",
        fontFamily: "'Nunito Sans', sans-serif",
      }}>

        {/* Glow overlay */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 80% 60% at 50% 35%, rgba(255,255,255,0.08) 0%, transparent 70%)",
        }}/>

        {/* ── NAVBAR ── */}
        <nav style={{
          position: "relative", zIndex: 10,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 40px",
        }}>
          <a href="#" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <BeeSVG />
            <span style={{
              fontFamily: "'Nunito', sans-serif", fontWeight: 800,
              fontSize: "1rem", letterSpacing: "0.12em", color: "#f5b800",
            }}>
              HONEY BEE
            </span>
          </a>

          <button style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", gap: 5, padding: 4,
          }}>
            <span style={{ display: "block", width: 26, height: 2.5, background: "#fff", borderRadius: 2 }}/>
            <span style={{ display: "block", width: 26, height: 2.5, background: "#fff", borderRadius: 2 }}/>
            <span style={{ display: "block", width: 26, height: 2.5, background: "#fff", borderRadius: 2 }}/>
          </button>
        </nav>

        {/* ── FLOATING BEES ── */}
        <div className="bee-1" style={{ position: "absolute", top: "8%",  left: "17%", zIndex: 5, pointerEvents: "none" }}>
          <FloatingBee />
        </div>
        <div className="bee-2" style={{ position: "absolute", top: "14%", right: "10%", zIndex: 5, pointerEvents: "none" }}>
          <FloatingBee />
        </div>
        <div className="bee-3" style={{ position: "absolute", top: "50%", left: "9%",  zIndex: 5, pointerEvents: "none" }}>
          <FloatingBee />
        </div>
        <div className="bee-4" style={{ position: "absolute", top: "52%", right: "9%", zIndex: 5, pointerEvents: "none" }}>
          <FloatingBee />
        </div>

        {/* Dotted flight paths */}
        <svg
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 4, opacity: 0.55 }}
          viewBox="0 0 1300 880"
          preserveAspectRatio="none"
        >
          <path d="M130 90 Q200 60 280 100 Q320 120 300 160" stroke="white" strokeWidth="1.5" strokeDasharray="5 7" fill="none"/>
          <path d="M1100 130 Q1160 80 1220 130 Q1260 160 1210 200" stroke="white" strokeWidth="1.5" strokeDasharray="5 7" fill="none"/>
          <path d="M110 430 Q80 470 120 510 Q150 540 130 570" stroke="white" strokeWidth="1.5" strokeDasharray="5 7" fill="none"/>
          <path d="M1190 460 Q1240 430 1260 480 Q1280 520 1220 540" stroke="white" strokeWidth="1.5" strokeDasharray="5 7" fill="none"/>
        </svg>

        {/* ── MAIN TEXT + BUTTONS ── */}
        <div className="hero-content" style={{
          position: "relative", zIndex: 10,
          flex: 1, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          textAlign: "center", padding: "0 24px 80px",
        }}>

          <h1 style={{
            fontFamily: "'Nunito', sans-serif", fontWeight: 800,
            fontSize: "clamp(2.4rem, 6vw, 4.2rem)",
            lineHeight: 1.15, color: "#ffffff",
            maxWidth: 740, marginBottom: 20,
          }}>
            Master your <span style={{ color: "#f5b800" }}>studies</span> with<br/>
            <span style={{ color: "#f5b800" }}>data-driven</span> control
          </h1>

          <p style={{
            fontSize: "clamp(0.9rem, 1.8vw, 1.05rem)",
            color: "rgba(255,255,255,0.82)",
            maxWidth: 480, lineHeight: 1.65, marginBottom: 44,
          }}>
            Stop guessing your study time. StudyLynk learns your behavior to build
            realistic, feedback-driven plans that actually work for you.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center" }}>

            <a href="#" className="btn-primary" style={{
              display: "inline-flex", alignItems: "center",
              padding: "14px 30px", borderRadius: 50,
              fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: "1rem",
              background: "#f5b800", color: "#1a1a1a",
              textDecoration: "none", border: "none", cursor: "pointer",
            }}>
              Start planning for free
            </a>

            <a href="#" className="btn-secondary" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "14px 30px", borderRadius: 50,
              fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: "1rem",
              background: "transparent", color: "#ffffff",
              border: "2.5px solid #ffffff", textDecoration: "none", cursor: "pointer",
            }}>
              <span style={{
                width: 22, height: 22, borderRadius: "50%",
                border: "2px solid #ffffff",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{
                  width: 0, height: 0,
                  borderTop: "5px solid transparent",
                  borderBottom: "5px solid transparent",
                  borderLeft: "9px solid #ffffff",
                  marginLeft: 2,
                }}/>
              </span>
              See how it works
            </a>

          </div>
        </div>

        {/* ── GROUND SCENE ── */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "42%", zIndex: 2, pointerEvents: "none" }}>

          {/* Back trees */}
          <div style={{
            position: "absolute", bottom: 100, left: "-2%", right: "-2%", height: 200,
            background: `
              radial-gradient(ellipse 18% 80% at 12%  100%, #2e7d32 60%, transparent 61%),
              radial-gradient(ellipse 22% 90% at 25%  100%, #388e3c 60%, transparent 61%),
              radial-gradient(ellipse 16% 75% at 36%  100%, #1b5e20 60%, transparent 61%),
              radial-gradient(ellipse 20% 85% at 48%  100%, #2e7d32 60%, transparent 61%),
              radial-gradient(ellipse 18% 80% at 60%  100%, #33691e 60%, transparent 61%),
              radial-gradient(ellipse 22% 90% at 72%  100%, #388e3c 60%, transparent 61%),
              radial-gradient(ellipse 20% 85% at 83%  100%, #1b5e20 60%, transparent 61%),
              radial-gradient(ellipse 18% 80% at 93%  100%, #2e7d32 60%, transparent 61%)
            `,
          }}/>

          {/* Front trees */}
          <div style={{
            position: "absolute", bottom: 90, left: "-1%", right: "-1%", height: 160,
            background: `
              radial-gradient(ellipse 14% 70% at 5%  100%, #1b5e20 65%, transparent 66%),
              radial-gradient(ellipse 18% 78% at 18% 100%, #2e7d32 65%, transparent 66%),
              radial-gradient(ellipse 14% 65% at 30% 100%, #388e3c 65%, transparent 66%),
              radial-gradient(ellipse 20% 80% at 44% 100%, #1b5e20 65%, transparent 66%),
              radial-gradient(ellipse 16% 72% at 57% 100%, #2e7d32 65%, transparent 66%),
              radial-gradient(ellipse 18% 78% at 70% 100%, #1b5e20 65%, transparent 66%),
              radial-gradient(ellipse 14% 68% at 82% 100%, #388e3c 65%, transparent 66%),
              radial-gradient(ellipse 16% 75% at 94% 100%, #2e7d32 65%, transparent 66%)
            `,
          }}/>

          {/* Flowers */}
          <div style={{ position: "absolute", bottom: 110, left: 0, right: 0, display: "flex", justifyContent: "space-between", padding: "0 3%" }}>
            {[
              { color: "#e53935", size: 18, stem: 22 },
              { color: "#fb8c00", size: 18, stem: 22 },
              { color: "#fdd835", size: 18, stem: 22 },
              { color: "#e53935", size: 14, stem: 16 },
              { color: "#fdd835", size: 18, stem: 22 },
              { color: "#fb8c00", size: 14, stem: 18 },
            ].map((f, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: f.size, height: f.size, borderRadius: "50%", background: f.color }}/>
                <div style={{ width: 2, height: f.stem, background: "#388e3c" }}/>
              </div>
            ))}
          </div>

          {/* Grass */}
          <div style={{
            position: "absolute", bottom: 16, left: 0, right: 0, height: 95,
            background: "radial-gradient(ellipse 100% 100% at 50% 100%, #4caf50 40%, #2e7d32 100%)",
            borderRadius: "55% 55% 0 0 / 30% 30% 0 0",
          }}/>

          {/* Dirt */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 18, background: "#7b4f2e" }}/>

        </div>
      </section>
    </>
  );
}