import { useEffect } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Newspaper,
  Image as ImageIcon,
  Settings,
  LogOut,
  Menu,
} from "lucide-react";
import { useState } from "react";
import logoImage from "@assets/logo_1761155635320.jpg";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [location, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    // Check authentication
    const isAuth = localStorage.getItem("dashboard_auth");
    console.log("Dashboard auth check:", isAuth);
    if (!isAuth || isAuth !== "true") {
      console.log("Not authenticated, redirecting to login");
      window.location.href = "/dashboard/login";
    }
  }, [setLocation]);

  const handleLogout = () => {
    localStorage.removeItem("dashboard_auth");
    localStorage.removeItem("dashboard_user");
    window.location.href = "/dashboard/login";
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Newspaper, label: "News Posts", path: "/dashboard/posts" },
    { icon: ImageIcon, label: "Media Library", path: "/dashboard/media" },
    { icon: Settings, label: "Settings", path: "/dashboard/settings" },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-primary text-white transition-all duration-300 flex flex-col`}
      >
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <img src={logoImage} alt="NVTI Kanda" className="h-10 w-10" />
            {sidebarOpen && (
              <div>
                <div className="font-bold text-sm">NVTI Kanda</div>
                <div className="text-xs text-white/70">Dashboard</div>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-white hover:bg-white/10 hover-elevate ${
                    location === item.path ? "bg-white/20" : ""
                  } ${!sidebarOpen ? "justify-center px-2" : ""}`}
                  data-testid={`link-${item.label.toLowerCase().replace(' ', '-')}`}
                >
                  <item.icon className="h-5 w-5" />
                  {sidebarOpen && <span className="ml-3">{item.label}</span>}
                </Button>
              </Link>
            ))}
          </div>
        </nav>

        <div className="p-4 border-t border-white/10">
          <Button
            variant="ghost"
            className={`w-full justify-start text-white hover:bg-white/10 hover-elevate ${
              !sidebarOpen ? "justify-center px-2" : ""
            }`}
            onClick={handleLogout}
            data-testid="button-logout"
          >
            <LogOut className="h-5 w-5" />
            {sidebarOpen && <span className="ml-3">Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-background border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hover-elevate"
              data-testid="button-toggle-sidebar"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">News Management</h1>
              <p className="text-sm text-muted-foreground">Manage your news and announcements</p>
            </div>
          </div>

          <Link href="/">
            <Button variant="outline" className="hover-elevate" data-testid="button-view-website">
              View Website
            </Button>
          </Link>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
