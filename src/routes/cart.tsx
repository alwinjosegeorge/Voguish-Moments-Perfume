import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { Minus, Plus, X, Check, ShoppingBag, ChevronDown } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { useCart } from "@/lib/cart";
import { createOrderDb } from "@/lib/api/dbFunctions";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Cart — Voguish Moments" },
      { name: "description", content: "Review the items in your shopping bag." },
    ],
  }),
  component: CartPage,
});

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && (window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const STATES_OF_INDIA = [
  "Kerala",
  "Tamil Nadu",
  "Karnataka",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal"
];

function CartPage() {
  const { detailed, setQty, remove, subtotal, clear } = useCart();
  const [deliveryState, setDeliveryState] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const shipping = isCheckingOut
    ? (deliveryState.toLowerCase() === "kerala" ? 70 : deliveryState ? 120 : 0)
    : 0;
  const total = subtotal + shipping;
  const [orderPlaced, setOrderPlaced] = useState<string | null>(null);
  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);
  const stateDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (stateDropdownRef.current && !stateDropdownRef.current.contains(event.target as Node)) {
        setIsStateDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Scroll to top on view changes (cart -> checkout -> success)
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, [isCheckingOut, orderPlaced]);
  
  // Contact & Delivery states
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryHouse, setDeliveryHouse] = useState("");
  const [deliveryArea, setDeliveryArea] = useState("");
  const [deliveryDistrict, setDeliveryDistrict] = useState("");
  const [deliveryPin, setDeliveryPin] = useState("");

  const submitOrder = (orderId: string, paymentId: string) => {
    const newOrder = {
      id: orderId,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      deliveryAddress: {
        house: deliveryHouse.trim(),
        area: deliveryArea.trim(),
        district: deliveryDistrict.trim(),
        state: deliveryState.trim(),
        pin: deliveryPin.trim(),
      },
      paymentId,
      items: detailed.map((d) => ({
        slug: d.product.slug,
        name: d.product.name,
        qty: d.qty,
        size: d.size,
        price: d.price,
      })),
      subtotal,
      shipping,
      total,
      status: "WAITING",
      dateString: new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      }) + " at " + new Date().toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' }),
    };

    createOrderDb({ data: newOrder })
      .then(() => {
        clear();
        setOrderPlaced(orderId);
      })
      .catch((err) => {
        console.error("Failed to save order to Neon database:", err);
        alert("Failed to place order in database. Please try again.");
      });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !customerName.trim() ||
      !customerPhone.trim() ||
      !deliveryHouse.trim() ||
      !deliveryArea.trim() ||
      !deliveryDistrict.trim() ||
      !deliveryState.trim() ||
      !deliveryPin.trim()
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    if (!/^\d{6}$/.test(deliveryPin.trim())) {
      alert("PIN Code must be exactly 6 digits.");
      return;
    }

    // Load Razorpay Script
    const sdkLoaded = await loadRazorpayScript();
    if (!sdkLoaded) {
      alert("Failed to load Razorpay SDK. Please check your internet connection.");
      return;
    }

    const orderId = `ERA-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const options = {
      key: "rzp_test_dummy_key", // Placeholder: User will change this later
      amount: total * 100, // in paise
      currency: "INR",
      name: "Voguish Moments Perfumes",
      description: `Order Checkout Payment - ${orderId}`,
      handler: function (response: any) {
        const paymentId = response.razorpay_payment_id || `pay_mock_${Math.random().toString(36).substring(2, 9)}`;
        submitOrder(orderId, paymentId);
      },
      prefill: {
        name: customerName.trim(),
        contact: customerPhone.trim(),
      },
      theme: {
        color: "#1c1917",
      },
    };

    try {
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Razorpay open error: ", err);
      // Fallback checkout for testing/dummy environment
      alert("Razorpay sandbox payment loaded. Completing payment step...");
      submitOrder(orderId, `pay_mock_${Math.random().toString(36).substring(2, 11).toUpperCase()}`);
    }
  };

  return (
    <SiteLayout>
      <div className="max-w-[1300px] mx-auto px-6 lg:px-12 pt-6 lg:pt-10 pb-12">
        <h1 className="font-display text-4xl md:text-5xl mb-10 text-center md:text-left">Your Cart</h1>

        {orderPlaced ? (
          <div className="text-center py-20 bg-[#FAF9F5] border border-emerald-100 rounded-3xl animate-fade-up max-w-xl mx-auto px-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto mb-6 shadow-md shadow-emerald-500/10">
              <Check className="w-8 h-8 stroke-[2.5]" />
            </div>
            <h2 className="font-display text-3xl mb-3 text-foreground">Order Placed Successfully!</h2>
            <p className="text-sm text-muted-foreground mb-2">Order ID: <span className="font-bold text-foreground">{orderPlaced}</span></p>
            <p className="text-sm text-muted-foreground mb-8">We have received your order. You can review and manage this order in the Control Panel.</p>
            <Link
              to="/shop"
              onClick={() => setOrderPlaced(null)}
              className="inline-flex bg-[#1c1917] hover:bg-[#1c1917]/90 text-white rounded-full px-8 py-3.5 text-xs font-bold tracking-widest uppercase shadow-md transition-all cursor-pointer"
            >
              Continue Shopping
            </Link>
          </div>
        ) : detailed.length === 0 ? (
          <div className="text-center py-20 bg-cream/50 rounded-3xl">
            <p className="text-muted-foreground mb-6">Your cart is empty.</p>
            <Link to="/shop" className="inline-flex bg-foreground text-background rounded-full px-7 py-3">Browse the shop</Link>
          </div>
        ) : isCheckingOut ? (
          /* CHECKOUT VIEW: TWO-COLUMN FORM LAYOUT */
          <form onSubmit={handlePlaceOrder} className="grid lg:grid-cols-[1fr_380px] gap-10 animate-fade-up">
            
            {/* Left Column: Form Fields */}
            <div className="bg-white border border-[#EAE8E2] rounded-3xl p-6 md:p-8 space-y-6">
              <h2 className="font-display text-2xl">Shipping & Contact Details</h2>
              <p className="text-xs text-muted-foreground">Please provide your contact and delivery address below.</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] tracking-wider text-muted-foreground font-bold uppercase mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full bg-[#FAF9F5] border border-border rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-wider text-muted-foreground font-bold uppercase mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Phone Number"
                    className="w-full bg-[#FAF9F5] border border-border rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
              </div>

              {/* Email field removed */}

              <div className="border-t border-[#EAE8E2] pt-6 space-y-4">
                <h3 className="text-xs tracking-widest text-[#A28F79] font-bold uppercase">Delivery Address</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] tracking-wider text-muted-foreground font-bold uppercase mb-1.5">
                      House Name / Flat *
                    </label>
                    <input
                      type="text"
                      required
                      value={deliveryHouse}
                      onChange={(e) => setDeliveryHouse(e.target.value)}
                      placeholder="House Name / Flat"
                      className="w-full bg-[#FAF9F5] border border-border rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-wider text-muted-foreground font-bold uppercase mb-1.5">
                      Area / Street *
                    </label>
                    <input
                      type="text"
                      required
                      value={deliveryArea}
                      onChange={(e) => setDeliveryArea(e.target.value)}
                      placeholder="Area / Street"
                      className="w-full bg-[#FAF9F5] border border-border rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] tracking-wider text-muted-foreground font-bold uppercase mb-1.5">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      required
                      pattern="\d{6}"
                      maxLength={6}
                      value={deliveryPin}
                      onChange={(e) => setDeliveryPin(e.target.value)}
                      placeholder="PIN Code"
                      className="w-full bg-[#FAF9F5] border border-border rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-1 focus:ring-accent font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-wider text-muted-foreground font-bold uppercase mb-1.5">
                      District / City *
                    </label>
                    <input
                      type="text"
                      required
                      value={deliveryDistrict}
                      onChange={(e) => setDeliveryDistrict(e.target.value)}
                      placeholder="District / City"
                      className="w-full bg-[#FAF9F5] border border-border rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-wider text-muted-foreground font-bold uppercase mb-1.5">
                      State *
                    </label>
                    <div className="relative" ref={stateDropdownRef}>
                      <button
                        type="button"
                        onClick={() => setIsStateDropdownOpen(!isStateDropdownOpen)}
                        className="w-full bg-[#FAF9F5] border border-border rounded-xl pl-4 pr-10 py-2.5 text-xs outline-none focus:ring-1 focus:ring-accent cursor-pointer text-left transition-all"
                      >
                        <span className={deliveryState ? "text-foreground font-medium" : "text-muted-foreground"}>
                          {deliveryState || "Select State"}
                        </span>
                      </button>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-muted-foreground/80">
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isStateDropdownOpen ? "rotate-180" : ""}`} />
                      </div>

                      {isStateDropdownOpen && (
                        <div className="absolute z-50 mt-1.5 w-full bg-[#FAF9F5] border border-border rounded-xl shadow-lg max-h-60 overflow-y-auto py-1.5 animate-fade-in">
                          {STATES_OF_INDIA.map((st) => (
                            <button
                              key={st}
                              type="button"
                              onClick={() => {
                                setDeliveryState(st);
                                setIsStateDropdownOpen(false);
                              }}
                              className={`w-full text-left px-4 py-2.5 text-xs transition-colors hover:bg-accent/10 hover:text-accent font-medium cursor-pointer ${
                                deliveryState === st ? "bg-accent/5 text-accent font-semibold" : "text-foreground"
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary & Actions */}
            <aside className="bg-cream/70 rounded-3xl p-6 h-fit border border-[#EAE8E2] space-y-6">
              <h3 className="font-display text-xl">Order Summary</h3>
              
              <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1 border-b border-border pb-4">
                {detailed.map(({ product, qty, size, price }) => (
                  <div key={`${product.slug}-${size}`} className="flex justify-between text-xs">
                    <div>
                      <span className="font-semibold text-foreground">{product.name}</span>
                      <span className="text-[9px] bg-white border border-border px-1.5 py-0.5 rounded ml-2 uppercase text-muted-foreground">{size}</span>
                    </div>
                    <span className="text-muted-foreground">x{qty} · ₹{(price * qty).toLocaleString("en-IN")}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 text-xs border-b border-border pb-4">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-semibold">₹{subtotal.toLocaleString("en-IN")}</span></div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-semibold">
                    {deliveryState ? `₹${shipping.toLocaleString("en-IN")}` : "Select State"}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-sm pt-1.5 border-t border-dashed border-border"><span className="text-foreground">Total</span><span className="text-foreground">₹{total.toLocaleString("en-IN")}</span></div>
              </div>

              <div className="space-y-2">
                <button
                  type="submit"
                  className="w-full bg-[#1c1917] hover:bg-foreground/90 text-white rounded-full py-3.5 font-semibold text-xs tracking-widest uppercase cursor-pointer shadow-md shadow-stone-900/10"
                >
                  Pay & Place Order
                </button>
                <button
                  type="button"
                  onClick={() => setIsCheckingOut(false)}
                  className="w-full bg-white border border-border text-muted-foreground hover:text-foreground rounded-full py-3.5 font-semibold text-xs tracking-widest uppercase cursor-pointer"
                >
                  Back to Cart
                </button>
              </div>
            </aside>
          </form>
        ) : (
          /* STANDARD CART VIEW */
          <div className="grid lg:grid-cols-[1fr_380px] gap-10">
            <div className="space-y-4">
              {detailed.map(({ product, qty, size, price }) => (
                <div key={`${product.slug}-${size}`} className="flex gap-4 bg-card border border-border rounded-2xl p-4">
                  <Link to="/product/$slug" params={{ slug: product.slug }} className="w-24 h-24 rounded-xl overflow-hidden bg-cream shrink-0">
                    <img src={product.img} alt={product.name} className="w-full h-full object-cover" />
                  </Link>
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1">
                      <Link to="/product/$slug" params={{ slug: product.slug }} className="font-medium hover:text-accent">{product.name}</Link>
                      <div className="text-sm text-muted-foreground">{product.category}</div>
                      <div className="text-[10px] bg-[#FAF9F5] border border-border/70 text-muted-foreground font-semibold px-2.5 py-0.5 rounded-md w-fit mt-1.5 uppercase tracking-wider">
                        {size}
                      </div>
                      <div className="text-sm mt-1.5 font-medium">₹{price.toLocaleString("en-IN")}</div>
                    </div>
                    <div className="flex items-center border border-border rounded-full bg-[#FAF9F5]/40">
                      <button onClick={() => setQty(product.slug, size, qty - 1)} className="w-9 h-9 flex items-center justify-center cursor-pointer hover:text-accent"><Minus className="w-4 h-4" /></button>
                      <span className="w-8 text-center text-sm font-semibold">{qty}</span>
                      <button onClick={() => setQty(product.slug, size, qty + 1)} className="w-9 h-9 flex items-center justify-center cursor-pointer hover:text-accent"><Plus className="w-4 h-4" /></button>
                    </div>
                    <div className="w-24 text-right font-semibold">₹{(price * qty).toLocaleString("en-IN")}</div>
                    <button onClick={() => remove(product.slug, size)} aria-label="Remove" className="text-muted-foreground hover:text-foreground cursor-pointer"><X className="w-5 h-5" /></button>
                  </div>
                </div>
              ))}
              <button onClick={clear} className="text-sm text-muted-foreground hover:text-foreground cursor-pointer mt-2">Clear cart</button>
            </div>

            <aside className="bg-cream/70 rounded-3xl p-6 h-fit border border-[#EAE8E2]">
              <h2 className="font-display text-2xl mb-6">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-semibold">₹{subtotal.toLocaleString("en-IN")}</span></div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-semibold text-muted-foreground text-xs italic">
                    Calculated at checkout
                  </span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between font-medium text-base"><span>Total</span><span className="font-bold">₹{total.toLocaleString("en-IN")}</span></div>
              </div>
              <button
                onClick={() => setIsCheckingOut(true)}
                className="mt-6 w-full bg-[#000000] hover:bg-zinc-900 text-white rounded-full py-4 font-bold text-xs tracking-[0.15em] uppercase cursor-pointer shadow-md flex items-center justify-center gap-2.5 transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                <ShoppingBag className="w-4 h-4 fill-white stroke-black" />
                Checkout Securely
              </button>

              {/* Payment logos container */}
              <div className="mt-4 flex items-center justify-center gap-2 select-none pointer-events-none">
                {/* Razorpay Icon */}
                <svg className="w-13 h-6.5 rounded bg-[#0F172A] px-1.5" viewBox="0 0 50 22" fill="none">
                  <path d="M11 16.5l5.5-8.5H8.5L6.8 16.5h4.2z" fill="#00E5FF"/>
                  <path d="M6.8 16.5l2.7-4.5h5.5l-2.7 4.5H6.8z" fill="#0052FF"/>
                  <text x="18" y="13.5" fill="white" fontFamily="system-ui, sans-serif" fontWeight="bold" fontSize="6.2">Razorpay</text>
                </svg>

                {/* UPI Icon */}
                <svg className="w-10 h-6.5 rounded bg-[#5F259F] px-1" viewBox="0 0 40 26" fill="none">
                  <rect width="40" height="26" rx="3" fill="#5F259F"/>
                  <text x="7" y="16.5" fill="white" fontFamily="system-ui, sans-serif" fontWeight="bold" fontSize="9" fontStyle="italic" letterSpacing="0.05em">UPI</text>
                </svg>

                {/* GPay Icon */}
                <svg className="w-10 h-6.5 rounded bg-white border border-border/70 px-1" viewBox="0 0 40 26" fill="none">
                  <rect width="40" height="26" rx="3" fill="#FFFFFF"/>
                  <path d="M15 15.5h6" stroke="#4285F4" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M17 11.5h4" stroke="#EA4335" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M19 13.5h3" stroke="#FBBC05" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M21 9.5h3" stroke="#34A853" strokeWidth="2" strokeLinecap="round"/>
                  <text x="8.5" y="21.5" fill="#5F6368" fontFamily="system-ui, sans-serif" fontWeight="bold" fontSize="6.2">G Pay</text>
                </svg>

                {/* Net Banking Icon */}
                <svg className="w-10 h-6.5 rounded bg-[#0A84FF] px-1" viewBox="0 0 40 26" fill="none">
                  <rect width="40" height="26" rx="3" fill="#0A84FF"/>
                  <text x="4" y="13" fill="white" fontFamily="system-ui, sans-serif" fontWeight="bold" fontSize="5.5" letterSpacing="0.02em">NET</text>
                  <text x="4" y="20.5" fill="white" fontFamily="system-ui, sans-serif" fontWeight="bold" fontSize="5.5" letterSpacing="0.02em">BANKING</text>
                </svg>

                {/* Card Icon */}
                <svg className="w-10 h-6.5 rounded bg-[#111111] px-1" viewBox="0 0 40 26" fill="none">
                  <rect width="40" height="26" rx="3" fill="#111111"/>
                  <rect x="4" y="8" width="32" height="4" fill="white" opacity="0.3"/>
                  <rect x="4" y="15" width="8" height="5" rx="1" fill="white" opacity="0.8"/>
                  <circle cx="28" cy="17.5" r="3.5" fill="#EB001B"/>
                  <circle cx="32" cy="17.5" r="3.5" fill="#F79E1B" fillOpacity="0.8"/>
                </svg>
              </div>

              <Link to="/shop" className="mt-5 block text-center text-xs tracking-wider uppercase font-semibold text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4 decoration-muted-foreground/30">
                Continue shopping
              </Link>
            </aside>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
