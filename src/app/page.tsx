import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import { ArrowRight, Bot, CheckCircle2, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default async function Home() {
  const { userId } = await auth();

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      
      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-gradient-to-br from-violet-600 to-blue-600 rounded-lg flex items-center justify-center">
                    <Bot className="text-white h-5 w-5" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 text-transparent bg-clip-text">
                    Orbit
                </span>
            </div>
            
            <div className="flex items-center gap-4">
                {userId ? (
                    <Link href="/dashboard">
                        <Button className="bg-white text-black hover:bg-zinc-200">
                            Go to Dashboard
                        </Button>
                    </Link>
                ) : (
                    <>
                        <Link href="/sign-in">
                            <Button variant="ghost" className="text-zinc-400 hover:text-white">
                                Sign In
                            </Button>
                        </Link>
                        <Link href="/sign-up">
                            <Button className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white border-0">
                                Get Started
                            </Button>
                        </Link>
                    </>
                )}
            </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="pt-32 pb-20 relative">
         {/* Background Glow Effect */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[120px] -z-10" />

         <div className="container mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-zinc-400 mb-8">
                <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                v1.0 is now live
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                Automate your life with <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-500">
                    AI Agents
                </span>
            </h1>

            <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
                Connect your favorite apps, build powerful workflows, and let AI handle the busy work. No coding required.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href={userId ? "/dashboard" : "/sign-up"}>
                    <Button size="lg" className="h-12 px-8 text-lg bg-white text-black hover:bg-zinc-200 rounded-full">
                        Start Building Free
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </Link>
                <Button size="lg" variant="outline" className="h-12 px-8 text-lg border-white/10 bg-white/5 hover:bg-white/10 rounded-full">
                    View Templates
                </Button>
            </div>
         </div>
      </section>

      {/* --- HERO IMAGE (Mockup) --- */}
      <section className="container mx-auto px-6 pb-24">
         <div className="relative rounded-xl border border-white/10 bg-white/5 p-2 shadow-2xl backdrop-blur-sm">
             {/* Fake Browser Header */}
             <div className="h-8 border-b border-white/10 flex items-center gap-2 px-4 bg-black/40 rounded-t-lg">
                 <div className="h-3 w-3 rounded-full bg-red-500/20"></div>
                 <div className="h-3 w-3 rounded-full bg-yellow-500/20"></div>
                 <div className="h-3 w-3 rounded-full bg-green-500/20"></div>
             </div>
             
             {/* Yahan hum baad mein Dashboard ka Screenshot lagayenge */}
             <div className="aspect-video w-full bg-zinc-900/50 rounded-b-lg flex items-center justify-center text-zinc-500">
                 <div className="text-center">
                    <Zap className="h-12 w-12 mx-auto mb-4 text-zinc-700" />
                    <p>Dashboard Preview UI</p>
                 </div>
             </div>
         </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section className="py-24 bg-black">
        <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-16">Why choose Orbit?</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
                <FeatureCard 
                    icon={<Bot className="text-violet-400" />}
                    title="AI Powered"
                    desc="Integrate Gemini AI directly into your workflows to generate content intelligently."
                />
                <FeatureCard 
                    icon={<Zap className="text-yellow-400" />}
                    title="Real-time Execution"
                    desc="Watch your workflows run instantly with live logs and visual feedback."
                />
                <FeatureCard 
                    icon={<CheckCircle2 className="text-green-400" />}
                    title="Visual Builder"
                    desc="Drag and drop nodes to create complex logic without writing a single line of code."
                />
            </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-8 border-t border-white/10 text-center text-zinc-500 text-sm">
          <p>© 2024 Orbit Inc. Built with ❤️ by You.</p>
      </footer>
    </div>
  );
}

// Helper Component for Features
function FeatureCard({ icon, title, desc }: any) {
    return (
        <div className="p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition">
            <div className="h-12 w-12 rounded-lg bg-white/5 flex items-center justify-center mb-4">
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-zinc-400">{desc}</p>
        </div>
    );
}