import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { 
  Check, Sparkles, RefreshCw, Lock, Search, 
  Trash2, ClipboardList, Package, Layers, Calendar, User, Mail,
  Upload, Edit3
} from "lucide-react";
import { PRODUCTS, PRODUCT_IMAGES } from "@/data/catalog";
import {
  getProductsDb,
  createOrUpdateProductDb,
  deleteProductDb,
  getOrdersDb,
  updateOrderStatusDb,
  deleteOrderDb,
} from "@/lib/api/dbFunctions";
import { invalidateCache } from "@/lib/productService";

export const Route = createFileRoute("/control-panel")({
  component: ControlPanel,
});

type FragranceMode = "OUD_BASE" | "FLORAL_BASE" | "FRUITY_BASE" | "FRESH_BASE";
type TabName = "orders" | "products";

function getStandardPriceForSize(basePrice: number, size: string): number {
  if (size === "10 ml") return Math.round(basePrice * 0.3);
  if (size === "15 ml") return Math.round(basePrice * 0.4);
  if (size === "100 ml") return Math.round(basePrice * 1.6);
  return basePrice;
}

function ControlPanel() {
  const router = useRouter();
  
  // Access control state
  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState(false);

  // Active view tab
  const [activeTab, setActiveTab] = useState<TabName>("orders");

  // Core data states
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  
  // Selected item states
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [orderSearchQuery, setOrderSearchQuery] = useState("");
  const [copiedAddressId, setCopiedAddressId] = useState<string | null>(null);

  const handleCopyAddress = (order: any) => {
    const text = `${order.customerName}
${order.customerPhone}
${order.deliveryAddress.house}
${order.deliveryAddress.area}${order.deliveryAddress.landmark ? `\nLandmark: ${order.deliveryAddress.landmark}` : ''}
${order.deliveryAddress.district}, ${order.deliveryAddress.state} - ${order.deliveryAddress.pin}`;

    navigator.clipboard.writeText(text).then(() => {
      setCopiedAddressId(order.id);
      setTimeout(() => setCopiedAddressId(null), 2000);
    });
  };

  // Editing state
  const [editingSlug, setEditingSlug] = useState<string | null>(null);

  // Product form states
  const [prodName, setProdName] = useState("");
  const [prodBase, setProdBase] = useState<"Oud Base" | "Floral Base" | "Fruity Base" | "Fresh Base">("Oud Base");
  const [prodPrice, setProdPrice] = useState<number>(1999);
  const [prodDesc, setProdDesc] = useState("");
  
  // Media states
  const [prodImgBase64, setProdImgBase64] = useState<string>("");
  const [prodImgUrl, setProdImgUrl] = useState<string>("");
  const [prodHoverImgBase64, setProdHoverImgBase64] = useState<string>("");
  const [prodHoverImgUrl, setProdHoverImgUrl] = useState<string>("");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [prodGalleryUrlInput, setProdGalleryUrlInput] = useState<string>("");
  
  const [sizePriceInputs, setSizePriceInputs] = useState<Record<string, string>>({});
  const [productSuccess, setProductSuccess] = useState<string | null>(null);

  // Display Settings states
  const [prodBadge, setProdBadge] = useState<"No Badge" | "Bestseller" | "Only 2 Left">("No Badge");
  const [activeSizes, setActiveSizes] = useState<string[]>(["10 ml", "15 ml", "50 ml", "100 ml"]);

  // Media handlers
  const handleMainImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1.5 * 1024 * 1024) {
        alert("Warning: This file is large (>1.5MB). Consider compressing to save browser storage space.");
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProdImgBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHoverImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1.5 * 1024 * 1024) {
        alert("Warning: This file is large (>1.5MB). Consider compressing to save browser storage space.");
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProdHoverImgBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        if (galleryImages.length >= 6) {
          alert("Maximum 6 gallery images allowed.");
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          setGalleryImages((prev) => [...prev, reader.result as string].slice(0, 6));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleAddGalleryUrl = () => {
    if (!prodGalleryUrlInput.trim()) return;
    if (galleryImages.length >= 6) {
      alert("Maximum 6 gallery images allowed.");
      return;
    }
    setGalleryImages((prev) => [...prev, prodGalleryUrlInput.trim()].slice(0, 6));
    setProdGalleryUrlInput("");
  };

  // Edit / Cancel handlers
  const startEditing = (p: any) => {
    setEditingSlug(p.slug);
    setProdName(p.name);
    setProdBase(p.category);
    setProdPrice(p.price);
    setProdDesc(p.description);
    
    if (p.img && p.img.startsWith("data:")) {
      setProdImgBase64(p.img);
      setProdImgUrl("");
    } else {
      setProdImgBase64("");
      setProdImgUrl(p.img || "");
    }
    
    if (p.hoverImg && p.hoverImg.startsWith("data:")) {
      setProdHoverImgBase64(p.hoverImg);
      setProdHoverImgUrl("");
    } else {
      setProdHoverImgBase64("");
      setProdHoverImgUrl(p.hoverImg || "");
    }
    
    setGalleryImages(p.gallery || []);
    setProdGalleryUrlInput("");

    if (p.pricing && Object.keys(p.pricing).length > 0) {
      const active = Object.keys(p.pricing);
      setActiveSizes(active);
      
      const editBasePrice = p.pricing["50 ml"] !== undefined ? p.pricing["50 ml"] : p.price;
      
      const inputs: Record<string, string> = {};
      Object.entries(p.pricing).forEach(([size, price]) => {
        const stdPrice = getStandardPriceForSize(editBasePrice, size);
        if (price !== stdPrice) {
          inputs[size] = String(price);
        }
      });
      setSizePriceInputs(inputs);
    } else {
      setActiveSizes(["10 ml", "15 ml", "50 ml", "100 ml"]);
      setSizePriceInputs({});
    }
    
    setProdBadge(p.badge || "No Badge");
    
    const formElement = document.getElementById("perfume-form-container");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const cancelEditing = () => {
    setEditingSlug(null);
    setProdName("");
    setProdBase("Oud Base");
    setProdPrice(1999);
    setProdDesc("");
    setProdImgBase64("");
    setProdImgUrl("");
    setProdHoverImgBase64("");
    setProdHoverImgUrl("");
    setGalleryImages([]);
    setProdGalleryUrlInput("");
    setSizePriceInputs({});
    setProdBadge("No Badge");
    setActiveSizes(["10 ml", "15 ml", "50 ml", "100 ml"]);
  };

  // Auth checking
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAuth = sessionStorage.getItem("voguishmoments_control_panel_auth") === "true";
      if (isAuth) {
        setIsAuthenticated(true);
      }
    }
  }, []);

  // Synchronize sizePriceInputs with activeSizes
  useEffect(() => {
    setSizePriceInputs((prev) => {
      const next = { ...prev };
      let changed = false;
      Object.keys(next).forEach((size) => {
        if (!activeSizes.includes(size)) {
          delete next[size];
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [activeSizes]);

  // Load dashboard data once authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = () => {
    getOrdersDb()
      .then((loadedOrders) => {
        setOrders(loadedOrders);
        if (loadedOrders.length > 0 && !selectedOrder) {
          setSelectedOrder(loadedOrders[0]);
        } else if (selectedOrder) {
          const updated = loadedOrders.find((o: any) => o.id === selectedOrder.id);
          setSelectedOrder(updated || loadedOrders[0] || null);
        }
      })
      .catch((err) => console.error("Failed to load orders:", err));

    getProductsDb()
      .then((loadedProducts) => {
        setProducts(loadedProducts);
      })
      .catch((err) => console.error("Failed to load products:", err));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "5555") {
      setIsAuthenticated(true);
      setAuthError(false);
      sessionStorage.setItem("voguishmoments_control_panel_auth", "true");
    } else {
      setAuthError(true);
      setPasscode("");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("voguishmoments_control_panel_auth");
  };

  // Orders handlers
  const handleUpdateOrderStatus = (orderId: string, nextStatus: string) => {
    updateOrderStatusDb({ data: { id: orderId, status: nextStatus } })
      .then(() => {
        loadData();
      })
      .catch((err) => console.error("Failed to update status:", err));
  };

  const handleSendWhatsApp = (order: any) => {
    let phone = order.customerPhone.replace(/\D/g, "");
    if (phone.length === 10) {
      phone = "91" + phone;
    }
    const trackingLink = `${window.location.origin}/track/${order.id}`;
    const message = `Your payment was successful! 👍🏼
Thank you for trusting Voguish Moments with your order.

Please allow us a little time to verify your order on our end and prepare your perfume for dispatch. Once everything is confirmed, we'll update you shortly. 😊

Your order will be shipped through DTDC. Your tracking ID will be sent directly to you by our courier partner tonight. 📦

You can also track your order live here: ${trackingLink} 🔍

Thank you for choosing Voguish Moments. We truly appreciate your support and hope you love your fragrance! ❤️`;

    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${phone}?text=${encoded}`;
    window.open(url, "_blank");
  };

  const handleDeleteOrder = (orderId: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    deleteOrderDb({ data: { id: orderId } })
      .then(() => {
        loadData();
      })
      .catch((err) => console.error("Failed to delete order:", err));
  };

  // Products handlers
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim() || !prodDesc.trim()) return;

    const finalImg = prodImgBase64 || prodImgUrl;
    if (!finalImg) {
      alert("Please upload a main thumbnail image or enter a direct URL.");
      return;
    }

    const slug = prodName
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    let baseEnum: string = "OUD_BASE";
    if (prodBase === "Floral Base") baseEnum = "FLORAL_BASE";
    if (prodBase === "Fruity Base") baseEnum = "FRUITY_BASE";
    if (prodBase === "Fresh Base") baseEnum = "FRESH_BASE";

    const pricing: Record<string, number> = {};
    activeSizes.forEach((size) => {
      const customVal = sizePriceInputs[size];
      if (customVal && customVal.trim() !== "") {
        pricing[size] = Number(customVal);
      } else {
        pricing[size] = getStandardPriceForSize(prodPrice, size);
      }
    });

    let resolvedPrice = prodPrice;
    if (pricing["50 ml"] !== undefined) {
      resolvedPrice = pricing["50 ml"];
    } else if (activeSizes.length > 0) {
      resolvedPrice = pricing[activeSizes[0]];
    }

    const payload = {
      slug: editingSlug || slug,
      name: prodName.trim(),
      category: prodBase,
      price: resolvedPrice,
      img: finalImg,
      hoverImg: prodHoverImgBase64 || prodHoverImgUrl || undefined,
      gallery: galleryImages,
      hr: "12 HR",
      description: prodDesc.trim(),
      base: baseEnum,
      isCustom: true,
      pricing: Object.keys(pricing).length > 0 ? pricing : undefined,
      badge: prodBadge !== "No Badge" ? prodBadge : undefined,
      featuredOnHomepage: false,
    };

    createOrUpdateProductDb({ data: payload })
      .then(async () => {
        invalidateCache();
        setProductSuccess(`Successfully saved perfume "${prodName}"!`);
        cancelEditing();
        loadData();
        setTimeout(() => setProductSuccess(null), 3500);
      })
      .catch((err) => {
        console.error("Failed to save product:", err);
        alert("Failed to save product to database.");
      });
  };

  const handleDeleteProduct = (slug: string) => {
    if (!confirm("Are you sure you want to delete this custom perfume or revert its changes?")) return;
    deleteProductDb({ data: { slug } })
      .then(() => {
        invalidateCache();
        if (editingSlug === slug) {
          cancelEditing();
        }
        loadData();
      })
      .catch((err) => {
        console.error("Failed to delete product:", err);
        alert("Failed to delete product.");
      });
  };

  // Lock screen view
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20 px-6 bg-[#FAF9F5] text-foreground">
        <div className="w-full max-w-md bg-white border border-[#EAE8E2] rounded-3xl p-8 shadow-sm text-center animate-fade-up">
          <div className="w-12 h-12 rounded-full bg-[#1c1917]/5 border border-[#1c1917]/20 flex items-center justify-center mx-auto mb-6 text-[#1c1917]">
            <Lock className="w-5 h-5" />
          </div>
          <h1 className="font-display text-3xl mb-1 text-foreground">Management Console</h1>
          <p className="text-xs text-muted-foreground tracking-widest uppercase mb-8">Access Locked</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] tracking-wider text-muted-foreground font-bold uppercase mb-2">
                Enter Console Passcode
              </label>
              <input
                type="password"
                required
                autoFocus
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="••••"
                className="w-full bg-[#FAF9F5] border border-border rounded-xl px-4 py-3.5 text-center text-lg font-bold tracking-widest outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            
            {authError && (
              <p className="text-xs font-semibold text-red-600 animate-pulse">
                Incorrect passcode. Please try again.
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-[#1c1917] hover:bg-foreground/90 text-white rounded-full py-3.5 text-xs font-bold tracking-widest uppercase transition-all shadow-md shadow-stone-900/10 cursor-pointer"
            >
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    const q = orderSearchQuery.toLowerCase().trim();
    if (!q) return true;
    return o.id.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q) || o.customerEmail?.toLowerCase().includes(q);
  });

  // Calculate order stats
  const stats = {
    total: orders.length,
    waiting: orders.filter((o) => o.status === "WAITING").length,
    shipped: orders.filter((o) => o.status === "SHIPPED").length,
    delivered: orders.filter((o) => o.status === "DELIVERED").length,
    revenue: orders.reduce((sum, o) => sum + (o.total || 0), 0),
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <div className="flex-1 flex flex-col md:flex-row min-h-screen">
        
        {/* Dashboard Sidebar Navigation */}
        <aside className="w-full md:w-64 bg-cream/45 border-b md:border-b-0 md:border-r border-[#EAE8E2] p-4 md:p-6 flex flex-col md:justify-between justify-start shrink-0 sticky top-0 z-30 backdrop-blur-md">
          <div className="flex flex-col gap-4 md:space-y-8 w-full">
            <div className="flex justify-between items-center w-full md:block">
              <div>
                <div className="font-display text-lg md:text-xl text-[#1c1917]">Voguish Moments</div>
                <div className="text-[8px] md:text-[9px] tracking-widest text-muted-foreground font-bold uppercase mt-0.5">
                  Management Console
                </div>
                <Link to="/" className="text-[9px] md:text-[10px] text-accent hover:underline mt-1.5 md:mt-2.5 block font-semibold uppercase tracking-wider">
                  ← Storefront
                </Link>
              </div>
              <button
                onClick={handleLogout}
                className="md:hidden bg-white border border-border text-muted-foreground hover:text-foreground rounded-xl px-3 py-1.5 text-[9px] font-bold tracking-widest uppercase transition-all cursor-pointer"
              >
                Sign Out
              </button>
            </div>

            <nav className="flex flex-row md:flex-col gap-2 md:space-y-1.5 md:w-full overflow-x-auto no-scrollbar py-1 md:py-0">
              <button
                onClick={() => setActiveTab("orders")}
                className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-xl text-[10px] md:text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer shrink-0 ${
                  activeTab === "orders"
                    ? "bg-[#1c1917] text-white shadow-md shadow-stone-900/10"
                    : "text-muted-foreground hover:bg-[#FAF9F5] hover:text-foreground bg-white/50 border border-border/40 md:border-none"
                }`}
              >
                <ClipboardList className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span>Orders</span>
                {stats.waiting > 0 && (
                  <span className="bg-accent text-white text-[8px] md:text-[9px] px-1.5 py-0.5 rounded-full ml-1">
                    {stats.waiting}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab("products")}
                className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-xl text-[10px] md:text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer shrink-0 ${
                  activeTab === "products"
                    ? "bg-[#1c1917] text-white shadow-md shadow-stone-900/10"
                    : "text-muted-foreground hover:bg-[#FAF9F5] hover:text-foreground bg-white/50 border border-border/40 md:border-none"
                }`}
              >
                <Package className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span>Products</span>
              </button>
            </nav>
          </div>

          <div className="pt-6 border-t border-[#EAE8E2] mt-6 md:mt-0 hidden md:block w-full">
            <button
              onClick={handleLogout}
              className="w-full bg-white hover:bg-[#FAF9F5] border border-border text-muted-foreground hover:text-foreground rounded-xl py-2.5 text-[10px] font-bold tracking-widest uppercase transition-all cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </aside>

        {/* Dashboard Content Panel */}
        <main className="flex-1 p-4 md:p-6 lg:p-10 bg-[#FAF9F5]/30">
          
          {/* TAB 1: ORDERS OVERVIEW */}
          {activeTab === "orders" && (
            <div className="space-y-8 animate-fade-up">
              <div>
                <h2 className="font-display text-3xl text-foreground">Studio Overview</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Manage your active perfume orders and status.</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white border border-[#EAE8E2] rounded-2xl p-4 shadow-sm">
                  <div className="text-[9px] tracking-wider text-muted-foreground font-bold uppercase">Total</div>
                  <div className="text-3xl font-display mt-1.5">{stats.total}</div>
                </div>
                <div className="bg-white border border-[#EAE8E2] rounded-2xl p-4 shadow-sm">
                  <div className="text-[9px] tracking-wider text-[#A28F79] font-bold uppercase">Waiting</div>
                  <div className="text-3xl font-display text-accent mt-1.5">{stats.waiting}</div>
                </div>
                <div className="bg-white border border-[#EAE8E2] rounded-2xl p-4 shadow-sm">
                  <div className="text-[9px] tracking-wider text-blue-600 font-bold uppercase">Shipped</div>
                  <div className="text-3xl font-display text-blue-600 mt-1.5">{stats.shipped}</div>
                </div>
                <div className="bg-white border border-[#EAE8E2] rounded-2xl p-4 shadow-sm">
                  <div className="text-[9px] tracking-wider text-emerald-600 font-bold uppercase">Delivered</div>
                  <div className="text-3xl font-display text-emerald-600 mt-1.5">{stats.delivered}</div>
                </div>
                <div className="bg-white border border-[#EAE8E2] rounded-2xl p-4 shadow-sm col-span-2 md:col-span-1">
                  <div className="text-[9px] tracking-wider text-[#000000] font-bold uppercase">Revenue</div>
                  <div className="text-2xl font-display text-[#000000] mt-1.5 font-bold">₹{stats.revenue.toLocaleString("en-IN")}</div>
                </div>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-20 bg-white border border-[#EAE8E2] rounded-3xl">
                  <ClipboardList className="w-10 h-10 text-muted-foreground/35 mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">No orders placed yet.</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">Simulate purchases in the cart page to populate orders list.</p>
                </div>
              ) : (
                <div className="grid lg:grid-cols-[1fr_400px] gap-8">
                  {/* Left Column: Search & Orders list */}
                  <div className={`bg-white border border-[#EAE8E2] rounded-3xl p-6 shadow-sm flex flex-col ${selectedOrder ? "hidden lg:flex" : "flex"}`}>
                    <div className="flex items-center bg-[#FAF9F5] border border-border rounded-xl px-4 py-2.5 mb-6">
                      <Search className="w-4 h-4 text-muted-foreground mr-3" />
                      <input
                        value={orderSearchQuery}
                        onChange={(e) => setOrderSearchQuery(e.target.value)}
                        placeholder="Search orders by name or ID..."
                        className="bg-transparent text-xs outline-none flex-1"
                      />
                    </div>

                    <div className="text-[10px] tracking-wider text-muted-foreground font-bold uppercase mb-4 px-2">
                      Active Orders ({filteredOrders.length})
                    </div>

                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                      {filteredOrders.map((o) => (
                        <button
                          key={o.id}
                          onClick={() => setSelectedOrder(o)}
                          className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                            selectedOrder?.id === o.id
                              ? "bg-[#FAF9F5] border-accent"
                              : "border-border/70 hover:border-foreground/20"
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="text-[10px] text-muted-foreground font-mono">{o.id}</div>
                            <div className="text-xs font-semibold text-foreground">{o.customerName}</div>
                            <div className="text-[10px] text-muted-foreground">
                              {o.items.length} item{o.items.length === 1 ? "" : "s"} · ₹{o.total.toLocaleString("en-IN")}
                            </div>
                          </div>
                          
                          <span className={`text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md border ${
                            o.status === "WAITING" 
                              ? "bg-amber-50 text-amber-700 border-amber-200" 
                              : o.status === "SHIPPED"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200"
                          }`}>
                            {o.status}
                          </span>
                        </button>
                      ))}

                      {filteredOrders.length === 0 && (
                        <div className="text-center py-10 text-xs text-muted-foreground">
                          No orders match your search query.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Order Details Panel */}
                  <div className={`bg-white border border-[#EAE8E2] rounded-3xl p-6 shadow-sm h-fit ${selectedOrder ? "block" : "hidden lg:block"}`}>
                    {selectedOrder ? (
                      <div className="space-y-6">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(null)}
                          className="lg:hidden flex items-center gap-1 text-[10px] text-accent hover:underline mb-2 font-semibold uppercase tracking-wider cursor-pointer"
                        >
                          ← Back to Orders List
                        </button>
                        <div className="flex items-center justify-between pb-4 border-b border-border">
                          <div>
                            <div className="text-[10px] font-mono text-muted-foreground">{selectedOrder.id}</div>
                            <h3 className="font-display text-lg mt-0.5">Order Details</h3>
                          </div>
                          <button
                            onClick={() => handleDeleteOrder(selectedOrder.id)}
                            className="p-2 text-muted-foreground hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                            title="Delete Order"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Customer Info */}
                        <div className="space-y-2.5 text-xs border-b border-border pb-4">
                          <div className="flex items-center gap-2.5">
                            <User className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="font-medium text-foreground">{selectedOrder.customerName}</span>
                          </div>
                          {selectedOrder.customerPhone && (
                            <div className="flex items-center gap-2.5">
                              <span className="w-3.5 h-3.5 text-muted-foreground font-semibold flex items-center justify-center text-[10px]">📞</span>
                              <span className="text-muted-foreground font-semibold">{selectedOrder.customerPhone}</span>
                            </div>
                          )}
                          {selectedOrder.customerEmail && (
                            <div className="flex items-center gap-2.5">
                              <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                              <span className="text-muted-foreground">{selectedOrder.customerEmail}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2.5">
                            <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="text-muted-foreground">{selectedOrder.date}</span>
                          </div>
                          {selectedOrder.paymentId && (
                            <div className="flex items-center gap-2.5">
                              <span className="w-3.5 h-3.5 text-muted-foreground font-semibold flex items-center justify-center text-[9px] border rounded border-muted-foreground/30 px-0.5">PAY</span>
                              <span className="text-muted-foreground font-mono text-[11px] font-semibold">{selectedOrder.paymentId}</span>
                            </div>
                          )}
                        </div>

                        {/* Delivery Address */}
                        {selectedOrder.deliveryAddress && (
                          <div className="space-y-2 text-xs border-b border-border pb-4">
                            <div className="flex justify-between items-center">
                              <div className="text-[9px] tracking-wider text-muted-foreground font-bold uppercase">Delivery Address</div>
                              <button
                                type="button"
                                onClick={() => handleCopyAddress(selectedOrder)}
                                className="text-[10px] font-bold text-accent hover:text-accent/80 transition-colors uppercase tracking-wider cursor-pointer bg-cream border border-border/80 rounded-lg px-2.5 py-1"
                              >
                                {copiedAddressId === selectedOrder.id ? "✓ Copied" : "Copy Address"}
                              </button>
                            </div>
                            <div className="text-muted-foreground leading-relaxed bg-[#FAF9F5]/65 border border-border/70 rounded-2xl p-4 space-y-1.5">
                              <div className="border-b border-border/60 pb-2 mb-2">
                                <div className="font-bold text-foreground text-sm">{selectedOrder.customerName}</div>
                                <div className="font-mono font-bold text-foreground text-[11px] mt-0.5">{selectedOrder.customerPhone}</div>
                              </div>
                              <div className="font-semibold text-foreground">{selectedOrder.deliveryAddress.house}</div>
                              <div>{selectedOrder.deliveryAddress.area}</div>
                              {selectedOrder.deliveryAddress.landmark && (
                                <div className="text-[11px] italic text-muted-foreground mt-0.5">Landmark: {selectedOrder.deliveryAddress.landmark}</div>
                              )}
                              <div className="mt-1.5 font-medium text-foreground">
                                {selectedOrder.deliveryAddress.district}, {selectedOrder.deliveryAddress.state} - <span className="font-mono font-bold">{selectedOrder.deliveryAddress.pin}</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Order Items */}
                        <div className="space-y-3">
                          <div className="text-[9px] tracking-wider text-muted-foreground font-bold uppercase">Items Purchased</div>
                          <div className="space-y-2 border-y border-border/60 py-3">
                            {selectedOrder.items.map((item: any, idx: number) => (
                              <div key={idx} className="flex justify-between text-xs">
                                <div>
                                  <span className="font-semibold text-foreground">{item.name}</span>
                                  <span className="text-[10px] bg-cream border border-border px-1.5 py-0.5 rounded ml-2 uppercase text-muted-foreground">{item.size}</span>
                                </div>
                                <span className="text-muted-foreground">x{item.qty} · ₹{(item.price * item.qty).toLocaleString("en-IN")}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Totals */}
                        <div className="space-y-1.5 text-xs">
                          <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-medium">₹{selectedOrder.subtotal.toLocaleString("en-IN")}</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="font-medium">₹{selectedOrder.shipping.toLocaleString("en-IN")}</span></div>
                          <div className="flex justify-between font-bold text-sm pt-1.5 border-t border-dashed border-border"><span className="text-foreground">Total</span><span className="text-foreground">₹{selectedOrder.total.toLocaleString("en-IN")}</span></div>
                        </div>

                        {/* Status Manager */}
                        <div className="pt-4 border-t border-border space-y-2">
                          <label className="block text-[9px] tracking-wider text-muted-foreground font-bold uppercase">
                            Update Order Status
                          </label>
                          <select
                            value={selectedOrder.status}
                            onChange={(e) => handleUpdateOrderStatus(selectedOrder.id, e.target.value)}
                            className="w-full bg-[#FAF9F5] border border-border rounded-xl px-4 py-3 text-xs font-semibold outline-none focus:ring-1 focus:ring-accent"
                          >
                            <option value="WAITING">WAITING</option>
                            <option value="SHIPPED">SHIPPED</option>
                            <option value="DELIVERED">DELIVERED</option>
                          </select>
                          
                          <button
                            type="button"
                            onClick={() => handleSendWhatsApp(selectedOrder)}
                            className="w-full mt-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-3 px-4 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-[0.98]"
                          >
                            <span className="text-sm">💬</span> Send WhatsApp Confirmation
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-10 text-xs text-muted-foreground">
                        Select an order from the list to view its details.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PRODUCTS MANAGER */}
          {activeTab === "products" && (
            <div className="space-y-8 animate-fade-up">
              <div>
                <h2 className="font-display text-3xl text-foreground">Products Library</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Manage and add dynamic perfume collections.</p>
              </div>

              {productSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium px-4 py-3.5 rounded-xl flex items-center gap-2.5">
                  <div className="w-4.5 h-4.5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[2.5]" />
                  </div>
                  <span>{productSuccess}</span>
                </div>
              )}

              <div className="grid lg:grid-cols-[1fr_400px] gap-8">
                
                {/* Left Column: Products Listing */}
                <div className="bg-white border border-[#EAE8E2] rounded-3xl p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-4 px-2">
                    <div className="text-[10px] tracking-wider text-muted-foreground font-bold uppercase">
                      Current Catalog ({products.length} Products)
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        cancelEditing();
                        const formElement = document.getElementById("perfume-form-container");
                        if (formElement) {
                          formElement.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                      className="lg:hidden px-3 py-1.5 border border-[#1c1917]/20 hover:border-foreground text-[9px] font-bold tracking-widest text-[#1c1917] rounded-full uppercase transition-all cursor-pointer"
                    >
                      + Add Perfume
                    </button>
                  </div>

                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                    {products.map((p) => (
                      <div key={p.slug} className="flex items-center gap-4 p-3 border border-border/70 rounded-2xl">
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-cream shrink-0 bg-[#FAF9F5]">
                          <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        
                        <div className="flex-1 space-y-0.5">
                          <div className="text-xs font-semibold text-foreground flex items-center gap-1.5 flex-wrap">
                            <span>{p.name}</span>
                          </div>
                          <div className="text-[10px] text-muted-foreground">{p.category}</div>
                          <div className="text-[10px] font-medium text-foreground">₹{p.price.toLocaleString("en-IN")}</div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => startEditing(p)}
                            className="p-2 text-muted-foreground hover:text-accent rounded-lg hover:bg-accent/5 transition-colors cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          {p.isCustom ? (
                            <button
                              onClick={() => handleDeleteProduct(p.slug)}
                              className="p-2 text-muted-foreground hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          ) : (
                            <span className="text-[8px] bg-cream/70 border border-border text-muted-foreground font-medium px-2 py-0.5 rounded uppercase tracking-wider">
                              Static
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Column: Product Form */}
                <div id="perfume-form-container" className="bg-white border border-[#EAE8E2] rounded-3xl p-6 shadow-sm h-fit">
                  <h3 className="font-display text-lg mb-1">
                    {editingSlug ? `Edit Perfume` : "Add Dynamic Perfume"}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-6">
                    {editingSlug ? `Modifying "${prodName}" configurations.` : "Create a new product that will populate listings instantly."}
                  </p>

                  <form onSubmit={handleAddProduct} className="space-y-4">
                    <div>
                      <label className="block text-[9px] tracking-wider text-muted-foreground font-bold uppercase mb-1.5">
                        Perfume Name
                      </label>
                      <input
                        type="text"
                        required
                        disabled={!!editingSlug} // disable name/slug changes in edit mode
                        value={prodName}
                        onChange={(e) => setProdName(e.target.value)}
                        placeholder="e.g. Amber Breeze"
                        className="w-full bg-[#FAF9F5] disabled:opacity-60 border border-border rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-1 focus:ring-accent"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] tracking-wider text-muted-foreground font-bold uppercase mb-1.5">
                          Price (₹, 50ml Base)
                        </label>
                        <input
                          type="number"
                          required
                          min={1}
                          value={prodPrice}
                          onChange={(e) => setProdPrice(Number(e.target.value))}
                          placeholder="e.g. 1999"
                          className="w-full bg-[#FAF9F5] border border-border rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-1 focus:ring-accent font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] tracking-wider text-muted-foreground font-bold uppercase mb-1.5">
                          Base Category
                        </label>
                        <select
                          value={prodBase}
                          onChange={(e) => setProdBase(e.target.value as any)}
                          className="w-full bg-[#FAF9F5] border border-border rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-1 focus:ring-accent font-semibold"
                        >
                          <option value="Oud Base">Oud Base</option>
                          <option value="Floral Base">Floral Base</option>
                          <option value="Fruity Base">Fruity Base</option>
                          <option value="Fresh Base">Fresh Base</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] tracking-wider text-muted-foreground font-bold uppercase mb-1.5">
                        Description
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={prodDesc}
                        onChange={(e) => setProdDesc(e.target.value)}
                        placeholder="Zesty orange and sweet amber notes combined..."
                        className="w-full bg-[#FAF9F5] border border-border rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-1 focus:ring-accent resize-none leading-relaxed"
                      />
                    </div>

                    {/* AVAILABLE SIZES */}
                    <div className="pt-4 border-t border-[#EAE8E2] space-y-4">
                      <div>
                        <label className="block text-[9px] tracking-wider text-muted-foreground font-bold uppercase mb-2">
                          Available Sizes
                        </label>
                        <div className="flex gap-2 flex-wrap">
                          {(["10 ml", "15 ml", "50 ml", "100 ml"] as const).map((sizeOption) => {
                            const isActive = activeSizes.includes(sizeOption);
                            return (
                              <button
                                key={sizeOption}
                                type="button"
                                onClick={() => {
                                  if (isActive) {
                                    if (activeSizes.length > 1) {
                                      const nextActive = activeSizes.filter((s) => s !== sizeOption);
                                      setActiveSizes(nextActive);
                                    } else {
                                      alert("At least one size must be selected.");
                                    }
                                  } else {
                                    const allSizesOrder = ["10 ml", "15 ml", "50 ml", "100 ml"];
                                    const nextActive = [...activeSizes, sizeOption].sort(
                                      (a, b) => allSizesOrder.indexOf(a) - allSizesOrder.indexOf(b)
                                    );
                                    setActiveSizes(nextActive);
                                  }
                                }}
                                className={`px-5 py-2.5 rounded-full border text-[11px] font-semibold tracking-wider transition-all cursor-pointer ${
                                  isActive
                                    ? "bg-[#FAF9F5] text-accent border-accent shadow-sm"
                                    : "bg-[#FAF9F5] border-border/70 text-muted-foreground hover:border-foreground/20"
                                }`}
                              >
                                {sizeOption}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* SIZE PRICES */}
                      <div className="space-y-3 pt-2">
                        <label className="block text-[9px] tracking-wider text-muted-foreground font-bold uppercase">
                          Size Prices (₹)
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          {activeSizes.map((size) => {
                            const val = sizePriceInputs[size] ?? "";
                            const placeholderVal = getStandardPriceForSize(prodPrice, size);
                            
                            return (
                              <div key={size} className="flex flex-col gap-1 bg-[#FAF9F5]/40 border border-border/70 rounded-2xl p-3">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase">{size} Price</span>
                                <div className="relative mt-1">
                                  <span className="absolute left-3.5 top-3 text-xs text-muted-foreground font-semibold">₹</span>
                                  <input
                                    type="number"
                                    min={1}
                                    value={val}
                                    placeholder={String(placeholderVal)}
                                    onChange={(e) => {
                                      setSizePriceInputs({
                                        ...sizePriceInputs,
                                        [size]: e.target.value,
                                      });
                                    }}
                                    className="w-full bg-white border border-border rounded-xl pl-7 pr-4 py-2.5 text-xs font-semibold outline-none focus:ring-1 focus:ring-accent"
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* PRODUCT IMAGES & MEDIA */}
                    <div className="pt-4 border-t border-[#EAE8E2] space-y-6">
                      <div>
                        <h4 className="text-[10px] tracking-widest text-[#A28F79] font-bold uppercase mb-1 flex items-center gap-2">
                          📷 Product Images & Media
                        </h4>
                      </div>

                      <div className="space-y-4">
                        {/* MAIN THUMBNAIL */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-baseline">
                            <span className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground">Main Thumbnail</span>
                            <span className="text-[8px] text-muted-foreground italic">Upload file or paste URL</span>
                          </div>
                          
                          <label className="flex flex-col items-center justify-center border border-dashed border-[#EAE8E2] rounded-2xl p-5 bg-[#FAF9F5]/40 hover:bg-[#FAF9F5]/80 hover:border-accent/40 transition-all cursor-pointer relative">
                            <div className="flex flex-col items-center gap-1 text-center">
                              <Upload className="w-4 h-4 text-accent/60 mb-0.5" />
                              <span className="text-[10px] font-semibold uppercase">UPLOAD MAIN THUMBNAIL</span>
                              <span className="text-[8px] text-muted-foreground">PNG, JPG, WebP up to 2MB</span>
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleMainImgChange}
                              className="hidden"
                            />
                          </label>

                          <input
                            type="text"
                            value={prodImgUrl}
                            onChange={(e) => setProdImgUrl(e.target.value)}
                            placeholder="Or paste Direct Image URL..."
                            className="w-full bg-[#FAF9F5] border border-border rounded-xl px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-accent"
                          />

                          {prodImgBase64 && (
                            <div className="flex items-center gap-2 p-2 bg-[#FAF9F5]/70 border border-border rounded-xl">
                              <div className="w-10 h-10 rounded-lg overflow-hidden bg-cream shrink-0">
                                <img src={prodImgBase64} alt="Main Preview" className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-[8px] font-bold text-emerald-600 uppercase">Thumbnail loaded</div>
                              </div>
                              <button
                                type="button"
                                onClick={() => setProdImgBase64("")}
                                className="p-1 text-muted-foreground hover:text-red-600 rounded-lg"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* HOVER IMAGE */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-baseline">
                            <span className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground">Hover Image (Optional)</span>
                            <span className="text-[8px] text-muted-foreground italic">Upload file or paste URL</span>
                          </div>
                          
                          <label className="flex flex-col items-center justify-center border border-dashed border-[#EAE8E2] rounded-2xl p-5 bg-[#FAF9F5]/40 hover:bg-[#FAF9F5]/80 hover:border-accent/40 transition-all cursor-pointer relative">
                            <div className="flex flex-col items-center gap-1 text-center">
                              <Upload className="w-4 h-4 text-accent/60 mb-0.5" />
                              <span className="text-[10px] font-semibold uppercase">UPLOAD HOVER IMAGE</span>
                              <span className="text-[8px] text-muted-foreground">PNG, JPG, WebP up to 2MB</span>
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleHoverImgChange}
                              className="hidden"
                            />
                          </label>

                          <input
                            type="text"
                            value={prodHoverImgUrl}
                            onChange={(e) => setProdHoverImgUrl(e.target.value)}
                            placeholder="Or paste Direct Hover Image URL..."
                            className="w-full bg-[#FAF9F5] border border-border rounded-xl px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-accent"
                          />

                          {prodHoverImgBase64 && (
                            <div className="flex items-center gap-2 p-2 bg-[#FAF9F5]/70 border border-border rounded-xl">
                              <div className="w-10 h-10 rounded-lg overflow-hidden bg-cream shrink-0">
                                <img src={prodHoverImgBase64} alt="Hover Preview" className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-[8px] font-bold text-emerald-600 uppercase">Hover image loaded</div>
                              </div>
                              <button
                                type="button"
                                onClick={() => setProdHoverImgBase64("")}
                                className="p-1 text-muted-foreground hover:text-red-600 rounded-lg"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* GALLERY IMAGES */}
                        <div className="space-y-2 pt-1">
                          <div className="flex justify-between items-baseline">
                            <span className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground">Gallery Images ({galleryImages.length}/6)</span>
                            <span className="text-[8px] text-muted-foreground italic">Upload or paste URLs</span>
                          </div>

                          <div className="grid grid-cols-1 gap-2">
                            <label className="flex flex-col items-center justify-center border border-dashed border-[#EAE8E2] rounded-2xl p-5 bg-[#FAF9F5]/40 hover:bg-[#FAF9F5]/80 hover:border-accent/40 transition-all cursor-pointer relative">
                              <div className="flex flex-col items-center gap-1 text-center">
                                <Upload className="w-4 h-4 text-accent/60 mb-0.5" />
                                <span className="text-[10px] font-semibold uppercase">UPLOAD GALLERY IMAGES</span>
                                <span className="text-[8px] text-muted-foreground">Select one or multiple images</span>
                              </div>
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleGalleryUpload}
                                className="hidden"
                              />
                            </label>

                            <div className="flex gap-2 items-center">
                              <input
                                type="text"
                                value={prodGalleryUrlInput}
                                onChange={(e) => setProdGalleryUrlInput(e.target.value)}
                                placeholder="Or paste Direct Gallery Image URL..."
                                className="flex-1 bg-[#FAF9F5] border border-border rounded-xl px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-accent"
                              />
                              <button
                                type="button"
                                onClick={handleAddGalleryUrl}
                                className="bg-[#A28F79] hover:bg-[#A28F79]/90 text-white rounded-xl px-4 py-2 text-xs font-bold uppercase transition-all cursor-pointer whitespace-nowrap shadow-sm"
                              >
                                Add
                              </button>
                            </div>
                          </div>

                          {galleryImages.length > 0 && (
                            <div className="grid grid-cols-4 gap-2 p-2 bg-[#FAF9F5]/40 border border-border rounded-2xl">
                              {galleryImages.map((imgUrl, i) => (
                                <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-cream group border border-border">
                                  <img src={imgUrl} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                                  <button
                                    type="button"
                                    onClick={() => setGalleryImages(galleryImages.filter((_, idx) => idx !== i))}
                                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white cursor-pointer"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>



                    {/* DISPLAY SETTINGS */}
                    <div className="pt-4 border-t border-[#EAE8E2] space-y-5">
                      <div>
                        <h4 className="text-[10px] tracking-widest text-[#A28F79] font-bold uppercase flex items-center gap-1.5">
                          # Display Settings
                        </h4>
                      </div>

                      {/* PRODUCT BADGE */}
                      <div className="space-y-2">
                        <label className="block text-[9px] tracking-wider text-muted-foreground font-bold uppercase">
                          Product Badge
                        </label>
                        <div className="flex gap-2 flex-wrap">
                          {(["No Badge", "Bestseller", "Only 2 Left"] as const).map((badgeOption) => (
                            <button
                              key={badgeOption}
                              type="button"
                              onClick={() => setProdBadge(badgeOption)}
                              className={`px-4 py-2 rounded-full border text-[11px] font-semibold tracking-wider transition-all cursor-pointer ${
                                prodBadge === badgeOption
                                  ? "bg-[#FAF9F5] text-accent border-accent shadow-sm"
                                  : "bg-[#FAF9F5] border-border/70 text-muted-foreground hover:border-foreground/20"
                              }`}
                            >
                              {badgeOption}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* END DISPLAY SETTINGS */}
                    </div>

                    <div className="flex flex-col gap-2 pt-2">
                      <button
                        type="submit"
                        className="w-full bg-[#1c1917] hover:bg-foreground/90 text-white rounded-full py-3.5 font-semibold text-xs tracking-widest uppercase cursor-pointer shadow-md shadow-stone-900/10"
                      >
                        {editingSlug ? "Save Changes" : "Add Perfume to Store"}
                      </button>
                      {editingSlug && (
                        <button
                          type="button"
                          onClick={cancelEditing}
                          className="w-full bg-white border border-border hover:bg-[#FAF9F5] text-muted-foreground hover:text-foreground rounded-full py-3.5 font-semibold text-xs tracking-widest uppercase cursor-pointer"
                        >
                          Cancel Edit
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}



        </main>
      </div>
    </div>
  );
}
