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
