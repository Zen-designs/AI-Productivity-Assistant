import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import {
  Mail,
  FileText,
  ListChecks,
  Search,
  MessageSquare,
  ArrowUpRight,
  Sparkles,
  Activity,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — AI Workplace" },
      { name: "description", content: "Your AI productivity command center." },
    ],
  }),
  component: Dashboard,
});

const stats = [
  { label: "Emails Generated", value: "128", delta: "+12 this week", icon: Mail },
  { label: "Meetings Summarized", value: "34", delta: "+5 this week", icon: FileText },
  { label: "Tasks Planned", value: "212", delta: "+28 this week", icon: ListChecks },
  { label: "Research Reports", value: "19", delta: "+3 this week", icon: Search },
];

const quick = [
  { title: "New Email", desc: "Draft a professional message", to: "/email", icon: Mail },
  { title: "New Summary", desc: "Summarize a meeting transcript", to: "/summarize", icon: FileText },
  { title: "New Plan", desc: "Turn a goal into a roadmap", to: "/planner", icon: ListChecks },
  { title: "New Research", desc: "Get insights on any topic", to: "/research", icon: Search },
  { title: "Open Chat", desc: "Ask anything, get answers", to: "/chat", icon: MessageSquare },
];

const recent = [
  { type: "Email", title: "Q3 sales follow-up to Acme Corp", time: "2h ago", icon: Mail },
  { type: "Summary", title: "Engineering sync — Nov 14", time: "5h ago", icon: FileText },
  { type: "Plan", title: "Launch plan: mobile app v2", time: "Yesterday", icon: ListChecks },
  { type: "Research", title: "EU AI Act implications for SaaS", time: "2 days ago", icon: Search },
];

function Dashboard() {
  return (
    <AppShell title="Dashboard" description="Your AI productivity overview">
      <div className="space-y-8">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-2xl border bg-[var(--gradient-primary)] p-6 md:p-8 text-primary-foreground shadow-[var(--shadow-glow)]">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium backdrop-blur">
              <Sparkles className="h-3 w-3" />
              Powered by AI
            </div>
            <h2 className="mt-3 text-2xl md:text-3xl font-bold tracking-tight">
              Good to see you. Ready to ship more today?
            </h2>
            <p className="mt-2 text-sm md:text-base text-primary-foreground/80">
              Generate emails, summarize meetings, plan projects, and run research — all from one
              workspace.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                to="/email"
                className="inline-flex items-center gap-1.5 rounded-md bg-white px-3.5 py-2 text-xs font-semibold text-primary shadow-sm hover:bg-white/95 transition-colors"
              >
                <Mail className="h-3.5 w-3.5" /> Draft an email
              </Link>
              <Link
                to="/chat"
                className="inline-flex items-center gap-1.5 rounded-md bg-white/10 px-3.5 py-2 text-xs font-semibold backdrop-blur hover:bg-white/20 transition-colors"
              >
                <MessageSquare className="h-3.5 w-3.5" /> Open AI chat
              </Link>
            </div>
          </div>
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -right-10 bottom-0 h-48 w-48 rounded-full bg-white/5 blur-2xl" />
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <Card
              key={s.label}
              className="p-5 border-border/60 shadow-[var(--shadow-card)] hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
                  <p className="mt-2 text-2xl font-bold">{s.value}</p>
                  <p className="mt-1 text-[11px] text-success">{s.delta}</p>
                </div>
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  <s.icon className="h-4 w-4" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Quick actions</h3>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {quick.map((q) => (
              <Link key={q.to} to={q.to} className="group">
                <Card className="h-full p-4 border-border/60 shadow-[var(--shadow-card)] hover:border-primary/40 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between">
                    <div className="rounded-lg bg-accent p-2 text-accent-foreground">
                      <q.icon className="h-4 w-4" />
                    </div>
                    <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <p className="mt-3 text-sm font-semibold">{q.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{q.desc}</p>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Recent activity */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Recent activity</h3>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </div>
          <Card className="divide-y border-border/60 shadow-[var(--shadow-card)] overflow-hidden">
            {recent.map((r, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-4 py-3 hover:bg-muted/40 transition-colors"
              >
                <div className="rounded-md bg-primary/10 p-1.5 text-primary">
                  <r.icon className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{r.title}</p>
                  <p className="text-[11px] text-muted-foreground">{r.type}</p>
                </div>
                <span className="text-[11px] text-muted-foreground">{r.time}</span>
              </div>
            ))}
          </Card>
        </section>
      </div>
    </AppShell>
  );
}
