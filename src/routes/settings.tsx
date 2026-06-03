import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Settings as SettingsIcon, Shield } from "lucide-react";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — AI Workplace" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <AppShell title="Settings" description="Manage your workspace preferences">
      <div className="max-w-2xl space-y-4">
        <Card className="p-6 border-border/60 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <SettingsIcon className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold">General</h2>
              <p className="text-xs text-muted-foreground">Workspace and account preferences</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Profile, integrations, team management, and billing will live here in a future update.
          </p>
        </Card>

        <Card className="p-6 border-border/60 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-warning/15 p-2 text-warning">
              <Shield className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold">Responsible AI</h2>
              <p className="text-xs text-muted-foreground">How we handle AI-generated content</p>
            </div>
          </div>
          <div className="mt-4 space-y-2 text-sm text-muted-foreground leading-relaxed">
            <p>
              This application uses generative AI to assist with workplace productivity.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>AI outputs may contain inaccuracies.</li>
              <li>Verify important business decisions independently.</li>
              <li>
                Do not submit confidential or regulated information without authorization.
              </li>
              <li>Human review is recommended before acting on AI-generated content.</li>
            </ul>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
