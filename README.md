# Autonomous Claims Agent

A lightweight Node.js service that processes FNOL (First Notice of Loss) documents, extracts key insurance claim fields using AI, identifies missing or incomplete data, and routes the claim to the correct workflow.

---

## 🌐 Live API (Deployed)

You can test the live API here:

```
https://autonomous-claims-agent.onrender.com/analyze
```

This endpoint accepts `POST` requests with `multipart/form-data` file uploads or raw text in the request body (text/plain).

---

## Features

- Upload FNOL documents (PDF/TXT)
- AI-powered extraction using **Vercel AI SDK + Groq**
- Field validation using **Zod**
- Automatic routing:

  - Fast-track (damage < 25,000)
  - Manual Review (missing mandatory fields)
  - Investigation Flag (fraud keywords)
  - Specialist Queue (injury-related claims)

- Clean structured JSON output

---

## Installation

```bash
npm install
```

---

## Environment Variables

Create a `.env` file:

```
PORT=3000
GROQ_API_KEY=your_groq_key_here
```

---

## Start Server

```bash
npm run dev
```

Server runs at:

```
http://localhost:3000
```

---

## API: Analyze FNOL Document

**Endpoint:**

```
POST /analyze
```

**Body:**

| Key  | Type                | Description                                                               |
| ---- | ------------------- | ------------------------------------------------------------------------- |
| file | File                | FNOL document (PDF or TXT)                                                |
| text | String (Form Field) | Raw FNOL text. Can be sent as JSON, text/plain, or a form-data text field |

---

## Example cURL (File Upload)

```bash
curl -X POST -F "file=@fnol.pdf" https://autonomous-claims-agent.onrender.com/analyze
```

## Example cURL (Raw Text)

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"text":"POLICY NUMBER: ABC123 INCIDENT DATE: 01/05/2024 DESCRIPTION: Rear-end collision..."}' \
  https://autonomous-claims-agent.onrender.com/analyze
```

---

## 📝 Notes

- If a field is not present in the document, the agent returns `null` or an empty value.
- The routing engine automatically sends the claim to **Manual Review** if mandatory fields are missing.

---
