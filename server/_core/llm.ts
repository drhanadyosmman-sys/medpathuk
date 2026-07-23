import Anthropic from "@anthropic-ai/sdk";
import { ENV } from "./env";

// Claude, called through the official Anthropic SDK.
//
// This replaced a hand-rolled fetch against Manus's forge endpoint, which tied
// the platform's AI to a Manus subscription and key. Nothing here depends on
// Manus, so the app can run wherever it is hosted.

const MODEL = "claude-opus-4-8";

/**
 * Default output ceiling. Kept below ~16k so non-streaming requests finish
 * inside the SDK's HTTP timeout; anything needing more should stream.
 */
const DEFAULT_MAX_TOKENS = 16000;

export type Role = "system" | "user" | "assistant";

export interface Message {
  role: Role;
  content: string;
}

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!ENV.anthropicApiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY is not configured — AI features are unavailable"
    );
  }
  if (!client) client = new Anthropic({ apiKey: ENV.anthropicApiKey });
  return client;
}

/**
 * Claude takes the system prompt as its own parameter rather than as a message,
 * so pull any system entries out of the list. Callers assembled these in the
 * OpenAI style, where the system prompt is just the first message.
 */
function splitSystem(messages: Message[]): {
  system: string | undefined;
  turns: Anthropic.MessageParam[];
} {
  const systemParts: string[] = [];
  const turns: Anthropic.MessageParam[] = [];

  for (const message of messages) {
    if (message.role === "system") {
      systemParts.push(message.content);
      continue;
    }
    turns.push({ role: message.role, content: message.content });
  }

  return {
    system: systemParts.length > 0 ? systemParts.join("\n\n") : undefined,
    turns,
  };
}

/** Pulls the text out of a response, and turns anything else into an error. */
function readText(message: Anthropic.Message): string {
  if (message.stop_reason === "refusal") {
    throw new Error("Claude declined to answer this request");
  }

  const text = message.content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map(block => block.text)
    .join("");

  if (!text) throw new Error("Claude returned an empty response");

  // Truncated output is usually invalid downstream — JSON especially — so fail
  // here rather than letting a half-written answer reach the user.
  if (message.stop_reason === "max_tokens") {
    throw new Error("Claude's response was cut off before it finished");
  }

  return text;
}

export type ResponseLanguage = "en" | "ar";

/**
 * A directive appended to a prompt so the model answers in the reader's
 * language. English is the default and adds nothing.
 *
 * Arabic keeps three kinds of thing in English on purpose: any value the
 * response must return as a fixed token that the client maps back to a label
 * (translating it silently breaks the mapping); every URL; and the official UK
 * names, bodies and exam abbreviations, because those are what the doctor will
 * actually meet on Oriel and the college sites — all of which are in English.
 * The point is comprehension for the reader, not a translation of the system.
 */
export function languageInstruction(
  language: ResponseLanguage | undefined
): string {
  if (language !== "ar") return "";
  return `

Respond in clear, professional Arabic (العربية), suitable for a doctor.
Translate all human-readable prose — titles, summaries, descriptions, advice, steps — into Arabic.
Keep the following in English, do NOT translate them:
- Any field this response must return as a fixed token (for example the "category" and "priority" values) — return those EXACTLY as the English options listed above, unchanged.
- Every URL.
- Official UK names, bodies and exam abbreviations: NHS, GMC, GDC, PLAB, MRCP, MRCS, MRCGP, MRCPCH, MRCOG, MRCPsych, FRCA, FRCR, OET, IELTS, Oriel, PubMed, NIHR, NICE, MSRA, IMT, CST, ACCS, PHST, UKFPO, HEE, and Royal College names.`;
}

/** A plain text completion. */
export async function invokeLLM(params: {
  messages: Message[];
  maxTokens?: number;
}): Promise<string> {
  const { system, turns } = splitSystem(params.messages);

  const response = await getClient().messages.create({
    model: MODEL,
    max_tokens: params.maxTokens ?? DEFAULT_MAX_TOKENS,
    thinking: { type: "adaptive" },
    ...(system ? { system } : {}),
    messages: turns,
  });

  return readText(response);
}

/**
 * A completion constrained to a JSON schema, parsed and returned.
 *
 * The schema is enforced by the API rather than requested in the prompt, so the
 * result is valid by construction — no repair pass, no retry loop.
 */
export async function invokeLLMJson<T>(params: {
  messages: Message[];
  schema: Record<string, unknown>;
  maxTokens?: number;
}): Promise<T> {
  const { system, turns } = splitSystem(params.messages);

  const response = await getClient().messages.create({
    model: MODEL,
    max_tokens: params.maxTokens ?? DEFAULT_MAX_TOKENS,
    thinking: { type: "adaptive" },
    output_config: { format: { type: "json_schema", schema: params.schema } },
    ...(system ? { system } : {}),
    messages: turns,
  });

  return JSON.parse(readText(response)) as T;
}
