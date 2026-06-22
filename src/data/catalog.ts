import a1 from "@/assets/article-1.jpg";
import a2 from "@/assets/article-2.jpg";
import a3 from "@/assets/article-3.jpg";
import divorceHero from "@/assets/divorce-hero.jpg";
import customProductsRaw from "./custom_products.json";
import divorceImg from "@/assets/divorce.png";
import nakedNoiseImg from "@/assets/naked-noise.png";
import extrovertImg from "@/assets/extrovert.png";
import noExitImg from "@/assets/no-exit.png";
import egoImg from "@/assets/ego.png";
import burningAttractionImg from "@/assets/burning-attraction.png";
import ego10mlImg from "@/assets/ego-10ml.png";
import nakedNoise10mlImg from "@/assets/naked-noise-10ml.png";
import noExit10mlImg from "@/assets/no-exit-10ml.png";
import extrovert10mlImg from "@/assets/extrovert-10ml.png";
import divorce15mlImg from "@/assets/divorce-15ml.png";
import seductionImg from "@/assets/seduction.png";
import suckEyesImg from "@/assets/suck-eyes.png";
import suicideKissImg from "@/assets/suicide-kiss.png";
import evesTemptationImg from "@/assets/eves-temptation.png";
import moodSwingsImg from "@/assets/mood-swings.png";
import provocativeWineImg from "@/assets/provocative-wine.png";
import dopamineImg from "@/assets/dopamine.png";
import suckEyes10mlImg from "@/assets/suck-eyes-10ml.png";
import seduction10mlImg from "@/assets/seduction-10ml.png";
import suicideKiss10mlImg from "@/assets/suicide-kiss-10ml.png";
import dopamine10mlImg from "@/assets/dopamine-10ml.png";
import moodSwings15mlImg from "@/assets/mood-swings-15ml.png";

// Roll ON Premium Imports
import dubaiNightsImg from "@/assets/dubai-nights.png";
import placeParisImg from "@/assets/place-paris.png";
import lastSeenImg from "@/assets/last-seen.png";
import cafeLipsImg from "@/assets/cafe-lips.png";
import sacrificeImg from "@/assets/sacrifice.png";

// Extra Gallery Images
import burningAttraction1 from "@/assets/burning-attraction-1.jpeg";
import burningAttraction2 from "@/assets/burning-attraction-2.jpeg";
import burningAttraction3 from "@/assets/burning-attraction-3.jpeg";
import dopamine1 from "@/assets/dopamine-1.jpeg";
import dopamine2 from "@/assets/dopamine-2.jpeg";
import dopamine3 from "@/assets/dopamine-3.jpeg";
import dopamine4 from "@/assets/dopamine-4.jpeg";
import dopamine5 from "@/assets/dopamine-5.jpeg";
import evesTemptation1 from "@/assets/eves-temptation-1.jpeg";
import evesTemptation2 from "@/assets/eves-temptation-2.jpeg";
import evesTemptation3 from "@/assets/eves-temptation-3.jpeg";
import evesTemptation4 from "@/assets/eves-temptation-4.jpeg";
import evesTemptation5 from "@/assets/eves-temptation-5.jpeg";

// Messi Edition Imports
import messiHeroImg from "@/assets/messi-hero.png";
import messiProductImg from "@/assets/messi-product.jpg";
import messiGalleryImg from "@/assets/messi-gallery.jpg";
import evesTemptation5b from "@/assets/eves-temptation-5b.jpeg";
import evesTemptation6 from "@/assets/eves-temptation-6.jpeg";
import evesTemptation7 from "@/assets/eves-temptation-7.jpeg";
import nakedNoise1 from "@/assets/naked-noise-1.jpeg";
import nakedNoise2 from "@/assets/naked-noise-2.jpeg";
import provocativeWine1 from "@/assets/provocative-wine-1.jpeg";
import provocativeWine2 from "@/assets/provocative-wine-2.jpeg";
import provocativeWine3 from "@/assets/provocative-wine-3.jpeg";
import seduction1 from "@/assets/seduction-1.jpeg";
import seduction2 from "@/assets/seduction-2.jpeg";
import seduction3 from "@/assets/seduction-3.jpeg";
import seduction4 from "@/assets/seduction-4.jpeg";

// Divorce Lotion Imports
import divorceLotionProduct from "@/assets/divorce-lotion-product.png";
import divorceLotionHero from "@/assets/divorce-lotion-hero.png";
import divorceLotionGallery1 from "@/assets/divorce-lotion-gallery1.jpg";
import divorceLotionGallery2 from "@/assets/divorce-lotion-gallery2.jpg";



export type Product = {
  slug: string;
  name: string;
  category: "Oud Base" | "Floral Base" | "Fruity Base" | "Fresh Base" | string;
  price: number;
  priceLabel: string;
  img: string;
  hr: string;
  description: string;
  base?: "OUD_BASE" | "FLORAL_BASE" | "FRUITY_BASE" | "FRESH_BASE" | "ROLL_ON_PREMIUM" | "MESSI_EDITION" | "DIVORCE_LOTION";
  isCustom?: boolean;
  pricing?: Record<string, number>;
  badge?: "Bestseller" | "Only 2 Left" | "";
  featuredOnHomepage?: boolean;
  heroTitle?: string;
  heroDescription?: string;
  hoverImg?: string;
  gallery?: string[];
};

export const PRODUCTS: Product[] = [
  // --- OUD BASE ---
  {
    slug: "divorce-perfume",
    name: "DIVORCE",
    category: "Honey & Oud",
    price: 1400,
    priceLabel: "₹1,400",
    img: divorceImg,
    hr: "24 HR",
    description: "ഈ പെർഫ്യൂമിനെ കുറിച്ച് പറയുകയാണെങ്കിൽ ഏഴ് മാസത്തോളമായി ഞങ്ങൾ ഇത് ലോഞ്ച് ചെയ്തിട്ട്. എന്താണ് ഇതിന്റെ ফീൽ? ഒരു വലിയ തറവാട്ടിൽ ഒരുപാട് പൈസയുള്ള ആളെപ്പോലെ. ഒരു 40000 രൂപയുടെ പെർഫ്യൂം ആണ് അടിച്ചിരിക്കുന്നത് എന്ന് മറ്റുള്ളവർക്ക് തോന്നും. ഒരാൾ വന്ന് ഹഗ്ഗ് ചെയ്താൽ പോലും ഈ സുഗന്ധം അവരുടെ ഡ്രസ്സിലോട്ട് പകരും. നമ്മൾ എവിടെ നിൽക്കുകയാണോ അവിടെ നിന്ന് മാറിയാൽ പോലും ആ ഏരിയയിൽ ഈ സുഗന്ധം തങ്ങിനിൽക്കും. ഞങ്ങളുടെ പെർഫ്യൂമിൽ ഏറ്റവും മികച്ചത്. ഒരു പുതിയ കസ്റ്റമർ വരികയാണെങ്കിൽ അവരുടെ ഡ്രസ്സിൽ അടിച്ചതിനു ശേഷം അവരെ പറഞ്ഞുവിടും, 'നിങ്ങൾ ഇപ്പോൾ ഇത് വാങ്ങണ്ട. വീട്ടിൽ പോയി നാളെ ചെക്ക് ചെയ്തതിനു ശേഷം നാളെ മണം നിൽക്കുന്നുണ്ടെങ്കിൽ മാത്രം വാങ്ങിയാൽ മതി' എന്ന്. ഇതാണ് ഞങ്ങളുടെ കോൺഫിഡൻസ്. നമുക്ക് ആരും പെർമനന്റ് അല്ല, ഈ മണമെങ്കിലും ഒരു ദിവസം നിൽക്കുന്നുണ്ട്, അല്ലേ സന്തോഷം?",
    base: "OUD_BASE",
    pricing: { "15 ml": 600, "50 ml": 1400 },
    gallery: [divorce15mlImg]
  },
  {
    slug: "ego",
    name: "EGO",
    category: "Saffron & Oud",
    price: 1300,
    priceLabel: "₹1,300",
    img: egoImg,
    hr: "3 HR",
    description: "ഈ പെർഫ്യൂനെ കുറിച്ച് പറയുകയാണെങ്കിൽ സഫ്രോൺ കുങ്കുമപ്പൂവിന്റെ സുഗന്ധം ഊതും ലെതറും കൂടെ തന്നെയുണ്ട് ഒരു ഫ്രഞ്ച് അറബിക് എല്ലാ ആളുകൾക്കും ദഹിക്കണമെന്നില്ല അല്പം ലക്ഷ്വറിസ്.  സഫറോൺ സുഗന്ധം ഇഷ്ടപ്പെടുന്നവർ മാത്രം കൈവശപ്പെടുത്തുന്നത് സ്മൂത്ത്സിലും ബ്ലെൻഡിങ്ങിലും കൂടുതൽ ശ്രദ്ധ ചെലുത്തിയത് nose ബ്ലൈൻഡ് ആവാൻ സാധ്യതയേറെ",
    base: "OUD_BASE",
    pricing: { "10 ml": 550, "50 ml": 1300 },
    gallery: [ego10mlImg]
  },
  {
    slug: "burning-attraction",
    name: "BURNING ATTRACTION",
    category: "Tobacco & Woody",
    price: 1200,
    priceLabel: "₹1,200",
    img: burningAttractionImg,
    hr: "5 HR",
    description: "ഈ പെർഫ്യൂമിനെ കുറിച്ച് പറയുകയാണെങ്കിൽ. ഒരു ടുബാക്കോ പെർഫ്യൂം കരിഞ്ഞ ഇലകൾ ചന്ദനം മെക്സിക്കൻ ടുബാക്കോ വെൽവെറ്റ് വാനില ഇവയെല്ലാം ചേർന്ന സ്മോക്കി ഫീൽ തരുന്ന ഒരു മസ്കുലിൻ പെർഫ്യൂം. എസി കാറിൽ ഇത് ഉപയോഗിച്ചു പുറത്തിറങ്ങുന്ന സമയം പാർക്കിംഗ് സൈഡിൽ ഉള്ള ആളുകൾക്ക് വിളിച്ചുണർത്തി നിങ്ങളോട് ചോദിക്കാൻ ആഗ്രഹപ്പെടുന്ന ഒന്ന്. കണ്ണുകൾ അടച്ച് ഈ പെർഫ്യൂം സുഗന്ധം നിഫ് ചെയ്യുമ്പോൾ ഒരു ശാന്തത സമാധാനം നിങ്ങൾക്ക് അനുഭവിച്ചറിയാൻ സാധിക്കുന്നുണ്ടെങ്കിൽ നിങ്ങൾ ഇതിന്റെ വശ്യ മനോഹാരിതയിൽ അടിമപ്പെട്ടു പോകുക തന്നെ ചെയ്യും . ഒരു പുരുഷന്റെ സുഗന്ധം വിലകുറഞ്ഞ പുരുഷനെ അല്ല പറഞ്ഞത് ഒരു ബെൻഡ്ലി കാറിൽ സ്യൂട്ട് ആയി വന്നിറങ്ങിയ ഒരു പുരുഷനെ കുറിച്ച്",
    base: "OUD_BASE",
    pricing: { "50 ml": 1200 },
    gallery: [burningAttraction1, burningAttraction2, burningAttraction3]
  },
  {
    slug: "no-exit",
    name: "NO EXIT",
    category: "Aged Areca & Oud",
    price: 1800,
    priceLabel: "₹1,800",
    img: noExitImg,
    hr: "10 HR",
    description: "ഈ പെർഫ്യൂമിനെ കുറിച്ച് പറയുകയാണെങ്കിൽ യൂസേഴ്സ് മാത്രം ഇത് ഉപയോഗിക്കുന്ന ഒന്നുതന്നെയാണ് ഇത് തുടക്കക്കാർക്ക് ദഹിക്കണമെന്നില്ല കാരണം ഇത് അല്പം ഊതാണ് ലക്ഷ്വറിസ് ലക്ഷ്വറിയുടെ അവസാനവാക്ക് പുരാതനകാലം പെർഫ്യൂമകളുടെ ലഭ്യത കുറവ് അന്ന് കരയെ മാത്രം ആശ്രയിച്ചിരുന്ന കാലഘട്ടത്തിൽ പേർഷ്യൻ രാജ്യകുടുംബം ഷെയ്ക്ക് റാഷിദ് അൽ മഖ്ദൂം ഫാമിലി മുതൽ ഇങ്ങോട്ട് ഈ കാലഘട്ടത്തിലും ഉപയോഗിച്ചു പോരുന്നത് അറബികളുമായി കൂടുതൽ ബന്ധമുള്ള ആളുകൾക്ക് ഇത് മനസ്സിലാക്കാൻ കഴിയും\nഅടക്ക നീറ്റിയ പോലെയുള്ള ഒരു ഊത് അറബി നാട്ടിൽ വിലയേറിയത് കാരണം അവിടെ അവരുടെ വിലക്കാണ് ഇത് കൊടുക്കുന്നത് ഒരു മലയാളിക്ക് അത് താങ്ങാൻ കഴിയണമെന്നില്ല ഞങ്ങൾ ഇത് ഇവിടെ കൊണ്ടുവന്നത് വലിയ റിസ്ക് തന്നെയാണ്.ഒരു ദിവസം ഒരു വട്ടം സ്പ്രേ ചെയ്യുക ആ ദിവസം മുഴുവൻ ആ ഒരു ഒറ്റ സ്പ്രയിൽ കഴിയുക അതുമതി പിന്നീട് പതിയെ പതിയെ ഇഷ്ടനുസരണം കൂട്ടി ഉപയോഗിക്കാൻ സാധിക്കുമെങ്കിൽ പരീക്ഷിക്കുക നല്ല പെർഫ്യൂം ആണെന്ന് ആളുകൾ പറയാൻ നിങ്ങളോട് മടിക്കും കാരണം അവർക്ക് നിങ്ങളോട് മിണ്ടാൻ പേടിയായിരിക്കും ഭയഭക്തിയാണ് ഇതിന്റെ കാരണം",
    base: "OUD_BASE",
    pricing: { "10 ml": 800, "50 ml": 1800 },
    gallery: [noExit10mlImg]
  },
  {
    slug: "extrovert",
    name: "EXTROVERT",
    category: "Amber & Velvet Oud",
    price: 1300,
    priceLabel: "₹1,300",
    img: extrovertImg,
    hr: "3 HR",
    description: "ഈ പെർഫിനെ കുറിച്ച് പറയുകയാണെങ്കിൽ ഇത് ഒരു ഗൾഫുകാരന്റെ സുഗന്ധം നൽകുന്നു നമുക്ക് വീട്ടിലെ ഫങ്ക്ഷൻസ് ഇവന്റെ എൻഗേജ്മെന്റ് ഇത്തരത്തിലുള്ള ദിവസങ്ങളിൽ അനുയോജ്യമായത് കുടുംബ അംഗങ്ങൾക്കിടയിൽ നമ്മളെ വേറിട്ട് നിർത്തും ഒരു പണക്കാരനെ പോലെ ലൈറ്റ് ആണ് സ്ത്രീകൾക്കും പുരുഷന്മാർക്കും ഒരുപോലെ ഇഷ്ടപ്പെടുന്നത് ഊതും ലെതറും ഉണ്ടെങ്കിലും ആമ്പറിന്റെ സുഗന്ധം അതിനെ വളരെ ലൈറ്റ് ആകുന്നു.തലയ്ക്കു മത് പിടിപ്പിക്കാത്ത വിധത്തിൽ രൂപപ്പെടുത്തിയത്",
    base: "OUD_BASE",
    pricing: { "10 ml": 550, "50 ml": 1300 },
    gallery: [extrovert10mlImg]
  },
  {
    slug: "naked-noise",
    name: "NAKED NOISE",
    category: "Passion Fruit & Oud",
    price: 1300,
    priceLabel: "₹1,300",
    img: nakedNoiseImg,
    hr: "8 HR",
    description: "ഈ പെർഫ്യൂമിനെ കുറിച്ച് പറയുകയാണെങ്കിൽ വാങ്ങിയ പൈസയ്ക്ക് രണ്ടിരട്ടി ലാഭം തരുന്ന പ്രോഡക്റ്റ് ഇത് ഒരു കസ്റ്റമർക്ക് കാഴ്ചവെക്കുന്ന രീതി രണ്ടു ആളുകളിൽ നിന്ന് ഒരാളെ മാറ്റി 20 മീറ്റർ ദൂരത്തോട്ട് നിർത്തുന്നു . അവിടെവച്ച് അയാൾക്ക് ഈ പെർഫ്യൂം ദേഹത്ത് അടിച്ചു കൊടുക്കുന്നു മറുഭാഗത്ത് നിൽക്കുന്ന ആൾക്ക് ഒരു മിനിറ്റിനുള്ളിൽ ഈ സുഗന്ധം അനുഭവിച്ചറിയാൻ സാധിച്ചാൽ പ്രോഡക്റ്റ് വിൽക്കത്തൊള്ളൂ അടങ്ങിയിരിക്കുന്ന കാര്യങ്ങൾ പാഷൻ ഫ്രൂട്ടിന്റെ വീര്യം കൂടെ ഊതും അതിനിടയിൽ കൂടെ കാന്റീ സുഗന്ധവും. ഇത് ഉപയോഗിച്ച് കടന്നുപോകുമ്പോൾ തലതിരിച്ചു നോക്കാൻ തോന്നിക്കുന്ന വിധം ആകർഷണ മാക്കപ്പെട്ടത്. ഉപയോഗിച്ചതിനു ശേഷം ഒരു വീട്ടിൽ ഗസ്റ്റ് ആയി പോവുകയോ ഒരു കടയിൽ കയറി സാധനം വാങ്ങാൻ പോവുകയോ ചെയ്താൽ അവിടെയുള്ളവർ തമ്മിൽ നോക്കി വന്നിരിക്കുന്ന ആളെ കുറിച്ച് സംസാരവിഷയം ആക്കുന്ന വീര്യം അതാണ് നേക്കഡ് നോയിസ്",
    base: "OUD_BASE",
    pricing: { "10 ml": 550, "50 ml": 1300 },
    gallery: [nakedNoise10mlImg, nakedNoise1, nakedNoise2]
  },

  // --- FLORAL BASE ---
  {
    slug: "seduction",
    name: "Seduction",
    category: "Floral Base",
    price: 1300,
    priceLabel: "₹1,300",
    img: seductionImg,
    hr: "6 HR",
    description: "ഈ പെർഫ്യൂമിനെ കുറിച്ച് പറയുകയാണെങ്കിൽ അടങ്ങിയ ഒരു പ്രോഡക്റ്റ് എന്താണ് ഫെർമോൺ മൃഗങ്ങളും മനുഷ്യരും ബന്ധപ്പെടുന്ന സമയത്ത് പുറപ്പെടുവിക്കുന്ന ഒരു രാസപ്രക്രിയയാണ് ഈ മോളിക്കോൾസ് ഒരു റൊമാന്റിക് പെർഫ്യൂമിലോട്ട് ഇൻവെസ്റ്റ് ചെയ്തിരിക്കുന്ന ഒരു പ്രോഡക്റ്റ് തമ്മിൽ സ്നേഹിക്കപ്പെടുന്ന സമയത്ത് കമിതാക്കൾ കൂടുതലായി ഉപയോഗിക്കുന്നു ഒരു മൂഡ് എൻഹാൻസിങ് ആണ് ഇതിൽ നിന്ന് ലഭിക്കുന്നത് ഈ പെർഫ്യൂമിനെ കുറിച്ച് തമ്മിൽ സംസാരിക്കാൻ പാടുള്ളതല്ല ഒരു ഇമോഷണൽ കണക്ഷനെ അത് ബ്രേക്ക് ചെയ്യപ്പെടും അവൾ ഉപയോഗിച്ചാൽ അവനിലോട്ട് ഇതിനെക്കുറിച്ച് യാതൊരു അറിവും പറയാൻ പാടുള്ളതല്ല അവൻ ഉപയോഗിക്കുകയാണെങ്കിൽ അവളിലോട്ടും പറയരുത് ഞങ്ങളുടെ സക്സസ്ഫുൾ പ്രോഡക്റ്റ്",
    base: "FLORAL_BASE",
    pricing: { "10 ml": 550, "50 ml": 1300 },
    gallery: [seduction10mlImg, seduction1, seduction2, seduction3, seduction4]
  },
  {
    slug: "suck-eyes",
    name: "Suck eyes",
    category: "Yang Lang with White Lilly",
    price: 1300,
    priceLabel: "₹1,300",
    img: suckEyesImg,
    hr: "3 HR",
    description: "ഈ പെർഫ്യൂമിനെ കുറിച്ച് പറയുകയാണെങ്കിൽ yang lang ഫ്ലവറും വൈറ്റ് ലില്ലി ഫ്ലവറും കൂടിച്ചേർന്ന ദിവസവും ഉപയോഗിക്കാൻ കഴിയുന്നത് ഈവനിംഗ് പുറത്തു പോകുമ്പോൾ പ്രത്യേക പ്രൊജക്ഷനും ക്ലോറൽ പെർഫ്യൂമുകളിൽ ഏറ്റവും ഏറ്റവും വിറ്റഴിക്കാൻ സാധ്യതയുള്ള സുഗന്ധം കാരണം ഇത് എളുപ്പത്തിൽ ലഭിക്കുന്ന ഒന്നല്ല ക്ലോസ്ഡ് ആംബിയൻസിൽ നമുക്ക് ചുറ്റുമുള്ളവർക്ക് നമ്മളെ മികച്ചതായി കാണിക്കുന്നു",
    base: "FLORAL_BASE",
    pricing: { "10 ml": 550, "50 ml": 1300 },
    gallery: [suckEyes10mlImg]
  },
  {
    slug: "suicide-kiss",
    name: "Suicide kiss",
    category: "Amber grees with vannilla",
    price: 1300,
    priceLabel: "₹1,300",
    img: suicideKissImg,
    hr: "1 HR",
    description: "ഈ പെർഫ്യൂമിനെ കുറിച്ച് പറയുകയാണെങ്കിൽ വളരെ കുറഞ്ഞ ലോങ്ങ് ലാസ്റ്റിംഗ് എന്ന് തുറന്നു കസ്റ്റമറോട് പറഞ്ഞാലും അവർക്ക് ഈ പെർഫ്യൂം തന്നെ മതി ഇതിന് കാരണമുണ്ട് ഇതു വളരെ മിനുസമാർന്നതും തലയ്ക്ക് പിടിപ്പിക്കാത്തതും നമ്മളെ ഇന്ദ്രിയങ്ങളെ സുഗമപ്പെടുത്തുന്നതും കാരണം ഇത് നിർമ്മിച്ചത് ഒരു സുഗന്ധം അനുഭവിച്ചാൽ തലവേദന ഉണ്ടാകുന്ന ആളുകൾക്ക് വേണ്ടിയാണ് അവർക്ക് ദീർഘകാലം നീണ്ടു നിൽക്കുന്ന പ്രൊജക്ഷനും ലാസ്റ്റിംഗും ഉണ്ടായാൽ തലക്ക് ഒരു കട്ടി അനുഭവപ്പെടും . അത് സ്ട്രെസ്സ് വർദ്ധിപ്പിക്കും നേർത്തതും ഒരാളെയും വെറുപ്പിക്കാത്തതും ഒരു ഫ്രണ്ട്ലി സ്വഭാവമുള്ളതുമാണ് ഈ പെർഫ്യൂം ദിവസവും ഉപയോഗിക്കാൻ കഴിയുന്നത് ഒരു മണിക്കൂർ മാത്രമേ നിലനിൽക്കുകയുള്ളൂ ഞങ്ങൾ തുറന്നു പറയാൻ റെഡിയാണ് ഇതൊരു വർഷമായി ഞങ്ങൾ വിറ്റഴിക്കു",
    base: "FLORAL_BASE",
    pricing: { "10 ml": 550, "50 ml": 1300 },
    gallery: [suicideKiss10mlImg]
  },
  {
    slug: "eves-temptation",
    name: "Eve's temptation",
    category: "Rose + Red Berry",
    price: 1300,
    priceLabel: "₹1,300",
    img: evesTemptationImg,
    hr: "12 HR",
    description: "ഈ പെർഫ്യൂമിനെ കുറിച്ച് പറയുകയാണെങ്കിൽ ഒരാൾ വന്ന് ആർക്കെങ്കിലും ഗിഫ്റ്റ് കൊടുക്കാൻ പെർഫ്യൂം വേണം എന്നു പറഞ്ഞാൽ ഈ പെർഫ്യൂം ആണ് സജസ്റ്റ് ചെയ്യുന്നത് കാരണം വാങ്ങാൻ വരുന്ന ആൾക്ക് ഗിഫ്റ്റ് കൊടുക്കാൻ ആഗ്രഹിക്കുന്ന ആളുടെ ഇഷ്ടപ്പെട്ട പെർഫ്യൂം ഏതായിരിക്കും എന്ന് അവർക്ക് അറിയാൻ കഴിയില്ല. ഞങ്ങൾ ഇതു തിരഞ്ഞെടുത്തു . കാരണമുണ്ട് മനുഷ്യർ ആരും ഇതുവരെ നോ പറയാത്തത് സുഗന്ധം എന്തിനെയാണ് സൂചിപ്പിക്കുന്നത് ഒരു ആഡംബര കല്യാണ ദിവസത്തെ അനുസ്മരിപ്പിക്കും വിധത്തിൽ തയ്യാറാക്കപ്പെട്ടത്. ഒരു ടിപ്പിക്കൽ പെർഫ്യൂം ആയി ആരും കാണില്ല. ആദ്യ അനുഭവത്തിൽ ആരുടെയും മുഖം ചുളിയില്ല കോൺഫിഡന്റിന്റെ അറ്റം. പേരുപോലെതന്നെ ഹവ്വ ഭൂമിയിലെ ആദ്യ സ്ത്രീ പ്രലോഭിപ്പിച്ചതുപോലെ",
    base: "FLORAL_BASE",
    pricing: { "50 ml": 1300 },
    gallery: [evesTemptation1, evesTemptation2, evesTemptation3, evesTemptation4, evesTemptation5, evesTemptation5b, evesTemptation6, evesTemptation7]
  },

  // --- FRUITY BASE ---
  {
    slug: "mood-swings",
    name: "Mood swings",
    category: "Mixed Fruit's",
    price: 1300,
    priceLabel: "₹1,300",
    img: moodSwingsImg,
    hr: "6 HR",
    description: "ഈ പെർഫ്യൂമിനെ കുറിച്ച് പറയുകയാണെങ്കിൽ ആരാണ് ലോങ്ങ് പ്രൊജക്ഷൻ ആഗ്രഹിക്കുന്നവർ വീട്ടിൽ ഉപയോഗിച്ചാൽ അയൽവക്കത്തെ ആൾ വന്ന് അതിനെക്കുറിച്ച് ചോദിക്കും സംശയമുണ്ടോ നിങ്ങൾക്ക് ഞങ്ങൾ ഗുണകരമല്ലാത്തത് ചെയ്യുമെന്ന് തോന്നുന്നുണ്ടോ 20 മീറ്ററോളം പെർഫ്യൂമിന്റെ പ്രൊജക്ഷൻ നീണ്ടുനിൽക്കുന്നു പലതരം ഫ്രൂട്ട്സുകളുടെ സ്വഭാവസവിശേഷത മാറിമാറി വരുന്ന നോട്ട്സ്. ആണും പെണ്ണും ഒരുപോലെ സംസാരവിഷയം ഉണ്ടാക്കുന്ന പെർഫ്യൂം എവിടെ നിന്നാണ് ഇത് വാങ്ങിയത് എന്ന് നിങ്ങളോട് പത്തുപേർ ചോദിക്കും ഇതിൽ കൂടുതൽ എന്താണ് നിങ്ങൾക്ക് വേണ്ടത്. മിക്സഡ് ഇമോഷൻസ്. ഒരു വിഷമഘട്ടത്തിൽ ഒന്ന് ഉപയോഗിച്ചു നോക്കൂ നിങ്ങളുടെ നിയന്ത്രണം വിട്ടു വിഷമിക്കുന്ന കാര്യത്തിൽ നിന്ന് നിങ്ങൾ ഡൈവേർട്ട് ആകും. ഈ പെർഫ്യൂം ഉപയോഗിച്ചവർ ഞങ്ങളെ വിട്ടു ഒരിക്കലും ഞങ്ങളെ വിട്ടു പോവില്ല എന്ന് തെളിയിച്ചതാണ്ന്നു",
    base: "FRUITY_BASE",
    pricing: { "15 ml": 600, "50 ml": 1300 },
    gallery: [moodSwings15mlImg]
  },
  {
    slug: "provocative-wine",
    name: "Provocative wine",
    category: "Apricot with coconut",
    price: 1300,
    priceLabel: "₹1,300",
    img: provocativeWineImg,
    hr: "12 HR",
    description: "ഈ പെർഫ്യൂമിനെ കുറിച്ച് പറയുകയാണെങ്കിൽ പാരീസ് നഗരത്തിലെ വിലകൂടിയ ഒരു വൈൻ വളരെ മൈൽഡ് പെർഫ്യൂം ഉപയോഗിച്ചു ആദ്യ സമയങ്ങളിൽ ഇതിനെ മനസ്സിലാക്കാൻ കഴിയില്ല മദ്യം പോലെ ഉയർന്ന പണം കൊടുത്തു വാങ്ങുന്ന മദ്യം സാവധാനത്തിൽ ലഹരി പിടിപ്പിക്കും പോലെ പ്ലം അപ്പ്രിക്കോട്ട് റെഡ് ബെറി കോക്കനട്ട് ഇവയെല്ലാം ചേർന്ന് ഉണ്ടാക്കിയ വാറ്റ്. പുറത്ത് വർക്ക് ചെയ്യുന്നവർക്ക് വേണ്ടിയല്ല. ഒരു ഓഫീസ് ജീവനക്കാർക്ക് സൗമ്യമായ പെർഫ്യൂം. പ്രൊജക്ഷനും ലോങ്ങ് ലാസ്റ്റിംഗും ക്ലോസെഡ് ആംബിയൻസിൽ കൂടുതൽ നിലനിൽപ്പ്. ചുറ്റുമുള്ളവരെ വെറുപ്പിക്കില്ല. മൃദുലതയാർന്ന ചുവന്ന വാറ്റ്",
    base: "FRUITY_BASE",
    pricing: { "50 ml": 1300 },
    gallery: [provocativeWine1, provocativeWine2, provocativeWine3]
  },

  // --- FRESH BASE ---
  {
    slug: "dopamine",
    name: "DOPAMINE",
    category: "Mint with Green Lemon",
    price: 1300,
    priceLabel: "₹1,300",
    img: dopamineImg,
    hr: "3 HR",
    description: "ഈ പെർഫ്യൂമിനെ കുറിച്ച് പറയുകയാണെങ്കിൽ നമ്മളുടെ ബ്രാൻഡിൽ ഒരേ ഒരു ഫ്രഷ് ഫ്രാഗ്രന്റ് ഇതു മതി ഒരുപാട് നാളുകൾ പല ഫ്രഷ് പെർഫ്യൂമുകളും നമ്മൾ കണ്ടു കാണും ലോങ്ങ് ലാസ്റ്റിംഗ് ഒരു മണിക്കൂർ മാത്രം തരുന്നത് ലോകത്തെവിടെയും ഫ്രഷ് സിട്രിക് ബേസ് പെർഫോമുകൾ ഒന്നോ രണ്ടോ മണിക്കൂർ മാത്രം ലാസ്റ്റിംഗ് തരുന്നു ഇത് വളരെ കെയർഫുൾ ആയി സ്മൂത്ത് ബ്ലെൻഡ് ചെയ്തു നിർമ്മിക്കപ്പെട്ടത് ഹൈ ഡോസ് ആണ് രാവിലെ ഉപയോഗിക്കാൻ നിർമ്മിച്ചത് ഓഫീസിൽ ഉപയോഗിക്കാൻ കഴിയും ജിമ്മിൽ കൊണ്ടുപോകാൻ ഏത് അവസരത്തിലും ഉപയോഗിക്കാൻ കഴിയുന്നതാണ് കാരണം ഫ്രഷ് സ്മെല്ലുകൾ നമുക്ക് എവിടെയും ആളുകളിൽ നിന്ന് നല്ല സംസാരം നല്ല ഫീൽ ലഭിക്കുന്നു ഓറഞ്ച് ലെമൺ മിന്റ് ബബ്ലൂസ് നാരങ്ങ ഇല ഉയർന്ന ഫ്രഷ്നസ് ഈ ബ്രാൻഡിൽ ഒരേയൊരു ഫ്രഷ് പെർഫ്യൂം എത്രത്തോളം ഫോക്കസ് ചെയ്തു നിർമ്മിച്ചതായിരിക്കും. ഒരിക്കലും നിങ്ങളെ വിഷമിപ്പിക്കില്ല ഒരു വൈകുന്നേരം ഉപയോഗിച്ചാൽ രാവിലെ എന്നപോലെ ഒരു ഫീൽ ഒരു തണുത്ത പെർഫ്യൂം",
    base: "FRESH_BASE",
    pricing: { "10 ml": 550, "50 ml": 1300 },
    gallery: [dopamine10mlImg, dopamine1, dopamine2, dopamine3, dopamine4, dopamine5]
  },

  // --- ROLL ON PREMIUM ---
  {
    slug: "dubai-nights",
    name: "DUBAI NIGHTS",
    category: "Patchouli & warm spicy",
    price: 1020,
    priceLabel: "₹1,020",
    img: dubaiNightsImg,
    hr: "8 Hours",
    description: "മരുഭൂമിയിലെ രാത്രികളുടെ സമൃദ്ധിയും രഹസ്യവും. ഈത്ത പന മരത്തിൽ നിന്നും നേർത്ത സൗമ്യമായ ഊദിലേക്.ഫ്രഞ്ച് രാജകുമാരിമാർക്കിടയിൽ ഏറ്റവും പ്രിയപ്പെട്ടത്",
    base: "ROLL_ON_PREMIUM",
    pricing: { "10 ml": 1020 }
  },
  {
    slug: "palace-in-paris",
    name: "PALACE IN PARIS",
    category: "Dry Oriental & rare oud",
    price: 1020,
    priceLabel: "₹1,020",
    img: placeParisImg,
    hr: "24 Hours",
    description: "ഒരു പുതിയ സൗഹൃദത്തിന്റെ തുടക്കം.ആഴമേറിയ സൗഹൃദം പോലെ ഒരിക്കലും വിട്ടു പിരിയാൻ ആകാത്ത വിധം ശരീരത്തിൽ നിലനിൽക്കുന്ന ഊദ്. വെള്ളമൊഴിച്ചു കഴുകിയാലും പിരിഞ്ഞു പോകാൻ പറ്റാത്ത വിധം നിലനിൽക്കുന്നത്. രാജ്യങ്ങൾ തമ്മിലുള്ള ആഴമേറിയ സൗഹൃദം പോലെ കണക്കാക്കുന്ന വിധം നിർമ്മിക്കപ്പെട്ടത്",
    base: "ROLL_ON_PREMIUM",
    pricing: { "10 ml": 1020 }
  },
  {
    slug: "last-seen",
    name: "LAST SEEN",
    category: "Tuberose & fruity",
    price: 1020,
    priceLabel: "₹1,020",
    img: lastSeenImg,
    hr: "8 Hours",
    description: "അകലങ്ങൾക്കിടയിലും നിലനിൽക്കുന്ന ഓർമ്മകൾ. ഒരു കാമുകിയെ പോലെ നീ സ്നേഹിക്കപെടാൻ ഉറപ്പുള്ള സുഗന്ധം . സ്നേഹമാണ് ഒരുപാട് അകന്നു പോവാൻ കഴിയാത്ത വിധം സ്നേഹിക്കപെടും . തീർന്നു പോയാൽ കരച്ചിൽ വരും. ആത്മബന്ധം പുനഃസ്ഥാപിക്കാൻ വീണ്ടും മനസ് ആഗ്രഹിക്കുന്ന ഒന്ന് .",
    base: "ROLL_ON_PREMIUM",
    pricing: { "10 ml": 1020 }
  },
  {
    slug: "cafe-lips",
    name: "CAFE LIPS",
    category: "Coffee & warm spicy",
    price: 1020,
    priceLabel: "₹1,020",
    img: cafeLipsImg,
    hr: "8 Hours",
    description: "കൊട്ടാരങ്ങളിലെ ഔദ്യോഗിക കൂടിക്കാഴ്ചകൾ കഴിഞ്ഞ്, മനുഷ്യരെ അടുത്ത് കൊണ്ടുവന്ന സംഭാഷണങ്ങളുടെ സുഗന്ധം. ആദ്യത്തെ സ്പ്രിറ്റ്സിൽ തന്നെ, കഫെ ലാറ്റെ നിങ്ങളുടെ ഇന്ദ്രിയങ്ങളെ ഉണർത്തുന്നു, കടുപ്പമേറിയ കോഫി, മധുരമുള്ള ബദാം, ക്രീം പാൽ എന്നിവയുടെ മികച്ച കുറിപ്പുകൾ. സുഗന്ധം പരക്കുമ്പോൾ, മിനുസമാർന്ന ഐസ്ക്രീം, സ്വർണ്ണ വാനില, ചൂടുള്ള ആമ്പർ എന്നിവയുടെ ഹൃദയസ്പർശിയായ കുറിപ്പുകൾ ഒരുമിച്ച് ഉരുകി, നിങ്ങളെ ഒരു സ്വാദിഷ്ടമായ മൃദുലമായ ആലിംഗനത്തിൽ പൊതിഞ്ഞു നിർത്തുന്നു.",
    base: "ROLL_ON_PREMIUM",
    pricing: { "10 ml": 1020 }
  },
  {
    slug: "sacrifice",
    name: "SACRIFICE",
    category: "Sichuan pepper & ginger",
    price: 1020,
    priceLabel: "₹1,020",
    img: sacrificeImg,
    hr: "8 Hours",
    description: "ഒരു സാമ്രാജ്യം നിലനിൽക്കാൻ നൽകിയ ത്യാഗങ്ങളുടെ ഓർമ്മ. പുരുഷന്മാർക്ക് വേണ്ടിയുള്ള ഒരു നിർത്തലാക്കപ്പെട്ട, കരുത്തുറ്റതും ഇരുണ്ടതുമായ ചൈപ്രെ സുഗന്ധം. ഇത് മൂർച്ചയുള്ളതും കടുപ്പമുള്ളതുമായ സുഗന്ധവ്യഞ്ജനങ്ങളെ സമ്പന്നമായ, മണ്ണുകൊണ്ടുള്ള മരങ്ങളുമായി താരതമ്യം ചെയ്യുന്നു, ഇത് ക്ഷമാപണമില്ലാത്തതും, പക്വവും, ആധുനികവുമായ ഒരു ભാവം നൽകുന്നു.",
    base: "ROLL_ON_PREMIUM",
    pricing: { "10 ml": 1020 }
  },
  {
    slug: "lionel-leather",
    name: "LIONEL LEATHER",
    category: "animalic & horse leather",
    price: 2000,
    priceLabel: "₹2,000",
    img: messiProductImg,
    hr: "24 Hours",
    description: "ഈ പെർഫ്യൂമിനെ കുറിച്ച് പറയുകയാണെങ്കിൽ മെസ്സിയുടെ സ്വന്തം ബ്രാൻഡിൽ നിന്നും ഇറക്കിയ ഒരു ഡ്യൂപ്പ് അല്ല അതിൽ ഒന്നും അധികനേരം നിലനിൽക്കുന്ന പെർഫ്യൂമുകൾ ലഭ്യമല്ല കൂടാതെ അത് മാർക്കറ്റിൽ ലഭ്യമാണ്. ഞങ്ങളുടെ ഫോക്കസിംഗ് അദ്ദേഹത്തിന്റെ പേഴ്സണൽ കളക്ഷനിൽ നിന്നും ഒരെണ്ണം ആയിരുന്നു. വളരെ കഠിന്യമേറിയ ജോലി തന്നെയാണ് ഇത്. അദ്ദേഹത്തിന് ലതറി നോട്ട് നോട് ഇഷ്ടം കൂടുതലാണ്. ഞങ്ങൾ ഒരുപാട് കടപ്പെട്ടത്  Fueguia 1833 Perfume House Argentina. ഒരു ശരിയായ വിഷൻ അവരിൽ നിന്നും നമുക്ക് ലഭിച്ചു. അർജന്റീന കൂട്ടുകാരോട് നന്ദി. ഒരു പുരുഷന് വേണ്ട സുഗന്ധം വളരെ മസ്കുലിൻ നനഞ്ഞ ലതറിന്റെ മത്തുപിടിപ്പിക്കും വിധം സുഗന്ധത്താൽ പൊതിഞ്ഞത്. നീണ്ട നേരം നിലനിൽക്കുന്നത്. ഒരു മരണവീട്ടിൽ അറിയാതെ പോലും ഉപയോഗിച്ചു അടിച്ചു ഉപയോഗിച്ചു പോകാൻ കഴിയാത്തതു. ചുറ്റുപാട് നിൽക്കുന്നവർക്ക് വളരെ ആകാംക്ഷയേറിയതും കാഠിന്യത്താൽ ഗുണമേന്മയേറിയതും അവസാനം ലഭിച്ചു.",
    base: "MESSI_EDITION",
    pricing: { "10 ml": 400, "50 ml": 2000 },
    gallery: [messiGalleryImg, messiHeroImg]
  },
  {
    slug: "divorce-lotion",
    name: "DIVORCE LOTION",
    category: "Honey & Oud",
    price: 650,
    priceLabel: "₹650",
    img: divorceLotionProduct,
    hr: "",
    description: "ബോഡി ലോഷന്റെ ഉപകാരം ഒരാൾക്ക് 50 സ്ത്രീകളുമായി അടുപ്പമുണ്ട് അതിൽ ഒരു സ്ത്രീ മാത്രമാണ് ബോഡി ലോഷൻ ഉപയോഗിക്കുന്നത് ഒരു കാര്യം പറയട്ടെ ഒരു 50 വർഷം കഴിഞ്ഞാൽ ഈ 50 സ്ത്രീകളിൽ ഒരാളെ മാത്രം നീ ഓർമിക്കുകയുള്ളൂ . ഓർമ്മ വരുകയുള്ളൂ ബാക്കി 49 ആളുകൾക്കും അവരവരുടേതായ ശരീര സുഗന്ധം ആണുള്ളത് ഒരു മനുഷ്യന് അത് ഓർത്തിരിക്കാൻ കഴിയുന്നതല്ല. ബോഡി ലോഷൻ ഉപയോഗിച്ച സ്ത്രീയെ നീ മരണംവരെ മറക്കുകയുമില്ല നിനക്ക് കിട്ടിയ അനുഭൂതി. ആയിരം നിമിഷങ്ങൾ നിനക്ക് ഓർക്കാൻ ഉണ്ടാവും. ഡിവോസിൽ അടങ്ങിയിരിക്കുന്നത് ലക്ഷ്വറി ഊദ് ഹണി കോമ്പൗണ്ട് ആണ്. പേഴ്സണലി ഊദ്  ഇഷ്ടമല്ലാത്തവർ ഈ ലോഷൻ വാങ്ങരുത്. ഇത് സൗന്ദര്യത്തിലും സുഗന്ധത്തിലും ആഡംബരത്തിലും ഈ ലോകത്ത് ഏറ്റവും പണം ചെലവഴിക്കുന്ന അറബ് സ്ത്രീകൾ ആണ് അതിൽ ഒരു സംശയവുമില്ല അവരുടെ പേഴ്സണൽ ഫേവറേറ്റ് ലിസ്റ്റിൽ നിന്നും ഈ ബോഡി ലോഷൻ സമർപ്പിക്കുന്നു",
    base: "DIVORCE_LOTION",
    pricing: { "100 ml": 650 },
    gallery: [divorceLotionHero, divorceLotionGallery1, divorceLotionGallery2]
  }
];

export const PRODUCT_IMAGES: Record<string, string> = {
  "divorce-hero": divorceHero,
  "divorce": divorceImg,
  "naked-noise": nakedNoiseImg,
  "extrovert": extrovertImg,
  "no-exit": noExitImg,
  "ego": egoImg,
  "burning-attraction": burningAttractionImg,
  "ego-10ml": ego10mlImg,
  "naked-noise-10ml": nakedNoise10mlImg,
  "no-exit-10ml": noExit10mlImg,
  "extrovert-10ml": extrovert10mlImg,
  "divorce-15ml": divorce15mlImg,
  "seduction": seductionImg,
  "suck-eyes": suckEyesImg,
  "suicide-kiss": suicideKissImg,
  "eves-temptation": evesTemptationImg,
  "mood-swings": moodSwingsImg,
  "provocative-wine": provocativeWineImg,
  "dopamine": dopamineImg,
  "suck-eyes-10ml": suckEyes10mlImg,
  "seduction-10ml": seduction10mlImg,
  "suicide-kiss-10ml": suicideKiss10mlImg,
  "dopamine-10ml": dopamine10mlImg,
  "mood-swings-15ml": moodSwings15mlImg,
  "burning-attraction-1": burningAttraction1,
  "burning-attraction-2": burningAttraction2,
  "burning-attraction-3": burningAttraction3,
  "dopamine-1": dopamine1,
  "dopamine-2": dopamine2,
  "dopamine-3": dopamine3,
  "dopamine-4": dopamine4,
  "dopamine-5": dopamine5,
  "eves-temptation-1": evesTemptation1,
  "eves-temptation-2": evesTemptation2,
  "eves-temptation-3": evesTemptation3,
  "eves-temptation-4": evesTemptation4,
  "eves-temptation-5": evesTemptation5,
  "eves-temptation-5b": evesTemptation5b,
  "eves-temptation-6": evesTemptation6,
  "eves-temptation-7": evesTemptation7,
  "naked-noise-1": nakedNoise1,
  "naked-noise-2": nakedNoise2,
  "provocative-wine-1": provocativeWine1,
  "provocative-wine-2": provocativeWine2,
  "provocative-wine-3": provocativeWine3,
  "seduction-1": seduction1,
  "seduction-2": seduction2,
  "seduction-3": seduction3,
  "seduction-4": seduction4,
};

export function getMergedProducts(): Product[] {
  try {
    const custom = customProductsRaw as Product[];
    const mapped = custom.map((c) => ({
      slug: c.slug,
      name: c.name,
      category: c.category,
      price: c.price,
      priceLabel: `₹${c.price.toLocaleString("en-IN")}`,
      img: c.img,
      hr: c.hr || "12 HR",
      description: c.description,
      base: c.base,
      isCustom: true,
      pricing: c.pricing,
      badge: c.badge,
      featuredOnHomepage: c.featuredOnHomepage,
      heroTitle: c.heroTitle,
      heroDescription: c.heroDescription,
      hoverImg: c.hoverImg,
      gallery: c.gallery || [],
    }));
    
    const customSlugs = mapped.map((p) => p.slug);
    const baseProducts = PRODUCTS.filter((p) => !customSlugs.includes(p.slug));
    
    return [...baseProducts, ...mapped];
  } catch {
    return PRODUCTS;
  }
}

export const CATEGORIES = ["All", "Oud Base", "Floral Base", "Fruity Base", "Fresh Base"] as const;


export type Article = {
  slug: string;
  date: string;
  title: string;
  excerpt: string;
  body: string[];
  img: string;
  category: string;
};

export const ARTICLES: Article[] = [
  {
    slug: "no-makeup-makeup-look",
    date: "May 1, 2025",
    title: "How to Achieve the Perfect 'No-Makeup' Makeup Look",
    excerpt: "Learn the layering, lighting, and product choices that create a radiant, effortless face.",
    body: [
      "The no-makeup makeup look is all about enhancing your natural features with the lightest possible touch.",
      "Start with a hydrating base, then sheer out coverage where you need it. Cream products blend into the skin better than powders and keep the finish dewy.",
      "Finish with a touch of flush on the cheeks and a tinted balm on the lips — that's it.",
    ],
    img: a1,
    category: "Makeup",
  },
  {
    slug: "anti-aging-science",
    date: "Apr 25, 2025",
    title: "The Science Behind Anti-Aging: What Actually Works",
    excerpt: "A clear-eyed look at retinoids, peptides, and antioxidants — and what to skip.",
    body: [
      "Anti-aging skincare is one of the most crowded categories, but only a handful of ingredients have meaningful evidence behind them.",
      "Retinoids remain the gold standard. Peptides and vitamin C have growing support. Most else is supporting cast.",
      "Consistency beats intensity. A simple routine you actually follow will outperform a complicated one you can't sustain.",
    ],
    img: a2,
    category: "Skincare",
  },
  {
    slug: "acne-prone-ingredients",
    date: "Apr 23, 2025",
    title: "The Best Ingredients for Acne-Prone Skin (and What to Avoid)",
    excerpt: "Niacinamide, salicylic acid, azelaic acid — your acne-fighting cheat sheet.",
    body: [
      "Acne-prone skin needs ingredients that balance oil, calm inflammation, and clear pores without stripping the barrier.",
      "Salicylic acid, niacinamide, and azelaic acid are reliable workhorses. Avoid heavy occlusives and fragrance-heavy formulas.",
      "Build your routine slowly and patch test new products — the skin barrier is everything.",
    ],
    img: a3,
    category: "Skincare",
  },
];
