import type { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function AppShell({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <SidebarTrigger />
            <div className="flex-1 min-w-0">
              <h1 className="text-sm font-semibold truncate">{title}</h1>
              {description && (
                <p className="text-xs text-muted-foreground truncate">{description}</p>
              )}
            </div>
            <div className="relative hidden md:block">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="h-8 w-56 pl-8 text-xs bg-muted/40 border-transparent focus-visible:bg-background"
              />
            </div>
            <button
              className="relative inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent transition-colors"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
            </button>
          </header>
          <main className="flex-1 p-4 md:p-8 max-w-[1400px] w-full mx-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
