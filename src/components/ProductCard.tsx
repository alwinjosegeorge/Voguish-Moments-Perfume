import { Link } from "@tanstack/react-router";
import type { Product } from "@/data/catalog";
import { useState } from "react";
import { Star, ShoppingBag } from "lucide-react";

export function ProductCard({ p }: { p: Product }) {
  const [isHovered, setIsHovered] = useState(false);

  // Generate stable mock rating based on slug
  const rating = ((p.slug.charCodeAt(0) % 5) * 0.1 + 4.5).toFixed(2);
  const reviewsCount = (p.slug.charCodeAt(1) % 80) + 20;

  return (
    <Link
      to="/product/$slug"
      params={{ slug: p.slug }}
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-none bg-white border border-border/40">
        {/* Top Left Badge */}
        {p.hr && (
          <span className="absolute top-3 left-3 z-10 bg-white/95 border border-border/80 text-foreground text-[9px] font-bold tracking-widest px-2.5 py-1 rounded-none shadow-xs uppercase">
            {p.hr}
          </span>
        )}

        {/* Product Image */}
        <img
          src={isHovered && p.hoverImg ? p.hoverImg : p.img}
          alt={p.name}
          width={768}
          height={768}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-all duration-500"
        />
      </div>

      <div className="mt-4 flex flex-col items-center text-center gap-1.5 px-1">
        {/* Title */}
        <h3 className="font-display text-[13px] font-light tracking-[0.125rem] uppercase text-[#1c1917] truncate max-w-full">
          {p.name}
        </h3>

        {/* Subtitle / Category */}
        <p className="text-[11px] text-muted-foreground tracking-wide font-light">
          {p.category}
        </p>

        {/* Price */}
        <div className="text-sm font-light text-[#1c1917] tracking-wider">
          {p.priceLabel}
        </div>

        {/* Star Rating */}
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-light">
          <span>{rating}</span>
          <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
          <span>({reviewsCount})</span>
        </div>

        {/* Add to Cart Button */}
        <div
          className="w-full mt-2 py-3 rounded-none text-[10px] font-light tracking-[0.18em] uppercase flex items-center justify-center gap-1.5 border border-[#1c1917] bg-[#1c1917] text-white hover:bg-white hover:text-[#1c1917] transition-all duration-300 active:scale-[0.98] cursor-pointer shadow-sm"
        >
          <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
        </div>
      </div>
    </Link>
  );
}
