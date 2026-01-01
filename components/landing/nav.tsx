import Link from "next/link";
import Image from "next/image";
import { GitHubStars } from "@/components/github-stars";
import { Button } from "../ui/button";

export function LandingNav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-primary/10 bg-background/80 backdrop-blur-xl supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
           <Image 
             src="/logo.png" 
             alt="OneURL Logo" 
             width={128} 
             height={128} 
             className="w-20 h-20"
           />
        </Link>
        <div className="flex items-center gap-6">

          <Button render={<Link href="/login" />} className="text-sm font-semibold hover:text-primary transition-colors">
            Log in
          </Button>
          <GitHubStars repo="KartikLabhshetwar/oneurl" /> 
        </div>
      </div>
    </nav>
  );
}

