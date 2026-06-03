import { useState } from "react";
import { Copy, RefreshCw, Download, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export function AiOutputCard({
  content,
  onChange,
  onRegenerate,
  loading,
  filename = "ai-output.txt",
  emptyHint = "Your AI-generated output will appear here.",
}: {
  content: string;
  onChange: (v: string) => void;
  onRegenerate?: () => void;
  loading?: boolean;
  filename?: string;
  emptyHint?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 1500);
  };

  const download = () => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="p-0 overflow-hidden border-border/60 shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between border-b bg-muted/30 px-4 py-2.5">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          AI Output
        </div>
        <div className="flex items-center gap-1">
          {onRegenerate && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRegenerate}
              disabled={loading}
              className="h-8 gap-1.5 text-xs"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              Regenerate
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={copy}
            disabled={!content}
            className="h-8 gap-1.5 text-xs"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            Copy
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={download}
            disabled={!content}
            className="h-8 gap-1.5 text-xs"
          >
            <Download className="h-3.5 w-3.5" />
            Download
          </Button>
        </div>
      </div>
      {loading && !content ? (
        <div className="p-6 space-y-3">
          <div className="h-3 w-3/4 bg-muted rounded animate-pulse" />
          <div className="h-3 w-full bg-muted rounded animate-pulse" />
          <div className="h-3 w-5/6 bg-muted rounded animate-pulse" />
          <div className="h-3 w-2/3 bg-muted rounded animate-pulse" />
        </div>
      ) : (
        <Textarea
          value={content}
          onChange={(e) => onChange(e.target.value)}
          placeholder={emptyHint}
          className="min-h-[360px] resize-y border-0 rounded-none font-mono text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      )}
    </Card>
  );
}
