import { UserProfile } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function SettingsPage() {
  return (
    <div className="flex flex-col p-8 h-full bg-black text-white overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-zinc-400 mt-2">Manage your account preferences.</p>
      </div>

      <div className="flex justify-center items-start w-full">
        {/* ADD routing="hash" HERE */}
        <UserProfile 
            routing="hash" 
            appearance={{
                baseTheme: dark,
                elements: {
                    card: "bg-zinc-900 border border-zinc-800 shadow-none",
                    navbar: "hidden",
                    navbarMobileMenuButton: "hidden",
                    headerTitle: "hidden",
                    headerSubtitle: "hidden",
                }
            }}
        />
      </div>
    </div>
  );
}