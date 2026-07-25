import { Header } from "./Header";
import { Footer } from "./Footer";
import { useEffect, type ReactNode } from "react";
import { useMode } from "@/context/ModeContext";
import { ModeSelectionScreen } from "./ModeSelectionScreen";
import { startPreloading } from "@/lib/productService";

export function SiteLayout({ children, bypassModeSelection = false }: { children: ReactNode; bypassModeSelection?: boolean }) {
  const { mode } = useMode();

  useEffect(() => {
    startPreloading();
  }, []);

  if (!mode && !bypassModeSelection) {
    return <ModeSelectionScreen />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      
      {/* Running Marquee Banner */}
      <div className="w-full bg-[#1c1917] py-2.5 overflow-hidden select-none border-b border-white/5">
        <div className="relative flex overflow-x-hidden">
          <div 
            className="animate-marquee whitespace-nowrap flex gap-16 pr-16 text-[11px] font-semibold tracking-[0.25em] text-white uppercase"
            style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
          >
            <span>I last longer than your ex</span>
            <span>I last longer than your ex</span>
            <span>I last longer than your ex</span>
            <span>I last longer than your ex</span>
            <span>I last longer than your ex</span>
            <span>I last longer than your ex</span>
          </div>
          <div 
            className="absolute top-0 animate-marquee2 whitespace-nowrap flex gap-16 pr-16 text-[11px] font-semibold tracking-[0.25em] text-white uppercase"
            style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
          >
            <span>I last longer than your ex</span>
            <span>I last longer than your ex</span>
            <span>I last longer than your ex</span>
            <span>I last longer than your ex</span>
            <span>I last longer than your ex</span>
            <span>I last longer than your ex</span>
          </div>
        </div>
      </div>

      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
