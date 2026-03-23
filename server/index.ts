import "dotenv/config";
import express from "express";
import cors from "cors";
import type { CorsOptions } from "cors";

const app = express();
const port = Number(process.env.PORT || 3001);
const groqApiKey = process.env.GROQ_API_KEY;
const groqModel = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Allow server-to-server and same-origin calls without an Origin header.
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  }
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

async function handleTranslate(req: express.Request, res: express.Response) {
  const input = typeof req.body?.input === "string" ? req.body.input.trim() : "";

  if (!input) {
    return res.status(400).json({ error: "Please enter a description to convert." });
  }

  if (!groqApiKey) {
    return res.status(500).json({
      error: "Missing GROQ_API_KEY. Add it to your .env file before generating captions."
    });
  }

  const systemPrompt = [
    "You rewrite plain user input into a polished LinkedIn post.",
    "Sound warm, ambitious, specific, and human.",
    "Use a strong opening hook, short readable paragraphs, gratitude when appropriate, and one light closing line.",
    "Keep it under 230 words unless the input clearly needs more context.",
    "Do not invent employers, numbers, mentors, or achievements that were not provided.",
    "If the input is casual or messy, infer the intended achievement and present it professionally.",
    "Avoid cliches like 'delighted to share' in every response. Vary the wording.",
    "Return only the final LinkedIn-ready caption with tasteful emoji only if it fits naturally."
  ].join(" ");

  const userPrompt = [
    "Convert this raw note into LinkedIn speak.",
    "Preserve the meaning, add polish, and make it sound post-ready:",
    input
  ].join("\n\n");

  try {
    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${groqApiKey}`
      },
      body: JSON.stringify({
        model: groqModel,
        temperature: 0.8,
        max_tokens: 300,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ]
      })
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      return res.status(502).json({
        error: `Groq request failed: ${errorText || groqResponse.statusText}`
      });
    }

    const data = (await groqResponse.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const output = data.choices?.[0]?.message?.content?.trim();

    if (!output) {
      return res.status(502).json({ error: "The model did not return a caption." });
    }

    return res.json({success:true,data:output });
  } catch (error) {
    return res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : "Something went wrong while generating the LinkedIn caption."
    });
  }
}

app.post("/translate", handleTranslate);
app.post("/api/translate", handleTranslate);

app.listen(port, () => {
  console.log(`LinkedIn Speak API running on http://localhost:${port}`);
});
