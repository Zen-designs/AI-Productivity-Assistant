import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AppShell } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Loader2, Sparkles, Copy, RotateCcw, User } from "lucide-react";
import { chatAI } from "@/lib/ai.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/chat")({
  head: () => ({ meta: [{ title: "AI Chat — AI Workplace" }] }),
  component: ChatPage,
});

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Draft a Slack update on our launch progress",
  "Help me write an OKR for Q1",
  "How do I run a better 1:1 with my manager?",
  "Suggest agenda items for a 30-min product review",
];

function ChatPage() {
  const chat = useServerFn(chatAI);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const { content } = await chat({ data: { messages: next } });
      setMessages([...next, { role: "assistant", content }]);
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to get response");
      setMessages(next); // keep user message
    } finally {
      setLoading(false);
    }
  };

  const regenerate = async () => {
    if (messages.length === 0 || loading) return;
    // Drop trailing assistant
    const lastUserIdx = [...messages].reverse().findIndex((m) => m.role === "user");
    if (lastUserIdx < 0) return;
    const cutoff = messages.length - lastUserIdx;
    const trimmed = messages.slice(0, cutoff);
    setMessages(trimmed);
    setLoading(true);
    try {
      const { content } = await chat({ data: { messages: trimmed } });
      setMessages([...trimmed, { role: "assistant", content }]);
    } catch (e: any) {
      toast.error(e?.message ?? "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell title="AI Chat" description="Your general-purpose workplace assistant">
      <div className="grid gap-4 h-[calc(100vh-9rem)] grid-rows-[1fr_auto]">
        <Card className="overflow-hidden border-border/60 shadow-[var(--shadow-card)] flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center max-w-xl mx-auto">
                <div className="rounded-2xl bg-[var(--gradient-primary)] p-3 text-primary-foreground shadow-[var(--shadow-glow)]">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h2 className="mt-4 text-xl font-semibold">How can I help today?</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Ask anything — drafting, planning, explaining, or coaching.
                </p>
                <div className="mt-6 grid gap-2 sm:grid-cols-2 w-full">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="rounded-lg border bg-card px-3 py-2.5 text-left text-xs text-foreground hover:border-primary/40 hover:bg-accent transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-5 max-w-3xl mx-auto">
                {messages.map((m, i) => (
                  <Bubble key={i} msg={m} />
                ))}
                {loading && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Thinking...
                  </div>
                )}
                <div ref={endRef} />
              </div>
            )}
          </div>
        </Card>

        <div className="space-y-2">
          <div className="flex items-end gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              placeholder="Message AI Workplace... (Enter to send, Shift+Enter for newline)"
              className="min-h-[60px] resize-none"
              maxLength={4000}
            />
            <div className="flex flex-col gap-2">
              {messages.length > 0 && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={regenerate}
                  disabled={loading}
                  title="Regenerate"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              )}
              <Button
                onClick={() => send(input)}
                disabled={loading || !input.trim()}
                size="icon"
                className="h-10 w-10"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground text-center">
            AI may produce inaccurate information. Verify important details.
          </p>
        </div>
      </div>
    </AppShell>
  );
}

function Bubble({ msg }: { msg: Msg }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`shrink-0 h-8 w-8 rounded-lg flex items-center justify-center ${
          isUser ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"
        }`}
      >
        {isUser ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
      </div>
      <div className={`group max-w-[80%] ${isUser ? "items-end" : "items-start"} flex flex-col`}>
        <div
          className={`rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap leading-relaxed ${
            isUser
              ? "bg-primary text-primary-foreground rounded-tr-sm"
              : "bg-muted text-foreground rounded-tl-sm"
          }`}
        >
          {msg.content}
        </div>
        {!isUser && (
          <button
            className="mt-1 inline-flex items-center gap-1 text-[11px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:text-foreground"
            onClick={() => {
              navigator.clipboard.writeText(msg.content);
              toast.success("Copied");
            }}
          >
            <Copy className="h-3 w-3" /> Copy
          </button>
        )}
      </div>
    </div>
  );
}
