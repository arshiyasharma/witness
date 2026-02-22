import { useNavigate } from "react-router-dom";

const cyan = "#5ec4ff";

export default function Verify() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: "100vh",
      background: "#04060a",
      color: "white",
      fontFamily: "'DM Sans', sans-serif",
      overflowX: "hidden",
      padding: "120px 28px 100px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        .v-card { animation: fadeUp 0.6s ease forwards; }
      `}</style>

      {/* Ambient */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "20%", right: "5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(94,196,255,0.05) 0%, transparent 70%)", filter: "blur(60px)" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 800, margin: "0 auto" }}>

        {/* Header */}
        <div className="v-card" style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", letterSpacing: "0.25em", color: cyan, marginBottom: 20, border: "1px solid rgba(94,196,255,0.2)", padding: "6px 18px", borderRadius: "100px", display: "inline-block", background: "rgba(94,196,255,0.06)" }}>
            INDEPENDENT VERIFICATION
          </div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(36px, 6vw, 60px)", fontWeight: 800, margin: "0 0 20px", lineHeight: 1.05 }}>
            Verify any evidence.<br />
            <span style={{ background: "linear-gradient(90deg, #5ec4ff, #2a9fd6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>No trust required.</span>
          </h1>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.45)", maxWidth: 580, margin: "0 auto", lineHeight: 1.7, fontWeight: 300 }}>
            Anyone — a judge, journalist, or lawyer — can independently verify a Witness record using only public tools. Here's exactly how.
          </p>
        </div>

        {/* Steps */}
        <div style={{ display: "flex", flexDirection: "column", gap: 3, marginBottom: 48 }}>

          {/* Step 1 */}
          <div className="v-card" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "32px", animationDelay: "0.1s" }}>
            <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(94,196,255,0.1)", border: "1px solid rgba(94,196,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Mono', monospace", fontSize: 13, color: cyan, flexShrink: 0, fontWeight: 500 }}>01</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 10 }}>Open Solana Explorer</div>
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, lineHeight: 1.7, marginBottom: 14 }}>
                  Every piece of evidence sealed on Witness has a Solana Transaction ID visible on its vault page. Paste it into Solana Explorer — a fully public, decentralized ledger. Under <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "rgba(255,255,255,0.7)", background: "rgba(255,255,255,0.06)", padding: "1px 6px", borderRadius: 4 }}>Instruction Data</span>, you'll see the raw SHA-256 hash that was permanently written on-chain at the exact timestamp.
                </p>
                <a href="https://explorer.solana.com/?cluster=devnet" target="_blank" rel="noreferrer"
                  style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: cyan, textDecoration: "underline", textDecorationColor: "rgba(94,196,255,0.3)", letterSpacing: "0.08em" }}>
                  ↗ OPEN SOLANA EXPLORER
                </a>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="v-card" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "32px", animationDelay: "0.2s" }}>
            <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(94,196,255,0.1)", border: "1px solid rgba(94,196,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Mono', monospace", fontSize: 13, color: cyan, flexShrink: 0, fontWeight: 500 }}>02</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 10 }}>Hash the original file yourself</div>
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>
                  If you have access to the original file, run one of these commands. It takes under a second and requires no special software — just a terminal.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    { os: "Mac / Linux", cmd: "shasum -a 256 yourfile.mp4" },
                    { os: "Windows", cmd: "certutil -hashfile yourfile.mp4 SHA256" },
                  ].map(({ os, cmd }) => (
                    <div key={os} style={{ background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "12px 16px" }}>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "rgba(94,196,255,0.5)", letterSpacing: "0.15em", marginBottom: 6 }}>{os.toUpperCase()}</div>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{cmd}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="v-card" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "32px", animationDelay: "0.3s" }}>
            <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(94,196,255,0.1)", border: "1px solid rgba(94,196,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Mono', monospace", fontSize: 13, color: cyan, flexShrink: 0, fontWeight: 500 }}>03</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 10 }}>Compare the hashes</div>
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>
                  If your locally-computed hash matches the one recorded on the Solana blockchain — the file is cryptographically proven authentic. If even a single byte was altered after sealing, the hash will be completely different. No match means tampering.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {[
                    { label: "HASHES MATCH", icon: "✓", color: "#6ee7b7", desc: "File is authentic and unaltered since sealing" },
                    { label: "HASHES DIFFER", icon: "✗", color: "#ff5c5c", desc: "File has been modified after the blockchain seal" },
                  ].map(({ label, icon, color, desc }) => (
                    <div key={label} style={{ background: `${color}08`, border: `1px solid ${color}25`, borderRadius: 10, padding: "14px 16px" }}>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color, letterSpacing: "0.15em", marginBottom: 6 }}>{icon} {label}</div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>{desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Key point */}
        <div className="v-card" style={{ background: "rgba(94,196,255,0.04)", border: "1px solid rgba(94,196,255,0.12)", borderRadius: 16, padding: "28px 32px", marginBottom: 48, animationDelay: "0.4s" }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", letterSpacing: "0.2em", color: "rgba(94,196,255,0.6)", marginBottom: 12 }}>WHY THIS MATTERS</div>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", lineHeight: 1.8, margin: 0, fontWeight: 300 }}>
            The Solana blockchain is permanent, public, and decentralized. This means <span style={{ color: "rgba(255,255,255,0.85)" }}>Witness itself cannot alter or delete a record</span> once it's been sealed. No company, no government, no legal pressure can touch it. The verification process above requires zero trust in Witness — the math does the work.
          </p>
        </div>

        {/* CTAs */}
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => navigate("/submit")}
            style={{ fontFamily: "'DM Mono', monospace", fontSize: "12px", letterSpacing: "0.15em", padding: "14px 36px", background: "linear-gradient(135deg, #5ec4ff, #2a9fd6)", color: "#04060a", border: "none", borderRadius: "100px", cursor: "pointer", boxShadow: "0 0 30px rgba(94,196,255,0.25)", transition: "transform 0.2s" }}
            onMouseEnter={e => e.target.style.transform = "scale(1.03)"}
            onMouseLeave={e => e.target.style.transform = "scale(1)"}
          >SEAL EVIDENCE NOW →</button>
          <button onClick={() => navigate("/vault")}
            style={{ fontFamily: "'DM Mono', monospace", fontSize: "12px", letterSpacing: "0.15em", padding: "14px 36px", background: "transparent", color: cyan, border: `1px solid ${cyan}`, borderRadius: "100px", cursor: "pointer", transition: "all 0.2s" }}
            onMouseEnter={e => { e.target.style.background = "rgba(94,196,255,0.08)"; }}
            onMouseLeave={e => { e.target.style.background = "transparent"; }}
          >VIEW DEMO VAULT</button>
        </div>

      </div>

      <div style={{ textAlign: "center", marginTop: 80, padding: "32px", borderTop: "1px solid rgba(255,255,255,0.05)", fontFamily: "'DM Mono', monospace", fontSize: "11px", color: "rgba(255,255,255,0.15)", letterSpacing: "0.1em" }}>
        BUILT BY ARSHIYA SHARMA — WITNESS © 2026
      </div>
    </div>
  );
}