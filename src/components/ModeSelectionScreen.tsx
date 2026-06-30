import { useState, useRef, useEffect } from "react";
import { useMode, FragranceMode } from "@/context/ModeContext";
import logoImg from "@/assets/logo.png";
import bgImage from "@/assets/divorce-hero.webp";
import bgImageMobile from "@/assets/web-page-1.webp";
import { ChevronDown, Check } from "lucide-react";

export function ModeSelectionScreen() {
  const { setMode } = useMode();
  const [selectedMode, setSelectedMode] = useState<FragranceMode | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEnter = () => {
    if (selectedMode) {
      setMode(selectedMode);
    }
  };

  const OPTIONS = [
    { id: "MESSI_EDITION", label: "Messi Edition" },
    { id: "ROLL_ON_PREMIUM", label: "Roll ON Premium" },
    { id: "OUD_BASE", label: "Oud Base" },
    { id: "FLORAL_BASE", label: "Floral Base" },
    { id: "FRUITY_BASE", label: "Fruity Base" },
    { id: "FRESH_BASE", label: "Fresh Base" },
    { id: "DIVORCE_LOTION", label: "Divorce Lotion" },
  ];

  const getModeLabel = (m: FragranceMode | null) => {
    switch (m) {
      case "OUD_BASE":
        return "Oud Base";
      case "FLORAL_BASE":
        return "Floral Base";
      case "FRUITY_BASE":
        return "Fruity Base";
      case "FRESH_BASE":
        return "Fresh Base";
      case "DIVORCE_LOTION":
        return "Divorce Lotion";
      case "ROLL_ON_PREMIUM":
        return "Roll ON Premium";
      case "MESSI_EDITION":
        return "Messi Edition";
      default:
        return "Choose your fragrance base";
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-start md:justify-start px-6 pt-[45vh] md:pt-[22vh] md:py-12 bg-cover bg-center select-none mode-selection-bg"
      style={{
        "--bg-desktop": `url(${bgImage})`,
        "--bg-mobile": `url(${bgImageMobile})`,
      } as React.CSSProperties}
    >
      {/* Main card/form container - animate-fade-up runs here ONCE on mount */}
      <div className="relative z-10 max-w-sm w-full flex flex-col items-center animate-fade-up">
        {/* Centered Logo - original black for bright background */}
        <div className="mb-14 hidden md:block">
          <img
            src={logoImg}
            alt="Voguish Moments Logo"
            className="h-14 md:h-16 w-auto object-contain"
          />
        </div>

        {/* Title - dark for bright background */}
        <h2 className="font-sans text-xs md:text-sm font-bold tracking-[0.2em] text-[#1c1917] text-center mb-4 md:mb-6 uppercase">
          SELECT YOUR SIGNATURE
        </h2>

        {/* Custom Dropdown Selection box */}
        <div ref={dropdownRef} className="w-full relative mb-3 md:mb-4">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full bg-[#1c1917] flex items-center justify-between px-6 py-4 cursor-pointer outline-none border-none text-left"
          >
            <div className="flex items-center">
              <span className="text-stone-400 text-xs font-sans font-bold tracking-wider mr-3 uppercase select-none">
                Mode:
              </span>
              <span
                className={`font-sans font-semibold text-xs md:text-sm ${
                  selectedMode ? "text-white" : "text-stone-500"
                }`}
              >
                {getModeLabel(selectedMode)}
              </span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-stone-400 transition-transform duration-300 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Custom Dropdown Options */}
          {isOpen && (
            <div className="absolute left-0 right-0 mt-1.5 bg-[#1c1917] border border-stone-800 shadow-2xl rounded-none py-1.5 z-[120] flex flex-col max-h-[220px] overflow-y-auto dropdown-scroll animate-dropdown-fade">
              {OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setSelectedMode(opt.id as FragranceMode);
                    setIsOpen(false);
                  }}
                  className={`w-full px-6 py-3.5 md:py-2.5 text-left text-xs md:text-[13px] font-medium transition-colors flex items-center justify-between cursor-pointer ${
                    selectedMode === opt.id
                      ? "text-accent bg-stone-900"
                      : "text-white hover:bg-stone-900"
                  }`}
                >
                  <span className="font-sans font-semibold">{opt.label}</span>
                  {selectedMode === opt.id && <Check className="w-4 h-4 text-accent" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Enter Site Button */}
        <button
          type="button"
          onClick={handleEnter}
          disabled={!selectedMode}
          className={`w-full font-sans font-bold tracking-[0.2em] text-xs py-3.5 md:py-4.5 transition-all duration-300 uppercase border border-none ${
            selectedMode
              ? "bg-[#1c1917] hover:bg-[#2e2a27] text-white cursor-pointer active:scale-[0.98]"
              : "bg-black/10 text-stone-500/50 cursor-not-allowed"
          }`}
        >
          ENTER SITE
        </button>

        {/* Small T&C link */}
        <span className="text-[10px] tracking-widest text-stone-500 hover:text-stone-800 font-medium uppercase mt-4 md:mt-6 transition-colors cursor-pointer">
          Terms & Conditions
        </span>
      </div>
    </div>
  );
}
