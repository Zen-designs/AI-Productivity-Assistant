import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AppShell } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { generateAI } from "@/lib/ai.functions";
import { AiOutputCard } from "@/components/AiOutputCard";
import { AiDisclaimer } from "@/components/AiDisclaimer";
import { toast } from "sonner";

export const Route = createFileRoute("/research")({
  head: () => ({ meta: [{ title: "Research Assistant — AI Workplace" }] }),
  component: ResearchPage,
});

function ResearchPage() {
  const generate = useServerFn(generateAI);
  const [topic, setTopic] = useState("");
  const [industry, setIndustry] = useState("");
  const [objective, setObjective] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (!topic.trim()) {
      toast.error("Enter a research topic first.");
      return;
    }
    setLoading(true);
    try {
      const { content } = await generate({
        data: {
          system: "You are an experienced business research analyst.",
          user: `Research the following topic and produce a workplace-ready report in clean markdown.\n\nTopic: ${topic}\nIndustry: ${industry || "not specified"}\nObjective: ${objective || "general briefing"}\n\nReturn these sections in order:\n## Summary\n## Key Insights\n## Opportunities\n## Risks\n## Recommendations`,
        },
      });
      setOutput(content);
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to run research");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell title="Research Assistant" description="Fast, structured business research">
      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <Card className="p-5 space-y-4 border-border/60 shadow-[var(--shadow-card)] h-fit">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <Search className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold">Research brief</h2>
              <p className="text-xs text-muted-foreground">Define scope and objective</p>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="topic">Topic</Label>
            <Input
              id="topic"
              placeholder="e.g. AI adoption trends in mid-market healthcare"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="industry">Industry</Label>
            <Input
              id="industry"
              placeholder="e.g. Healthcare, SaaS, Manufacturing"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="objective">Objective</Label>
            <Textarea
              id="objective"
              placeholder="What decision is this informing? Who is the audience?"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <Button onClick={run} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Researching...
              </>
            ) : (
              "Run research"
            )}
          </Button>

          <AiDisclaimer />
        </Card>

        <AiOutputCard
          content={output}
          onChange={setOutput}
          onRegenerate={run}
          loading={loading}
          filename="research-report.md"
          emptyHint="Enter a topic to get a structured briefing with insights, opportunities, risks, and recommendations."
        />
      </div>
    </AppShell>
  );
}
