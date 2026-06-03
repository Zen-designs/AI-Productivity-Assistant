import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  system: z.string().min(1).max(4000),
  user: z.string().min(1).max(20000),
  model: z.string().optional(),
});

export const generateAI = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      throw new Error("AI is not configured. Missing LOVABLE_API_KEY.");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: data.model ?? "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: data.system },
          { role: "user", content: data.user },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("Rate limit reached. Please try again in a moment.");
      }
      if (response.status === 402) {
        throw new Error("AI credits exhausted. Please add credits to your workspace.");
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      throw new Error("AI request failed.");
    }

    const json = await response.json();
    const content: string = json?.choices?.[0]?.message?.content ?? "";
    return { content };
  });

const ChatSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant", "system"]),
        content: z.string().min(1).max(20000),
      })
    )
    .min(1)
    .max(50),
});

export const chatAI = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => ChatSchema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("AI is not configured.");

    const systemMsg = {
      role: "system" as const,
      content:
        "You are an expert workplace productivity assistant. Provide clear, concise, actionable answers using markdown formatting when helpful.",
    };

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [systemMsg, ...data.messages],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) throw new Error("Rate limit reached. Try again shortly.");
      if (response.status === 402) throw new Error("AI credits exhausted.");
      throw new Error("AI request failed.");
    }

    const json = await response.json();
    const content: string = json?.choices?.[0]?.message?.content ?? "";
    return { content };
  });
