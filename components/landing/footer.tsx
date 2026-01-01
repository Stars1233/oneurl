import Image from "next/image";

export function LandingFooter() {
  return (
    <footer className="bg-primary text-primary-foreground pt-24 pb-12">
      <div className="container mx-auto px-4">
         <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-24">
             <div className="space-y-6">
                 <div className="flex items-center gap-3">
                    <div className="bg-background rounded-full p-1">
                      <Image 
                        src="/logo.png" 
                        alt="OneURL Logo" 
                        width={32} 
                        height={32} 
                        className="w-8 h-8"
                      />
                    </div>
                    <span className="font-bold text-2xl">OneURL</span>
                 </div>
                 <p className="text-primary-foreground/80 max-w-md text-lg leading-relaxed">
                     The open-source link in bio tool designed for minimalists. 
                     Join thousands of creators sharing their work simply.
                 </p>
             </div>
            
             <div className="space-y-6">
                 <h4 className="font-bold text-lg">Community</h4>
                 <ul className="space-y-4 text-primary-foreground/80">
                     <li><a href="https://github.com/KartikLabhshetwar/oneurl" className="hover:text-white transition-colors">GitHub</a></li>
                     <li><a href="https://x.com/code_kartik" className="hover:text-white transition-colors">Twitter</a></li>
                     <li><a href="#" className="hover:text-white transition-colors">Discord</a></li>
                 </ul>
             </div>
         </div>
         
         <div className="border-t border-primary-foreground/20 pt-8 flex flex-col md:flex-row justify-center items-center gap-4 text-sm text-primary-foreground/60">
             <div>© {new Date().getFullYear()} OneURL. Open Source BSD 3-Clause License.</div>
         </div>
      </div>
    </footer>
  );
}

