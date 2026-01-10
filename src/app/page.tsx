"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { 
  Bot, Sun, Moon, Zap, Layers, 
  Workflow, ArrowRight, Share2, ShieldCheck, 
  CheckCircle2, Globe, Sparkles,
  Lock, ChevronDown, Terminal, X, ScrollText
} from "lucide-react";
// Variants type import kiya hai taaki easing error fix ho jaye
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ContainerScroll } from "@/components/ui/container-scroll-animation"; 
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

// --- ANIMATION VARIANTS FIXED ---
const fadeIn: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: "easeOut" } 
  }
};

export default function Home() {
  const { theme, setTheme } = useTheme();
  const { isSignedIn } = useUser();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => setMounted(true), []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-[#020202] text-zinc-900 dark:text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden transition-colors duration-300">
      
      {/* ================= 1. NAVBAR ================= */}
      <nav className="fixed top-0 w-full z-50 border-b border-zinc-200 dark:border-white/5 bg-white/80 dark:bg-black/80 backdrop-blur-md transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="h-10 w-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform">
                <Workflow className="h-6 w-6" />
            </div>
            <span className="font-bold text-2xl tracking-tight">Orbit</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600 dark:text-zinc-400">
             <button onClick={() => scrollToSection('features')} className="hover:text-indigo-600 dark:hover:text-white transition-colors">Features</button>
             <button onClick={() => scrollToSection('value-prop')} className="hover:text-indigo-600 dark:hover:text-white transition-colors">Visuals</button>
             <button onClick={() => scrollToSection('pricing')} className="hover:text-indigo-600 dark:hover:text-white transition-colors">Pricing</button>
          </div>

          <div className="flex gap-4 items-center">
            <button 
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")} 
                className="p-2.5 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-all border border-zinc-200 dark:border-zinc-800"
            >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <SignedIn>
              <Link href="/dashboard">
                <button className="px-6 py-2.5 font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-full shadow-lg hover:shadow-indigo-500/25 transition-all hover:scale-105">
                  Dashboard
                </button>
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <Link href="/sign-up">
                <button className="px-6 py-2.5 font-bold text-white bg-zinc-900 dark:bg-white dark:text-black rounded-full shadow-lg hover:scale-105 transition-all">
                  Get Started
                </button>
              </Link>
            </SignedOut>
          </div>
        </div>
      </nav>

      {/* ================= 2. HERO SECTION ================= */}
      <section className="pt-32 pb-10 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-500/10 rounded-[100%] blur-[100px] -z-10"></div>
        
        <ContainerScroll
          titleComponent={
            <div className="relative z-10 mb-10">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center mb-6">
                 <span className="px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest">
                   🚀 v2.0 Public Beta
                 </span>
              </motion.div>
              <h1 className="text-5xl md:text-8xl font-black mb-6 leading-tight">
                Automate the <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                  Impossible.
                </span>
              </h1>
              <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-8">
                 Build intelligent agents that browse the web, scrape data, and execute complex workflows. No code required.
              </p>
              <div className="flex justify-center gap-4">
                  <Link href="/sign-up">
                    <button className="px-8 py-4 bg-indigo-600 text-white text-lg font-bold rounded-full hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 transition-all">
                        Start Building Free
                    </button>
                  </Link>
              </div>
            </div>
          }
        >
          {/* LIVE ANIMATED DASHBOARD MOCKUP */}
          <div className="w-full h-full bg-[#0a0a0a] rounded-2xl relative overflow-hidden border border-zinc-800 flex">
             <div className="w-64 border-r border-zinc-800 p-4 flex flex-col gap-4">
                <div className="flex gap-2 mb-4"><div className="h-3 w-3 rounded-full bg-red-500"></div><div className="h-3 w-3 rounded-full bg-yellow-500"></div><div className="h-3 w-3 rounded-full bg-green-500"></div></div>
                <div className="h-8 w-full bg-zinc-900 rounded mb-2"></div>
                <div className="h-4 w-3/4 bg-zinc-900 rounded"></div>
             </div>
             <div className="flex-1 p-6 relative">
                 <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                 <div className="relative z-10 flex justify-center items-center h-full gap-8">
                     <motion.div animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="w-40 h-24 bg-zinc-900 border border-indigo-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                        <div className="text-indigo-400 font-bold flex gap-2"><Zap/> Trigger</div>
                     </motion.div>
                     <div className="w-20 h-1 bg-zinc-800 relative overflow-hidden">
                        <motion.div animate={{ x: [-20, 100] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} className="w-10 h-full bg-indigo-500 blur-sm"></motion.div>
                     </div>
                     <motion.div animate={{ y: [0, 15, 0] }} transition={{ repeat: Infinity, duration: 4, delay: 0.5 }} className="w-40 h-24 bg-zinc-900 border border-purple-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                        <div className="text-purple-400 font-bold flex gap-2"><Bot/> AI Agent</div>
                     </motion.div>
                 </div>
                 <div className="absolute bottom-4 left-4 right-4 h-32 bg-zinc-950 border border-zinc-800 rounded-lg p-3 font-mono text-xs text-green-500 overflow-hidden">
                    <motion.div animate={{ y: [0, -100] }} transition={{ repeat: Infinity, duration: 10, ease: "linear" }}>
                       <p>{">"} Initializing workflow...</p>
                       <p>{">"} Connected to Google Drive.</p>
                       <p>{">"} AI Analysis: "Positive sentiment detected"</p>
                       <p>{">"} Sending payload to Slack...</p>
                    </motion.div>
                 </div>
             </div>
          </div>
        </ContainerScroll>
      </section>

      {/* ================= 3. SOCIAL PROOF ================= */}
      <section className="py-12 bg-zinc-50 dark:bg-zinc-900/30 border-y border-zinc-200 dark:border-white/5 overflow-hidden">
         <p className="text-center text-sm font-bold text-zinc-500 uppercase tracking-widest mb-8">Trusted by 10,000+ Automation Experts</p>
         <div className="flex w-max animate-scroll gap-20 hover:pause-animation">
           {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
               <div key={i} className="flex items-center gap-3 opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
                  <div className="h-10 w-10 bg-zinc-300 dark:bg-zinc-700 rounded-full"></div>
                  <span className="text-2xl font-bold text-zinc-400 dark:text-zinc-600">CORP {i}</span>
               </div>
           ))}
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
               <div key={`d-${i}`} className="flex items-center gap-3 opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
                  <div className="h-10 w-10 bg-zinc-300 dark:bg-zinc-700 rounded-full"></div>
                  <span className="text-2xl font-bold text-zinc-400 dark:text-zinc-600">CORP {i}</span>
               </div>
           ))}
         </div>
      </section>

      {/* ================= 4. THE PROBLEM ================= */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" variants={fadeIn} viewport={{ once: true }} className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Manual Work is <span className="text-red-500 line-through">Expensive</span> Dead.</h2>
              <p className="text-xl text-zinc-500 max-w-3xl mx-auto">
                You are wasting 20+ hours a week copying data between tabs. Traditional automation tools are too rigid.
              </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
              {[{ title: "Siloed Data", desc: "Your emails don't talk to your spreadsheets.", color: "bg-red-500" }, { title: "Fragile Scripts", desc: "One UI change breaks your entire Python script.", color: "bg-orange-500" }, { title: "No Intelligence", desc: "Standard bots can't read context or make decisions.", color: "bg-yellow-500" }].map((item, i) => (
                  <motion.div key={i} whileHover={{ y: -10 }} className="p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 relative overflow-hidden">
                      <div className={`absolute top-0 right-0 w-24 h-24 ${item.color} opacity-10 rounded-bl-full`}></div>
                      <div className={`h-12 w-12 ${item.color} rounded-xl mb-6 flex items-center justify-center text-white`}><X size={24} /></div>
                      <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                      <p className="text-zinc-500">{item.desc}</p>
                  </motion.div>
              ))}
          </div>
      </section>

      {/* ================= 5. VALUE PROPOSITION ================= */}
      <section id="value-prop" className="py-32 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-black mb-6 text-zinc-900 dark:text-white">Built for <span className="text-indigo-600 dark:text-indigo-400">Power Users</span>.</h2>
              <p className="text-xl text-zinc-500 max-w-2xl mx-auto">We abstracted the complexity of code into a beautiful visual canvas.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
             <div className="space-y-6">
                 {[
                     { title: "Infinite Canvas", desc: "Drag, drop, and connect. No limits on complexity.", icon: Layers, active: activeTab === 0 },
                     { title: "Gemini AI Native", desc: "First-class support for Google's most powerful models.", icon: Sparkles, active: activeTab === 1 },
                     { title: "Real-time Logs", desc: "Watch your data flow node-by-node. Debug instantly.", icon: ScrollText, active: activeTab === 2 }
                 ].map((feature, i) => (
                     <div 
                       key={i} 
                       onClick={() => setActiveTab(i)}
                       className={`p-6 rounded-2xl cursor-pointer border transition-all duration-300 ${feature.active ? 'bg-white dark:bg-zinc-900 border-indigo-500 shadow-xl scale-105' : 'border-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900/50'}`}
                     >
                        <div className="flex items-center gap-4">
                            <div className={`h-12 w-12 rounded-full flex items-center justify-center transition-colors ${feature.active ? 'bg-indigo-600 text-white' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'}`}>
                                <feature.icon size={20} />
                            </div>
                            <div>
                                <h3 className={`text-xl font-bold ${feature.active ? 'text-zinc-900 dark:text-white' : 'text-zinc-500'}`}>{feature.title}</h3>
                                <p className="text-zinc-500 text-sm mt-1">{feature.desc}</p>
                            </div>
                        </div>
                     </div>
                 ))}
             </div>

             <div className="h-[500px] w-full bg-zinc-100 dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 relative overflow-hidden shadow-2xl group flex items-center justify-center">
                  <div className="absolute inset-0 bg-grid-zinc-300/50 dark:bg-grid-white/[0.02]"></div>
                  
                  <AnimatePresence mode="wait">
                    {/* TAB 0 */}
                    {activeTab === 0 && (
                        <motion.div key="tab0" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex items-center justify-center overflow-hidden">
                            <motion.div drag dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }} className="absolute top-1/4 left-1/4 bg-white dark:bg-black p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-lg cursor-grab active:cursor-grabbing z-20">
                                <div className="flex items-center gap-2"><Globe className="text-blue-500" size={16}/><span className="font-bold text-xs">Web Scraper</span></div>
                            </motion.div>
                            
                            <motion.div drag dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }} className="absolute top-1/2 left-1/2 bg-white dark:bg-black p-4 rounded-xl border border-indigo-500 shadow-lg cursor-grab active:cursor-grabbing z-30">
                                <div className="flex items-center gap-2"><Bot className="text-indigo-500" size={16}/><span className="font-bold text-xs">Gemini AI</span></div>
                            </motion.div>

                            <motion.div drag dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }} className="absolute bottom-1/4 right-1/4 bg-white dark:bg-black p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-lg cursor-grab active:cursor-grabbing z-20">
                                <div className="flex items-center gap-2"><Share2 className="text-pink-500" size={16}/><span className="font-bold text-xs">Slack</span></div>
                            </motion.div>

                            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }} d="M 150 150 L 300 250" stroke="#6366f1" strokeWidth="2" strokeDasharray="5,5" fill="none" />
                                <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.5 }} d="M 300 250 L 450 350" stroke="#6366f1" strokeWidth="2" strokeDasharray="5,5" fill="none" />
                            </svg>
                        </motion.div>
                    )}

                    {/* TAB 1 */}
                    {activeTab === 1 && (
                        <motion.div key="tab1" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex flex-col items-center justify-center">
                            <div className="relative">
                                <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 bg-indigo-500 rounded-full blur-[60px]"></motion.div>
                                <Bot className="h-32 w-32 text-white relative z-10" />
                            </div>
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="mt-8 bg-zinc-900 border border-zinc-700 p-4 rounded-xl max-w-xs text-center"
                            >
                                <p className="text-xs text-zinc-400 mb-2">Processing...</p>
                                <TextGenerateEffect words="Analyzing 50 PDFs and extracting key financial metrics." className="text-sm font-mono text-green-400" />
                            </motion.div>
                        </motion.div>
                    )}

                    {/* TAB 2 */}
                    {activeTab === 2 && (
                        <motion.div key="tab2" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex flex-col items-center justify-center p-8 font-mono text-xs text-green-400 bg-black/90 m-8 rounded-xl border border-zinc-800 overflow-hidden shadow-2xl">
                             <div className="w-full h-6 bg-zinc-800 border-b border-zinc-700 flex items-center px-2 gap-1 mb-2">
                                 <div className="h-2 w-2 rounded-full bg-red-500"></div>
                                 <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                                 <div className="h-2 w-2 rounded-full bg-green-500"></div>
                             </div>
                             <div className="w-full flex-1 overflow-hidden relative">
                                 <motion.div animate={{ y: [0, -150] }} transition={{ repeat: Infinity, duration: 8, ease: "linear" }} className="space-y-1">
                                    <p>{">"} Initializing Orbit Engine v2.1...</p>
                                    <p className="text-blue-400">{">"} [INFO] Gateway connected.</p>
                                    <p>{">"} Listening for webhooks on port 3000...</p>
                                    <p className="text-white">{">"} [EVENT] New Payload Received from Stripe.</p>
                                    <p>{">"} Parsing JSON body...</p>
                                    <p>{">"} Executing Node: Gemini_AI_Processing...</p>
                                    <p className="text-yellow-400">{">"} [AI] Token Usage: 450 tokens.</p>
                                    <p className="text-yellow-400">{">"} [AI] Response: "High Value Customer detected."</p>
                                    <p>{">"} Routing to VIP Slack Channel...</p>
                                    <p className="text-green-500">{">"} [SUCCESS] Message sent. Duration: 240ms.</p>
                                    <p>{">"} Waiting for next event...</p>
                                    <p className="text-zinc-500">...</p>
                                 </motion.div>
                             </div>
                        </motion.div>
                    )}
                  </AnimatePresence>
             </div>
          </div>
      </section>

      {/* ================= 6. BENTO GRID ================= */}
      <section id="features" className="py-24 bg-zinc-50 dark:bg-[#080808] relative">
         <div className="max-w-7xl mx-auto px-6 relative z-10">
            <h2 className="text-4xl font-black text-center mb-16 text-zinc-900 dark:text-white">Everything you need to <br /> Scale Automation.</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 h-[900px] md:h-[600px]">
                {/* LARGE CARD */}
                <motion.div whileHover={{ scale: 1.01 }} className="md:col-span-2 md:row-span-2 bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden relative group">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all"></div>
                     <Layers className="h-10 w-10 text-indigo-600 mb-6" />
                     <h3 className="text-2xl font-bold mb-2 text-zinc-900 dark:text-white">Multi-Step Workflows</h3>
                     <p className="text-zinc-500 dark:text-zinc-400 mb-8 max-w-sm">Chain together unlimited nodes. Pass data from Google Drive to AI, then to Slack, then to Notion. No limits on logic.</p>
                     <div className="absolute bottom-8 left-8 right-8 flex gap-4">
                        <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-700 p-3 rounded-lg shadow-lg flex-1 text-center text-xs">Trigger</div>
                        <ArrowRight className="text-zinc-400" />
                        <div className="bg-indigo-600 text-white p-3 rounded-lg shadow-lg flex-1 text-center text-xs">AI Agent</div>
                        <ArrowRight className="text-zinc-400" />
                        <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-700 p-3 rounded-lg shadow-lg flex-1 text-center text-xs">Action</div>
                     </div>
                </motion.div>
                {/* TALL CARD */}
                <motion.div whileHover={{ scale: 1.02 }} className="md:col-span-1 md:row-span-2 bg-gradient-to-b from-indigo-900 to-black rounded-3xl p-8 border border-indigo-500/30 shadow-xl relative overflow-hidden group">
                     <Bot className="h-10 w-10 text-white mb-6" />
                     <h3 className="text-2xl font-bold mb-2 text-white">Gemini Native</h3>
                     <p className="text-indigo-200 text-sm mb-6">Built-in AI nodes that can summarize, generate, and decide.</p>
                     <div className="mt-auto bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
                         <div className="flex gap-2 items-center mb-2"><div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div><span className="text-xs text-white">AI Processing</span></div>
                         <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden"><div className="h-full w-2/3 bg-indigo-400"></div></div>
                     </div>
                </motion.div>
                {/* SMALL CARDS */}
                <motion.div whileHover={{ scale: 1.02 }} className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-lg relative overflow-hidden">
                     <Globe className="h-8 w-8 text-pink-500 mb-4" /><h3 className="text-lg font-bold">Web Scraping</h3><p className="text-zinc-500 text-xs mt-2">Extract data from any URL instantly.</p>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-lg relative overflow-hidden">
                     <ShieldCheck className="h-8 w-8 text-green-500 mb-4" /><h3 className="text-lg font-bold">SOC2 Secure</h3><p className="text-zinc-500 text-xs mt-2">Enterprise grade encryption.</p>
                </motion.div>
            </div>
         </div>
      </section>

      {/* ================= 7. HOW IT WORKS ================= */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
         <div className="text-center mb-16"><h2 className="text-3xl font-bold">From Idea to Automation in <span className="text-indigo-600">3 Steps</span></h2></div>
         <div className="relative">
             <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 to-transparent -translate-x-1/2"></div>
             {[{ step: "01", title: "Choose a Trigger", desc: "Start with a Webhook, Schedule, or App Event.", icon: Zap }, { step: "02", title: "Add Logic & AI", desc: "Drag in a Gemini Node to process the data intelligently.", icon: Bot }, { step: "03", title: "Connect Actions", desc: "Send the result to Slack, Notion, or Email.", icon: Share2 }].map((item, i) => (
                 <motion.div initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} key={i} className={`flex flex-col md:flex-row items-center gap-8 mb-16 relative ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                     <div className="flex-1 text-center md:text-right">{i % 2 === 0 && (<><h3 className="text-2xl font-bold">{item.title}</h3><p className="text-zinc-500">{item.desc}</p></>)}</div>
                     <div className="z-10 h-16 w-16 bg-zinc-900 border-4 border-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-xl">{item.step}</div>
                     <div className="flex-1 text-center md:text-left">{i % 2 !== 0 && (<><h3 className="text-2xl font-bold">{item.title}</h3><p className="text-zinc-500">{item.desc}</p></>)}</div>
                 </motion.div>
             ))}
         </div>
      </section>

      {/* ================= 8. COMPARISON ================= */}
      <section id="comparison" className="py-20 bg-zinc-50 dark:bg-zinc-900/30">
          <div className="max-w-4xl mx-auto px-6">
              <h2 className="text-3xl font-bold text-center mb-12">Why Orbit?</h2>
              <div className="bg-white dark:bg-black rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xl">
                  <div className="grid grid-cols-3 p-6 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 font-bold"><div>Feature</div><div className="text-center text-indigo-600">Orbit</div><div className="text-center text-zinc-400">Others</div></div>
                  {[{ feat: "Visual Builder", orbit: true, other: true }, { feat: "AI Native Nodes", orbit: true, other: false }, { feat: "Web Scraping", orbit: true, other: false }, { feat: "Unlimited Flows (Free)", orbit: true, other: false }, { feat: "Dark Mode", orbit: true, other: true }].map((row, i) => (
                      <div key={i} className="grid grid-cols-3 p-6 border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                          <div className="font-medium">{row.feat}</div>
                          <div className="flex justify-center"><CheckCircle2 className="text-indigo-600" /></div>
                          <div className="flex justify-center">{row.other ? <CheckCircle2 className="text-zinc-400"/> : <X className="text-red-400"/>}</div>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* ================= 9. INTEGRATIONS ================= */}
      <section className="py-20 overflow-hidden">
          <h2 className="text-center text-3xl font-bold mb-12">Connects with Everything</h2>
          <div className="flex justify-center flex-wrap gap-4 max-w-5xl mx-auto opacity-80">
              {['Slack', 'Notion', 'Gmail', 'Drive', 'Discord', 'Linear', 'GitHub', 'Figma', 'Zoom', 'Stripe'].map((app, i) => (
                  <div key={i} className="px-6 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full font-bold text-zinc-600 dark:text-zinc-400 shadow-sm hover:scale-110 transition-transform cursor-default">{app}</div>
              ))}
          </div>
      </section>

      {/* ================= 10. TEMPLATES ================= */}
      <section className="py-12 border-t border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-black">
         <div className="flex w-max animate-scroll-reverse gap-8 px-6 hover:pause-animation">
           {["New Lead -> AI Qualify -> CRM", "Tweet -> Sentiment Analysis -> Slack", "Support Email -> Draft Reply -> Drafts", "Website Change -> Scrape -> Notify", "Meeting Recording -> Summarize -> Notion"].map((t, i) => (
               <div key={i} className="flex items-center gap-2 px-6 py-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-600 dark:text-indigo-400 font-mono text-sm whitespace-nowrap"><Terminal size={14} /> {t}</div>
           ))}
           {["New Lead -> AI Qualify -> CRM", "Tweet -> Sentiment Analysis -> Slack", "Support Email -> Draft Reply -> Drafts", "Website Change -> Scrape -> Notify", "Meeting Recording -> Summarize -> Notion"].map((t, i) => (
               <div key={`d-${i}`} className="flex items-center gap-2 px-6 py-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-600 dark:text-indigo-400 font-mono text-sm whitespace-nowrap"><Terminal size={14} /> {t}</div>
           ))}
         </div>
      </section>

      {/* ================= 11. FAQ ================= */}
      <section className="py-24 px-6 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Questions?</h2>
          <div className="space-y-4">
              {[{ q: "Is Orbit really free?", a: "Yes! Our starter plan includes 100 credits per month forever." }, { q: "Can I connect custom APIs?", a: "Absolutely. Use the HTTP Request node to connect to any REST API." }, { q: "Is my data safe?", a: "We use AES-256 encryption. We never train models on your data." }, { q: "How does the AI work?", a: "We use Google's Gemini Pro model to interpret and generate content within your flows." }].map((item, i) => (
                  <div key={i} className="border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 overflow-hidden">
                      <button onClick={() => setActiveFaq(activeFaq === i ? null : i)} className="w-full flex justify-between items-center p-6 text-left font-bold">{item.q}<ChevronDown className={`transition-transform duration-300 ${activeFaq === i ? 'rotate-180' : ''}`} /></button>
                      <AnimatePresence>{activeFaq === i && (<motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden"><div className="p-6 pt-0 text-zinc-500">{item.a}</div></motion.div>)}</AnimatePresence>
                  </div>
              ))}
          </div>
      </section>

      {/* ================= 12. PRICING ================= */}
      <section id="pricing" className="py-32 px-6 max-w-7xl mx-auto border-t border-zinc-200 dark:border-white/5">
         <div className="text-center mb-16"><h2 className="text-4xl font-black mb-4">Simple Pricing</h2><p className="text-zinc-500">Scale as you grow.</p></div>
         <div className="grid md:grid-cols-3 gap-8">
             <div className="p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:border-zinc-400 transition-colors">
                 <h3 className="text-xl font-bold">Starter</h3><div className="text-4xl font-bold my-4">$0</div>
                 <ul className="space-y-4 mb-8 text-zinc-500 text-sm"><li className="flex gap-2"><CheckCircle2 size={16} className="text-green-500"/> 100 Credits / Month</li><li className="flex gap-2"><CheckCircle2 size={16} className="text-green-500"/> 3 Active Workflows</li></ul>
                 <Link href="/sign-up"><button className="w-full py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">Start Free</button></Link>
             </div>
             <div className="p-8 rounded-3xl border border-indigo-500 bg-zinc-900 relative overflow-hidden transform md:-translate-y-4 shadow-2xl">
                 <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1">POPULAR</div><h3 className="text-xl font-bold text-white">Pro</h3><div className="text-4xl font-bold my-4 text-white">$29<span className="text-lg text-zinc-500 font-normal">/mo</span></div>
                 <ul className="space-y-4 mb-8 text-zinc-300 text-sm"><li className="flex gap-2"><CheckCircle2 size={16} className="text-indigo-400"/> Unlimited Credits</li><li className="flex gap-2"><CheckCircle2 size={16} className="text-indigo-400"/> Unlimited Workflows</li><li className="flex gap-2"><CheckCircle2 size={16} className="text-indigo-400"/> GPT-4 Access</li></ul>
                 <Link href="/sign-up"><button className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition-colors shadow-lg">Get Pro</button></Link>
             </div>
             <div className="p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:border-zinc-400 transition-colors">
                 <h3 className="text-xl font-bold">Enterprise</h3><div className="text-4xl font-bold my-4">Custom</div>
                 <ul className="space-y-4 mb-8 text-zinc-500 text-sm"><li className="flex gap-2"><CheckCircle2 size={16} className="text-zinc-400"/> Dedicated Instance</li><li className="flex gap-2"><CheckCircle2 size={16} className="text-zinc-400"/> SSO & Logs</li></ul>
                 <button className="w-full py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">Contact Sales</button>
             </div>
         </div>
      </section>

      {/* ================= 13. SECURITY ================= */}
      <section className="py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-600 font-bold text-sm mb-4 border border-green-500/20"><Lock size={14} /> Enterprise Grade Security</div>
          <h2 className="text-2xl font-bold mb-4">Your data belongs to you.</h2>
          <p className="text-zinc-500 max-w-lg mx-auto">We are SOC2 Type II compliant and encrypt all credentials using AES-256.</p>
      </section>

      {/* ================= 14. CTA ================= */}
      <section className="py-32 relative overflow-hidden bg-black text-white">
         <div className="absolute inset-0 bg-indigo-600/20 blur-[100px]"></div>
         <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
             <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">Ready to build the <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Future?</span></h2>
             <Link href={isSignedIn ? "/dashboard" : "/sign-up"}><button className="px-10 py-5 bg-white text-black text-xl font-bold rounded-full hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.4)]">{isSignedIn ? "Launch Console" : "Get Started Free"}</button></Link>
         </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="py-12 bg-zinc-50 dark:bg-[#050505] border-t border-zinc-200 dark:border-zinc-800">
         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
             <div className="flex items-center gap-2"><div className="h-8 w-8 bg-zinc-900 dark:bg-white rounded-lg flex items-center justify-center"><Workflow className="h-4 w-4 text-white dark:text-black" /></div><span className="font-bold text-lg">Orbit</span></div>
             <div className="text-zinc-500 text-sm">© 2024 Orbit Inc. All rights reserved.</div>
         </div>
      </footer>

      <style jsx global>{`
        @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-scroll { animation: scroll 40s linear infinite; }
        .animate-scroll-reverse { animation: scroll 40s linear infinite reverse; }
        .hover\\:pause-animation:hover { animation-play-state: paused; }
        .animate-gradient-x { background-size: 200% 200%; animation: gradient-move 5s ease infinite; }
        @keyframes gradient-move { 0% { background-position: 0% 50% } 50% { background-position: 100% 50% } 100% { background-position: 0% 50% } }
      `}</style>
    </div>
  );
}