import { useNavigate } from 'react-router-dom';
import bgMain   from '../assets/Background.png';
import bgForest from '../assets/Background forest.png';
import beeLogo  from '../assets/Honey Bee Logo.png';
import beeFly   from '../assets/bee flying.png';

const GEO    = "'Georama', 'Inter', sans-serif";
const YELLOW = '#FED430';

// Each bee: anchor position, ellipse radii, size, animation timing
const BEES = [
  { id: 1, pos: { top: 72,    left: 195 }, rx: 28, ry: 16, size: 80, dur: '22s', delay: '0s',   kf: 'bee1' },
  { id: 2, pos: { top: 90,    right: 190 }, rx: 34, ry: 20, size: 80, dur: '26s', delay: '5s',   kf: 'bee2' },
  { id: 3, pos: { top: '43%', left: 38   }, rx: 26, ry: 15, size: 80, dur: '20s', delay: '9s',   kf: 'bee3' },
  { id: 4, pos: { top: '48%', right: 62  }, rx: 32, ry: 20, size: 80, dur: '28s', delay: '14s',  kf: 'bee4' },
];

export default function MainPage() {
  const navigate = useNavigate();

  return (
    <div style={s.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Georama:wght@300;400;500;600;700&display=swap');

        @keyframes bee1 {
          0%   { transform: translate(  0px,   0px) rotate(-4deg); }
          16%  { transform: translate( 40px, -25px) rotate( 3deg); }
          33%  { transform: translate( 75px, -10px) rotate(-3deg); }
          50%  { transform: translate( 60px,  30px) rotate( 5deg); }
          66%  { transform: translate( 20px,  50px) rotate(-4deg); }
          83%  { transform: translate(-15px,  25px) rotate( 2deg); }
          100% { transform: translate(  0px,   0px) rotate(-4deg); }
        }
        @keyframes bee2 {
          0%   { transform: translate(  0px,   0px) rotate( 5deg); }
          14%  { transform: translate(-35px,  20px) rotate(-4deg); }
          28%  { transform: translate(-70px,  10px) rotate( 3deg); }
          42%  { transform: translate(-80px,  45px) rotate(-5deg); }
          57%  { transform: translate(-50px,  70px) rotate( 4deg); }
          71%  { transform: translate(-15px,  55px) rotate(-3deg); }
          85%  { transform: translate( 10px,  25px) rotate( 4deg); }
          100% { transform: translate(  0px,   0px) rotate( 5deg); }
        }
        @keyframes bee3 {
          0%   { transform: translate(  0px,   0px) rotate(-3deg); }
          15%  { transform: translate( 50px, -20px) rotate( 5deg); }
          30%  { transform: translate( 80px, -35px) rotate(-3deg); }
          45%  { transform: translate( 65px,  10px) rotate( 4deg); }
          60%  { transform: translate( 30px,  40px) rotate(-5deg); }
          75%  { transform: translate(-10px,  30px) rotate( 3deg); }
          88%  { transform: translate(-20px,  10px) rotate(-2deg); }
          100% { transform: translate(  0px,   0px) rotate(-3deg); }
        }
        @keyframes bee4 {
          0%   { transform: translate(  0px,   0px) rotate( 4deg); }
          13%  { transform: translate(-45px, -15px) rotate(-5deg); }
          27%  { transform: translate(-75px, -30px) rotate( 3deg); }
          42%  { transform: translate(-60px,  15px) rotate(-4deg); }
          58%  { transform: translate(-25px,  50px) rotate( 5deg); }
          73%  { transform: translate( 15px,  40px) rotate(-3deg); }
          87%  { transform: translate( 20px,  15px) rotate( 4deg); }
          100% { transform: translate(  0px,   0px) rotate( 4deg); }
        }
      `}</style>

      {/* Sky background */}
      <img src={bgMain} alt="" aria-hidden="true" style={s.bgMain} />

      {/* Forest fixed to bottom */}
      <img src={bgForest} alt="" aria-hidden="true" style={s.bgForest} />

      {/* Top nav */}
      <nav style={s.nav}>
        {/* Logo */}
        <div style={s.brand}>
          <img src={beeLogo} alt="Honey Bee" style={s.brandImg} />
        </div>

        {/* Hamburger — far right */}
        <div style={s.hamburger}>
          <span style={s.hLine} />
          <span style={s.hLine} />
          <span style={s.hLine} />
        </div>
      </nav>

      {/* Animated bees + dashed oval trails */}
      {BEES.map(({ id, pos, size, dur, delay, kf }) => (
        <div
          key={id}
          style={{ position: 'absolute', width: 0, height: 0, zIndex: 4, pointerEvents: 'none', ...pos }}
        >
          {/* Bee image, centered on anchor, animated along wandering path */}
          <img
            src={beeFly}
            alt=""
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: -(size / 2),
              top: -(size / 2),
              width: size,
              height: 'auto',
              animation: `${kf} ${dur} ease-in-out infinite ${delay}`,
            }}
          />
        </div>
      ))}

      {/* Hero content */}
      <div style={s.hero}>
        <h1 style={s.heading}>
          Master your <span style={{ color: YELLOW }}>studies</span> with
          <br />
          <span style={{ color: YELLOW }}>data-driven</span> control
        </h1>

        <p style={s.sub}>
          Stop guessing your study time. StudyLynk learns your behavior to build realistic,
          <br />
          feedback-driven plans that actually work for you.
        </p>

        <div style={s.btnRow}>
          <button style={s.btnYellow} onClick={() => navigate('/signin')}>
            Login to your account
          </button>

          <button style={s.btnOutline} onClick={() => navigate('/dashboard')}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="10" stroke="currentColor" strokeWidth="1.8" />
              <polygon points="9,7 16,11 9,15" fill="currentColor" />
            </svg>
            See how it works
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── styles ── */
const s = {
  root: {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    fontFamily: GEO,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: '#2b9ec7',
  },
  bgMain: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center',
    zIndex: 0,
  },
  bgForest: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    zIndex: 1,
    pointerEvents: 'none',
    display: 'block',
    filter: 'blur(3px)',
  },
  nav: {
    position: 'relative',
    zIndex: 5,
    width: '100%',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: '18px 28px 0',
    flexShrink: 0,
  },
  brand: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 3,
  },
  brandImg: {
    width: 160,
    height: 'auto',
    display: 'block',
  },
  brandText: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 2.5,
    color: YELLOW,
    fontFamily: GEO,
  },
  hamburger: {
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
    cursor: 'pointer',
    paddingTop: 6,
  },
  hLine: {
    display: 'block',
    width: 24,
    height: 2.5,
    background: '#fff',
    borderRadius: 2,
    boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
  },
  hero: {
    position: 'relative',
    zIndex: 3,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    gap: 18,
    padding: '0 24px',
    paddingBottom: '28vh',
  },
  heading: {
    margin: 0,
    fontFamily: GEO,
    fontWeight: 700,
    fontSize: 'clamp(30px, 4.2vw, 60px)',
    lineHeight: 1.25,
    color: '#fff',
    textShadow: '0 2px 8px rgba(0,0,0,0.18)',
  },
  sub: {
    margin: 0,
    fontFamily: GEO,
    fontWeight: 400,
    fontSize: 'clamp(13px, 1.1vw, 15px)',
    color: 'rgba(255,255,255,0.92)',
    lineHeight: 1.6,
    maxWidth: 520,
    textShadow: '0 1px 4px rgba(0,0,0,0.15)',
  },
  btnRow: {
    display: 'flex',
    gap: 16,
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 6,
  },
  btnYellow: {
    height: 50,
    padding: '0 30px',
    borderRadius: 30,
    background: YELLOW,
    border: 'none',
    fontFamily: GEO,
    fontWeight: 600,
    fontSize: 17,
    color: '#160a00',
    cursor: 'pointer',
    boxShadow: '0 3px 14px rgba(0,0,0,0.22)',
    whiteSpace: 'nowrap',
  },
  btnOutline: {
    height: 50,
    padding: '0 26px',
    borderRadius: 30,
    background: 'rgba(255,255,255,0.12)',
    border: '2px solid rgba(255,255,255,0.9)',
    fontFamily: GEO,
    fontWeight: 500,
    fontSize: 17,
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 9,
    whiteSpace: 'nowrap',
    boxShadow: '0 3px 14px rgba(0,0,0,0.18)',
  },
};
