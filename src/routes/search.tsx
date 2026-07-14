import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Search as SearchIcon } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { ProductCard } from "@/components/ProductCard";
import { PRODUCTS } from "@/data/catalog";
import { getProducts } from "@/lib/productService";
import { trackPixelEvent } from "../lib/metaPixel";

type S = { q?: string };

export const Route = createFileRoute("/search")({
  validateSearch: (s: Record<string, unknown>): S => ({
    q: typeof s.q === "string" ? s.q : undefined,
  }),
  head: () => ({
    meta: [{ title: "Search — Voguish Moments" }, { name: "description", content: "Search Voguish Moments signature perfumes." }],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const navigate = useNavigate();
  const [value, setValue] = useState(q ?? "");
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

  useEffect(() => {
    if (q && q.trim()) {
      trackPixelEvent("Search", { search_string: q.trim() });
    }
  }, [q]);

  const query = (q ?? "").trim().toLowerCase();
  const results = query
    ? allProducts.filter((p) => p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query))
    : [];

  return (
    <SiteLayout>
      <div className="max-w-[1100px] mx-auto px-6 lg:px-12 pt-6 lg:pt-10 pb-16">
        <h1 className="font-display text-4xl md:text-5xl text-center mb-8">Search</h1>
        <form
          onSubmit={(e) => { e.preventDefault(); navigate({ to: "/search", search: { q: value } }); }}
          className="flex items-center bg-cream/70 rounded-full p-2 max-w-2xl mx-auto"
        >
          <SearchIcon className="w-5 h-5 ml-4 text-muted-foreground" />
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Search for perfumes…"
            className="flex-1 bg-transparent px-4 py-2 outline-none"
            autoFocus
          />
          <button className="bg-foreground text-background rounded-full px-6 py-2.5 text-sm">Search</button>
        </form>

        <div className="mt-12">
          {query && (
            <p className="text-sm text-muted-foreground mb-6">
              {results.length} result{results.length === 1 ? "" : "s"} for "{q}"
            </p>
          )}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
            {results.map((p) => <ProductCard key={p.slug} p={p} />)}
          </div>
          {query && results.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No products match your search.</p>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}
