"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Bot, 
  Zap, 
  Settings, 
  CreditCard 
} from "lucide-react";
import { cn } from "@/lib/utils"; // Shadcn ka helper utility

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "My Agents",
    icon: Bot,
    href: "/dashboard/workflows", // Both point to workflows now
    color: "text-violet-500",
  },
  {
    label: "Workflows",
    icon: Zap,
    href: "/dashboard/workflows",
    color: "text-pink-700",
  },
  {
    label: "Billing",
    icon: CreditCard,
    href: "/dashboard/billing",
    color: "text-orange-700",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
    color: "text-gray-500",
  },
];

// Add Props Interface
interface SidebarProps {
    currentCredits: number;
}

export const Sidebar = ({ currentCredits }: SidebarProps) => {
  const pathname = usePathname(); // Pata lagayega hum abhi kis page par hain

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white border-r border-zinc-800">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">
            Orbit
          </h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.label} // <--- FIXED: Changed from href to label (Unique ID)
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                pathname === route.href ? "text-white bg-white/10" : "text-zinc-400"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* UPDATE BOTTOM CARD (Dynamic Credits) */}
      <div className="px-3 py-2 mt-auto"> {/* mt-auto pushes it to bottom */}
         <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
             <div className="flex justify-between items-center mb-2">
                <p className="text-xs text-zinc-400">Credits</p>
                <p className="text-xs font-bold text-white">{currentCredits} / 10</p>
             </div>
             
             {/* Dynamic Progress Bar */}
             <div className="w-full bg-zinc-800 rounded-full h-1.5 mb-2">
                 <div 
                    className="bg-violet-500 h-1.5 rounded-full transition-all" 
                    style={{ width: `${(currentCredits / 10) * 100}%` }}
                 ></div>
             </div>
             
             <p className="text-[10px] text-zinc-500">
                {currentCredits === 0 ? "Upgrade to Pro" : "Free Plan Active"}
             </p>
         </div>
      </div>
    </div>
  );
};