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
    href: "/dashboard/agents",
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

export const Sidebar = () => {
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
              key={route.href}
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
      <div className="px-3 py-2">
         <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
             <p className="text-xs text-zinc-400 mb-2">Free Plan</p>
             <div className="w-full bg-zinc-800 rounded-full h-1.5 mb-2">
                 <div className="bg-blue-500 h-1.5 rounded-full w-[30%]"></div>
             </div>
             <p className="text-[10px] text-zinc-500">3/10 Credits Used</p>
         </div>
      </div>
    </div>
  );
};