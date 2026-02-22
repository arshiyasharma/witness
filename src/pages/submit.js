import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const cyan = "#5ec4ff";
const API = "https://witness-production-853d.up.railway.app";

const STEPS = [
  { key: "uploading",   label: "Uploading & Hashing",      icon: "⬆", detail: "Generating SHA-256 fingerprint..." },
  { key: "sealing",     label: "Sealing to Blockchain",    icon: "⛓", detail: "Writing hash to Solana devnet..." },
  { key: "voice",       label: "Generating Voice Record",  icon: "🎙", detail: "ElevenLabs preserving your statement..." },
  { key: "analyzing",   label: "AI Legal Analysis",        icon: "⚖", detail: "Extracting entities & drafting report..." },
  { key: "done",        label: "Vault Sealed",             icon: "✓", detail: "Redirecting to your evidence vault..." },
];

export default function Submit() {
  const navigate = useNavigate();
  const [statement, setStatement] = useState("");
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [currentStep, setCurrentStep] = useState(null); // null = idle, or step key
  const [completedSteps, setCompletedSteps] = useState([]);
  const [error, setError] = useState(null);
  const fileInputRef = useRef();

  const isProcessing = currentStep !== null;

  const markDone = (key) => setCompletedSteps(prev => [...prev, key]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  }, []);

  const handleSubmit = async () => {
    if (!file) return setError("Please select a file.");
    if (!statement.trim()) return setError("Please describe what happened.");
    setError(null);
    setCompletedSteps([]);

    try {
      // ── STEP 1: Upload + Solana ──
      setCurrentStep("uploading");
      const formData = new FormData();
      formData.append("file", file);
      const submitRes = await fetch(`${API}/api/submit`, { method: "POST", body: formData });
      if (!submitRes.ok) throw new Error("File upload failed");
      const { mongoId } = await submitRes.json();
      markDone("uploading");

      // ── STEP 2: Sealing visual delay (already done in step 1, show for UX) ──
      setCurrentStep("sealing");
      await new Promise(r => setTimeout(r, 800)); // brief pause for UX clarity
      markDone("sealing");

      // ── STEP 3: Voice ──
      setCurrentStep("voice");
      const voiceRes = await fetch(`${API}/api/voice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: statement, mongoId }),
      });
      if (!voiceRes.ok) throw new Error("Voice generation failed");
      markDone("voice");

      // ── STEP 4: AI Analysis ──
      setCurrentStep("analyzing");
      const analyzeRes = await fetch(`${API}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: statement, mongoId }),
      });
      if (!analyzeRes.ok) throw new Error("AI analysis failed");
      markDone("analyzing");

      // ── STEP 5: Done ──
      setCurrentStep("done");
      markDone("done");
      await new Promise(r => setTimeout(r, 900));

      navigate(`/vault/${mongoId}`);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong.");
      setCurrentStep(null);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#04060a",
      color: "white",
      fontFamily: "'DM Sans', sans-serif",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "120px 24px 80px",
    }}>

      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:translateX(0)} }
        @keyframes dashMove { to { stroke-dashoffset: -20; } }
      `}</style>

      <div style={{ width: "100%", maxWidth: 720 }}>

        {/* Header */}
        <div style={{ marginBottom: 48, textAlign: "center" }}>
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "11px", letterSpacing: "0.25em", color: cyan, marginBottom: 16
          }}>SUBMIT EVIDENCE</div>
          <h1 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 800,
            margin: 0, lineHeight: 1.1
          }}>Seal your truth forever.</h1>
          <p style={{
            color: "rgba(255,255,255,0.4)", marginTop: 12,
            fontSize: 15, fontWeight: 300
          }}>Your file never leaves as-is — only its cryptographic hash is stored on-chain.</p>
        </div>

        {!isProcessing ? (
          /* ── FORM ── */
          <div style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 24, padding: "40px",
          }}>

            {/* Drag & Drop */}
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current.click()}
              style={{
                border: `2px dashed ${dragging ? cyan : "rgba(255,255,255,0.15)"}`,
                borderRadius: 16,
                padding: "48px 24px",
                textAlign: "center",
                cursor: "pointer",
                transition: "border-color 0.2s, background 0.2s",
                background: dragging ? "rgba(94,196,255,0.05)" : "transparent",
                marginBottom: 28,
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*,image/*,audio/*"
                style={{ display: "none" }}
                onChange={e => setFile(e.target.files[0])}
              />
              <div style={{ fontSize: 40, marginBottom: 12 }}>
                {file ? "📎" : "⬆"}
              </div>
              {file ? (
                <>
                  <div style={{ color: cyan, fontFamily: "'DM Mono', monospace", fontSize: 13 }}>
                    {file.name}
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, marginTop: 4 }}>
                    {(file.size / 1024 / 1024).toFixed(2)} MB — click to change
                  </div>
                </>
              ) : (
                <>
                  <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 15, marginBottom: 6 }}>
                    Drag & drop your file here
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.25)", fontSize: 13, fontFamily: "'DM Mono', monospace" }}>
                    VIDEO · IMAGE · AUDIO
                  </div>
                </>
              )}
            </div>

            {/* Statement textarea */}
            <div style={{ marginBottom: 28 }}>
              <label style={{
                display: "block",
                fontFamily: "'DM Mono', monospace",
                fontSize: "11px", letterSpacing: "0.15em",
                color: "rgba(255,255,255,0.4)", marginBottom: 10
              }}>YOUR STATEMENT</label>
              <textarea
                placeholder="Describe what happened — include names, badge numbers, times, locations, and any identifying details..."
                value={statement}
                onChange={e => setStatement(e.target.value)}
                rows={5}
                style={{
                  width: "100%", boxSizing: "border-box",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12,
                  padding: "16px 18px",
                  color: "white",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 15, lineHeight: 1.6,
                  resize: "vertical",
                  outline: "none",
                  transition: "border-color 0.2s"
                }}
                onFocus={e => e.target.style.borderColor = "rgba(94,196,255,0.4)"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
              />
            </div>

            {error && (
              <div style={{
                background: "rgba(255,80,80,0.08)",
                border: "1px solid rgba(255,80,80,0.2)",
                borderRadius: 10, padding: "12px 16px",
                color: "#ff8080", fontSize: 14,
                fontFamily: "'DM Mono', monospace",
                marginBottom: 20
              }}>{error}</div>
            )}

            <button
              onClick={handleSubmit}
              style={{
                width: "100%",
                padding: "18px",
                background: "linear-gradient(135deg, #5ec4ff, #2a9fd6)",
                color: "#04060a",
                border: "none", borderRadius: 12,
                fontFamily: "'DM Mono', monospace",
                fontSize: 13, letterSpacing: "0.15em", fontWeight: 500,
                cursor: "pointer",
                transition: "opacity 0.2s, transform 0.2s, box-shadow 0.2s",
                boxShadow: "0 0 30px rgba(94,196,255,0.25)"
              }}
              onMouseEnter={e => {
                e.target.style.transform = "scale(1.01)";
                e.target.style.boxShadow = "0 0 50px rgba(94,196,255,0.45)";
              }}
              onMouseLeave={e => {
                e.target.style.transform = "scale(1)";
                e.target.style.boxShadow = "0 0 30px rgba(94,196,255,0.25)";
              }}
            >
              SEAL EVIDENCE TO BLOCKCHAIN →
            </button>
          </div>

        ) : (
          /* ── PROGRESS PANEL ── */
          <div style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 24, padding: "48px 40px",
          }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div style={{
                width: 64, height: 64, borderRadius: "50%",
                border: `2px solid rgba(94,196,255,0.2)`,
                borderTopColor: cyan,
                animation: currentStep === "done" ? "none" : "spin 1s linear infinite",
                margin: "0 auto 20px",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 24
              }}>
                {currentStep === "done" ? "✓" : ""}
              </div>
              <h2 style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 28, fontWeight: 700, margin: "0 0 8px"
              }}>
                {currentStep === "done" ? "Evidence Sealed." : "Processing..."}
              </h2>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 14, margin: 0, fontFamily: "'DM Mono', monospace" }}>
                {STEPS.find(s => s.key === currentStep)?.detail}
              </p>
            </div>

            {/* Step list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {STEPS.map((step, i) => {
                const isDone = completedSteps.includes(step.key);
                const isActive = currentStep === step.key && !isDone;

                return (
                  <div
                    key={step.key}
                    style={{
                      display: "flex", alignItems: "center", gap: 16,
                      padding: "16px 20px", borderRadius: 12,
                      background: isActive ? "rgba(94,196,255,0.08)" : isDone ? "rgba(94,196,255,0.04)" : "transparent",
                      border: `1px solid ${isActive ? "rgba(94,196,255,0.25)" : isDone ? "rgba(94,196,255,0.1)" : "rgba(255,255,255,0.05)"}`,
                      transition: "all 0.4s ease",
                      animation: isActive ? "slideIn 0.3s ease" : "none"
                    }}
                  >
                    {/* Icon */}
                    <div style={{
                      width: 40, height: 40, borderRadius: "50%",
                      background: isDone ? cyan : isActive ? "rgba(94,196,255,0.15)" : "rgba(255,255,255,0.05)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: isDone ? 16 : 18,
                      color: isDone ? "#04060a" : isActive ? cyan : "rgba(255,255,255,0.2)",
                      flexShrink: 0,
                      transition: "all 0.4s"
                    }}>
                      {isDone ? "✓" : step.icon}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: 13, letterSpacing: "0.05em",
                        color: isDone ? "white" : isActive ? cyan : "rgba(255,255,255,0.25)",
                        fontWeight: isActive ? 500 : 400,
                        transition: "color 0.3s"
                      }}>
                        {step.label}
                      </div>
                    </div>

                    {/* Status */}
                    <div style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 10, letterSpacing: "0.15em",
                      color: isDone ? "rgba(94,196,255,0.7)" : isActive ? "rgba(94,196,255,0.5)" : "rgba(255,255,255,0.15)"
                    }}>
                      {isDone ? "SEALED" : isActive ? "IN PROGRESS" : "PENDING"}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Progress bar */}
            <div style={{
              marginTop: 32,
              height: 3, background: "rgba(255,255,255,0.06)",
              borderRadius: 2, overflow: "hidden"
            }}>
              <div style={{
                height: "100%",
                width: `${((completedSteps.length) / STEPS.length) * 100}%`,
                background: `linear-gradient(90deg, ${cyan}, #2a9fd6)`,
                borderRadius: 2,
                transition: "width 0.6s ease",
                boxShadow: `0 0 12px rgba(94,196,255,0.6)`
              }} />
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        marginTop: 48,
        fontFamily: "'DM Mono', monospace",
        fontSize: "11px",
        color: "rgba(255,255,255,0.15)",
        letterSpacing: "0.1em"
      }}>
        BUILT BY ARSHIYA SHARMA
      </div>
    </div>
  );
}