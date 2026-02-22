import { useState } from "react";

export default function Submit() {
  const [statement, setStatement] = useState("");
  const [audioSrc, setAudioSrc] = useState(null);
  const [loadingVoice, setLoadingVoice] = useState(false);

  const generateVoice = async () => {
    if (!statement) return alert("Enter a statement");

    setLoadingVoice(true);

    const res = await fetch("http://localhost:5001/api/voice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: statement }),
    });

    const data = await res.json();

    setAudioSrc(`data:audio/mpeg;base64,${data.audioBase64}`);

    setLoadingVoice(false);
  };

  return (
    <div>
      <h2>Submit Evidence</h2>

      <textarea
        placeholder="Describe what happened..."
        value={statement}
        onChange={(e) => setStatement(e.target.value)}
      />

      <button onClick={generateVoice} disabled={loadingVoice}>
        {loadingVoice ? "Generating voice..." : "Generate Voice Statement"}
      </button>

      {audioSrc && <audio controls src={audioSrc} />}
    </div>
  );
}