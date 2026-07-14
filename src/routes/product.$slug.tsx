import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Minus, Plus, ShoppingBag, Check } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { ProductCard } from "@/components/ProductCard";
import { PRODUCTS } from "@/data/catalog";
import { getProductsSync, getProducts } from "@/lib/productService";
import { useCart, getPriceForSize } from "@/lib/cart";
import { trackPixelEvent } from "../lib/metaPixel";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    return { slug: params.slug };
  },
  head: ({ loaderData }) => {
    const all = getProductsSync();
    const product = all.find((p) => p.slug === loaderData?.slug);
    return {
      meta: [
        { title: `${product?.name ?? "Product"} — Voguish Moments` },
        { name: "description", content: product?.description ?? "" },
      ],
    };
  },
  component: ProductPage,
  errorComponent: ({ error }) => (
    <SiteLayout><div className="p-12 text-center">{error.message}</div></SiteLayout>
  ),
  notFoundComponent: () => {
    const { slug } = Route.useParams();
    return <SiteLayout><div className="p-12 text-center">Product "{slug}" not found.</div></SiteLayout>;
  },
});

function ProductPage() {
  const { slug } = Route.useLoaderData();
  const [allProducts, setAllProducts] = useState<any[]>(PRODUCTS);
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>("50 ml");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeMainImage, setActiveMainImage] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [fadeOpacity, setFadeOpacity] = useState<number>(1);
  const { add } = useCart();
  const router = useRouter();

  const changeImageWithFade = (newUrl: string) => {
    setFadeOpacity(0);
    setTimeout(() => {
      setActiveMainImage(newUrl);
      setFadeOpacity(1);
    }, 100);
  };

  useEffect(() => {
    let active = true;
    getProducts().then((data) => {
      if (active) setAllProducts(data);
    });
    return () => {
      active = false;
    };
  }, [slug]);

  const product = allProducts.find((p) => p.slug === slug);

  useEffect(() => {
    if (product) {
      let targetImg = product.img;
      if ((selectedSize === "10 ml" || selectedSize === "15 ml") && product.gallery && product.gallery.length > 0) {
        targetImg = product.gallery[0];
      }
      // Apply fade transition on initial load or size swap
      setFadeOpacity(0);
      setTimeout(() => {
        setActiveMainImage(targetImg);
        setFadeOpacity(1);
      }, 100);
      setIsExpanded(false);
    }
  }, [product, selectedSize]);

  useEffect(() => {
    if (product) {
      trackPixelEvent("ViewContent", {
        content_name: product.name,
        content_ids: [product.slug],
        content_type: "product",
        value: getPriceForSize(product, selectedSize),
        currency: "INR",
      });
    }
  }, [product, selectedSize]);

  if (!product) {
    return (
      <SiteLayout>
        <div className="max-w-[1300px] mx-auto px-6 lg:px-12 py-32 text-center text-muted-foreground animate-pulse">
          Loading product details...
        </div>
      </SiteLayout>
    );
  }

  // Show ONLY other perfumes from the same fragrance base
  const related = allProducts.filter((p) => p.base === product.base && p.slug !== product.slug);

  const sizeOptions = product.pricing && Object.keys(product.pricing).length > 0
    ? Object.keys(product.pricing)
    : ["10 ml", "15 ml", "50 ml", "100 ml"];

  useEffect(() => {
    if (product) {
      const options = product.pricing && Object.keys(product.pricing).length > 0
        ? Object.keys(product.pricing)
        : ["10 ml", "15 ml", "50 ml", "100 ml"];
      if (!options.includes(selectedSize)) {
        if (options.includes("50 ml")) {
          setSelectedSize("50 ml");
        } else {
          setSelectedSize(options[0]);
        }
      }
    }
  }, [product, allProducts]);

  const currentPrice = getPriceForSize(product, selectedSize);
  const allImages = product.base === "ROLL_ON_PREMIUM" && product.gallery && product.gallery.length > 0
    ? [product.gallery[0], product.img, ...product.gallery.slice(1)]
    : ([product.img, ...(product.gallery || [])] as string[]);

  return (
    <SiteLayout>
      <div className="max-w-[1300px] mx-auto px-6 lg:px-12 pt-6 lg:pt-10 pb-12">
        <nav className="text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-accent">Home</Link> / <Link to="/shop" className="hover:text-accent">Shop</Link> / <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
          {/* Mobile Gallery (Original simple grid layout, no swiping/modal) */}
          <div className="block md:hidden w-full">
            <div className={`aspect-square rounded-none overflow-hidden bg-white mb-4 ${
              selectedSize === "10 ml" || selectedSize === "15 ml" ? "p-2" : ""
            }`}>
              <img 
                src={activeMainImage || product.img} 
                alt={product.name} 
                width={1024} 
                height={1024} 
                className={`w-full h-full ${
                  selectedSize === "10 ml" || selectedSize === "15 ml" ? "object-contain" : "object-cover"
                }`} 
              />
            </div>
            <div className="grid grid-cols-4 gap-3">
              {allImages.map((imgUrl, i) => {
                const isGalleryImg = i > 0;
                return (
                  <div 
                    key={i} 
                    onClick={() => setActiveMainImage(imgUrl)}
                    className={`aspect-square rounded-none overflow-hidden bg-white border transition-all cursor-pointer ${
                      isGalleryImg ? "p-2" : ""
                    } ${
                      activeMainImage === imgUrl ? "border-accent ring-1 ring-accent" : "border-border hover:border-foreground/30"
                    }`}
                  >
                    <img 
                      src={imgUrl} 
                      alt="" 
                      loading="lazy" 
                      className={`w-full h-full ${
                        isGalleryImg ? "object-contain" : "object-cover"
                      }`} 
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Desktop Gallery (Side vertical thumbnails list + active main image with zoom & lightbox) */}
          <div className="hidden md:flex md:flex-row gap-4 items-start w-full">
            {/* Gallery Thumbnails List */}
            <div className="flex flex-col w-20 max-h-[500px] shrink-0 scrollbar-none gap-3">
              {allImages.map((imgUrl, i) => {
                const isGalleryImg = i > 0;
                return (
                  <div 
                    key={i} 
                    onClick={() => changeImageWithFade(imgUrl)}
                    className={`relative w-20 h-20 rounded-none overflow-hidden bg-white border transition-all cursor-pointer shrink-0 ${
                      isGalleryImg ? "p-2" : ""
                    } ${
                      activeMainImage === imgUrl ? "border-accent ring-1 ring-accent" : "border-border hover:border-foreground/30"
                    }`}
                  >
                    <img 
                      src={imgUrl} 
                      alt="" 
                      loading="lazy" 
                      className={`w-full h-full ${
                        isGalleryImg ? "object-contain" : "object-cover"
                      }`} 
                    />
                  </div>
                );
              })}
            </div>

            {/* Active Main Image Display */}
            <div 
              onClick={() => {
                const currentIdx = allImages.indexOf(activeMainImage || product.img);
                setLightboxIndex(currentIdx >= 0 ? currentIdx : 0);
                setIsLightboxOpen(true);
              }}
              className={`flex-1 aspect-square rounded-none overflow-hidden bg-white cursor-zoom-in relative select-none ${
                selectedSize === "10 ml" || selectedSize === "15 ml" ? "p-2" : ""
              }`}
            >
              <img 
                src={activeMainImage || product.img} 
                alt={product.name} 
                width={1024} 
                height={1024} 
                style={{ opacity: fadeOpacity }}
                className={`w-full h-full transition-opacity duration-150 ease-in-out pointer-events-none select-none ${
                  selectedSize === "10 ml" || selectedSize === "15 ml" ? "object-contain" : "object-cover"
                }`} 
              />
            </div>
          </div>

          <div className="flex flex-col justify-start">
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <span>{product.category}</span>
            </div>
            <h1 className="mt-2 font-display text-4xl md:text-5xl font-light">{product.name}</h1>
            <div className="mt-4 font-display text-2xl md:text-3xl font-light text-foreground">
              <span className="font-sans mr-1 font-light">₹</span>{currentPrice.toLocaleString("en-IN")}
            </div>

            {/* Size Selector */}
            <div className="mt-8">
              <div className="text-[10px] font-light tracking-[0.2em] text-muted-foreground uppercase mb-3">Size</div>
              <div className="flex gap-3 flex-wrap">
                {sizeOptions.map((sizeOption) => (
                   <button
                     key={sizeOption}
                     onClick={() => setSelectedSize(sizeOption)}
                     className={`px-6 py-3 rounded-xl border text-xs font-light tracking-widest uppercase transition-all cursor-pointer ${
                       selectedSize === sizeOption
                         ? "bg-[#1c1917] text-white border-[#1c1917] shadow-md shadow-stone-900/10 scale-[1.02]"
                         : "bg-[#FAF9F5] border-border/70 hover:border-foreground/30 text-muted-foreground"
                     }`}
                   >
                     {sizeOption}
                   </button>
                ))}
              </div>
            </div>

            {/* Added to Cart Feedback Toast */}
            {toastMessage && (
              <div className="mt-6 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium px-4 py-3.5 rounded-xl flex items-center gap-2.5 animate-fade-up">
                <div className="w-4.5 h-4.5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 stroke-[2.5]" />
                </div>
                <span>{toastMessage}</span>
              </div>
            )}

            {/* Add to Cart / Buy Now Controls */}
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <div className="flex items-center border border-border rounded-full self-start sm:self-auto shrink-0 bg-[#FAF9F5]/40">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-12 h-12 flex items-center justify-center hover:text-accent cursor-pointer"><Minus className="w-4 h-4" /></button>
                <span className="w-8 text-center text-sm font-semibold">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="w-12 h-12 flex items-center justify-center hover:text-accent cursor-pointer"><Plus className="w-4 h-4" /></button>
              </div>
              <div className="flex-1 flex gap-3">
                <button
                  onClick={() => {
                    add(product.slug, qty, selectedSize);
                    trackPixelEvent("AddToCart", {
                      content_name: product.name,
                      content_ids: [product.slug],
                      content_type: "product",
                      value: getPriceForSize(product, selectedSize) * qty,
                      currency: "INR",
                      quantity: qty,
                    });
                    setToastMessage(`Added ${product.name} (${selectedSize}) x${qty} to cart!`);
                    setTimeout(() => setToastMessage(null), 3500);
                  }}
                  className="flex-1 bg-white hover:bg-[#FAF9F5] border border-border text-foreground rounded-full px-6 py-3.5 flex items-center justify-center gap-2 text-xs font-light tracking-[0.18em] uppercase transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" /> Add to Cart
                </button>
                <button
                  onClick={() => {
                    add(product.slug, qty, selectedSize);
                    trackPixelEvent("AddToCart", {
                      content_name: product.name,
                      content_ids: [product.slug],
                      content_type: "product",
                      value: getPriceForSize(product, selectedSize) * qty,
                      currency: "INR",
                      quantity: qty,
                    });
                    router.navigate({ to: "/cart" });
                  }}
                  className="flex-1 bg-[#1c1917] hover:bg-foreground/90 text-white rounded-full px-6 py-3.5 flex items-center justify-center gap-2 text-xs font-light tracking-[0.18em] uppercase transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-md shadow-stone-900/10"
                >
                  Buy Now
                </button>
              </div>
            </div>

            {(() => {
              const threshold = 150;
              const shouldShowToggle = product.description.length > threshold;
              const displayDescription = shouldShowToggle && !isExpanded
                ? product.description.slice(0, threshold) + "..."
                : product.description;

              return (
                <>
                  <p className="mt-8 text-muted-foreground leading-relaxed text-sm">
                    {displayDescription}
                    {shouldShowToggle && (
                      <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="ml-2 text-[#1c1917] hover:opacity-75 font-medium underline cursor-pointer inline-block"
                      >
                        {isExpanded ? "See Less" : "See More"}
                      </button>
                    )}
                  </p>

                  {product.slug === "divorce-lotion" && (
                    <div className="mt-10 border-t border-border/60 pt-8 flex flex-col gap-6 text-sm text-foreground">
                      <div>
                        <h4 className="font-semibold text-zinc-900 tracking-wider text-xs uppercase mb-2">Special Features</h4>
                        <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                          <li>Dye-free</li>
                          <li>Cruelty-free</li>
                          <li>A millionaire collective seductive allure, skin-nourishing lotion adds the perfect touch of scent. Airy French sage mixes with creamy white oud and warm velvet musk for an enticing, Honey sensual aroma.</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-zinc-900 tracking-wider text-xs uppercase mb-2">Fragrance Profile</h4>
                        <p className="text-muted-foreground"><strong className="text-zinc-800 font-medium">Fragrance Type:</strong> Honey Base</p>
                        <p className="text-muted-foreground"><strong className="text-zinc-800 font-medium">Notes:</strong> Honey, velvet musk, oud, fruity, sweet, warm spicy, Silky amber</p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-zinc-900 tracking-wider text-xs uppercase mb-2">How-to-Apply & Tip</h4>
                        <p className="text-muted-foreground mb-2">Start right after a shower. Lightly towel-dry your skin so it's still slightly damp. Moist skin holds fragrance better than dry skin.</p>
                        <p className="text-muted-foreground italic"><strong className="text-zinc-800 not-italic font-medium">Tip:</strong> Rub gently or just pat it in. Don't aggressively rub your wrists together—it can break down the fragrance molecules and reduce longevity.</p>
                      </div>

                      <div className="bg-[#FAF9F5]/60 p-4 border border-border/40 text-center font-display">
                        <p className="text-xs uppercase tracking-widest text-zinc-800 font-semibold mb-1">"DIVORCE"</p>
                        <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-2">FROM OUR FAST-MOVING PARFUM COLLECTION. REIMAGINED AS A BODY LOTION WHAT LASTS BEYOND THE MOMENT?</p>
                        <p className="text-[10px] text-accent uppercase tracking-widest font-bold">THIS DROP SPEAKS YOUR IDENTITY TO THE PEOPLES</p>
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="font-display text-lg md:text-2xl font-light tracking-[0.2em] uppercase text-[#1c1917] mb-8 text-center">You May Also Like</h2>
            <div className="grid grid-cols-2 md:flex md:justify-center gap-6 lg:gap-8">
              {related.map((p) => (
                <div key={p.slug} className="md:w-[280px] w-full">
                  <ProductCard p={p} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Full Screen Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 bg-black/95 z-[9999] flex flex-col justify-center items-center p-4 animate-fade-in">
          {/* Close button */}
          <button 
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 text-white hover:text-white/80 transition-colors p-2 z-[10000] cursor-pointer"
          >
            <span className="text-3xl font-light">&times;</span>
          </button>

          {/* Main Slide Image */}
          <div className="relative max-w-4xl max-h-[75vh] w-full flex items-center justify-center">
            {/* Prev button */}
            <button 
              onClick={() => setLightboxIndex((prev: number) => (prev === 0 ? allImages.length - 1 : prev - 1))}
              className="absolute left-4 z-10 text-white bg-black/40 hover:bg-black/60 rounded-full w-12 h-12 flex items-center justify-center transition-all cursor-pointer text-xl font-bold"
            >
              &larr;
            </button>

            <img 
              src={allImages[lightboxIndex]} 
              alt="Gallery Zoom" 
              className="max-w-full max-h-[75vh] object-contain rounded select-none animate-fade-in"
              key={lightboxIndex}
            />

            {/* Next button */}
            <button 
              onClick={() => setLightboxIndex((prev: number) => (prev === allImages.length - 1 ? 0 : prev + 1))}
              className="absolute right-4 z-10 text-white bg-black/40 hover:bg-black/60 rounded-full w-12 h-12 flex items-center justify-center transition-all cursor-pointer text-xl font-bold"
            >
              &rarr;
            </button>
          </div>

          {/* Dots / Thumbnails indicator at bottom */}
          <div className="mt-6 flex gap-2 overflow-x-auto max-w-full p-2 scrollbar-none">
            {allImages.map((imgUrl, idx) => (
              <button 
                key={idx}
                onClick={() => setLightboxIndex(idx)}
                className={`w-12 h-12 border rounded overflow-hidden shrink-0 transition-all cursor-pointer ${
                  lightboxIndex === idx ? "border-white scale-105" : "border-white/20 opacity-60"
                }`}
              >
                <img src={imgUrl} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </SiteLayout>
  );
}
