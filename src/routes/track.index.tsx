import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Search, MapPin, ChevronRight, Loader2, AlertCircle } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { searchOrdersDb } from "@/lib/api/dbFunctions";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ordersList, setOrdersList] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    setLoading(true);
    setError(null);
    setOrdersList([]);
    setHasSearched(false);

    try {
      const res = await searchOrdersDb({ data: { query } });
      
      if (res.type === "EXACT" && res.orders.length > 0) {
        navigate({ to: `/track/${res.orders[0].id}` });
      } else if (res.type === "LIST") {
        setOrdersList(res.orders);
        setHasSearched(true);
      } else {
        setError("No orders found for this Order ID or Phone Number. Please double check and try again.");
        setHasSearched(true);
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while searching. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SiteLayout bypassModeSelection={true}>
      <div className="flex-1 py-16 px-6 max-w-4xl mx-auto w-full text-center">
        
        {/* Search Box */}
        <div className="max-w-md w-full bg-card border border-border/80 rounded-3xl p-8 md:p-10 mx-auto shadow-lg shadow-stone-100/50">
          <div className="w-12 h-12 rounded-full bg-accent/5 text-accent flex items-center justify-center mx-auto mb-6">
            <MapPin className="w-6 h-6 text-foreground/80" />
          </div>
          
          <h1 className="font-display text-3xl mb-3 text-foreground">Track Order</h1>
          <p className="text-xs text-muted-foreground mb-8 leading-relaxed">
            Enter your order tracking ID (e.g., <span className="font-semibold">ERA-2026-1234</span>) or registered phone number.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                required
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Order ID or Phone Number"
                className="w-full bg-[#FAF9F5] border border-border rounded-xl pl-4 pr-11 py-3.5 text-sm font-semibold outline-none focus:ring-1 focus:ring-accent tracking-wide placeholder:font-normal"
              />
              <button 
                type="submit"
                disabled={loading}
                className="absolute right-2 top-2 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-transparent transition-colors cursor-pointer"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
              </button>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-foreground text-background hover:bg-foreground/90 disabled:bg-foreground/75 font-bold text-xs uppercase tracking-widest py-4 px-6 rounded-full transition-all cursor-pointer shadow-sm active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Searching...
                </>
              ) : (
                "Track Status"
              )}
            </button>
          </form>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mt-8 max-w-md mx-auto bg-amber-50 border border-amber-200/60 rounded-2xl p-4 flex gap-3 text-left animate-fade-up">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 leading-relaxed font-medium">{error}</p>
          </div>
        )}

        {/* Orders List Results */}
        {hasSearched && ordersList.length > 0 && (
          <div className="mt-12 max-w-2xl mx-auto space-y-4 text-left animate-fade-up">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 pl-1">
              Orders Found ({ordersList.length})
            </h2>
            
            <div className="space-y-4">
              {ordersList.map((order) => (
                <div 
                  key={order.id} 
                  className="bg-card border border-border/80 rounded-2xl p-5 md:p-6 hover:border-accent/40 hover:shadow-md hover:shadow-stone-50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-bold text-sm text-foreground">Order ID: #{order.id}</span>
                      <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        order.status === "DELIVERED" 
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-100" 
                          : order.status === "SHIPPED"
                            ? "bg-blue-50 text-blue-800 border border-blue-100"
                            : "bg-amber-50 text-amber-800 border border-amber-100"
                      }`}>
                        {order.status === "WAITING" ? "Processing" : order.status}
                      </span>
                    </div>
                    
                    <div className="text-[11px] text-muted-foreground flex flex-wrap gap-x-3.5 gap-y-1">
                      <span className="font-medium text-foreground/80">👤 {order.customerName}</span>
                      <span>📅 {order.date || new Date(order.createdAt).toLocaleDateString()}</span>
                      <span>💰 ₹{order.total.toLocaleString("en-IN")}</span>
                    </div>
                    
                    <div className="text-xs font-semibold text-foreground/80 truncate max-w-sm sm:max-w-md md:max-w-lg mt-1 bg-[#FAF9F5]/70 border border-border/40 rounded-lg px-2.5 py-1.5 inline-block">
                      {order.items.map((it: any) => `${it.name} (${it.size})`).join(", ")}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => navigate({ to: `/track/${order.id}` })}
                    className="bg-[#1c1917] hover:bg-[#1c1917]/90 text-white rounded-xl py-3 px-5 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-[0.98] self-start md:self-auto"
                  >
                    Track Live <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </SiteLayout>
  );
}
