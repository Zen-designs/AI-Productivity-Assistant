import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AppShell } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FileText, Loader2, Upload } from "lucide-react";
import { generateAI } from "@/lib/ai.functions";
import { AiOutputCard } from "@/components/AiOutputCard";
import { AiDisclaimer } from "@/components/AiDisclaimer";
import { toast } from "sonner";

export const Route = createFileRoute("/summarize")({
  head: () => ({ meta: [{ title: "Meeting Summarizer — AI Workplace" }] }),
  component: SummarizePage,
});

function SummarizePage() {
  const generate = useServerFn(generateAI);
  const [transcript, setTranscript] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const onFile = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large (max 5MB). Try pasting text instead.");
      return;
    }
    const text = await file.text();
    setTranscript(text);
    toast.success(`Loaded ${file.name}`);
  };

  const run = async () => {
    if (transcript.trim().length < 30) {
      toast.error("Paste a meeting transcript first.");
      return;
    }
    setLoading(true);
    try {
      const { content } = await generate({
        data: {
          system: "You are an expert meeting analyst.",
          user: `Summarize the following meeting transcript. Use clean markdown with these sections in order:\n\n## Executive Summary\n## Key Decisions\n## Action Items (with owners if mentioned)\n## Risks\n## Follow-up Tasks\n\nTranscript:\n${transcript}`,
        },
      });
      setOutput(content);
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to summarize");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell title="Meeting Summarizer" description="Turn transcripts into clear summaries">
      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <Card className="p-5 space-y-4 border-border/60 shadow-[var(--shadow-card)] h-fit">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold">Input</h2>
              <p className="text-xs text-muted-foreground">Paste or upload your transcript</p>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="transcript">Transcript</Label>
            <Textarea
              id="transcript"
              placeholder="Paste the full meeting transcript here..."
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              className="min-h-[260px] font-mono text-xs"
            />
          </div>

          <label className="flex items-center justify-center gap-2 rounded-md border border-dashed bg-muted/30 px-3 py-3 text-xs text-muted-foreground hover:bg-muted/60 cursor-pointer transition-colors">
            <Upload className="h-3.5 w-3.5" />
            Upload .txt file
            <input
              type="file"
              accept=".txt,.md,.vtt,.srt"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
            />
          </label>

          <Button onClick={run} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Summarizing...
              </>
            ) : (
              "Summarize meeting"
            )}
          </Button>

          <AiDisclaimer />
        </Card>

        <AiOutputCard
          content={output}
          onChange={setOutput}
          onRegenerate={run}
          loading={loading}
          filename="meeting-summary.md"
          emptyHint="Paste a transcript on the left to get an executive summary, decisions, and action items."
        />
      </div>
    </AppShell>
  );
}
