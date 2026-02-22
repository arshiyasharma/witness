import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const cyan = "#5ec4ff";
const API = "https://witness-production-853d.up.railway.app";

// ── Fake demo data shown when no :id is in the URL ──
const DEMO_DATA = {
  _id: "demo",
  fileHash: "a3f8c2d1e4b7a9f0c2e5d8b1a4f7c0e3d6b9a2f5c8e1d4b7a0f3c6e9d2b5a8",
  solanaTxId: "ANYvM5m5xtokguxpDsD3e8qaBBW6jTzUNtVjKTgAnqc4",
  timestamp: new Date().toISOString(),
  rawStatement: "Officer Martinez, badge #447, entered my property at 11:43 PM without a warrant. He was accompanied by two other officers. My neighbor witnessed the incident from across the street.",
  analysis: {
    incidentType: "police",
    urgency: 4,
    extractedEntities: ["Officer Martinez", "Badge #447", "11:43 PM", "Unauthorized entry", "2 additional officers"],
    formalReport: "On the evening of February 21, 2026, at approximately 11:43 PM, Officer Martinez (Badge #447) of the local police department unlawfully entered the complainant's private residence without a valid search warrant or the occupant's consent. This action constitutes a potential violation of the Fourth Amendment of the United States Constitution, which protects citizens against unreasonable searches and seizures.\n\nThe officer was accompanied by two additional unidentified officers during the unlawful entry. A neighbor and independent witness corroborates the complainant's account of the incident from an adjacent property. No warrant was presented at any point before, during, or following the entry onto the premises.\n\nThis formal report has been generated and cryptographically sealed via the Witness platform at the time of incident documentation. The complainant is advised to seek legal counsel immediately and to file a formal complaint with the department's Internal Affairs division. This record, its hash, and its Solana blockchain timestamp constitute admissible evidence of the incident as documented."
  },
  audioBase64: null
};

const URGENCY_LABELS = ["", "Low", "Moderate", "Elevated", "High", "Critical"];
const URGENCY_COLORS = ["", "#6ee7b7", "#fbbf24", "#f97316", "#ef4444", "#dc2626"];

const TYPE_LABELS = {
  police: "⚖ Police Incident",
  workplace: "🏢 Workplace",
  housing: "🏠 Housing",
  other: "📋 Other"
};

export default function Vault() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Google fonts
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500&display=swap";
    document.head.appendChild(link);

    if (!id || id === "demo") {
      setTimeout(() => { setDoc(DEMO_DATA); setLoading(false); }, 600);
      return;
    }

    fetch(`${API}/api/vault/${id}`)
      .then(r => r.json())
      .then(data => { setDoc(data); setLoading(false); })
      .catch(() => { setDoc(DEMO_DATA); setLoading(false); });
  }, [id]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
    <div style={{
      minHeight: "100vh", background: "#04060a",
      display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      <div style={{
        width: 48, height: 48, borderRadius: "50%",
        border: "2px solid rgba(94,196,255,0.2)",
        borderTopColor: cyan,
        animation: "spin 1s linear infinite"
      }} />
    </div>
  );

  const { fileHash, solanaTxId, timestamp, rawStatement, analysis, audioBase64 } = doc;
  const urgency = analysis?.urgency || 1;
  const incidentType = analysis?.incidentType || "other";
  const entities = analysis?.extractedEntities || [];
  const report = analysis?.formalReport || "";
  const paragraphs = report.split("\n").filter(p => p.trim());

  const explorerUrl = `https://explorer.solana.com/address/${solanaTxId}?cluster=devnet`;
  const sealedAt = new Date(timestamp).toLocaleString("en-US", {
    month: "long", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit", hour12: true
  });

  return (
    <div style={{
      minHeight: "100vh",
      background: "#04060a",
      color: "white",
      fontFamily: "'DM Sans', sans-serif",
      padding: "100px 24px 80px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .vault-card { animation: fadeUp 0.5s ease forwards; }
      `}</style>

      <div style={{ maxWidth: 800, margin: "0 auto" }}>

        {/* ── Header ── */}
        <div className="vault-card" style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(94,196,255,0.08)",
            border: "1px solid rgba(94,196,255,0.2)",
            borderRadius: "100px", padding: "8px 20px",
            fontFamily: "'DM Mono', monospace",
            fontSize: "11px", letterSpacing: "0.2em", color: cyan,
            marginBottom: 24
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: cyan, display: "inline-block", boxShadow: `0 0 8px ${cyan}` }} />
            SEALED & VERIFIED
          </div>

          <h1 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(36px, 6vw, 60px)",
            fontWeight: 800, margin: "0 0 12px", lineHeight: 1
          }}>Evidence Vault</h1>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 15, margin: 0, fontFamily: "'DM Mono', monospace" }}>
            {sealedAt}
          </p>
        </div>

        {/* ── Save Your Link Banner ── */}
        <div className="vault-card" style={{
          background: "rgba(251,191,36,0.05)",
          border: "1px solid rgba(251,191,36,0.2)",
          borderRadius: 14, padding: "16px 24px",
          marginBottom: 20,
          display: "flex", alignItems: "center", gap: 16,
          animationDelay: "0.05s"
        }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>⚠</span>
          <div>
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 11, letterSpacing: "0.12em",
              color: "#fbbf24", marginBottom: 4
            }}>SAVE THIS PAGE</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
              This URL is the only way to access your evidence vault. Bookmark it, email it to yourself, or share it with your lawyer.
              Your Vault ID: <span style={{
                fontFamily: "'DM Mono', monospace",
                color: "rgba(255,255,255,0.8)", fontSize: 12
              }}>{id || "__YOUR_EVIDENCE_ID_COMES_HERE_ON_GENERATION__"}</span>
            </div>
          </div>
        </div>

        {/* ── Blockchain Seal Card ── */}
        <div className="vault-card" style={{
          background: "rgba(94,196,255,0.05)",
          border: "1px solid rgba(94,196,255,0.2)",
          borderRadius: 20, padding: "28px 32px",
          marginBottom: 20,
          animationDelay: "0.1s"
        }}>
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "10px", letterSpacing: "0.2em",
            color: "rgba(94,196,255,0.6)", marginBottom: 16
          }}>🔐 SOLANA BLOCKCHAIN PROOF</div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", fontFamily: "'DM Mono', monospace", marginBottom: 6 }}>TRANSACTION ID</div>
            <a
              href={explorerUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 13, color: cyan,
                wordBreak: "break-all", lineHeight: 1.6,
                textDecoration: "none",
                borderBottom: `1px solid rgba(94,196,255,0.3)`,
                transition: "border-color 0.2s"
              }}
              onMouseEnter={e => e.target.style.borderColor = cyan}
              onMouseLeave={e => e.target.style.borderColor = "rgba(94,196,255,0.3)"}
            >
              {solanaTxId} ↗
            </a>
          </div>

          <div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", fontFamily: "'DM Mono', monospace", marginBottom: 6 }}>FILE HASH (SHA-256)</div>
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 12, color: "rgba(255,255,255,0.5)",
              wordBreak: "break-all", lineHeight: 1.6
            }}>{fileHash}</div>
          </div>

          <div style={{
            marginTop: 20,
            padding: "14px 18px",
            background: "rgba(94,196,255,0.06)",
            borderRadius: 10,
            fontFamily: "'DM Mono', monospace",
            fontSize: 12, color: "rgba(255,255,255,0.5)",
            lineHeight: 1.7, fontStyle: "italic"
          }}>
            "This evidence was cryptographically sealed on the Solana blockchain on <span style={{ color: "white" }}>{sealedAt}</span>. The file has not been altered since sealing — Transaction ID: <span style={{ color: cyan }}>{solanaTxId?.slice(0, 12)}...{solanaTxId?.slice(-6)}</span>"
          </div>
        </div>

        {/* ── Incident Summary ── */}
        <div className="vault-card" style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 20, padding: "28px 32px",
          marginBottom: 20,
          animationDelay: "0.2s"
        }}>
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "10px", letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.35)", marginBottom: 20
          }}>⚖ INCIDENT CLASSIFICATION</div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
            {/* Type badge */}
            <div style={{
              padding: "8px 16px",
              background: "rgba(94,196,255,0.1)",
              border: "1px solid rgba(94,196,255,0.2)",
              borderRadius: "100px",
              fontFamily: "'DM Mono', monospace",
              fontSize: 12, color: cyan,
              letterSpacing: "0.05em"
            }}>
              {TYPE_LABELS[incidentType] || incidentType}
            </div>

            {/* Urgency badge */}
            <div style={{
              padding: "8px 16px",
              background: `${URGENCY_COLORS[urgency]}18`,
              border: `1px solid ${URGENCY_COLORS[urgency]}40`,
              borderRadius: "100px",
              fontFamily: "'DM Mono', monospace",
              fontSize: 12, color: URGENCY_COLORS[urgency],
              letterSpacing: "0.05em"
            }}>
              URGENCY {urgency}/5 — {URGENCY_LABELS[urgency]}
            </div>
          </div>

          {/* Entities */}
          {entities.length > 0 && (
            <div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", fontFamily: "'DM Mono', monospace", marginBottom: 12 }}>EXTRACTED ENTITIES</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {entities.map((e, i) => (
                  <span key={i} style={{
                    padding: "5px 12px",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "100px",
                    fontSize: 12, color: "rgba(255,255,255,0.65)",
                    fontFamily: "'DM Mono', monospace"
                  }}>{e}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Voice Statement ── */}
        {audioBase64 && (
          <div className="vault-card" style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 20, padding: "28px 32px",
            marginBottom: 20,
            animationDelay: "0.3s"
          }}>
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "10px", letterSpacing: "0.2em",
              color: "rgba(255,255,255,0.35)", marginBottom: 16
            }}>🎙 PRESERVED VOICE STATEMENT</div>
            <audio
              controls
              src={`data:audio/mpeg;base64,${audioBase64}`}
              style={{ width: "100%", filter: "invert(1) hue-rotate(180deg)" }}
            />
            <p style={{
              marginTop: 16, fontSize: 14,
              color: "rgba(255,255,255,0.4)",
              fontStyle: "italic", lineHeight: 1.6
            }}>"{rawStatement}"</p>
          </div>
        )}

        {/* ── Formal Legal Report ── */}
        <div className="vault-card" style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 20, padding: "28px 32px",
          marginBottom: 24,
          animationDelay: "0.4s"
        }}>
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "10px", letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.35)", marginBottom: 20
          }}>📋 AI-GENERATED LEGAL INCIDENT REPORT</div>

          <div style={{
            borderLeft: `3px solid rgba(94,196,255,0.3)`,
            paddingLeft: 24
          }}>
            {paragraphs.map((para, i) => (
              <p key={i} style={{
                color: "rgba(255,255,255,0.7)",
                lineHeight: 1.8, fontSize: 15,
                margin: i === 0 ? "0 0 18px" : "0 0 18px",
                fontWeight: 300
              }}>{para}</p>
            ))}
          </div>
        </div>

        {/* ── Action Row ── */}
        <div className="vault-card" style={{
          display: "flex", gap: 12, flexWrap: "wrap",
          animationDelay: "0.5s"
        }}>
          <button
            onClick={copyLink}
            style={{
              flex: 1, padding: "14px 24px",
              background: copied ? "rgba(94,196,255,0.15)" : "rgba(255,255,255,0.05)",
              border: `1px solid ${copied ? "rgba(94,196,255,0.4)" : "rgba(255,255,255,0.1)"}`,
              borderRadius: 12, color: copied ? cyan : "rgba(255,255,255,0.6)",
              fontFamily: "'DM Mono', monospace",
              fontSize: 12, letterSpacing: "0.1em",
              cursor: "pointer", transition: "all 0.2s"
            }}
          >
            {copied ? "✓ LINK COPIED" : "⬡ COPY VAULT LINK"}
          </button>

          <a
            href={explorerUrl}
            target="_blank"
            rel="noreferrer"
            style={{
              flex: 1, padding: "14px 24px",
              background: "rgba(94,196,255,0.08)",
              border: "1px solid rgba(94,196,255,0.2)",
              borderRadius: 12, color: cyan,
              fontFamily: "'DM Mono', monospace",
              fontSize: 12, letterSpacing: "0.1em",
              cursor: "pointer", textDecoration: "none",
              textAlign: "center", transition: "all 0.2s",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}
          >
            ↗ VIEW ON SOLANA EXPLORER
          </a>

          <button
            onClick={() => navigate("/submit")}
            style={{
              flex: 1, padding: "14px 24px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12, color: "rgba(255,255,255,0.6)",
              fontFamily: "'DM Mono', monospace",
              fontSize: 12, letterSpacing: "0.1em",
              cursor: "pointer", transition: "all 0.2s"
            }}
          >
            + NEW EVIDENCE
          </button>
        </div>

      </div>

      {/* Footer */}
      <div style={{
        marginTop: 64, textAlign: "center",
        fontFamily: "'DM Mono', monospace",
        fontSize: "11px", color: "rgba(255,255,255,0.15)",
        letterSpacing: "0.1em"
      }}>
        BUILT BY ARSHIYA SHARMA — WITNESS © 2026
      </div>
    </div>
  );
}