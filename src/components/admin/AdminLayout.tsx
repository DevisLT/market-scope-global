import { useState, useEffect, ReactNode } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

export function AdminLayout({ children, title, description }: AdminLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  // Apply admin theme class to body when mounted
  useEffect(() => {
    document.documentElement.classList.add("admin-theme");
    document.documentElement.classList.add("dark");
    
    return () => {
      document.documentElement.classList.remove("admin-theme");
      // Don't remove dark class as it might be user preference
    };
  }, []);

  return (
    <div className="min-h-screen bg-[hsl(var(--admin-bg))] admin-theme">
      <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      
      <AdminHeader
        title={title}
        description={description}
        collapsed={collapsed}
      />
      
      <main
        className={cn(
          "min-h-[calc(100vh-4rem)] transition-all duration-300 p-6",
          collapsed ? "ml-16" : "ml-64"
        )}
      >
        {children}
      </main>
    </div>
  );
}
