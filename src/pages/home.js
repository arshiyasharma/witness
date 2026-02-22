import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const cyan = "#5ec4ff";
const cyanDim = "rgba(94,196,255,0.12)";

export default function Home() {
  const navigate = useNavigate();
  const sectionsRef = useRef([]);

  useEffect(() => {
    // Google Fonts
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500&display=swap";
    document.head.appendChild(link);

    // Scroll fade-in
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity = "1";
          e.target.style.transform = "translateY(0)";
        }
      }),
      { threshold: 0.15 }
    );
    sectionsRef.current.forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const addRef = (el) => { if (el && !sectionsRef.current.includes(el)) sectionsRef.current.push(el); };

  const fadeStyle = {
    opacity: 0,
    transform: "translateY(32px)",
    transition: "opacity 0.7s ease, transform 0.7s ease"
  };

  const steps = [
    {
      num: "01",
      title: "Capture & Upload",
      desc: "Drag and drop any video, image, or audio file. The moment it lands, Witness generates a SHA-256 cryptographic fingerprint — a unique hash that proves this exact file existed at this exact moment.",
      icon: "⬆"
    },
    {
      num: "02",
      title: "Blockchain Seal",
      desc: "Your file hash is written to the Solana blockchain in under 4 seconds. No government, no corporation, no court order can erase it. The ledger is permanent and public.",
      icon: "⛓"
    },
    {
      num: "03",
      title: "AI + Voice Report",
      desc: "Describe what happened. Our AI extracts entities, classifies the incident, assigns urgency, and generates a formal 3-paragraph legal-style report. ElevenLabs preserves your voice statement as audio evidence.",
      icon: "🎙"
    }
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#04060a",
      color: "white",
      fontFamily: "'DM Sans', sans-serif",
      overflowX: "hidden"
    }}>

      {/* Ambient background blobs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{
          position: "absolute", top: "15%", left: "60%",
          width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(94,196,255,0.06) 0%, transparent 70%)",
          filter: "blur(40px)"
        }} />
        <div style={{
          position: "absolute", top: "50%", left: "10%",
          width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(94,196,255,0.04) 0%, transparent 70%)",
          filter: "blur(60px)"
        }} />
      </div>

      {/* ───── HERO ───── */}
      <section style={{
        position: "relative", zIndex: 1,
        minHeight: "100vh",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        textAlign: "center",
        padding: "120px 24px 80px"
      }}>

        {/* Eyebrow */}
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "11px", letterSpacing: "0.25em",
          color: cyan, marginBottom: "28px",
          border: `1px solid ${cyanDim}`,
          padding: "6px 16px", borderRadius: "100px",
          background: "rgba(94,196,255,0.06)"
        }}>
          BLOCKCHAIN-SEALED LEGAL EVIDENCE
        </div>

        {/* Main title */}
        <h1 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "clamp(72px, 12vw, 140px)",
          fontWeight: 800, lineHeight: 0.9,
          margin: "0 0 32px",
          background: "linear-gradient(160deg, #ffffff 30%, #8dd8ff 70%, #5ec4ff 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          letterSpacing: "-0.02em"
        }}>
          Witness
        </h1>

        {/* Tagline */}
        <p style={{
          fontSize: "clamp(16px, 2.5vw, 22px)",
          color: "rgba(255,255,255,0.55)",
          maxWidth: 640, lineHeight: 1.6,
          margin: "0 0 52px",
          fontWeight: 300
        }}>
          Turn your phone into a legally-defensible evidence machine —<br />
          <span style={{ color: "rgba(255,255,255,0.8)" }}>cryptographically sealed, permanently timestamped, and structured for court.</span>
        </p>

        {/* CTA */}
        <button
          onClick={() => navigate("/submit")}
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "13px", letterSpacing: "0.15em",
            fontWeight: 500,
            padding: "16px 40px",
            background: "linear-gradient(135deg, #5ec4ff, #2a9fd6)",
            color: "#04060a",
            border: "none", borderRadius: "100px",
            cursor: "pointer",
            boxShadow: "0 0 40px rgba(94,196,255,0.3)",
            transition: "transform 0.2s, box-shadow 0.2s"
          }}
          onMouseEnter={e => {
            e.target.style.transform = "scale(1.04)";
            e.target.style.boxShadow = "0 0 60px rgba(94,196,255,0.5)";
          }}
          onMouseLeave={e => {
            e.target.style.transform = "scale(1)";
            e.target.style.boxShadow = "0 0 40px rgba(94,196,255,0.3)";
          }}
        >
          UPLOAD EVIDENCE →
        </button>

        {/* Demo quote card */}
        <div style={{
          marginTop: 72,
          maxWidth: 700,
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 16,
          padding: "24px 32px",
          textAlign: "left",
          backdropFilter: "blur(10px)"
        }}>
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "11px", letterSpacing: "0.15em",
            color: cyan, marginBottom: 12
          }}>
            EXAMPLE SEALED RECORD
          </div>
          <p style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "13px",
            color: "rgba(255,255,255,0.6)",
            lineHeight: 1.7, margin: 0
          }}>
            "This video was recorded at <span style={{ color: "white" }}>11:43 PM on Feb 21, 2026</span>. Its contents were cryptographically sealed on the Solana blockchain within <span style={{ color: cyan }}>4 seconds</span> of recording — Transaction ID: <span style={{ color: cyan }}>4xK9...mNp2</span>. The file has not been altered since."
          </p>
        </div>
      </section>

      {/* ───── PROBLEM SECTION ───── */}
      <section ref={addRef} style={{ ...fadeStyle, position: "relative", zIndex: 1, padding: "100px 24px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "11px", letterSpacing: "0.25em", color: cyan, marginBottom: 20
        }}>THE PROBLEM</div>
        <h2 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 700,
          lineHeight: 1.15, margin: "0 0 28px",
          color: "white"
        }}>
          Evidence gets deleted.<br />
          <span style={{ color: "rgba(255,255,255,0.35)" }}>Every single day.</span>
        </h2>
        <p style={{
          fontSize: 18, color: "rgba(255,255,255,0.5)",
          lineHeight: 1.8, maxWidth: 680, fontWeight: 300
        }}>
          Platforms remove videos. Authorities confiscate phones. Legal pressure buries footage. 
          And even when evidence survives, proving it wasn't manipulated is nearly impossible in court.
          There's never been a tool that <span style={{ color: "rgba(255,255,255,0.85)" }}>captures, timestamps, and legally structures</span> evidence for people who can't trust the system — until now.
        </p>
      </section>

      {/* ───── HOW IT WORKS ───── */}
      <section style={{ position: "relative", zIndex: 1, padding: "60px 24px 120px", maxWidth: 1100, margin: "0 auto" }}>
        <div ref={addRef} style={{ ...fadeStyle, textAlign: "center", marginBottom: 64 }}>
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "11px", letterSpacing: "0.25em", color: cyan, marginBottom: 16
          }}>HOW IT WORKS</div>
          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, margin: 0
          }}>Three steps. Permanent proof.</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
          {steps.map((step, i) => (
            <div
              key={i}
              ref={addRef}
              style={{
                ...fadeStyle,
                transitionDelay: `${i * 0.15}s`,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 20,
                padding: "36px 32px",
                position: "relative",
                overflow: "hidden",
                transition: "opacity 0.7s ease, transform 0.7s ease, border-color 0.3s"
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(94,196,255,0.3)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"}
            >
              <div style={{
                position: "absolute", top: 24, right: 24,
                fontFamily: "'DM Mono', monospace",
                fontSize: "11px", color: "rgba(94,196,255,0.4)",
                letterSpacing: "0.2em"
              }}>{step.num}</div>
              <div style={{ fontSize: 32, marginBottom: 20 }}>{step.icon}</div>
              <h3 style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 22, fontWeight: 700,
                margin: "0 0 14px", color: "white"
              }}>{step.title}</h3>
              <p style={{
                fontSize: 15, color: "rgba(255,255,255,0.5)",
                lineHeight: 1.7, margin: 0, fontWeight: 300
              }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───── FINAL CTA ───── */}
      <section ref={addRef} style={{
        ...fadeStyle, position: "relative", zIndex: 1,
        textAlign: "center", padding: "80px 24px 140px"
      }}>
        <div style={{
          display: "inline-block",
          background: "rgba(94,196,255,0.05)",
          border: "1px solid rgba(94,196,255,0.15)",
          borderRadius: 24,
          padding: "64px 80px"
        }}>
          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(28px, 4vw, 44px)",
            fontWeight: 700, margin: "0 0 16px"
          }}>Your evidence deserves to survive.</h2>
          <p style={{
            color: "rgba(255,255,255,0.45)", fontSize: 17,
            margin: "0 0 36px", fontWeight: 300
          }}>Seal it to the blockchain. Make it unkillable.</p>
          <button
            onClick={() => navigate("/submit")}
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "13px", letterSpacing: "0.15em",
              padding: "16px 40px",
              background: "transparent",
              color: cyan,
              border: `1px solid ${cyan}`,
              borderRadius: "100px",
              cursor: "pointer",
              transition: "background 0.2s, color 0.2s, box-shadow 0.2s"
            }}
            onMouseEnter={e => {
              e.target.style.background = cyan;
              e.target.style.color = "#04060a";
              e.target.style.boxShadow = "0 0 40px rgba(94,196,255,0.4)";
            }}
            onMouseLeave={e => {
              e.target.style.background = "transparent";
              e.target.style.color = cyan;
              e.target.style.boxShadow = "none";
            }}
          >
            UPLOAD EVIDENCE →
          </button>
        </div>
      </section>

      {/* ───── FOOTER ───── */}
      <footer style={{
        position: "relative", zIndex: 1,
        textAlign: "center",
        padding: "32px",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        fontFamily: "'DM Mono', monospace",
        fontSize: "12px",
        color: "rgba(255,255,255,0.2)",
        letterSpacing: "0.1em"
      }}>
        BUILT BY ARSHIYA SHARMA — WITNESS © 2026
      </footer>
    </div>
  );
}