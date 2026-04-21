// Shared design tokens derived from Figma (Triple B / StudyLynk)
export const colors = {
  yellow: '#FED430',
  white: '#FFFFFF',
  offWhite: '#FFFCFC',
  black: '#171717',
  darkBlack: '#160C0C',
  cardBg: 'rgba(45, 82, 96, 0.2)',
  cardBgSelected: 'rgba(254, 212, 48, 0.18)',
  borderWhite: 'rgba(255, 251, 251, 0.6)',
  borderYellow: '#FED430',
  overlayDark: 'rgba(217, 217, 217, 0.2)',
};

export const fonts = {
  heading: "'Albert Sans', Inter, sans-serif",
  body: "Inter, sans-serif",
};

export const shadow = {
  box: '0px 4px 4px 0px rgba(0,0,0,0.25)',
  text: '0px 4px 4px rgba(0,0,0,0.25)',
};

// Shared base layout: full-screen teal gradient background
export const rootStyle = {
  position: 'relative',
  width: '100vw',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: fonts.body,
  overflow: 'hidden',
  background:
    'linear-gradient(135deg, #0d2a35 0%, #1a4a5a 40%, #2d5260 70%, #0d2a35 100%)',
};

// Glass-morphism card matching Figma (1118x733, borderRadius 50px)
export const glassCard = {
  position: 'relative',
  zIndex: 1,
  width: 'min(82%, 620px)',
  padding: '48px 56px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 16,
  background: colors.cardBg,
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  borderRadius: 50,
  boxShadow: shadow.box,
};

export const pageHeader = {
  position: 'absolute',
  top: 24,
  left: 32,
  margin: 0,
  fontFamily: fonts.body,
  fontWeight: 400,
  fontSize: 20,
  color: colors.white,
  textShadow: shadow.text,
  zIndex: 1,
};

export const titleStyle = {
  margin: 0,
  fontFamily: fonts.heading,
  fontWeight: 400,
  fontSize: 32,
  lineHeight: '1.2',
  textAlign: 'center',
  color: colors.white,
  textShadow: shadow.text,
};

export const subtitleStyle = {
  margin: '0 0 8px',
  fontFamily: fonts.body,
  fontWeight: 400,
  fontSize: 15,
  lineHeight: '1.21',
  textAlign: 'center',
  color: colors.white,
  textShadow: shadow.text,
};

export const yellowBtn = {
  height: 40,
  borderRadius: 10,
  background: colors.yellow,
  border: 'none',
  fontFamily: fonts.heading,
  fontWeight: 400,
  fontSize: 20,
  lineHeight: '1.2',
  textAlign: 'center',
  color: colors.black,
  boxShadow: shadow.box,
  cursor: 'pointer',
  transition: 'opacity 0.15s',
  padding: '0 24px',
};

export const ghostBtn = {
  height: 40,
  borderRadius: 10,
  background: 'transparent',
  border: `1px solid ${colors.white}`,
  fontFamily: fonts.body,
  fontWeight: 400,
  fontSize: 20,
  lineHeight: '1.2',
  textAlign: 'center',
  color: colors.white,
  cursor: 'pointer',
  transition: 'opacity 0.15s',
  padding: '0 24px',
};
