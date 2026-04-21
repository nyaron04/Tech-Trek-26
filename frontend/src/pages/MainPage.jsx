import { useNavigate } from 'react-router-dom';

export default function MainPage() {
  const navigate = useNavigate();

  return (
    <div style={root}>
      {/* Background image */}
      <img src="/images/main-bg.png" alt="" style={bgImg} aria-hidden="true" />

      {/* Gradient overlay */}
      <div style={gradientOverlay} />

      {/* Nav */}
      <nav style={nav}>
        <div style={hamburger}>
          <span style={hamburgerLine} />
          <span style={hamburgerLine} />
          <span style={hamburgerLine} />
        </div>
        <button style={loginBtn} onClick={() => navigate('/signin')}>
          Login
        </button>
      </nav>

      {/* Hero strip: full-width photo + 4 study photos */}
      <div style={heroStrip}>
        <img src="/images/hero-top-1f71d8.png" alt="" style={heroTopImg} aria-hidden="true" />
        <div style={studyPhotos}>
          <img src="/images/study-photo-1-57c3ee.png" alt="" style={{ ...studyPhoto, width: 184, height: 133 }} />
          <img src="/images/study-photo-2-3bca51.png" alt="" style={{ ...studyPhoto, width: 194, height: 198 }} />
          <img src="/images/study-photo-3-4a6e6a.png" alt="" style={{ ...studyPhoto, width: 160, height: 196 }} />
          <img src="/images/study-photo-4-477872.png" alt="" style={{ ...studyPhoto, width: 175, height: 206 }} />
        </div>
      </div>

      {/* Hero content */}
      <div style={hero}>
        <h1 style={headline}>
          Master your studies with data-driven control
        </h1>

        <img src="/images/studylynk-logo.png" alt="StudyLynk" style={logoImg} />

        <p style={subtext}>
          Stop guessing your study time. StudyLynk learns your behavior to build realistic, feedback-driven plans that actually work for you.
        </p>

        <div style={ctaRow}>
          <button style={primaryCta} onClick={() => navigate('/welcome')}>
            Start planning for free
          </button>

          <button style={secondaryCta}>
            <img src="/images/play-button.png" alt="" style={playIcon} aria-hidden="true" />
            See how it works
          </button>
        </div>
      </div>

      {/* Bottom frosted band */}
      <div style={frostedBand} />
    </div>
  );
}

/* ── styles ─────────────────────────────────────────────── */

const root = {
  position: 'relative',
  width: '100vw',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  overflow: 'hidden',
  fontFamily: 'Inter, sans-serif',
};

const bgImg = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  objectPosition: 'center',
  zIndex: 0,
};

const gradientOverlay = {
  position: 'absolute',
  inset: 0,
  background: 'linear-gradient(180deg, rgba(35, 147, 188, 1) 0%, rgba(13, 42, 53, 0.9) 100%)',
  zIndex: 1,
};

const nav = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 3,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '20px 40px',
};

const hamburger = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  cursor: 'pointer',
};

const hamburgerLine = {
  display: 'block',
  width: 25,
  height: 3,
  background: '#FFFFFF',
  borderRadius: 2,
  boxShadow: '0px 4px 4px rgba(0,0,0,0.25)',
};

const loginBtn = {
  fontFamily: 'Inter, sans-serif',
  fontWeight: 400,
  fontSize: 20,
  lineHeight: '1.21em',
  color: '#FFFFFF',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  textShadow: '0px 4px 4px rgba(0,0,0,0.25)',
};

const heroStrip = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 2,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const heroTopImg = {
  width: '100%',
  height: 325,
  objectFit: 'cover',
  objectPosition: 'center',
  opacity: 0.6,
};

const studyPhotos = {
  display: 'flex',
  gap: 16,
  alignItems: 'flex-end',
  justifyContent: 'center',
  marginTop: -40,
  paddingBottom: 8,
};

const studyPhoto = {
  borderRadius: 12,
  objectFit: 'cover',
  boxShadow: '0px 4px 4px 0px rgba(0,0,0,0.25)',
  opacity: 0.85,
};

const hero = {
  position: 'relative',
  zIndex: 3,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 20,
  maxWidth: 853,
  padding: '0 24px',
  textAlign: 'center',
  marginTop: 'auto',
  marginBottom: 'auto',
  paddingTop: 320,
};

const headline = {
  margin: 0,
  fontFamily: "'Alatsi', sans-serif",
  fontWeight: 400,
  fontSize: 'clamp(36px, 5.07vw, 70px)',
  lineHeight: '1.28em',
  color: '#FFFFFF',
  textShadow: '0px 4px 4px rgba(0,0,0,0.25)',
  maxWidth: 853,
};

const logoImg = {
  width: 284,
  height: 189,
  objectFit: 'contain',
};

const subtext = {
  margin: 0,
  fontFamily: "'Albert Sans', sans-serif",
  fontWeight: 400,
  fontSize: 15,
  lineHeight: '1.2em',
  color: '#FFFFFF',
  maxWidth: 612,
  textShadow: '0px 4px 4px rgba(0,0,0,0.25)',
};

const ctaRow = {
  display: 'flex',
  gap: 20,
  flexWrap: 'wrap',
  justifyContent: 'center',
  marginTop: 8,
};

const primaryCta = {
  width: 249,
  height: 55,
  borderRadius: 20,
  background: '#FED430',
  border: 'none',
  fontFamily: "'Albert Sans', sans-serif",
  fontWeight: 600,
  fontSize: 21,
  lineHeight: '1.2em',
  color: '#160C0C',
  cursor: 'pointer',
  boxShadow: '0px 4px 4px 0px rgba(0,0,0,0.25)',
};

const secondaryCta = {
  width: 249,
  height: 55,
  borderRadius: 20,
  background: '#FFFFFF',
  border: 'none',
  fontFamily: "'Albert Sans', sans-serif",
  fontWeight: 600,
  fontSize: 21,
  lineHeight: '1.2em',
  color: '#160C0C',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  boxShadow: '0px 4px 4px 0px rgba(0,0,0,0.25)',
};

const playIcon = {
  width: 33,
  height: 33,
  objectFit: 'contain',
};

const frostedBand = {
  position: 'absolute',
  bottom: 0,
  left: '50%',
  transform: 'translateX(-50%)',
  width: 913,
  height: 219,
  borderRadius: 20,
  background: 'rgba(217, 217, 217, 0.2)',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)',
  zIndex: 2,
};
