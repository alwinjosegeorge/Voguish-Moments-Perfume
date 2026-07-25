import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Search, MapPin, ChevronRight, Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { searchOrdersDb } from "@/lib/api/dbFunctions";

type TrackSearch = {
  q?: string;
};

export const Route = createFileRoute("/track/")({
  validateSearch: (search: Record<string, unknown>): TrackSearch => ({
    q: typeof search.q === "string" ? search.q : undefined,
  }),
  head: ({ search }) => ({
    meta: [
      { title: search.q ? `Tracking Results for "${search.q}" — Voguish Moments` : "Track Your Order — Voguish Moments" },
      { name: "description", content: "Track your perfume order live." },
    ],
  }),
  component: TrackIndexPage,
});

function TrackIndexPage() {
  const { q } = Route.useSearch();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState(q ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ordersList, setOrdersList] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Sync state if q changes
  useEffect(() => {
    if (q) {
      setSearchQuery(q);
      performSearch(q);
    } else {
      setSearchQuery("");
      setOrdersList([]);
      setHasSearched(false);
      setError(null);
    }
  }, [q]);

  const performSearch = async (query: string) => {
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
        setError("No orders found for this Order ID or Phone Number. Please check the spelling and try again.");
        setHasSearched(true);
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching tracking details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    navigate({ to: "/track", search: { q: query } });
  };

  return (
    <SiteLayout bypassModeSelection={true}>
      <div className="flex-1 py-16 px-6 max-w-4xl mx-auto w-full text-center">
        
        {/* Render Search Results view when query is active */}
        {q ? (
          <div className="text-left animate-fade-up max-w-2xl mx-auto">
            <button 
              onClick={() => navigate({ to: "/track", search: {} })}
              className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors mb-6 uppercase tracking-wider cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Search Again
            </button>

            {loading ? (
              <div className="bg-card border border-border/80 rounded-3xl p-12 text-center shadow-lg shadow-stone-100/50 flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-8 h-8 text-accent animate-spin" />
                <p className="text-sm text-muted-foreground font-medium">Searching database for orders...</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h1 className="font-display text-3xl text-foreground mb-1">Search Results</h1>
                  <p className="text-xs text-muted-foreground">Showing matching orders for: <span className="font-semibold text-foreground">{q}</span></p>
                </div>

                {/* Error Alert */}
                {error && (
                  <div className="bg-amber-50 border border-amber-200/60 rounded-2xl p-5 flex gap-3 text-left">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="space-y-3">
                      <p className="text-xs text-amber-800 leading-relaxed font-medium">{error}</p>
                      <button 
                        onClick={() => navigate({ to: "/track", search: {} })}
                        className="bg-foreground text-background font-bold text-[10px] uppercase tracking-wider py-2.5 px-4 rounded-xl hover:bg-foreground/90 transition-all cursor-pointer"
                      >
                        Try Another Search
                      </button>
                    </div>
                  </div>
                )}

                {/* Orders List Results */}
                {hasSearched && ordersList.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1 pl-1">
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
            )}
          </div>
        ) : (
          /* Render main search form */
          <div className="max-w-md w-full bg-card border border-border/80 rounded-3xl p-8 md:p-10 mx-auto shadow-lg shadow-stone-100/50 animate-fade-up">
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
        )}

      </div>
    </SiteLayout>
  );
}
