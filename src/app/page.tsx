import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-6xl font-bold tracking-tighter mb-4 bg-linear-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">
        Orbit
      </h1>
      <p className="text-xl text-zinc-400 mb-8">
        Your Digital Universe, Automated.
      </p>
      <div className="flex gap-4">
        <Button size="lg" className="bg-white text-black hover:bg-zinc-200">
          Get Started
        </Button>
        <Button variant="outline" size="lg" className="text-white border-zinc-800 hover:bg-zinc-900">
          View Demo
        </Button>
      </div>
    </div>
  );
}