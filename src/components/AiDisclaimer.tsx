import { Info } from "lucide-react";

export function AiDisclaimer() {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/10 px-3 py-2 text-xs text-warning-foreground/80">
      <Info className="h-3.5 w-3.5 mt-0.5 shrink-0 text-warning" />
      <p>
        AI outputs may contain inaccuracies. Review before sharing externally and never submit
        confidential or regulated information without authorization.
      </p>
    </div>
  );
}
