import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link"; // For navigation
import { UserButton } from "@clerk/nextjs"; // The cool profile circle

export default async function Home() {
  const { userId } = await auth(); // Check if user is logged in

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white relative overflow-hidden">
      
      {/* Top Navigation */}
      <nav className="absolute top-0 right-0 p-6">
         {userId ? (
            <UserButton /> 
         ) : (
            <div className="space-x-4">
               <Link href="/sign-in">
                  <Button variant="ghost" className="text-zinc-300 hover:text-white hover:bg-zinc-800">
                    Sign In
                  </Button>
               </Link>
            </div>
         )}
      </nav>

      {/* Hero Section */}
      <h1 className="text-6xl font-bold tracking-tighter mb-4 bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">
        Orbit
      </h1>
      <p className="text-xl text-zinc-400 mb-8">
        Your Digital Universe, Automated.
      </p>
      
      <div className="flex gap-4">
        {userId ? (
           <Link href="/dashboard">
             <Button size="lg" className="bg-white text-black hover:bg-zinc-200">
               Go to Dashboard
             </Button>
           </Link>
        ) : (
           <Link href="/sign-up">
             <Button size="lg" className="bg-white text-black hover:bg-zinc-200">
               Get Started
             </Button>
           </Link>
        )}
      </div>
    </div>
  );
}