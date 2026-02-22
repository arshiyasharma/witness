# Witness

### Seal your truth. Forever.

## Inspiration

We are living through a moment where the people who most need to be believed are the least likely to be.

ICE raids filmed on phones, footage deleted before lawyers arrive. War crimes documented on social media, quietly removed by automated content moderation that can't distinguish evidence from extremism. A tenant films her landlord entering illegally — her phone gets confiscated at the door. A worker records a threat, HR says there's no proof.

Darnella Frazier. She was 17, standing on a Minneapolis sidewalk, and she refused to put her phone down for 9 minutes and 29 seconds. That footage convicted a police officer. But there was no infrastructure protecting her. That video could have been deleted, seized, or dismissed as manipulated. The only reason it survived was her courage and luck.

That shouldn't be the system. I wanted to build something that made evidence unkillable, and I had 24 hours to do it alone.

---

## What It Does

**Witness** turns any phone into a tamper-proof legal evidence machine in three steps:

**1. Capture & Seal**
A user uploads any video, image, or audio file. Witness instantly computes a SHA-256 cryptographic hash - a unique mathematical fingerprint of that exact file. That hash is then written to the **Solana blockchain** via a memo transaction. Permanent. Public. Irreversible. In under 4 seconds, at a cost of fractions of a cent.

**2. Voice Statement**
The user describes what happened in their own words. **ElevenLabs** preserves their voice as audio evidence and generates a clean narration, because a traumatized person speaking is more human and more accessible than a legal form they may not know how to fill out.

**3. AI Legal Analysis**
An AI model (Solar Pro 3 via OpenRouter) extracts entities-badge numbers, names, locations, timestamps-classifies the incident type (police, workplace, housing, other), assigns an urgency score from 1–5, and generates a 3-paragraph formal incident report structured for submission to an attorney or legal aid organization.

Everything lives in a single **MongoDB Atlas** document, accessible forever via a permanent vault URL. The vault displays the Solana transaction ID, the file hash, the AI report, and the voice audio - all in one place, shareable with a lawyer or journalist instantly.

**Verification requires zero trust in Witness.** Anyone with the original file can run:

```bash
shasum -a 256 yourfile.mp4
```

If the output matches the hash on the Solana blockchain, the file is mathematically proven unaltered. The logic is simple:

```
H(file) == H(chain)  →  authentic, unaltered
H(file) != H(chain)  →  tampered with
```

---

## How I Built It

The stack was chosen deliberately, not by default.

| Layer        | Technology                            | Why                                                                         |
| ------------ | ------------------------------------- | --------------------------------------------------------------------------- |
| Frontend     | React + React Router                  | Step-by-step pipeline UX with real-time progress states                     |
| Backend      | Node.js + Express                     | Orchestrates the 3-API sequence into one atomic MongoDB document            |
| Blockchain   | Solana (@solana/web3.js)              | Sub-second finality, ~$0.00025/tx, permanent memo transactions              |
| Voice        | ElevenLabs API                        | Preserves human voice as evidence; removes literacy barriers                |
| AI Analysis  | Solar Pro 3 via OpenRouter            | Entity extraction, classification, urgency scoring, legal report generation |
| Database     | MongoDB Atlas                         | Flexible schema for varied, messy evidence data                             |
| File Hashing | Node.js crypto (SHA-256)              | Built-in, no dependencies, industry standard                                |
| Hosting      | Railway (backend) + Vercel (frontend) | Deployed, live, fully independent of any local machine                      |

The backend runs three sequential endpoints — `/api/submit` (hash + Solana), `/api/voice` (ElevenLabs), `/api/analyze` (AI) — all writing into the same MongoDB document by ID. The frontend calls them in sequence, showing a live progress panel with each step lighting up in real time.

The file itself is never stored permanently. Only its fingerprint goes on-chain. Witness is a proof-of-existence tool, not a surveillance system.

---

## Challenges I Ran Into

It was sitting with the weight of what this tool is actually for, and making sure every design decision reflected that. The language on buttons. The tone of the AI report. The way the vault page presents information. Every element had to be legible to someone who is scared, who may not speak English fluently, who may be filing evidence against people with significantly more power than them. No framework solves that for you.

On the technical side:

- **Solana devnet memo transactions** are not extensively documented for this exact use case. Getting a keypair funded, writing arbitrary data to the memo program, and confirming transactions reliably took real iteration.
- **ElevenLabs returns an async stream**, not a buffer. Converting that stream into base64, storing it in MongoDB, and playing it back in an `<audio>` tag required careful handling.
- **Coordinating three sequential API calls**: each dependent on the MongoDB ID returned by the previous, while keeping the frontend progress states accurate and handling mid-pipeline failures gracefully was the core engineering challenge of the night.

---

## Accomplishments I'm Proud Of

Building a full-stack, blockchain-integrated, AI-powered legal tool in 24 hours that actually works end to end on a live URL.

The verification story is the thing I'm proudest of: **no trust in Witness is required**. Any person, anywhere, with any computer, can independently verify a piece of evidence using a single terminal command and a public blockchain explorer.

The "The Why" page, which cites peer-reviewed studies, investigative journalism, and human rights reports to ground every product decision in documented, real-world failure.

---

## What I Learned

That the most important infrastructure in a crisis is the kind you build before you need it.

Evidence doesn't disappear because people are careless. It disappears because the systems that should protect it are sometimes the same systems that benefit from its absence.

Cryptography doesn't have a political opinion. A SHA-256 hash doesn't know who generated it or why. The Solana blockchain doesn't ask for permission. That neutrality, is a profound form of protection.

And practically: scoping a 24-hour solo build is an art form. The vault page with a working Solana explorer link is worth more than five half-finished features.

---

## What's Next for Witness

- **Cross-device support**: fully responsive experience on more devices, mainly phones and tablets.
- **Stronger encoding**: moving from SHA-256 to SHA-3 or BLAKE3 for enhanced collision resistance.
- **User accounts**: email or wallet-based auth so users can access a history of their sealed records without relying solely on saving a URL
- **Legal aid integrations**: direct submission pipelines to organizations like the ACLU, legal aid societies, and human rights documentation projects
- **Multilingual support**: evidence capture shouldn't require English literacy
- **Media authenticity layer**: integrating C2PA (Coalition for Content Provenance and Authenticity) standards to flag likely AI-generated content at upload time

---

_Built by Arshiya Sharma_
