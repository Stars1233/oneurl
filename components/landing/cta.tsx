import Link from "next/link";
import { Button } from "@/components/ui/button";

export function LandingCTA() {
  return (
    <section className="border-y border-primary/10 bg-muted/5 py-24 md:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
            Ready to share your links?
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Join thousands of creators who use OneURL to showcase their work. 
            Get started in seconds.
          </p>
          <div className="flex justify-center items-center pt-4">
            <Button 
              render={<Link href="/signup" />}
              size="lg" 
              className="rounded-none text-lg font-semibold px-8 h-14 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

