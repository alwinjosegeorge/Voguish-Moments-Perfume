import { Link } from "@tanstack/react-router";
import { Search, ShoppingBag, ChevronDown, Sparkles } from "lucide-react";
import { useCart } from "@/lib/cart";
import logoImg from "@/assets/logo.png";
import { useMode, FragranceMode } from "@/context/ModeContext";
import { useState, useRef, useEffect } from "react";

const NAV: Array<{ label: string; to: string }> = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "About Us", to: "/about" },
  { label: "Contact Us", to: "/contact" },
];

export function VoguishMomentsLogo() {
  const { clearMode } = useMode();
  return (
    <Link to="/" className="flex items-center" onClick={() => clearMode()}>
      <img src={logoImg} alt="Voguish Moments Logo" className="h-7 md:h-10 w-auto object-contain" />
    </Link>
  );
}

export function Header() {
  const { count } = useCart();
  const { mode, setMode } = useMode();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const MODES = [
    { id: "ALL_FRAGRANCES", label: "All Fragrances" },
    { id: "OUD_BASE", label: "Oud Base" },
    { id: "FLORAL_BASE", label: "Floral Base" },
    { id: "FRUITY_BASE", label: "Fruity Base" },
    { id: "MESSI_EDITION", label: "Leather Base" },
    { id: "FRESH_BASE", label: "Fresh Base" },
    { id: "ROLL_ON_PREMIUM", label: "Roll ON Premium" },
    { id: "DIVORCE_LOTION", label: "Divorce Lotion" },
  ];

  const getModeLabel = (m: FragranceMode | null) => {
    switch (m) {
      case "ALL_FRAGRANCES":
        return "All Fragrances";
      case "OUD_BASE":
        return "Oud Base";
      case "FLORAL_BASE":
        return "Floral Base";
      case "FRUITY_BASE":
        return "Fruity Base";
      case "MESSI_EDITION":
        return "Leather Base";
      case "FRESH_BASE":
        return "Fresh Base";
      case "DIVORCE_LOTION":
        return "Divorce Lotion";
      case "ROLL_ON_PREMIUM":
        return "Roll ON Premium";
      default:
        return "Select Mode";
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/85 backdrop-blur-md border-b border-border/40">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 h-20 flex items-center justify-between relative">
        <div className="flex items-center">
          <nav className="hidden lg:flex items-center gap-9 text-[15px] font-medium">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: n.to === "/" }}
                activeProps={{ className: "text-accent" }}
                className="hover:text-accent transition-colors"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <VoguishMomentsLogo />
        </div>

        <div className="flex items-center gap-5">
          {/* Mode Selector Dropdown */}
          <div ref={dropdownRef} className="relative hidden md:block">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/60 bg-cream/40 text-[12px] font-medium hover:border-accent/40 hover:bg-cream/85 transition-all cursor-pointer select-none"
            >
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>{getModeLabel(mode)}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isOpen && (
              <div className="absolute right-0 mt-2 w-40 rounded-2xl bg-white border border-[#EAE8E2] shadow-lg py-2 z-50 animate-fade-up [animation-duration:200ms] flex flex-col">
                {MODES.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setMode(m.id as FragranceMode);
                      setIsOpen(false);
                    }}
                    className={`px-4 py-2 text-left text-xs font-medium transition-colors hover:bg-[#FAF9F5] hover:text-accent cursor-pointer ${
                      mode === m.id ? "text-accent bg-[#FAF9F5]/80" : "text-[#1c1917]"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link to="/search" aria-label="Search" className="hover:text-accent">
            <Search className="w-5 h-5" />
          </Link>
          <Link to="/cart" aria-label="Cart" className="relative hover:text-accent">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] min-w-4 h-4 px-1 rounded-full flex items-center justify-center">
              {count}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
