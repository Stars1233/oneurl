import { UsernameClaimForm } from "./username-claim-form";

export function LandingHero() {
  return (
    <section className="container mx-auto px-4 py-24 md:py-32">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
        <div className="space-y-8">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9]">
            One URL for all your links
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-lg font-medium">
            Create a beautiful profile page to share all your important links in one place. Open source alternative to Linktree.
          </p>
          <div className="pt-4">
            <UsernameClaimForm />
          </div>
        </div>
        
        <div className="relative aspect-square lg:aspect-[4/5] bg-muted/20 border-2 border-primary/5 p-8 md:p-12 flex items-center justify-center overflow-hidden group">
            {/* Abstract UI composition */}
            <div className="relative w-full max-w-sm bg-background border-2 border-primary shadow-[12px_12px_0px_0px_var(--color-primary)] p-8 space-y-8 transition-transform duration-500 group-hover:-translate-y-2 group-hover:translate-x-2">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-32 h-32 bg-muted rounded-full border-2 border-primary/10" />
                    <div className="h-6 bg-primary w-1/2" />
                    <div className="h-4 bg-muted w-3/4" />
                </div>
                <div className="space-y-4 pt-4">
                   {[1, 2, 3].map((i) => (
                       <div key={i} className="h-14 border-2 border-primary bg-background hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-between px-6 font-bold cursor-pointer">
                           <span>Link {i}</span>
                           <span>→</span>
                       </div>
                   ))}
                </div>
            </div>
            
            {/* Decorative Grid Background */}
            <div className="absolute inset-0 -z-10 opacity-20" 
                 style={{ 
                     backgroundImage: 'linear-gradient(var(--primary) 1px, transparent 1px), linear-gradient(90deg, var(--primary) 1px, transparent 1px)', 
                     backgroundSize: '40px 40px' 
                 }} 
            />
        </div>
      </div>
    </section>
  );
}

