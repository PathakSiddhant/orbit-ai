import { Sidebar } from "@/components/sidebar";
import { UserButton } from "@clerk/nextjs";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
   <div className="min-h-screen w-full relative bg-black text-white">
      {/* Sidebar - Hidden on Mobile, Visible on Desktop (md) */}
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="md:pl-72">
        {/* Top Navbar (Mobile only mostly, but global header) */}
        <div className="flex justify-end items-center p-4 border-b border-zinc-800 bg-black">
            <UserButton afterSignOutUrl="/" />
        </div>
        
        {/* The Actual Page Content goes here */}
        {children}
      </main>
    </div>
  );
}