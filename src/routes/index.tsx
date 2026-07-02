import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, User } from "lucide-react";
import { useState, useEffect } from "react";

import { SiteLayout } from "@/components/SiteLayout";
import { ProductCard } from "@/components/ProductCard";
import { PRODUCTS } from "@/data/catalog";
import { useMode } from "@/context/ModeContext";
import { getProducts } from "@/lib/productService";

import divorceHero from "@/assets/divorce-hero.webp";
import seductionHeroImg from "@/assets/seduction-1.webp";
import dopamineHeroImg from "@/assets/dopamine-1.webp";
import oilsPageHeader from "@/assets/oils-page-header.webp";
import oilsPageHeaderMobile from "@/assets/oils-page-header-mobile.webp";
import messiHeroImg from "@/assets/messi-hero.webp";
import oilsPageHeaderLap from "@/assets/oils-page-header-lap.webp";
import divorceLotionHero from "@/assets/divorce-lotion-hero.webp";
import oilsPageHeaderImage from "@/assets/oils-page-header-image.webp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Voguish Moments — Where Luxury Perfume Begins" },
      {
        name: "description",
        content:
          "Discover Voguish Moments signature perfumes, crafted with high-grade ingredients sourced from France by Raa.",
      },
    ],
  }),
  component: Home,
});

export interface HeroData {
  title: string;
  description: string;
  featuredSlug: string;
  img: string;
}

export const DEFAULT_HERO_DATA: Record<string, HeroData> = {
  OUD_BASE: {
    title: "OUR EXCLUSIVE PARFUM\nDIVORCE",
    description:
      "THE GREATEST DISTANCE IN THE WORLD IS NOT BETWEEN TWO COUNTRIES,\nBUT BETWEEN TWO PEOPLE WHO SPEAK THE SAME LANGUAGE AND STILL FAIL TO UNDERSTAND EACH OTHER.\nTHIS DROP SPEAKS YOUR IDENTITY TO THE PEOPLES",
    featuredSlug: "divorce-perfume",
    img: divorceHero,
  },
  FLORAL_BASE: {
    title: "OUR SEX PARFUM\nSEDUCTION",
    description:
      "A romantic, mood-enhancing fragrance infused with pheromone molecules designed to create a deep emotional connection.",
    featuredSlug: "seduction",
    img: "",
  },
  FRUITY_BASE: {
    title: "OUR EXCLUSIVE PARFUM\nMOOD SWINGS",
    description:
      "An incredibly long-projecting scent featuring a dynamic profile of shifting mixed fruit notes that diverts your mind.",
    featuredSlug: "mood-swings",
    img: "",
  },
  FRESH_BASE: {
    title: "OUR EXCLUSIVE PARFUM\nDOPAMINE",
    description:
      "A cool, high-dose fresh citrus blend of mint and green lemon to keep you focused and refreshed all day.",
    featuredSlug: "dopamine",
    img: "",
  },
  MESSI_EDITION: {
    title: "NEW LAUNCH\nLIONEL LEATHER",
    description:
      "ഈ പെർഫ്യൂമിനെ കുറിച്ച് പറയുകയാണെങ്കിൽ മെസ്സിയുടെ സ്വന്തം ബ്രാൻഡിൽ നിന്നും ഇറക്കിയ ഒരു ഡ്യൂപ്പ് അല്ല അതിൽ ഒന്നും അധികനേരം നിലനിൽക്കുന്ന പെർഫ്യൂമുകൾ ലഭ്യമല്ല കൂടാതെ അത് മാർക്കറ്റിൽ ലഭ്യമാണ്. ഞങ്ങളുടെ ഫോക്കസിംഗ് അദ്ദേഹത്തിന്റെ പേഴ്സണൽ കളക്ഷനിൽ നിന്നും ഒരെണ്ണം ആയിരുന്നു. വളരെ കഠിന്യമേറിയ ജോലി തന്നെയാണ് ഇത്. അദ്ദേഹത്തിന് ലതറി നോട്ട് നോട് ഇഷ്ടം കൂടുതലാണ്. ഞങ്ങൾ ഒരുപാട് കടപ്പെട്ടത്  Fueguia 1833 Perfume House Argentina. ഒരു ശരിയായ വിഷൻ അവരിൽ നിന്നും നമുക്ക് ലഭിച്ചു. അർജന്റീന കൂട്ടുകാരോട് നന്ദി. ഒരു പുരുഷന് വേണ്ട സുഗന്ധം വളരെ മസ്കുലിൻ നനഞ്ഞ ലതറിന്റെ മത്തുപിടിപ്പിക്കും വിധം സുഗന്ധത്താൽ പൊതിഞ്ഞത്. നീണ്ട നേരം നിലനിൽക്കുന്നത്. ഒരു മരണവീട്ടിൽ അറിയാതെ പോലും ഉപയോഗിച്ചു അടിച്ചു ഉപയോഗിച്ചു പോകാൻ കഴിയാത്തതു. ചുറ്റുപാട് നിൽക്കുന്നവർക്ക് വളരെ ആകാംക്ഷയേറിയതും കാഠിന്യത്താൽ ഗുണമേന്മയേറിയതും അവസാനം ലഭിച്ചു.",
    featuredSlug: "lionel-leather",
    img: messiHeroImg,
  },
  DIVORCE_LOTION: {
    title: "OUR EXCLUSIVE LOTION\nDIVORCE LOTION",
    description:
      "ബോഡി ലോഷന്റെ ഉപകാരം ഒരാൾക്ക് 50 സ്ത്രീകളുമായി അടുപ്പമുണ്ട് അതിൽ ഒരു സ്ത്രീ മാത്രമാണ് ബോഡി ലോഷൻ ഉപയോഗിക്കുന്നത് ഒരു കാര്യം പറയട്ടെ ഒരു 50 വർഷം കഴിഞ്ഞാൽ ഈ 50 സ്ത്രീകളിൽ ഒരാളെ മാത്രം നീ ഓർമിക്കുകയുള്ളൂ . ഓർമ്മ വരുകയുള്ളൂ ബാക്കി 49 ആളുകൾക്കും അവരവരുടേതായ ശരീര സുഗന്ധം ആണുള്ളത് ഒരു മനുഷ്യന് അത് ഓർത്തിരിക്കാൻ കഴിയുന്നതല്ല. ബോഡി ലോഷൻ ഉപയോഗിച്ച സ്ത്രീയെ നീ മരണംവരെ മറക്കുകയുമില്ല നിനക്ക് കിട്ടിയ അനുഭൂതി. ആയിരം നിമിഷങ്ങൾ നിനക്ക് ഓർക്കാൻ ഉണ്ടാവും. ഡിവോസിൽ അടങ്ങിയിരിക്കുന്നത് ലക്ഷ്വറി ഊദ് ഹണി കോമ്പൗണ്ട് ആണ്. പേഴ്സണലി ഊദ്  ഇഷ്ടമല്ലാത്തവർ ഈ ലോഷൻ വാങ്ങരുത്. ഇത് സൗന്ദര്യത്തിലും സുഗന്ധത്തിലും ആഡംബരത്തിലും ഈ ലോകത്ത് ഏറ്റവും പണം ചെലവഴിക്കുന്ന അറബ് സ്ത്രീകൾ ആണ് അതിൽ ഒരു സംശയവുമില്ല അവരുടെ പേഴ്സണൽ ഫേവറേറ്റ് ലിസ്റ്റിൽ നിന്നും ഈ ബോഡി ലോഷൻ സമർപ്പിക്കുന്നു",
    featuredSlug: "divorce-lotion",
    img: divorceLotionHero,
  },
};

function Hero({ allProducts }: { allProducts: any[] }) {
  const { mode } = useMode();
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const activeMode = mode || "OUD_BASE";

  const defaults = DEFAULT_HERO_DATA[activeMode] || DEFAULT_HERO_DATA.OUD_BASE;

  let resolvedTitle = defaults.title;
  let resolvedDesc = defaults.description;
  let resolvedSlug = defaults.featuredSlug;
  let resolvedImg = defaults.img;

  const match = allProducts.find((p) => p.slug === resolvedSlug);
  if (match) {
    if (resolvedSlug === "divorce-perfume") {
      resolvedImg = divorceHero;
    } else if (resolvedSlug === "seduction") {
      resolvedImg = seductionHeroImg;
    } else if (resolvedSlug === "dopamine") {
      resolvedImg = dopamineHeroImg;
    } else if (resolvedSlug === "lionel-leather") {
      resolvedImg = messiHeroImg;
    } else if (resolvedSlug === "divorce-lotion") {
      resolvedImg = divorceLotionHero;
    } else {
      resolvedImg = match.img;
    }
  }

  const data = {
    title: resolvedTitle,
    description: resolvedDesc,
    featuredSlug: resolvedSlug,
    img: resolvedImg,
  };

  const renderTitle = (title: string) => {
    const lines = title.split("\n");
    if (lines.length > 1) {
      return (
        <span className="flex flex-col gap-3 lg:gap-4">
          <span className="font-hubballi text-sm md:text-base lg:text-lg font-normal tracking-[0.25em] uppercase text-muted-foreground block">
            {lines[0]}
          </span>
          <span className="font-futura text-[38px] md:text-7xl lg:text-8xl font-normal uppercase text-foreground block leading-none lg:-ml-[8px]">
            {lines[1]}
          </span>
        </span>
      );
    }
    return <span>{title}</span>;
  };

  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.25] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, oklch(0.85 0.01 70) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.85 0.01 70) 1px, transparent 1px)",
          backgroundSize: "120px 120px",
        }}
      />
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-6 lg:pt-10 pb-12 lg:pb-20 grid lg:grid-cols-2 gap-10 items-center relative">
        <div className="order-2 lg:order-1 animate-fade-up text-center lg:text-left">
          <h1 className="font-display">
            {renderTitle(data.title)}
          </h1>
          {mode === "MESSI_EDITION" || mode === "DIVORCE_LOTION" ? (
            <p className="mt-8 text-muted-foreground text-sm lg:text-base max-w-lg mx-auto lg:mx-0 leading-relaxed whitespace-pre-line text-left">
              {isDescExpanded
                ? data.description
                : data.description.slice(0, 110) + "..."}
              <button
                onClick={() => setIsDescExpanded(!isDescExpanded)}
                className="ml-2 text-[#1c1917] hover:opacity-75 font-semibold underline cursor-pointer inline-block"
              >
                {isDescExpanded ? "See Less" : "See More"}
              </button>
            </p>
          ) : (
            <p className="mt-8 text-muted-foreground text-sm lg:text-base max-w-lg mx-auto lg:mx-0 leading-relaxed whitespace-pre-line">
              {data.description}
            </p>
          )}
          <div className="mt-8 lg:mt-10 flex items-center gap-6 flex-wrap justify-center lg:justify-start">
            <Link
              to="/product/$slug"
              params={{ slug: data.featuredSlug }}
              className="group flex items-center gap-3 bg-foreground text-background rounded-full pl-7 pr-3 py-3 hover:bg-foreground/90 transition-all"
            >
              <span className="font-medium">Shop Now</span>
              <span className="w-9 h-9 rounded-full bg-background/15 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
            <div className="hidden lg:flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border border-dashed border-accent flex items-center justify-center">
                <User className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="text-left">
                <div className="font-display text-xl">20K +</div>
                <div className="text-sm text-muted-foreground">Happy customers</div>
              </div>
            </div>
          </div>
        </div>

        <div className="order-1 lg:order-2 relative">
          <Link
            to="/product/$slug"
            params={{ slug: data.featuredSlug }}
            className={`relative mx-auto w-full max-w-[450px] block cursor-pointer group/heroimg ${
              mode === "MESSI_EDITION" || mode === "DIVORCE_LOTION" ? "aspect-[118/160]" : "aspect-square"
            }`}
          >
            <div className="absolute inset-0 overflow-hidden bg-cream group-hover/heroimg:scale-[1.01] transition-transform duration-500 rounded-none border border-border/80">
              <img
                src={data.img}
                alt="Voguish Moments perfume"
                width={1280}
                height={1280}
                className="w-full h-full object-cover"
              />
            </div>
          </Link>
        </div>

      </div>
    </section>
  );
}

function Home() {
  const { mode } = useMode();
  const activeMode = mode || "OUD_BASE";
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

  const modePerfumes = allProducts.filter(
    (p) => p.base === activeMode
  );

  const getModeHeading = (m: string) => {
    switch (m) {
      case "FLORAL_BASE":
        return "Another Floral Perfumes";
      case "FRUITY_BASE":
        return "Another Fruity Perfumes";
      case "FRESH_BASE":
        return "Another Fresh Perfumes";
      default:
        return "Another Oud Perfumes";
    }
  };

  const isRollOnPremium = mode === "ROLL_ON_PREMIUM";
  const isMessiEdition = mode === "MESSI_EDITION";
  const isDivorceLotion = mode === "DIVORCE_LOTION";

  // Hide library and other sections for special single-product editions
  const isHeroOnlyMode = isMessiEdition || isDivorceLotion;

  return (
    <SiteLayout>
      {!isRollOnPremium && <Hero allProducts={allProducts} />}
 
      {/* Mode-Specific Showcase */}
      {!isHeroOnlyMode && (
        <section className={isRollOnPremium ? "pt-6 pb-16 md:pt-8 md:pb-24" : "py-16"}>
          <div className="max-w-[1300px] mx-auto px-6 lg:px-12">
            {isRollOnPremium ? (
              <div className="flex flex-col items-center justify-center text-center mt-2 mb-12 animate-fade-up mx-auto w-full select-none">
                {/* Top Image */}
                <img
                  src={oilsPageHeaderImage}
                  alt="1001 Collections"
                  className="w-full max-w-[380px] md:max-w-[420px] h-auto object-contain select-none pointer-events-none mb-4"
                />

                {/* Heading */}
                <h2 
                  className="text-center font-extrabold tracking-[0.06em] text-[#111111] text-[28px] md:text-3xl lg:text-[34px] uppercase mb-4"
                  style={{ fontFamily: "'RyuGothic', 'Ryu Gothic', 'Montserrat', sans-serif" }}
                >
                  PREMIUM FRAGRANCE OILS
                </h2>

                {/* English Paragraph */}
                <p 
                  className="text-center text-[10px] md:text-[12px] text-zinc-800 leading-[1.6] uppercase tracking-[0.08em] mb-4 max-w-[850px] w-[90%] md:w-full"
                  style={{ fontFamily: "'Cinzel', 'Cormorant Garamond', serif", fontVariant: "small-caps" }}
                >
                  IN MANY COUNTRIES, SPICES ARE CONSIDERED PRECIOUS AND PRESERVED, AND SOME OF THEM ARE GIVEN TO THE OUTSIDE WORLD FOR KNOWLEDGE. IN SUCH A WAY, CONSIDERING THE PALACES OF MANY COUNTRIES WE HAVE DECIDED TO COLLECT ONLY THOSE SPICES THAT ARE CONSIDERED PRECIOUS TREASURES FROM PALACES AS RARE COLLECTIONS.
                </p>

                {/* Malayalam Paragraph */}
                <p 
                  className="text-center text-[10px] md:text-[11.5px] text-zinc-600 leading-[1.8] max-w-[850px] w-[90%] md:w-full font-light"
                  style={{ fontFamily: "'Noto Serif Malayalam', 'Manjari', 'Noto Sans Malayalam', sans-serif" }}
                >
                  പല രാജ്യങ്ങളിലും സുഗന്ധവ്യഞ്ജനങ്ങൾ അമൂല്യവും സംരക്ഷിക്കപ്പെടുന്നതുമായി കണക്കാക്കപ്പെടുന്നു, അവയിൽ ചിലത് പുറം ലോകത്തിന് അറിവിനായി നൽകപ്പെടുന്നു അങ്ങനെ, പല രാജ്യങ്ങളിലെയും കൊട്ടാരങ്ങൾ കണക്കിലെടുക്കുമ്പോൾ, കൊട്ടാരങ്ങളിൽ നിന്ന് അപൂർവ ശേഖരങ്ങളായി കണക്കാക്കപ്പെടുന്ന സുഗന്ധവ്യഞ്ജനങ്ങൾ മാത്രം ശേഖരിക്കാൻ ഞങ്ങൾ തീരുമാനിച്ചു.
                </p>
              </div>
            ) : (
              <h2 className="text-center font-display text-lg md:text-2xl font-light tracking-[0.2em] uppercase text-[#1c1917] mb-12">
                {getModeHeading(activeMode)}
              </h2>
            )}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {modePerfumes.map((p) => (
                <ProductCard key={p.slug} p={p} />
              ))}
            </div>
          </div>
        </section>
      )}
 
      {/* Global Combined Showcase Link above Footer */}
      <section className="relative py-20 overflow-hidden text-center -mb-16">
        {/* Mobile Background Video (Air fryer recipes) */}
        <iframe
          src="https://player.cloudinary.com/embed/?cloud_name=dar4m0jyt&public_id=From_Klickpin.com-_Save_these_9_Unique_air_fryer_dinner_recipes_that_bring_together_comfort_beauty_and_useful_ideas_you_will_actually_try_for_anyo_1_ud9zpl&autoplay=true&loop=true&muted=true&controls=false&player[autoplay]=true&player[loop]=true&player[muted]=true&player[controls]=false"
          className="absolute top-[-40px] left-1/2 -translate-x-1/2 w-full h-[calc(100%+80px)] z-0 pointer-events-none border-none scale-[2.6] origin-top block md:hidden"
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          style={{ border: "none" }}
        />
        {/* Desktop/Laptop Background Video (Untitled design (1) (1)) */}
        <iframe
          src="https://player.cloudinary.com/embed/?cloud_name=dar4m0jyt&public_id=Untitled_design_1_1_mxi7vn&autoplay=true&loop=true&muted=true&controls=false&player[autoplay]=true&player[loop]=true&player[muted]=true&player[controls]=false"
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none border-none scale-[2.4] origin-bottom hidden md:block"
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          style={{ border: "none" }}
        />
        
        {/* Dark overlay for text contrast */}
        <div className="absolute inset-0 bg-black/45 z-10" />

        <div className="max-w-2xl mx-auto px-6 relative z-20">
          <h2 className="font-display text-lg md:text-2xl font-light tracking-[0.2em] uppercase text-white mb-4">FORMULATED WITH INGREDIENTS</h2>
          <p className="text-sm text-white/80 leading-relaxed mb-8">
            Every Voguish Moments fragrance begins a remarkable journey between two legendary perfume capitals. From the historic streets of Kannauj, India, where ancient distillation techniques have been perfected for centuries, to the renowned Centre-Val de Loire, France, celebrated for producing some of the world's finest aromatic ingredients. Here, generations of craftsmanship, rare botanicals, and French elegance come together to create fragrances that carry both heritage and luxury in every drop.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center justify-center rounded-full bg-white hover:bg-white/90 text-[#1c1917] font-semibold text-xs tracking-widest uppercase px-8 py-4 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            See All Our Perfumes
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}

