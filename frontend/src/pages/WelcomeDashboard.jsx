import { useState } from "react";

const OPTIONS = [
  { id: "productivity", label: "Team productivity and payroll" },
  { id: "planning", label: "Planning resources effectively" },
  { id: "personal", label: "Personal progress" },
  { id: "other", label: "Other..." },
];

export default function WelcomeDashboard({ onNext }) {
  const [selected, setSelected] = useState(new Set());

  const toggle = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div style={styles.root}>
      {/* Background overlay */}
      <div style={styles.bg} />

      {/* Header */}
      <p style={styles.header}>Welcome</p>

      {/* Main card */}
      <div style={styles.card}>
        <h1 style={styles.title}>Welcome! What are you here to do?</h1>
        <p style={styles.subtitle}>Select all that apply</p>

        <div style={styles.optionList}>
          {OPTIONS.map(({ id, label }) => {
            const isSelected = selected.has(id);
            return (
              <button
                key={id}
                onClick={() => toggle(id)}
                style={{
                  ...styles.option,
                  background: isSelected
                    ? "rgba(254, 212, 48, 0.18)"
                    : "rgba(45, 82, 96, 0.2)",
                  border: isSelected
                    ? "1px solid #FED430"
                    : "1px solid rgba(255, 251, 251, 0.6)",
                }}
              >
                <span style={styles.optionText}>{label}</span>
                <span
                  style={{
                    ...styles.checkbox,
                    background: isSelected ? "#FED430" : "transparent",
                    borderColor: isSelected
                      ? "#FED430"
                      : "rgba(255, 251, 251, 0.7)",
                  }}
                >
                  {isSelected && <CheckIcon />}
                </span>
              </button>
            );
          })}
        </div>

        <button
          style={{
            ...styles.nextBtn,
            opacity: selected.size === 0 ? 0.5 : 1,
            cursor: selected.size === 0 ? "not-allowed" : "pointer",
          }}
          disabled={selected.size === 0}
          onClick={() => onNext?.(Array.from(selected))}
        >
          Next
        </button>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 7L5.5 10.5L12 4"
        stroke="#171717"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const styles = {
  root: {
    position: "relative",
    width: "100vw",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Inter, sans-serif",
    overflow: "hidden",
    // Fallback gradient matching the teal/dark palette seen in the design
    background:
      "linear-gradient(135deg, #0d2a35 0%, #1a4a5a 40%, #2d5260 70%, #0d2a35 100%)",
  },
  bg: {
    position: "absolute",
    inset: 0,
    // Decorative radial glow to approximate the background image
    background:
      "radial-gradient(ellipse at 70% 30%, rgba(45,82,96,0.6) 0%, transparent 60%)," +
      "radial-gradient(ellipse at 20% 80%, rgba(20,50,65,0.8) 0%, transparent 50%)",
    pointerEvents: "none",
  },
  header: {
    position: "absolute",
    top: 24,
    left: 32,
    margin: 0,
    fontFamily: "Inter, sans-serif",
    fontWeight: 400,
    fontSize: 20,
    lineHeight: "1.21",
    color: "#FFFFFF",
    textShadow: "0px 4px 4px rgba(0,0,0,0.25)",
    zIndex: 1,
  },
  card: {
    position: "relative",
    zIndex: 1,
    width: "min(80%, 580px)",
    padding: "52px 56px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 16,
    background: "rgba(45, 82, 96, 0.22)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderRadius: 50,
    boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.25)",
  },
  title: {
    margin: 0,
    fontFamily: "'Albert Sans', Inter, sans-serif",
    fontWeight: 400,
    fontSize: 32,
    lineHeight: "1.2",
    textAlign: "center",
    color: "#FFFFFF",
    textShadow: "0px 4px 4px rgba(0,0,0,0.25)",
  },
  subtitle: {
    margin: "0 0 8px",
    fontFamily: "Inter, sans-serif",
    fontWeight: 400,
    fontSize: 15,
    lineHeight: "1.21",
    textAlign: "center",
    color: "#FFFFFF",
    textShadow: "0px 4px 4px rgba(0,0,0,0.25)",
  },
  optionList: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  option: {
    width: "100%",
    height: 49,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 20,
    paddingRight: 16,
    cursor: "pointer",
    transition: "background 0.15s, border 0.15s",
    boxShadow: "none",
    outline: "none",
  },
  optionText: {
    fontFamily: "Inter, sans-serif",
    fontWeight: 400,
    fontSize: 21,
    lineHeight: "1.21",
    textAlign: "center",
    color: "#FFFCFC",
    textShadow: "0px 4px 4px rgba(0,0,0,0.25)",
    flex: 1,
    textAlign: "left",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    border: "2px solid",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: "background 0.15s, border-color 0.15s",
  },
  nextBtn: {
    marginTop: 12,
    width: 127,
    height: 40,
    borderRadius: 10,
    background: "#FED430",
    border: "none",
    fontFamily: "'Albert Sans', Inter, sans-serif",
    fontWeight: 400,
    fontSize: 20,
    lineHeight: "1.2",
    textAlign: "center",
    color: "#171717",
    boxShadow: "0px 4px 4px rgba(0,0,0,0.25)",
    transition: "opacity 0.15s",
  },
};
