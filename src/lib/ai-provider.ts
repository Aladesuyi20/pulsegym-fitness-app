// Provider-agnostic AI chat call.
//
// The original app only worked through Lovable's private AI gateway
// (LOVABLE_API_KEY), which is only issued inside Lovable Cloud. This module
// picks a provider based on whichever API key is configured in the
// environment, so the AI coach keeps working no matter where the app is
// deployed — Lovable, Vercel, Netlify, or your own server.
//
// Supported providers (auto-detected in this order, or force one with
// AI_PROVIDER=lovable|openai|gemini|anthropic):
//   1. Lovable AI Gateway  - LOVABLE_API_KEY    (only issued inside Lovable Cloud)
//   2. OpenAI              - OPENAI_API_KEY     (+ optional OPENAI_MODEL, default "gpt-4o-mini")
//   3. Google Gemini       - GEMINI_API_KEY or GOOGLE_API_KEY (+ optional GEMINI_MODEL, default "gemini-2.0-flash")
//   4. Anthropic Claude    - ANTHROPIC_API_KEY  (+ optional ANTHROPIC_MODEL, default "claude-3-5-haiku-latest")
//
// All four are prompted with the same strict-JSON contract by the caller, so
// chat.functions.ts doesn't need to know which provider actually answered.

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };
export type AiResult = { ok: true; text: string } | { ok: false; error: string };

type Provider = "lovable" | "openai" | "gemini" | "anthropic";

function detectProvider(): Provider | null {
  const forced = process.env.AI_PROVIDER?.toLowerCase();
  if (
    forced === "lovable" ||
    forced === "openai" ||
    forced === "gemini" ||
    forced === "anthropic"
  ) {
    return forced;
  }
  if (process.env.LOVABLE_API_KEY) return "lovable";
  if (process.env.OPENAI_API_KEY) return "openai";
  if (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY) return "gemini";
  if (process.env.ANTHROPIC_API_KEY) return "anthropic";
  return null;
}

export async function callAiChat(messages: ChatMessage[]): Promise<AiResult> {
  const provider = detectProvider();
  if (!provider) {
    return {
      ok: false,
      error:
        "No AI provider is configured on the server. Set one of LOVABLE_API_KEY, OPENAI_API_KEY, GEMINI_API_KEY, or ANTHROPIC_API_KEY.",
    };
  }
  try {
    switch (provider) {
      case "lovable":
        return await callOpenAiCompatible({
          url: "https://ai.gateway.lovable.dev/v1/chat/completions",
          apiKey: process.env.LOVABLE_API_KEY!,
          model: process.env.LOVABLE_MODEL || "google/gemini-3.6-flash",
          messages,
        });
      case "openai":
        return await callOpenAiCompatible({
          url: "https://api.openai.com/v1/chat/completions",
          apiKey: process.env.OPENAI_API_KEY!,
          model: process.env.OPENAI_MODEL || "gpt-4o-mini",
          messages,
        });
      case "gemini":
        return await callGemini(messages);
      case "anthropic":
        return await callAnthropic(messages);
    }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown AI provider error." };
  }
}

async function callOpenAiCompatible(opts: {
  url: string;
  apiKey: string;
  model: string;
  messages: ChatMessage[];
}): Promise<AiResult> {
  const res = await fetch(opts.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${opts.apiKey}`,
    },
    body: JSON.stringify({
      model: opts.model,
      messages: opts.messages,
      response_format: { type: "json_object" },
    }),
  });
  return parseOpenAiCompatibleResponse(res);
}

async function parseOpenAiCompatibleResponse(res: Response): Promise<AiResult> {
  if (res.status === 429) {
    return { ok: false, error: "The AI coach is busy right now (rate limit). Please try again in a moment." };
  }
  if (res.status === 402) {
    return { ok: false, error: "The AI service is out of credits. Please contact the studio." };
  }
  if (!res.ok) {
    return { ok: false, error: `AI service error (${res.status}). Please try again.` };
  }
  const json = await res.json();
  const text = json.choices?.[0]?.message?.content;
  if (typeof text !== "string") {
    return { ok: false, error: "AI service returned an unexpected response." };
  }
  return { ok: true, text };
}

async function callGemini(messages: ChatMessage[]): Promise<AiResult> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY!;
  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  const system = messages.find((m) => m.role === "system")?.content;
  const contents = messages
    .filter((m) => m.role !== "system")
    .map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        ...(system ? { systemInstruction: { parts: [{ text: system }] } } : {}),
        generationConfig: { responseMimeType: "application/json" },
      }),
    },
  );
  if (res.status === 429) {
    return { ok: false, error: "The AI coach is busy right now (rate limit). Please try again in a moment." };
  }
  if (!res.ok) {
    return { ok: false, error: `AI service error (${res.status}). Please try again.` };
  }
  const json = await res.json();
  const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
  if (typeof text !== "string") {
    return { ok: false, error: "AI service returned an unexpected response." };
  }
  return { ok: true, text };
}

async function callAnthropic(messages: ChatMessage[]): Promise<AiResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY!;
  const model = process.env.ANTHROPIC_MODEL || "claude-3-5-haiku-latest";
  const system = messages.find((m) => m.role === "system")?.content;
  const convo = messages
    .filter((m) => m.role !== "system")
    .map((m) => ({ role: m.role, content: m.content }));

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 1024,
      ...(system ? { system } : {}),
      messages: convo,
    }),
  });
  if (res.status === 429) {
    return { ok: false, error: "The AI coach is busy right now (rate limit). Please try again in a moment." };
  }
  if (!res.ok) {
    return { ok: false, error: `AI service error (${res.status}). Please try again.` };
  }
  const json = await res.json();
  const text = json.content?.[0]?.text;
  if (typeof text !== "string") {
    return { ok: false, error: "AI service returned an unexpected response." };
  }
  return { ok: true, text };
}
