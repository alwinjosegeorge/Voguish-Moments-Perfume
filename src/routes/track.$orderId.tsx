import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { 
  Package, Truck, CheckCircle2, MapPin, User, Clock, 
  ArrowLeft, ShoppingBag, Phone, ChevronRight
} from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { getOrderByIdDb, updateOrderStatusDb } from "@/lib/api/dbFunctions";
import { PRODUCTS } from "@/data/catalog";

export const Route = createFileRoute("/track/$orderId")({
  loader: async ({ params }) => {
    try {
      const order = await getOrderByIdDb({ data: { id: params.orderId } });
      if (!order) throw notFound();
      return { order };
    } catch (e) {
      throw notFound();
    }
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `Track Order #${loaderData?.order.id ?? ""} — Voguish Moments` },
      { name: "description", content: "View the live delivery status of your order." },
    ],
  }),
  component: TrackDetailPage,
  errorComponent: () => (
    <SiteLayout bypassModeSelection={true}>
      <div className="flex-1 flex flex-col items-center justify-center py-20 px-6">
        <div className="max-w-md text-center">
          <h2 className="font-display text-4xl mb-4">Order Not Found</h2>
          <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
            We couldn't find an order with that tracking ID. Please make sure the ID is entered correctly or contact support.
          </p>
          <Link
            to="/track"
            className="inline-flex bg-[#1c1917] hover:bg-[#1c1917]/90 text-white rounded-full px-8 py-3.5 text-xs font-bold tracking-widest uppercase shadow-md transition-all cursor-pointer"
          >
            Go Back
          </Link>
        </div>
      </div>
    </SiteLayout>
  ),
});

function TrackDetailPage() {
  const { order } = Route.useLoaderData();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleConfirmDelivery = async () => {
    if (!confirm("Are you sure you have received your order? This will mark the order as delivered.")) return;
    setLoading(true);
    try {
      await updateOrderStatusDb({ data: { id: order.id, status: "DELIVERED" } });
      router.invalidate();
    } catch (e) {
      console.error(e);
      alert("Failed to confirm delivery. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to resolve product image from catalog
  const getProductImage = (slug: string) => {
    const p = PRODUCTS.find((item) => item.slug === slug);
    return p?.img || "/logo.png";
  };

  // Helper to format date
  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    }) + " at " + d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Extract history entries
  const history = Array.isArray(order.statusHistory) ? order.statusHistory : [];
  
  const waitingEvent = history.find((h: any) => h.status === "WAITING");
  const shippedEvent = history.find((h: any) => h.status === "SHIPPED");
  const deliveredEvent = history.find((h: any) => h.status === "DELIVERED");

  // Determine stage status
  const isPlaced = !!waitingEvent;
  const isShipped = !!shippedEvent;
  const isDelivered = !!deliveredEvent;

  // Banner messages
  let statusTitle = "Order Placed";
  let statusDesc = "We're verifying your details and preparing your perfume for dispatch.";
  let statusColor = "bg-amber-50 text-amber-800 border-amber-200/60";

  if (order.status === "SHIPPED") {
    statusTitle = "Shipped";
    statusDesc = "Your order is on the way! It has been shipped through our courier partner DTDC.";
    statusColor = "bg-blue-50 text-blue-800 border-blue-200/60";
  } else if (order.status === "DELIVERED") {
    statusTitle = "Delivered";
    statusDesc = "Your order has been delivered successfully. Thank you for choosing Voguish Moments!";
    statusColor = "bg-emerald-50 text-emerald-800 border-emerald-200/60";
  }

  return (
    <SiteLayout bypassModeSelection={true}>
      <div className="max-w-[1100px] mx-auto px-6 lg:px-12 pt-6 lg:pt-10 pb-16">
        <Link 
          to="/track"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors mb-6 uppercase tracking-wider"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Search
        </Link>

        {/* Top Header Card */}
        <div className="bg-card border border-border/80 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 animate-fade-up">
          <div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1.5">Live Tracking</div>
            <h1 className="font-display text-2xl md:text-3xl text-foreground">Order ID: #{order.id}</h1>
            <p className="text-xs text-muted-foreground mt-1.5 font-medium">Placed on: {order.date || "Just now"}</p>
          </div>
          <div className={`border rounded-2xl px-6 py-4 max-w-md ${statusColor}`}>
            <div className="font-bold text-sm flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
              {statusTitle}
            </div>
            <p className="text-xs leading-relaxed opacity-90">{statusDesc}</p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-[1.3fr_1fr] gap-8 items-start">
          
          {/* Left Column: Timeline & Items */}
          <div className="space-y-8 animate-fade-up" style={{ animationDelay: "100ms" }}>
            
            {/* Timeline */}
            <div className="bg-card border border-border/80 rounded-3xl p-6 md:p-8 shadow-sm">
              <h2 className="font-display text-xl mb-6 text-foreground">Delivery Timeline</h2>
              
              <div className="relative pl-8 border-l border-border/70 ml-3 space-y-10 py-2">
                
                {/* Step 1: Order Placed */}
                <div className="relative">
                  <div className={`absolute -left-[41px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center border transition-colors shadow-sm ${
                    isPlaced ? "bg-[#1c1917] border-[#1c1917] text-white" : "bg-white border-border text-muted-foreground"
                  }`}>
                    <ShoppingBag className="w-3 h-3" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-foreground">Order Placed</h3>
                    <p className="text-xs text-muted-foreground mt-1">Order successfully registered in our system.</p>
                    {waitingEvent && (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground bg-cream border border-border px-2 py-0.5 rounded-md mt-2">
                        <Clock className="w-3 h-3 text-muted-foreground" /> {formatDate(waitingEvent.timestamp)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Step 2: Shipped */}
                <div className="relative">
                  <div className={`absolute -left-[41px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center border transition-colors shadow-sm ${
                    isShipped ? "bg-[#1c1917] border-[#1c1917] text-white" : "bg-white border-border text-muted-foreground"
                  }`}>
                    <Truck className="w-3 h-3" />
                  </div>
                  <div>
                    <h3 className={`font-bold text-sm ${isShipped ? "text-foreground" : "text-muted-foreground"}`}>
                      Shipped & In Transit
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">Package handed over to DTDC. You will receive SMS with direct tracking links.</p>
                    {shippedEvent ? (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground bg-cream border border-border px-2 py-0.5 rounded-md mt-2">
                        <Clock className="w-3 h-3 text-muted-foreground" /> {formatDate(shippedEvent.timestamp)}
                      </span>
                    ) : (
                      <span className="inline-flex text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-md mt-2 uppercase tracking-wide">
                        Pending Dispatch
                      </span>
                    )}
                  </div>
                </div>

                {/* Step 3: Delivered */}
                <div className="relative">
                  <div className={`absolute -left-[41px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center border transition-colors shadow-sm ${
                    isDelivered ? "bg-emerald-600 border-emerald-600 text-white" : "bg-white border-border text-muted-foreground"
                  }`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className={`font-bold text-sm ${isDelivered ? "text-foreground" : "text-muted-foreground"}`}>
                      Delivered
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">Package arrived at the destination.</p>
                    {deliveredEvent ? (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md mt-2">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {formatDate(deliveredEvent.timestamp)}
                      </span>
                    ) : (
                      <span className="inline-flex text-[10px] font-bold text-muted-foreground bg-cream border border-border px-2 py-0.5 rounded-md mt-2 uppercase tracking-wide">
                        Awaiting Delivery
                      </span>
                    )}
                  </div>
                </div>

              </div>
              
              {/* Customer confirmation button */}
              {order.status !== "DELIVERED" && (
                <div className="mt-8 pt-6 border-t border-border/60">
                  <div className="bg-[#FAF9F5] border border-border rounded-2xl p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-sm text-foreground">Did you receive your package?</h4>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                        Let us know when your perfume arrives safely so we can close your order.
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={loading}
                      onClick={handleConfirmDelivery}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white disabled:bg-emerald-500/50 font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all cursor-pointer whitespace-nowrap shadow-sm active:scale-[0.98]"
                    >
                      {loading ? "Confirming..." : "Confirm Delivery Received"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Product Items */}
            <div className="bg-card border border-border/80 rounded-3xl p-6 md:p-8 shadow-sm">
              <h2 className="font-display text-xl mb-6 text-foreground">Items Ordered</h2>
              
              <div className="space-y-4">
                {order.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex gap-4 items-center py-3 border-b border-border/50 last:border-b-0">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border border-border bg-[#FAF9F5] flex-shrink-0 flex items-center justify-center">
                      <img 
                        src={getProductImage(item.slug)} 
                        alt={item.name} 
                        className="w-full h-full object-cover object-center" 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm text-foreground truncate">{item.name}</h3>
                      <div className="flex gap-2.5 items-center mt-1 text-[11px]">
                        <span className="text-muted-foreground uppercase font-bold tracking-wide">{item.size}</span>
                        <span className="text-stone-300">•</span>
                        <span className="text-muted-foreground font-semibold">Qty: {item.qty}</span>
                      </div>
                    </div>
                    <div className="font-semibold text-sm text-foreground">
                      ₹{(item.price * item.qty).toLocaleString("en-IN")}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Customer Info & Order Summary */}
          <div className="space-y-8 animate-fade-up" style={{ animationDelay: "200ms" }}>
            
            {/* Customer Details */}
            <div className="bg-card border border-border/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
              <h2 className="font-display text-xl mb-2 text-foreground">Shipping Details</h2>
              
              <div className="flex gap-3 text-xs leading-relaxed items-start">
                <User className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-foreground">{order.customerName}</div>
                  <div className="text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3 inline text-muted-foreground" /> {order.customerPhone}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 text-xs leading-relaxed items-start pt-3 border-t border-border/50">
                <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div className="text-muted-foreground space-y-1">
                  <div className="font-semibold text-foreground">{order.deliveryAddress.house}</div>
                  <div>{order.deliveryAddress.area}</div>
                  <div>
                    {order.deliveryAddress.district}, {order.deliveryAddress.state} - <span className="font-mono font-bold">{order.deliveryAddress.pin}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-card border border-border/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
              <h2 className="font-display text-xl mb-4 text-foreground">Order Summary</h2>
              
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold text-foreground">₹{order.subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-semibold text-foreground">₹{order.shipping.toLocaleString("en-IN")}</span>
                </div>
                
                <div className="pt-3 border-t border-dashed border-border flex justify-between font-bold text-sm">
                  <span className="text-foreground">Total Paid</span>
                  <span className="text-foreground">₹{order.total.toLocaleString("en-IN")}</span>
                </div>
              </div>
              
              {order.paymentId && (
                <div className="mt-4 pt-3 border-t border-border/50 text-[10px] text-muted-foreground leading-relaxed">
                  <div className="font-bold uppercase tracking-wider">Payment Verified</div>
                  <div className="font-mono mt-0.5 truncate">{order.paymentId}</div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </SiteLayout>
  );
}
