import { useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import bgMain   from '../assets/Background.png';
import bgForest from '../assets/Background forest.png';

const GEO    = "'Georama', 'Inter', sans-serif";
const YELLOW = '#FED430';

export default function TaskCompleted() {
  const navigate = useNavigate();

  return (
    <div style={s.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Georama:wght@300;400;500;600;700;800&display=swap');
      `}</style>

      {/* Full-page confetti */}
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        colors={['#FED430', '#FFD700', '#FFFFFF', '#5BC8E8', '#FF6B6B']}
        numberOfPieces={350}
        gravity={0.15}
        recycle={false}
      />

      {/* Sky background */}
      <img src={bgMain} alt="" aria-hidden="true" style={s.bgMain} />

      {/* Forest fixed to bottom */}
      <img src={bgForest} alt="" aria-hidden="true" style={s.bgForest} />

      {/* Centered content */}
      <div style={s.content}>
        <div style={s.trophy}>🏆</div>
        <h1 style={s.heading}>Task Completed!</h1>
        <button style={s.btn} onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
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
  content: {
    position: 'relative',
    zIndex: 3,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 24,
    paddingBottom: '12vh',
  },
  trophy: {
    fontSize: 80,
    lineHeight: 1,
    filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.35))',
  },
  heading: {
    margin: 0,
    fontFamily: GEO,
    fontWeight: 800,
    fontSize: 64,
    color: '#fff',
    textShadow: '0 4px 24px rgba(0,0,0,0.35), 0 2px 8px rgba(0,0,0,0.25)',
    letterSpacing: '-0.5px',
    textAlign: 'center',
  },
  btn: {
    height: 52,
    padding: '0 40px',
    borderRadius: 30,
    background: YELLOW,
    border: 'none',
    fontFamily: GEO,
    fontWeight: 600,
    fontSize: 18,
    color: '#160a00',
    cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
    marginTop: 8,
  },
};
