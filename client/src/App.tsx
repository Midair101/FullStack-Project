import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PlayerProvider } from "@/lib/player-context";
import { AppSidebar } from "@/components/app-sidebar";
import { PlayerBar } from "@/components/player-bar";
import { ScrollArea } from "@/components/ui/scroll-area";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import SearchPage from "@/pages/search";
import PlaylistPage from "@/pages/playlist";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/search" component={SearchPage} />
      <Route path="/playlist/:id" component={PlaylistPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <PlayerProvider>
          <div className="flex flex-col h-screen w-full bg-background overflow-hidden">
            <div className="flex flex-1 overflow-hidden">
              {/* Sidebar */}
              <div className="w-60 flex-shrink-0 border-r border-border">
                <AppSidebar />
              </div>
              
              {/* Main Content */}
              <div className="flex-1 flex flex-col min-w-0">
                <ScrollArea className="flex-1">
                  <main className="min-h-full">
                    <Router />
                  </main>
                </ScrollArea>
              </div>
            </div>
            {/* Player Bar */}
            <PlayerBar />
          </div>
          
          <Toaster />
        </PlayerProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
