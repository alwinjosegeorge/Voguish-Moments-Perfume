import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { ProductCard } from "@/components/ProductCard";
import { PRODUCTS, CATEGORIES } from "@/data/catalog";
import { getProducts } from "@/lib/productService";

type Search = { category?: string };

export const Route = createFileRoute("/shop")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    category: typeof s.category === "string" ? s.category : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Shop — Voguish Moments" },
      { name: "description", content: "Explore expertly crafted fragrances designed to match every mood, moment, and personality." },
    ],
  }),
  component: Shop,
});

function Shop() {
  const { category } = Route.useSearch();
  const navigate = useNavigate();
  const active = category && CATEGORIES.includes(category as never) ? category : "All";
  const [allProducts, setAllProducts] = useState<any[]>(PRODUCTS);

  useEffect(() => {
    let active = true;
    getProducts().then((data) => {
      if (active) setAllProducts(data);
    });
    return () => {
      active = false;
    };
  }, []);

  const list = active === "All"
    ? allProducts
    : allProducts.filter((p) => {
        if (p.category === active) return true;
        if (active === "Oud Base" && p.base === "OUD_BASE") return true;
        if (active === "Floral Base" && p.base === "FLORAL_BASE") return true;
        if (active === "Fruity Base" && p.base === "FRUITY_BASE") return true;
        if (active === "Fresh Base" && p.base === "FRESH_BASE") return true;
        if (active === "Roll On" && p.base === "ROLL_ON_PREMIUM") return true;
        if (active === "Messi Edition" && p.base === "MESSI_EDITION") return true;
        if (active === "Divorce Lotion" && p.base === "DIVORCE_LOTION") return true;
        return false;
      });

  return (
    <SiteLayout>
      <section className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-6 lg:pt-10 pb-20">
        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-tight max-w-3xl">
          We Make Fuckin Great Parfum
        </h1>
        <p className="mt-6 text-muted-foreground max-w-2xl leading-relaxed">
          We sell emotions &amp; moments
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => navigate({ to: "/shop", search: c === "All" ? {} : { category: c } })}
              className={`px-6 py-2.5 rounded-full text-sm border transition-colors ${
                active === c
                  ? "bg-foreground text-background border-foreground"
                  : "bg-background border-border hover:border-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
          {list.map((p) => <ProductCard key={p.slug} p={p} />)}
        </div>

        {list.length === 0 && (
          <p className="mt-16 text-center text-muted-foreground">No products in this category yet.</p>
        )}
      </section>
    </SiteLayout>
  );
}
