"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, Workflow, Settings, CreditCard, 
  Zap, LogOut, ShieldCheck, ScrollText
} from "lucide-react";
import { UserButton, useClerk } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/theme-toggle"; 
import { getUserCredits } from "@/app/actions/billing"; // 👈 Import Action
import { useEffect, useState } from "react"; // 👈 Import Hooks

// Interface updated (Prop no longer needed)
interface SidebarProps {}

const MENU_ITEMS = [
  { name: "Overview", icon: LayoutDashboard, href: "/dashboard" },
  { name: "Workflows", icon: Workflow, href: "/dashboard/workflows" },
  { name: "Connections", icon: Zap, href: "/dashboard/connections" },
  { name: "Activity Logs", icon: ScrollText, href: "/dashboard/logs" },
  { name: "Billing", icon: CreditCard, href: "/dashboard/billing" },
  { name: "Settings", icon: Settings, href: "/dashboard/settings" },
];

export const Sidebar = ({}: SidebarProps) => {
  const pathname = usePathname();
  const { signOut } = useClerk();
  
  // 👇 NEW CODE: Credit Fetching Logic
  const [credits, setCredits] = useState<number>(0); 

  useEffect(() => {
    const fetchCredits = async () => {
       try {
         const c = await getUserCredits();
         // Ensure we handle cases where c might be null/undefined
         setCredits(c || 0);
       } catch (error) {
         console.error("Error fetching credits:", error);
       }
    };
    fetchCredits();
  }, []);

  return (
    <div className="h-full w-full bg-card border-r border-border flex flex-col relative overflow-hidden transition-colors duration-300">
      
      {/* 1. HEADER & THEME TOGGLE */}
      <div className="p-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-gradient-to-br from-primary to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <Workflow className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg text-foreground tracking-tight">Orbit</span>
        </div>
        <ModeToggle />
      </div>

      {/* 2. MENU */}
      <div className="flex-1 px-4 py-4 space-y-1.5 z-10">
        <p className="px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Main Menu</p>
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className="relative group block">
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary/10 border-r-2 border-primary rounded-r-none rounded-l-lg"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                />
              )}
              <div className={cn(
                  "relative flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200",
                  isActive ? "text-primary font-semibold" : "text-muted-foreground group-hover:text-foreground group-hover:bg-muted/50"
              )}>
                  <item.icon size={18} className={cn(isActive ? "text-primary" : "text-muted-foreground")} />
                  <span className="text-sm">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* 3. CREDITS (Bottom) - Updated to use State */}
      <div className="p-4 z-10">
          <div className="bg-muted/30 border border-border p-4 rounded-xl relative overflow-hidden">
              <div className="flex items-center gap-3 mb-3 relative z-10">
                  <div className="h-8 w-8 bg-background rounded-full flex items-center justify-center text-primary border border-border">
                      <ShieldCheck size={14} />
                  </div>
                  <div>
                      <p className="text-[10px] text-muted-foreground font-medium uppercase">Credits</p>
                      <p className="text-sm font-bold text-foreground">{credits} / 10</p>
                  </div>
              </div>
              <div className="h-1.5 w-full bg-background rounded-full overflow-hidden relative z-10 border border-border/50">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${(credits / 10) * 100}%` }} 
                    className="h-full bg-primary"
                  ></motion.div>
              </div>
          </div>
      </div>

      {/* 4. USER PROFILE */}
      <div className="p-4 border-t border-border flex items-center justify-between bg-muted/10 z-10">
           <div className="flex items-center gap-3">
               <UserButton afterSignOutUrl="/"/>
               <div className="text-xs overflow-hidden">
                   <p className="text-foreground font-medium truncate w-24">My Account</p>
                   <p className="text-muted-foreground truncate w-24">Pro Plan</p>
               </div>
           </div>
           <button onClick={() => signOut()} className="text-muted-foreground hover:text-destructive transition-colors p-2 hover:bg-destructive/10 rounded-full"><LogOut size={16} /></button>
      </div>
    </div>
  );
};