"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, Workflow, Settings, CreditCard, 
  Zap, LogOut, ShieldCheck, ScrollText, Database
} from "lucide-react";
import { UserButton, useClerk } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/theme-toggle"; // Import Toggle

interface SidebarProps {
    currentCredits: number;
}

const MENU_ITEMS = [
  { name: "Overview", icon: LayoutDashboard, href: "/dashboard" },
  { name: "Workflows", icon: Workflow, href: "/dashboard/workflows" },
  { name: "Connections", icon: Zap, href: "/dashboard/connections" },
  { name: "Activity Logs", icon: ScrollText, href: "/dashboard/logs" },
  { name: "Billing", icon: CreditCard, href: "/dashboard/billing" },
  { name: "Settings", icon: Settings, href: "/dashboard/settings" },
];

export const Sidebar = ({ currentCredits }: SidebarProps) => {
  const pathname = usePathname();
  const { signOut } = useClerk();

  return (
    // FIX: Using CSS Variables for Background (bg-card) ensures it matches theme
    <div className="h-full w-full bg-card border-r border-border flex flex-col relative overflow-hidden transition-colors duration-300">
      
      {/* 1. HEADER */}
      <div className="p-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Workflow className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl text-foreground tracking-tight">Orbit</span>
        </div>
        {/* THEME SWITCHER */}
        <ModeToggle />
      </div>

      {/* 2. MENU */}
      <div className="flex-1 px-4 py-4 space-y-2 z-10">
        <p className="px-4 text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Menu</p>
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className="relative group block">
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-xl"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                />
              )}
              <div className={cn(
                  "relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                  isActive ? "text-primary font-bold" : "text-muted-foreground group-hover:text-foreground group-hover:bg-muted/50"
              )}>
                  <item.icon size={20} className={cn(isActive ? "text-primary" : "text-muted-foreground")} />
                  <span className="font-medium text-sm">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* 3. CREDITS (Bottom) */}
      <div className="p-4 z-10">
          <div className="bg-muted/50 border border-border p-4 rounded-2xl relative overflow-hidden">
              <div className="flex items-center gap-3 mb-3 relative z-10">
                  <div className="h-8 w-8 bg-background rounded-full flex items-center justify-center text-primary">
                      <ShieldCheck size={16} />
                  </div>
                  <div>
                      <p className="text-xs text-muted-foreground font-medium">Free Plan</p>
                      <p className="text-sm font-bold text-foreground">{currentCredits} / 10 Credits</p>
                  </div>
              </div>
              <div className="h-1.5 w-full bg-background rounded-full overflow-hidden relative z-10">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(currentCredits / 10) * 100}%` }} className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"></motion.div>
              </div>
          </div>
      </div>

      {/* 4. USER */}
      <div className="p-4 border-t border-border flex items-center justify-between bg-muted/20 z-10">
           <div className="flex items-center gap-3">
               <UserButton />
               <div className="text-xs">
                   <p className="text-foreground font-medium">My Account</p>
                   <p className="text-muted-foreground">Manage</p>
               </div>
           </div>
           <button onClick={() => signOut()} className="text-muted-foreground hover:text-destructive transition-colors"><LogOut size={18} /></button>
      </div>
    </div>
  );
};