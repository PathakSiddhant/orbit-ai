import { getUserCredits } from "@/app/actions/billing";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, Coins, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function BillingPage() {
  // Server Side se Credits fetch karo
  const credits = await getUserCredits();
  
  // Example: Maan lo Free plan limit 10 hai, aur Pro ki 1000
  // Display ke liye logic (sirf UI purpose ke liye)
  const plan = credits > 100 ? "Pro Plan" : "Free Plan";
  const maxCredits = credits > 100 ? 10000 : 10; 
  // Agar tere paas 1 Million hain, toh progress bar full dikhayenge bas
  const usagePercent = Math.min(100, (credits / maxCredits) * 100);

  return (
    <div className="flex flex-col gap-8 p-6">
      <h1 className="text-3xl font-bold">Billing & Plans</h1>

      {/* 1. CREDIT BALANCE CARD */}
      <Card className="bg-gradient-to-br from-zinc-900 to-zinc-800 text-white border-none shadow-xl">
          <CardHeader>
              <CardTitle className="flex items-center gap-2">
                  <Coins className="text-yellow-400" /> Current Balance
              </CardTitle>
              <CardDescription className="text-zinc-400">
                  Credits are consumed for every workflow execution.
              </CardDescription>
          </CardHeader>
          <CardContent>
              <div className="text-4xl font-bold mb-4">
                  {credits} <span className="text-lg font-normal text-zinc-400">Credits</span>
              </div>
              <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                      <span>{plan} Active</span>
                      <span>{credits > 1000 ? "Unlimited" : `${credits}/${maxCredits}`}</span>
                  </div>
                  {/* Progress bar ulat kaam karega (Credits bache hain) */}
                  <Progress value={usagePercent} className="h-2 bg-zinc-700" color="yellow" />
              </div>
          </CardContent>
      </Card>

      {/* 2. PRICING PLANS (Mock UI) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* FREE PLAN */}
          <Card className={`border-2 ${plan === "Free Plan" ? "border-primary" : "border-zinc-200 dark:border-zinc-800"}`}>
              <CardHeader>
                  <CardTitle>Free</CardTitle>
                  <CardDescription>For hobbyists.</CardDescription>
                  <div className="text-3xl font-bold mt-2">$0 <span className="text-sm font-normal text-muted-foreground">/mo</span></div>
              </CardHeader>
              <CardContent>
                  <ul className="space-y-2 text-sm">
                      <li className="flex gap-2"><Check size={16} className="text-green-500"/> 10 Credits / Month</li>
                      <li className="flex gap-2"><Check size={16} className="text-green-500"/> Basic Actions</li>
                      <li className="flex gap-2"><Check size={16} className="text-green-500"/> Community Support</li>
                  </ul>
              </CardContent>
              <CardFooter>
                  <Button variant="outline" className="w-full" disabled={plan === "Free Plan"}>
                      {plan === "Free Plan" ? "Current Plan" : "Downgrade"}
                  </Button>
              </CardFooter>
          </Card>

          {/* PRO PLAN */}
          <Card className={`border-2 relative overflow-hidden ${plan === "Pro Plan" ? "border-primary" : "border-zinc-200 dark:border-zinc-800"}`}>
              {plan === "Pro Plan" && (
                  <div className="absolute top-0 right-0 bg-primary text-white text-xs px-3 py-1 rounded-bl-lg">Active</div>
              )}
              <CardHeader>
                  <CardTitle className="flex items-center gap-2">Pro <Zap size={16} className="fill-yellow-400 text-yellow-400"/></CardTitle>
                  <CardDescription>For power users.</CardDescription>
                  <div className="text-3xl font-bold mt-2">$29 <span className="text-sm font-normal text-muted-foreground">/mo</span></div>
              </CardHeader>
              <CardContent>
                  <ul className="space-y-2 text-sm">
                      <li className="flex gap-2"><Check size={16} className="text-green-500"/> 10,000 Credits / Month</li>
                      <li className="flex gap-2"><Check size={16} className="text-green-500"/> Unlimited Workflows</li>
                      <li className="flex gap-2"><Check size={16} className="text-green-500"/> Priority Support</li>
                  </ul>
              </CardContent>
              <CardFooter>
                   {/* Button abhi dummy hai, Stripe baad mein lagayenge */}
                  <Button className="w-full" disabled={plan === "Pro Plan"}>
                      {plan === "Pro Plan" ? "Current Plan" : "Upgrade to Pro"}
                  </Button>
              </CardFooter>
          </Card>
      </div>
    </div>
  );
}