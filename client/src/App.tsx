import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import News from "@/pages/news";
import Login from "@/pages/dashboard/login";
import DashboardOverview from "@/pages/dashboard/index";
import PostsList from "@/pages/dashboard/posts";
import PostEditor from "@/pages/dashboard/post-editor";
import MediaLibrary from "@/pages/dashboard/media";
import Settings from "@/pages/dashboard/settings";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      {/* Public Website */}
      <Route path="/" component={Home} />
      <Route path="/news" component={News} />
      
      {/* Dashboard Routes */}
      <Route path="/dashboard/login" component={Login} />
      <Route path="/dashboard" component={DashboardOverview} />
      <Route path="/dashboard/posts" component={PostsList} />
      <Route path="/dashboard/posts/new" component={PostEditor} />
      <Route path="/dashboard/posts/:id/edit" component={PostEditor} />
      <Route path="/dashboard/media" component={MediaLibrary} />
      <Route path="/dashboard/settings" component={Settings} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
