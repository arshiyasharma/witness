import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const cyan = "#5ec4ff";
const red = "#ff5c5c";
const amber = "#fbbf24";

// ── Sources with URLs ──
const SOURCES = {
  wapo:      { label: "Washington Post Fatal Force Database (2015–2024)", url: "https://www.washingtonpost.com/graphics/investigations/police-shootings-database/" },
  lancet:    { label: "The Lancet, 'Fatal police violence by race and state in the USA, 1980–2019' (2021)", url: "https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(21)01609-3/fulltext" },
  hrw:       { label: "Human Rights Watch, 'Video Unavailable: Social Media Platforms Remove Evidence of War Crimes' (2020)", url: "https://www.hrw.org/report/2020/09/10/video-unavailable/social-media-platforms-remove-evidence-war-crimes" },
  eeoc:      { label: "EEOC Select Task Force on the Study of Harassment in the Workplace (2016)", url: "https://www.eeoc.gov/select-task-force-study-harassment-workplace" },
  convo:     { label: "UMASS AMHERST Center for Employment Equity (2017)", url: "https://www.umass.edu/employmentequity/employers-responses-sexual-harassment#:~:text=About%205%20million%20employees%20are,White%20women%20and%20White%20men." },
  mpv:       { label: "Mapping Police Violence Database (2025)", url: "https://mappingpoliceviolence.us" },
  intercept: { label: "The Intercept, 'YouTube and Facebook Are Removing Evidence of Atrocities' (2017)", url: "https://theintercept.com/2017/11/02/war-crimes-youtube-facebook-syria-rohingya/" },
};

// ── Clickable source link ──
function Src({ id }) {
  const s = SOURCES[id];
  return (
    <a href={s.url} target="_blank" rel="noreferrer" style={{
      display: "block", marginTop: 8,
      fontFamily: "'DM Mono', monospace",
      fontSize: 10, color: "rgba(94,196,255,0.5)",
      textDecoration: "underline", textDecorationColor: "rgba(94,196,255,0.2)",
      textUnderlineOffset: 2, lineHeight: 1.5
    }}>↗ {s.label}</a>
  );
}

// ── Stat card — fixed font size, overflow contained ──
function StatCard({ value, label, srcId, color = cyan, delay = 0 }) {
  const ref = useRef();
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { e.target.style.opacity = "1"; e.target.style.transform = "translateY(0)"; } },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{
      opacity: 0, transform: "translateY(24px)",
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      background: "rgba(255,255,255,0.03)",
      border: `1px solid ${color}25`,
      borderTop: `3px solid ${color}`,
      borderRadius: 16,
      padding: "24px 20px",
      display: "flex", flexDirection: "column",
      overflow: "hidden",
      minWidth: 0,           /* prevents grid blowout */
    }}>
      <div style={{
        fontFamily: "'Syne', sans-serif",
        fontSize: 40, fontWeight: 800, lineHeight: 1,
        color, marginBottom: 10,
        wordBreak: "break-word",
      }}>{value}</div>
      <div style={{
        fontSize: 13, color: "rgba(255,255,255,0.75)",
        fontWeight: 500, marginBottom: 4, lineHeight: 1.4, flex: 1
      }}>{label}</div>
      {srcId && <Src id={srcId} />}
    </div>
  );
}

// ── Scroll-reveal wrapper ──
function Section({ children, delay = 0 }) {
  const ref = useRef();
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { e.target.style.opacity = "1"; e.target.style.transform = "translateY(0)"; } },
      { threshold: 0.08 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ opacity: 0, transform: "translateY(28px)", transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s` }}>
      {children}
    </div>
  );
}

function Tag({ children, color = cyan }) {
  return (
    <span style={{
      display: "inline-block",
      padding: "3px 10px",
      background: `${color}14`,
      border: `1px solid ${color}30`,
      borderRadius: "100px",
      fontFamily: "'DM Mono', monospace",
      fontSize: 10, letterSpacing: "0.12em",
      color, marginRight: 6, marginBottom: 6,
    }}>{children}</span>
  );
}

function Hr() {
  return <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", margin: "64px 0" }} />;
}

// ── Comparison table — proper 5-col grid ──
const TABLE_ROWS = [
  { tool: "iCloud / Google Drive", tp: false, perm: false, struct: false, instant: true },
  { tool: "Screenshot",            tp: false, perm: false, struct: false, instant: true },
  { tool: "Police report",         tp: true,  perm: true,  struct: true,  instant: false },
  { tool: "Notary / Lawyer",       tp: true,  perm: true,  struct: true,  instant: false },
  { tool: "Witness ←",             tp: true,  perm: true,  struct: true,  instant: true, highlight: true },
];
const TABLE_COLS = ["Tamper-proof?", "Permanent?", "Structured?", "Instant?"];

function ComparisonTable() {
  const colStyle = (val, highlight) => ({
    padding: "14px 8px",
    textAlign: "center",
    fontSize: 17,
    color: val ? "#6ee7b7" : "#ff5c5c",
    background: highlight ? "rgba(94,196,255,0.06)" : "transparent",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
  });

  return (
    <div style={{
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 16, overflow: "hidden",
      marginBottom: 32,
    }}>
      {/* Header row */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", background: "rgba(255,255,255,0.05)" }}>
        <div style={{ padding: "12px 20px", fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.15em", color: "rgba(255,255,255,0.4)" }}>TOOL</div>
        {TABLE_COLS.map(col => (
          <div key={col} style={{ padding: "12px 8px", textAlign: "center", fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)" }}>{col}</div>
        ))}
      </div>

      {/* Data rows */}
      {TABLE_ROWS.map((row) => (
        <div
          key={row.tool}
          style={{
            display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
            background: row.highlight ? "rgba(94,196,255,0.05)" : "transparent",
            transition: "background 0.2s",
          }}
        >
          <div style={{
            padding: "14px 20px",
            fontFamily: row.highlight ? "'Syne', sans-serif" : "'DM Sans', sans-serif",
            fontSize: row.highlight ? 14 : 13,
            fontWeight: row.highlight ? 700 : 400,
            color: row.highlight ? cyan : "rgba(255,255,255,0.65)",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            {row.highlight && <span style={{ width: 6, height: 6, borderRadius: "50%", background: cyan, display: "inline-block", boxShadow: `0 0 6px ${cyan}`, flexShrink: 0 }} />}
            {row.tool}
          </div>
          <div style={colStyle(row.tp, row.highlight)}>{row.tp ? "✓" : "✗"}</div>
          <div style={colStyle(row.perm, row.highlight)}>{row.perm ? "✓" : "✗"}</div>
          <div style={colStyle(row.struct, row.highlight)}>{row.struct ? "✓" : "✗"}</div>
          <div style={colStyle(row.instant, row.highlight)}>{row.instant ? "✓" : "✗"}</div>
        </div>
      ))}
    </div>
  );
}

const STACK = [
  { name: "React", role: "Frontend UI", color: "#61dafb", why: "Component-based architecture for the evidence pipeline UX, progress steps, and vault page." },
  { name: "Node.js + Express", role: "Backend API", color: "#68a063", why: "Handles file ingestion, SHA-256 hashing pipeline, and orchestrates the 3-step API sequence." },
  { name: "Solana Blockchain", role: "Immutable Timestamp", color: "#9945ff", why: "Near-zero cost (~$0.00025/tx), sub-second finality. Memo program writes the hash permanently on-chain. No government, no platform, no court order can delete it." },
  { name: "ElevenLabs TTS", role: "Voice Evidence", color: "#f97316", why: "Traumatized witnesses speak — ElevenLabs preserves their voice and generates a clean legal narration. See full section above." },
  { name: "Solar Pro 3 (OpenRouter)", role: "AI Legal Analysis", color: "#5ec4ff", why: "Entity extraction, incident classification, urgency scoring, and 3-paragraph court-ready report generation from raw unstructured testimony." },
  { name: "MongoDB Atlas", role: "Evidence Vault", color: "#00ed64", why: "Flexible document schema stores the full atomic evidence record: hash, Solana tx ID, audio, AI report, and metadata in one document." },
  { name: "SHA-256 (Node crypto)", role: "File Fingerprinting", color: "#fbbf24", why: "Industry-standard cryptographic hash function. Any single-bit alteration to the file produces a completely different hash — making tampering mathematically detectable." },
];

// ── MAIN PAGE ──
export default function Why() {
  const navigate = useNavigate();

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500&display=swap";
    document.head.appendChild(link);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#04060a", color: "white", fontFamily: "'DM Sans', sans-serif", overflowX: "hidden" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500&display=swap'); @keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}} .fade-up{animation:fadeUp 0.7s ease forwards}`}</style>

      {/* Ambient bg */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "8%", right: "0%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,92,92,0.05) 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div style={{ position: "absolute", top: "55%", left: "0%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(94,196,255,0.04) 0%, transparent 70%)", filter: "blur(60px)" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 860, margin: "0 auto", padding: "120px 28px 100px" }}>

        {/* ── HERO ── */}
        <div className="fade-up" style={{ textAlign: "center", marginBottom: 80 }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", letterSpacing: "0.25em", color: red, marginBottom: 20, border: "1px solid rgba(255,92,92,0.2)", padding: "6px 18px", borderRadius: "100px", display: "inline-block", background: "rgba(255,92,92,0.06)" }}>
            THE PROBLEM — WHY THIS EXISTS
          </div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(40px, 7vw, 72px)", fontWeight: 800, lineHeight: 1.05, margin: "0 0 24px", background: "linear-gradient(160deg, #ffffff 30%, #ff9090 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            The evidence exists.<br />Then it disappears.
          </h1>
          <p style={{ fontSize: "clamp(16px, 2.5vw, 20px)", color: "rgba(255,255,255,0.5)", maxWidth: 640, margin: "0 auto", lineHeight: 1.7, fontWeight: 300 }}>
            People capturing evidence of police brutality, war crimes, landlord violations, and workplace abuse face the same nightmare:
            {" "}<span style={{ color: "rgba(255,255,255,0.85)" }}>the evidence gets deleted</span> — by platforms, by authorities, by legal pressure, by technical failure. And even when it survives, proving it wasn't manipulated is nearly impossible in court.
          </p>
        </div>

        <Hr />

        {/* ── 01 POLICE ── */}
        <Section>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", letterSpacing: "0.22em", color: red, marginBottom: 14 }}>01 — POLICE ACCOUNTABILITY</div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 700, margin: "0 0 20px" }}>
            1,000+ killed annually.<br /><span style={{ color: "rgba(255,255,255,0.35)" }}>The government doesn't track most of them.</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.8, fontSize: 16, fontWeight: 300, marginBottom: 32 }}>
            Police kill over 1,000 people every year in the United States — a rate at least three times higher than Canada, and over 60 times the rate of England and Wales. But the most disturbing part isn't the number. It's that the government isn't even counting them.
          </p>
        </Section>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 24 }}>
          <StatCard value="1,260+" label="People killed by US police in 2025" srcId="mpv" color={red} delay={0} />
          <StatCard value="⅔" label="Of fatal shootings missing from FBI records by 2021" srcId="wapo" color={amber} delay={0.1} />
          <StatCard value="55.5%" label="Of US police killings misclassified in official death records (1980–2018)" srcId="lancet" color={red} delay={0.2} />
          <StatCard value="2.5×" label="Rate Black Americans killed vs. white Americans — 6.1 vs 2.4 per million" srcId="wapo" color={amber} delay={0.3} />
        </div>

        <Section delay={0.1}>
          <div style={{ background: "rgba(255,92,92,0.05)", border: "1px solid rgba(255,92,92,0.15)", borderLeft: "3px solid rgba(255,92,92,0.5)", borderRadius: "0 12px 12px 0", padding: "20px 24px", marginBottom: 24, fontFamily: "'DM Mono', monospace", fontSize: 13, lineHeight: 1.7, color: "rgba(255,255,255,0.6)" }}>
            "The FBI database contains only about one-third of the 7,000 fatal police shootings between 2015 and 2021. Fatal shootings by officers in at least 2,250 police departments are missing from federal records entirely."
            <div style={{ color: "rgba(255,92,92,0.7)", fontSize: 11, marginTop: 8 }}>— The Washington Post, Fatal Force Investigation (2022)
              <a href={SOURCES.wapo.url} target="_blank" rel="noreferrer" style={{ color: "rgba(94,196,255,0.5)", marginLeft: 10, textDecoration: "underline" }}>↗ Read</a>
            </div>
          </div>
          <p style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.8, fontSize: 15, fontWeight: 300, marginBottom: 12 }}>
            The only reason Derek Chauvin was convicted for the murder of George Floyd was that a 17-year-old refused to put her phone down. Her footage changed the world. But there is no infrastructure to ensure evidence like hers survives — it can be deleted from a platform in under an hour, seized, or corrupted.
          </p>
          <p style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.8, fontSize: 15, fontWeight: 300 }}>
            The Lancet's 2021 peer-reviewed study found that over half of all US police killings between 1980 and 2018 were incorrectly classified in government vital records — because the same system responsible for the violence is responsible for reporting it.
          </p>
        </Section>

        <Hr />

        {/* ── 02 WAR CRIMES ── */}
        <Section>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", letterSpacing: "0.22em", color: red, marginBottom: 14 }}>02 — WAR CRIMES & ATROCITIES</div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 700, margin: "0 0 20px" }}>
            The evidence was there.<br /><span style={{ color: "rgba(255,255,255,0.35)" }}>Then Facebook deleted it.</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.8, fontSize: 16, fontWeight: 300, marginBottom: 32 }}>
            Social media video is now the world's primary tool for documenting war crimes — used in ICC prosecutions, European war crimes trials, and UN investigations. The ICC issued its first arrest warrant based largely on Facebook evidence in 2017. And platforms are deleting it faster than investigators can save it.
          </p>
        </Section>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 24 }}>
          <StatCard value="11%+" label="Of 5,000+ referenced evidence items already removed when researchers tried to access them" srcId="hrw" color={red} delay={0} />
          <StatCard value="9,000" label="Ukraine-related YouTube channels removed during the conflict" srcId="hrw" color={amber} delay={0.1} />
          <StatCard value="700K+" label="War-zone images saved by the BBC before platforms removed them" srcId="intercept" color={amber} delay={0.3} />
        </div>

        <Section delay={0.1}>
          <div style={{ background: "rgba(255,92,92,0.05)", border: "1px solid rgba(255,92,92,0.15)", borderLeft: "3px solid rgba(255,92,92,0.5)", borderRadius: "0 12px 12px 0", padding: "20px 24px", marginBottom: 24, fontFamily: "'DM Mono', monospace", fontSize: 13, lineHeight: 1.7, color: "rgba(255,255,255,0.6)" }}>
            "Content being taken down has become a daily part of my work experience. I am constantly being confronted with possible crucial evidence that is not accessible to me anymore."
            <div style={{ color: "rgba(255,92,92,0.7)", fontSize: 11, marginTop: 8 }}>— European war crimes investigator, Human Rights Watch report (2020)
              <a href={SOURCES.hrw.url} target="_blank" rel="noreferrer" style={{ color: "rgba(94,196,255,0.5)", marginLeft: 10, textDecoration: "underline" }}>↗ Read</a>
            </div>
          </div>
          <p style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.8, fontSize: 15, fontWeight: 300 }}>
            In April 2022, Facebook's automated moderation systems blocked hashtags used to document civilian killings in Bucha, Ukraine — deleting potential war crimes evidence in real time as Russia denied the massacres ever occurred. There is still no global mechanism to archive this content before it's gone. Human Rights Watch has been calling for one since 2017. Nothing has been built.
          </p>
        </Section>

        <Hr />

        {/* ── 03 WORKPLACE ── */}
        <Section>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", letterSpacing: "0.22em", color: amber, marginBottom: 14 }}>03 — WORKPLACE & CIVIL RIGHTS ABUSE</div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 700, margin: "0 0 20px" }}>
            99.8% never file.<br /><span style={{ color: "rgba(255,255,255,0.35)" }}>Most don't have proof anyway.</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.8, fontSize: 16, fontWeight: 300, marginBottom: 32 }}>
            An estimated 5 million people experience workplace sexual harassment in the US every year. Of those, an average of only 9,200 file a charge with the EEOC or state agencies. That's 99.8% who stay silent. The most common reason: they don't believe anyone will believe them without proof.
          </p>
        </Section>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 28 }}>
          <StatCard value="90%" label="Of harassment victims never take any formal action" srcId="eeoc" color={amber} delay={0} />
          <StatCard value="75%" label="Never told a supervisor or manager — suffered in silence" srcId="eeoc" color={amber} delay={0.1} />
          <StatCard value="68%" label="Of those who do file face employer retaliation afterward" srcId="convo" color={red} delay={0.2} />
          <StatCard value="99.8%" label="Of estimated harassment never results in an EEOC charge" srcId="convo" color={red} delay={0.3} />
        </div>

        <Section delay={0.1}>
          <p style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.8, fontSize: 15, fontWeight: 300 }}>
            When victims do try to document abuse, evidence is easily dismissed or argued as fabricated. Courts require chain-of-custody integrity. A screenshot doesn't provide that. A Solana blockchain timestamp does.
          </p>
        </Section>

        <Hr />

        {/* ── 04 ELEVENLABS ── */}
        <Section>
          <div style={{ background: "rgba(249,115,22,0.05)", border: "1px solid rgba(249,115,22,0.2)", borderRadius: 20, padding: "40px" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", letterSpacing: "0.22em", color: "#f97316", marginBottom: 16 }}>04 — WHY WE ADDED AI VOICE (ELEVENLABS)</div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(24px, 3.5vw, 36px)", fontWeight: 700, margin: "0 0 20px" }}>
              A voice is harder to deny than a paragraph.
            </h2>
            <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.8, fontSize: 15, fontWeight: 300, marginBottom: 20 }}>
              When Darnella Frazier filmed George Floyd, the video didn't just prove what happened — it conveyed the <em>human reality</em> of the moment in a way no written report ever could. Judges, juries, journalists, and the public respond differently to a human voice than to typed text.
            </p>
            <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.8, fontSize: 15, fontWeight: 300, marginBottom: 20 }}>
              Many people in high-stress incidents — a tenant being illegally locked out, a worker being threatened, a bystander documenting abuse — are <span style={{ color: "white" }}>shaking, traumatized, or functionally illiterate in the language of the legal system.</span> Asking them to write a structured incident report minutes after a traumatic event is asking them to fail.
            </p>
            <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.8, fontSize: 15, fontWeight: 300, marginBottom: 28 }}>
              With ElevenLabs, the user simply speaks. Their raw, authentic voice statement — with all the emotion and urgency intact — is preserved as audio evidence. ElevenLabs then generates a clean narration that is simultaneously:
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 14, marginBottom: 24 }}>
              {[
                { icon: "⚖", title: "Legally structured", desc: "Clear, sequential account suitable for attorneys, legal aid orgs, or court submission." },
                { icon: "🎙", title: "Voice-authenticated", desc: "Original voice recording preserved and timestamped alongside the narration — two authenticity layers." },
                { icon: "♿", title: "Accessible", desc: "Removes the literacy and language barrier for people who struggle to write formal accounts under pressure." },
                { icon: "🔒", title: "Tamper-evident", desc: "Audio is stored alongside the Solana proof — any alteration would invalidate the chain-of-custody." },
              ].map((item, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(249,115,22,0.12)", borderRadius: 12, padding: "20px" }}>
                  <div style={{ fontSize: 22, marginBottom: 10 }}>{item.icon}</div>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>{item.title}</div>
                  <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, lineHeight: 1.6 }}>{item.desc}</div>
                </div>
              ))}
            </div>
            <p style={{ color: "rgba(255,255,255,0.4)", lineHeight: 1.8, fontSize: 14, fontStyle: "italic", margin: 0 }}>
              Think of it as an automatic court reporter in your pocket — one that captures your words exactly as spoken, then reformats them for the legal system, instantly.
            </p>
          </div>
        </Section>

        <Hr />

        {/* ── 05 THE GAP ── */}
        <Section>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", letterSpacing: "0.22em", color: cyan, marginBottom: 14 }}>05 — THE MISSING TOOL</div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 700, margin: "0 0 20px" }}>
            No tool does all of this.<br /><span style={{ color: "rgba(255,255,255,0.35)" }}>Until now.</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.8, fontSize: 16, fontWeight: 300, marginBottom: 32 }}>
            Cloud storage can be subpoenaed. Screenshots can be faked. Written accounts can be contested. Emails can be deleted.
            <span style={{ color: "rgba(255,255,255,0.8)" }}> A Solana blockchain hash cannot.</span>
          </p>
          <ComparisonTable />
        </Section>

        <Hr />

        {/* ── 06 TECH STACK ── */}
        <Section>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", letterSpacing: "0.22em", color: cyan, marginBottom: 14 }}>06 — TECH STACK</div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 700, margin: "0 0 8px" }}>Built to last. Built to prove.</h2>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 15, fontWeight: 300, marginBottom: 36 }}>Every technology choice was made deliberately. Nothing is here for show.</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {STACK.map((item, i) => (
              <div key={i}
                style={{ display: "grid", gridTemplateColumns: "160px 160px 1fr", gap: 20, padding: "20px 24px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, alignItems: "start", transition: "background 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
              >
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, color: item.color, paddingTop: 2 }}>{item.name}</div>
                <div><Tag color={item.color}>{item.role}</Tag></div>
                <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, lineHeight: 1.6 }}>{item.why}</div>
              </div>
            ))}
          </div>
        </Section>

        <Hr />

        {/* ── SOURCES ── */}
        <Section>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", letterSpacing: "0.22em", color: "rgba(255,255,255,0.2)", marginBottom: 16 }}>SOURCES & CITATIONS</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {Object.entries(SOURCES).map(([key, s]) => (
              <div key={key} style={{ padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", gap: 12, alignItems: "baseline" }}>
                <span style={{ color: "rgba(94,196,255,0.4)", fontFamily: "'DM Mono', monospace", fontSize: 11, flexShrink: 0 }}>↗</span>
                <a href={s.url} target="_blank" rel="noreferrer" style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.35)", textDecoration: "underline", textDecorationColor: "rgba(255,255,255,0.15)", lineHeight: 1.6, textUnderlineOffset: 2 }}>
                  {s.label}
                </a>
              </div>
            ))}
          </div>
        </Section>

        {/* ── CTA ── */}
        <div style={{ textAlign: "center", marginTop: 80 }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, margin: "0 0 16px" }}>Ready to see it in action?</h2>
          <p style={{ color: "rgba(255,255,255,0.35)", marginBottom: 36, fontSize: 15 }}>Every feature traces back to a real, documented failure.</p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/submit")}
              style={{ fontFamily: "'DM Mono', monospace", fontSize: "13px", letterSpacing: "0.15em", padding: "16px 40px", background: "linear-gradient(135deg, #5ec4ff, #2a9fd6)", color: "#04060a", border: "none", borderRadius: "100px", cursor: "pointer", boxShadow: "0 0 30px rgba(94,196,255,0.25)", transition: "transform 0.2s, box-shadow 0.2s" }}
              onMouseEnter={e => { e.target.style.transform = "scale(1.03)"; e.target.style.boxShadow = "0 0 50px rgba(94,196,255,0.4)"; }}
              onMouseLeave={e => { e.target.style.transform = "scale(1)"; e.target.style.boxShadow = "0 0 30px rgba(94,196,255,0.25)"; }}
            >SUBMIT EVIDENCE →</button>
            <button onClick={() => navigate("/vault")}
              style={{ fontFamily: "'DM Mono', monospace", fontSize: "13px", letterSpacing: "0.15em", padding: "16px 40px", background: "transparent", color: cyan, border: `1px solid ${cyan}`, borderRadius: "100px", cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => { e.target.style.background = "rgba(94,196,255,0.08)"; }}
              onMouseLeave={e => { e.target.style.background = "transparent"; }}
            >VIEW DEMO VAULT</button>
          </div>
        </div>
      </div>

      <div style={{ textAlign: "center", padding: "32px", borderTop: "1px solid rgba(255,255,255,0.05)", fontFamily: "'DM Mono', monospace", fontSize: "11px", color: "rgba(255,255,255,0.15)", letterSpacing: "0.1em" }}>
        BUILT BY ARSHIYA SHARMA — WITNESS © 2026
      </div>
    </div>
  );
}