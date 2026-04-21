import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bgMain   from '../assets/Background.png';
import bgForest from '../assets/Background forest.png';
import beeLogo  from '../assets/Honey Bee Logo.png';

const GEO    = "'Georama', 'Inter', sans-serif";
const YELLOW = '#FED430';

export default function SigninPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  return (
    <div style={s.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Georama:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        input::placeholder { color: rgba(255,255,255,0.35); }
        input:focus { outline: none; }
      `}</style>

      {/* Sky background */}
      <img src={bgMain} alt="" aria-hidden="true" style={s.bgMain} />

      {/* Forest fixed to bottom */}
      <img src={bgForest} alt="" aria-hidden="true" style={s.bgForest} />

      {/* Centered card */}
      <div style={s.card}>

        {/* Logo + brand */}
        <div style={s.brandWrap}>
          <img src={beeLogo} alt="Honey Bee" style={s.logoImg} />
        </div>

        {/* Heading */}
        <p style={s.heading}>Unlock Personalized study planning!</p>

        {/* Email field */}
        <div style={s.fieldWrap}>
          <label style={s.label}>EMAIL</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={s.input}
          />
        </div>

        {/* Primary CTA */}
        <button style={s.btnYellow} onClick={() => navigate('/dashboard')}>
          Create your study plan
        </button>

        {/* Divider */}
        <p style={s.divider}>OR SIGN UP WITH</p>

        {/* Social buttons */}
        <div style={s.socialRow}>
          <button style={s.socialBtn}>
            {/* Google G */}
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Google
          </button>

          <button style={s.socialBtn}>
            {/* Apple */}
            <svg viewBox="0 0 814 1000" width="16" height="16" fill="currentColor" aria-hidden="true">
              <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.5 135.4-317.3 269-317.3 71 0 130.1 46.9 174.4 46.9 42.6 0 109.2-49.9 190.5-49.9 30.3 0 133.6 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"/>
            </svg>
            Apple
          </button>
        </div>

        {/* Disclaimer */}
        <p style={s.disclaimer}>
          We're building a student-focused web application that integrates task planning,
          time tracking, calendar visualization, and an AI-assisted scheduling system to
          support realistic study planning.
        </p>
      </div>
    </div>
  );
}

const s = {
  root: {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    fontFamily: GEO,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
  card: {
    position: 'relative',
    zIndex: 2,
    width: 440,
    background: 'rgba(255,255,255,0.15)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: 24,
    border: '1.5px solid rgba(91,200,232,0.55)',
    padding: '56px 48px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 14,
  },
  brandWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
  },
  logoImg: {
    width: 160,
    height: 'auto',
    display: 'block',
  },
  brandText: {
    fontFamily: GEO,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 3,
    color: YELLOW,
    textTransform: 'uppercase',
  },
  heading: {
    margin: 0,
    fontFamily: GEO,
    fontWeight: 500,
    fontSize: 15,
    color: '#fff',
    textAlign: 'left',
    alignSelf: 'flex-start',
    lineHeight: 1.4,
  },
  fieldWrap: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
  },
  label: {
    fontFamily: GEO,
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: 1.5,
    color: 'rgba(255,255,255,0.85)',
    textTransform: 'uppercase',
  },
  input: {
    width: '100%',
    height: 40,
    borderRadius: 20,
    border: '1.5px solid rgba(255,255,255,0.7)',
    background: 'rgba(255,255,255,0.18)',
    padding: '0 16px',
    fontFamily: GEO,
    fontSize: 14,
    color: '#fff',
  },
  btnYellow: {
    width: '100%',
    height: 44,
    borderRadius: 22,
    background: YELLOW,
    border: 'none',
    fontFamily: GEO,
    fontWeight: 600,
    fontSize: 15,
    color: '#160a00',
    cursor: 'pointer',
    boxShadow: '0 2px 10px rgba(0,0,0,0.18)',
  },
  divider: {
    margin: 0,
    fontFamily: GEO,
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: 1.2,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
  socialRow: {
    width: '100%',
    display: 'flex',
    gap: 12,
  },
  socialBtn: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    background: '#fff',
    border: 'none',
    fontFamily: GEO,
    fontWeight: 500,
    fontSize: 14,
    color: '#1a1a1a',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    boxShadow: '0 1px 6px rgba(0,0,0,0.12)',
  },
  disclaimer: {
    margin: 0,
    fontFamily: GEO,
    fontSize: 10,
    lineHeight: 1.5,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
  },
};
