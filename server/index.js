require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const crypto = require("crypto");
const { Connection, PublicKey, Transaction, TransactionInstruction, Keypair } = require("@solana/web3.js");
const { ElevenLabsClient } = require("elevenlabs");
const OpenAI = require("openai");

// ------------------- Clients -------------------
const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "Witness Hackathon Project",
  },
});

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

const app = express();
app.use(cors());
app.use(express.json());

// ------------------- MongoDB -------------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const EvidenceSchema = new mongoose.Schema({
  fileHash: String,
  solanaTxId: String,
  timestamp: { type: Date, default: Date.now },
  rawStatement: String,
  audioBase64: String,
  analysis: Object,
});

const Evidence = mongoose.model("Evidence", EvidenceSchema);

// ------------------- Multer -------------------
const upload = multer({ storage: multer.memoryStorage() });

// ------------------- Solana Setup -------------------
const connection = new Connection("https://api.devnet.solana.com");
const payer = Keypair.fromSecretKey(
  Uint8Array.from(JSON.parse(process.env.SOLANA_PRIVATE_KEY))
);

// ------------------- AI System Prompt -------------------
const systemPrompt = `
Given this incident statement, return ONLY valid JSON in this exact format with no extra text:
{
  "incidentType": "police | workplace | housing | other",
  "urgency": 1,
  "extractedEntities": ["example entity"],
  "formalReport": "Detailed 3 paragraph legal-style incident report"
}
`;

// ------------------- Routes -------------------

app.get("/", (req, res) => res.send("Witness API Running"));

// STEP 1: Upload file → hash → Solana → save to MongoDB → return mongoId
app.post("/api/submit", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send("No file uploaded");

    // Hash the file
    const fileHash = crypto.createHash("sha256").update(req.file.buffer).digest("hex");

    // Write hash to Solana devnet via memo transaction
    const tx = new Transaction().add(
      new TransactionInstruction({
        keys: [],
        programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
        data: Buffer.from(fileHash),
      })
    );

    const signature = await connection.sendTransaction(tx, [payer]);
    await connection.confirmTransaction(signature);

    // Save initial doc to MongoDB
    const doc = await Evidence.create({
      fileHash,
      solanaTxId: signature,
      rawStatement: "",
    });

    res.json({
      message: "Sealed to blockchain!",
      fileHash,
      solanaTxId: signature,
      mongoId: doc._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error submitting evidence");
  }
});

// STEP 2: Generate voice statement → save audio to existing MongoDB doc
app.post("/api/voice", async (req, res) => {
  try {
    const { text, mongoId } = req.body;
    if (!text) return res.status(400).send("No text provided");

    const audio = await elevenlabs.textToSpeech.convert("JBFqnCBsd6RMkjVDRZzb", {
      modelId: "eleven_multilingual_v2",
      text: text,
    });

    const chunks = [];
    for await (const chunk of audio) chunks.push(chunk);
    const buffer = Buffer.concat(chunks);
    const audioBase64 = buffer.toString("base64");

    // Update the existing MongoDB doc
    if (mongoId) {
      await Evidence.findByIdAndUpdate(mongoId, {
        rawStatement: text,
        audioBase64,
      });
    }

    res.json({ audioBase64 });
  } catch (err) {
    console.error(err);
    res.status(500).send("Voice generation failed");
  }
});

// STEP 3: AI analysis → save to existing MongoDB doc → return full record
app.post("/api/analyze", async (req, res) => {
  try {
    const { text, mongoId } = req.body;
    if (!text) return res.status(400).send("No statement provided");

    const completion = await client.chat.completions.create({
      model: "upstage/solar-pro-3:free",
      temperature: 0,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: text },
      ],
    });

    const rawText = completion.choices[0].message.content;

    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch (err) {
      console.error("Failed to parse AI JSON:", rawText);
      return res.status(500).send("AI returned invalid JSON");
    }

    // Update existing MongoDB doc with analysis
    const doc = await Evidence.findByIdAndUpdate(
      mongoId,
      { analysis: parsed },
      { new: true }
    );

    res.json({
      message: "Analysis complete!",
      data: parsed,
      mongoId: doc._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("AI analysis failed");
  }
});

// VAULT: Fetch full evidence record by ID
app.get("/api/vault/:id", async (req, res) => {
  try {
    const doc = await Evidence.findById(req.params.id);
    if (!doc) return res.status(404).send("Evidence not found");
    res.json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching vault");
  }
});

// ------------------- Start Server -------------------
app.listen(5001, () => console.log("Server running on port 5001"));