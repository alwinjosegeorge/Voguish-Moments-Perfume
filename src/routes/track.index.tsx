import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Search, MapPin } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/track/")({
  head: () => ({
    meta: [
      { title: "Track Your Order — Voguish Moments" },
      { name: "description", content: "Track your perfume order live." },
    ],
  }),
  component: TrackIndexPage,
});

function TrackIndexPage() {
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    navigate({ to: `/track/${orderId.trim()}` });
  };

  return (
    <SiteLayout bypassModeSelection={true}>
      <div className="flex-1 flex items-center justify-center py-20 px-6">
        <div className="max-w-md w-full bg-card border border-border/80 rounded-3xl p-8 md:p-10 text-center shadow-lg shadow-stone-100/50">
          <div className="w-12 h-12 rounded-full bg-accent/5 text-accent flex items-center justify-center mx-auto mb-6">
            <MapPin className="w-6 h-6 text-foreground/80" />
          </div>
          
          <h1 className="font-display text-3xl mb-3 text-foreground">Track Order</h1>
          <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
            Enter your order tracking ID sent to you via SMS/WhatsApp to view delivery status.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                required
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="e.g. ERA-2026-1234"
                className="w-full bg-[#FAF9F5] border border-border rounded-xl pl-4 pr-11 py-3.5 text-sm font-semibold outline-none focus:ring-1 focus:ring-accent tracking-wider uppercase placeholder:normal-case placeholder:font-normal"
              />
              <button 
                type="submit"
                className="absolute right-2 top-2 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-transparent transition-colors cursor-pointer"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
            
            <button
              type="submit"
              className="w-full bg-foreground text-background hover:bg-foreground/90 font-bold text-xs uppercase tracking-widest py-4 px-6 rounded-full transition-all cursor-pointer shadow-sm active:scale-[0.98]"
            >
              Track Status
            </button>
          </form>
        </div>
      </div>
    </SiteLayout>
  );
}
