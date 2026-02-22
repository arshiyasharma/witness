import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./pages/home";
import Submit from "./pages/submit";
import Vault from "./pages/vault";
import Why from "./pages/why";
import Verify from "./pages/verify";
import "./index.css";

function Nav() {
  const location = useLocation();
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "18px 48px",
      background: "rgba(4,6,10,0.7)",
      backdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(255,255,255,0.05)"
    }}>
      <Link to="/" style={{ textDecoration: "none" }}>
        <span style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "20px", fontWeight: 800,
          letterSpacing: "0.08em",
          background: "linear-gradient(90deg, #e2f4ff, #5ec4ff)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
        }}>WITNESS</span>
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: "36px" }}>
        {[["/" , "Home"], ["/why", "The Why and How"], ["/submit", "Submit Evidence"], ["/vault", "Vault"], ["/verify", "Verify"]].map(([path, label]) => (
          <Link key={path} to={path} style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "12px", letterSpacing: "0.12em",
            textDecoration: "none",
            color: location.pathname === path ? "#5ec4ff" : "rgba(255,255,255,0.45)",
            transition: "color 0.2s"
          }}>{label.toUpperCase()}</Link>
        ))}

        {/* Divider */}
        <div style={{ width: 1, height: 16, background: "rgba(255,255,255,0.1)" }} />

        {/* LinkedIn */}
        <a
          href="https://linkedin.com/in/arshiyasharma"
          target="_blank"
          rel="noreferrer"
          style={{ display: "flex", alignItems: "center", opacity: 0.45, transition: "opacity 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.opacity = "1"}
          onMouseLeave={e => e.currentTarget.style.opacity = "0.45"}
        >
          <img src="../icons/lnkd.png" alt="LinkedIn" style={{ width: 18, height: 18 }} />
        </a>

        {/* GitHub */}
        <a
          href="https://github.com/arshiyasharma"
          target="_blank"
          rel="noreferrer"
          style={{ display: "flex", alignItems: "center", opacity: 0.45, transition: "opacity 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.opacity = "1"}
          onMouseLeave={e => e.currentTarget.style.opacity = "0.45"}
        >
          <img src="../icons/gt.png" alt="GitHub" style={{ width: 18, height: 18 }} />
        </a>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/why" element={<Why />} />
        <Route path="/submit" element={<Submit />} />
        <Route path="/vault/:id" element={<Vault />} />
        <Route path="/vault" element={<Vault />} />
        <Route path="/verify" element={<Verify />} />
      </Routes>
    </Router>
  );
}

export default App;