import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AppShell } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, Loader2 } from "lucide-react";
import { generateAI } from "@/lib/ai.functions";
import { AiOutputCard } from "@/components/AiOutputCard";
import { AiDisclaimer } from "@/components/AiDisclaimer";
import { toast } from "sonner";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [{ title: "Email Generator — AI Workplace" }],
  }),
  component: EmailPage,
});

const EMAIL_TYPES = [
  "Client Communication",
  "Follow-up",
  "Sales Outreach",
  "Internal Team Update",
  "Meeting Invitation",
  "Custom",
];
const TONES = ["Professional", "Friendly", "Formal", "Persuasive", "Concise"];

function EmailPage() {
  const generate = useServerFn(generateAI);
  const [type, setType] = useState("Client Communication");
  const [tone, setTone] = useState("Professional");
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [points, setPoints] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (!recipient || !subject || !points) {
      toast.error("Recipient, subject, and key points are required.");
      return;
    }
    setLoading(true);
    try {
      const { content } = await generate({
        data: {
          system: "You are an expert business communication assistant.",
          user: `Generate a professional email based on:\n\nEmail Type: ${type}\nRecipient: ${recipient}\nSubject: ${subject}\nTone: ${tone}\nKey Points:\n${points}\n\nReturn ONLY the email body (no subject line, no preface).`,
        },
      });
      setOutput(content);
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to generate email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell title="Email Generator" description="Draft professional emails in seconds">
      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <Card className="p-5 space-y-4 border-border/60 shadow-[var(--shadow-card)] h-fit">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <Mail className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold">Compose</h2>
              <p className="text-xs text-muted-foreground">Configure your email</p>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="type">Email type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EMAIL_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="recipient">Recipient</Label>
            <Input
              id="recipient"
              placeholder="e.g. Jane Smith, Head of Marketing at Acme"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="e.g. Proposal for Q4 partnership"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="tone">Tone</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger id="tone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TONES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="points">Key points</Label>
            <Textarea
              id="points"
              placeholder="Bullet your main points, context, and any call-to-action..."
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              className="min-h-[140px]"
            />
          </div>

          <Button onClick={run} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Generating...
              </>
            ) : (
              "Generate email"
            )}
          </Button>

          <AiDisclaimer />
        </Card>

        <div className="space-y-3">
          <AiOutputCard
            content={output}
            onChange={setOutput}
            onRegenerate={run}
            loading={loading}
            filename="email.txt"
            emptyHint="Fill in the form and click Generate. Your draft will appear here, fully editable."
          />
        </div>
      </div>
    </AppShell>
  );
}
