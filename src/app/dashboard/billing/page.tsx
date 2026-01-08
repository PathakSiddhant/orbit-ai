import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { Check, Zap, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function BillingPage() {
  const { userId } = await auth();
  const user = await db.query.users.findFirst({
      where: eq(users.clerkId, userId!)
  });

  const credits = parseInt(user?.credits || "0");

  return (
    <div className="flex flex-col p-8 h-full bg-black text-white overflow-y-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 text-transparent bg-clip-text">
            Billing & Plans
        </h1>
        <p className="text-zinc-400 mt-2">Manage your subscription and credit usage.</p>
      </div>

      {/* Credit Usage Card */}
      <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-violet-600/10 rounded-full blur-3xl -z-10"></div>
          
          <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                 <div className="h-10 w-10 rounded-lg bg-zinc-800 flex items-center justify-center text-violet-400">
                    <Zap className="h-6 w-6" />
                 </div>
                 <div>
                    <h3 className="font-semibold text-lg">Credit Balance</h3>
                    <p className="text-sm text-zinc-400">Credits use hote hain jab workflow run hota hai.</p>
                 </div>
              </div>
              <div className="text-right">
                 <p className="text-3xl font-bold">{credits}</p>
                 <p className="text-xs text-zinc-500">Available Credits</p>
              </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-zinc-800 rounded-full h-3 mb-2 overflow-hidden">
             <div 
                className="bg-gradient-to-r from-violet-600 to-fuchsia-600 h-full transition-all duration-500" 
                style={{ width: `${(credits / 100) * 100}%` }} // Example calc
             ></div>
          </div>
          <p className="text-xs text-zinc-500 text-right">Free Tier Limit: 10 Credits</p>
      </div>

      {/* Pricing Plans */}
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl">
          
          {/* FREE PLAN */}
          <div className="p-8 rounded-2xl border border-zinc-800 bg-black hover:border-zinc-700 transition flex flex-col">
              <h3 className="text-xl font-semibold text-zinc-300">Free Starter</h3>
              <div className="my-4">
                  <span className="text-4xl font-bold text-white">$0</span>
                  <span className="text-zinc-500">/month</span>
              </div>
              <p className="text-zinc-400 text-sm mb-6">Perfect for testing and hobby projects.</p>
              
              <div className="space-y-3 flex-1">
                  <FeatureItem text="10 Free Credits" />
                  <FeatureItem text="Basic Workflow Builder" />
                  <FeatureItem text="2 Active Workflows" />
                  <FeatureItem text="Community Support" />
              </div>

              <Button disabled className="mt-8 w-full bg-zinc-800 text-zinc-400">Current Plan</Button>
          </div>

          {/* PRO PLAN (Glowing) */}
          <div className="p-8 rounded-2xl border border-violet-500/30 bg-zinc-900/40 relative flex flex-col hover:border-violet-500/50 transition shadow-2xl shadow-violet-900/10">
              <div className="absolute top-0 right-0 bg-violet-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">
                  POPULAR
              </div>
              <h3 className="text-xl font-semibold text-white">Pro Monthly</h3>
              <div className="my-4">
                  <span className="text-4xl font-bold text-white">$29</span>
                  <span className="text-zinc-500">/month</span>
              </div>
              <p className="text-zinc-400 text-sm mb-6">For serious automators and businesses.</p>
              
              <div className="space-y-3 flex-1">
                  <FeatureItem text="Unlimited Credits" checked />
                  <FeatureItem text="Access to AI Agents (Gemini Pro)" checked />
                  <FeatureItem text="Unlimited Active Workflows" checked />
                  <FeatureItem text="Priority Support" checked />
              </div>

              <Button className="mt-8 w-full bg-white text-black hover:bg-zinc-200 font-bold">
                 <CreditCard className="mr-2 h-4 w-4" /> Upgrade to Pro
              </Button>
          </div>

      </div>
    </div>
  );
}

// Helper Component for List Items
function FeatureItem({ text, checked = false }: { text: string, checked?: boolean }) {
    return (
        <div className="flex items-center gap-3">
            <div className={`h-5 w-5 rounded-full flex items-center justify-center ${checked ? 'bg-violet-600/20 text-violet-400' : 'bg-zinc-800 text-zinc-500'}`}>
                <Check className="h-3 w-3" />
            </div>
            <span className="text-sm text-zinc-300">{text}</span>
        </div>
    )
}