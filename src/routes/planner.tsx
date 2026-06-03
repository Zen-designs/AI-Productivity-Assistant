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
import { ListChecks, Loader2 } from "lucide-react";
import { generateAI } from "@/lib/ai.functions";
import { AiOutputCard } from "@/components/AiOutputCard";
import { AiDisclaimer } from "@/components/AiDisclaimer";
import { toast } from "sonner";

export const Route = createFileRoute("/planner")({
  head: () => ({ meta: [{ title: "Task Planner — AI Workplace" }] }),
  component: PlannerPage,
});

function PlannerPage() {
  const generate = useServerFn(generateAI);
  const [goal, setGoal] = useState("");
  const [deadline, setDeadline] = useState("");
  const [team, setTeam] = useState("3");
  const [priority, setPriority] = useState("High");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (!goal.trim()) {
      toast.error("Describe the project goal first.");
      return;
    }
    setLoading(true);
    try {
      const { content } = await generate({
        data: {
          system: "You are a workplace productivity strategist.",
          user: `Create a detailed project plan in clean markdown.\n\nGoal: ${goal}\nDeadline: ${deadline || "not specified"}\nTeam Size: ${team}\nPriority: ${priority}\n\nReturn these sections in order:\n## Milestones (with target dates)\n## Tasks (grouped by milestone, with owners suggested by role)\n## Dependencies\n## Timeline (weekly breakdown)\n## Risks & Mitigation`,
        },
      });
      setOutput(content);
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to generate plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell title="Task Planner" description="Turn goals into structured work plans">
      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <Card className="p-5 space-y-4 border-border/60 shadow-[var(--shadow-card)] h-fit">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <ListChecks className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold">Plan a project</h2>
              <p className="text-xs text-muted-foreground">From idea to roadmap</p>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="goal">Project goal</Label>
            <Textarea
              id="goal"
              placeholder="e.g. Launch a customer-facing analytics dashboard for the SMB segment."
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="min-h-[120px]"
            />
          </div>

          <div className="grid gap-2 grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="team">Team size</Label>
              <Input
                id="team"
                type="number"
                min={1}
                max={50}
                value={team}
                onChange={(e) => setTeam(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="priority">Priority</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger id="priority">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={run} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Building plan...
              </>
            ) : (
              "Generate project plan"
            )}
          </Button>

          <AiDisclaimer />
        </Card>

        <AiOutputCard
          content={output}
          onChange={setOutput}
          onRegenerate={run}
          loading={loading}
          filename="project-plan.md"
          emptyHint="Describe a goal, deadline, and team — get back milestones, tasks, dependencies, and risks."
        />
      </div>
    </AppShell>
  );
}
