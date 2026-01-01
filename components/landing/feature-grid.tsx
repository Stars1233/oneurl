import { LayoutGrid, BarChart3, Zap, Shield, Globe, Smartphone, Fingerprint, PenTool } from "lucide-react";

const features = [
  {
    title: "Google Authentication",
    description: "Secure and seamless sign-in with your existing Google account. No new passwords to remember.",
    icon: Shield
  },
  {
    title: "Custom Profile",
    description: "Claim your unique username (oneurl.live/you) and customize your bio and avatar to match your brand.",
    icon: Fingerprint
  },
  {
    title: "Link Management",
    description: "Add, edit, and reorganize your links effortlessly. Keep your audience directed to what matters most.",
    icon: PenTool
  },
  {
    title: "Deep Analytics",
    description: "Track clicks and view detailed insights to understand what your audience engages with.",
    icon: BarChart3
  },
  {
    title: "Fast & Modern",
    description: "Built with Next.js 16 and React 19 for instant page loads and a smooth user experience.",
    icon: Zap
  },
  {
    title: "Responsive Design",
    description: "Your profile looks perfect on every device, from desktop monitors to mobile phones.",
    icon: Smartphone
  }
];

export function LandingFeatures() {
  return (
    <section className="border-y border-primary/10 bg-muted/5">
      <div className="container mx-auto px-4 py-24">
        <div className="mb-16 md:mb-24">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Everything you need.</h2>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Powerful features to help you share your online presence effectively.
            </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-primary/10 border border-primary/10">
           {features.map((f, i) => (
             <div key={i} className="bg-background p-8 md:p-12 space-y-6 hover:bg-muted/30 transition-colors">
               <div className="w-12 h-12 bg-primary/5 flex items-center justify-center rounded-none">
                 <f.icon className="w-6 h-6 text-primary" />
               </div>
               <h3 className="text-2xl font-bold tracking-tight">{f.title}</h3>
               <p className="text-muted-foreground text-lg leading-relaxed">{f.description}</p>
             </div>
           ))}
        </div>
      </div>
    </section>
  )
}
