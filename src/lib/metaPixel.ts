declare global {
  interface Window {
    fbq?: any;
    _fbq?: any;
  }
}

const getPixelId = (): string => {
  // Try loading from import.meta.env
  return import.meta.env.VITE_META_PIXEL_ID || "";
};

export const initMetaPixel = () => {
  if (typeof window === "undefined") return;

  const pixelId = getPixelId();
  if (!pixelId) {
    console.warn("[Meta Pixel] VITE_META_PIXEL_ID is not configured. Pixel tracking is inactive.");
    return;
  }

  if (window.fbq) return;

  window._fbq = window._fbq || [];
  window.fbq = function () {
    window.fbq.callMethod
      ? window.fbq.callMethod.apply(window.fbq, arguments)
      : window.fbq.queue.push(arguments);
  };
  if (!window._fbq) window._fbq = window.fbq;
  window.fbq.push = window.fbq;
  window.fbq.loaded = true;
  window.fbq.version = "2.0";
  window.fbq.queue = [];

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  const firstScript = document.getElementsByTagName("script")[0];
  if (firstScript && firstScript.parentNode) {
    firstScript.parentNode.insertBefore(script, firstScript);
  } else {
    document.head.appendChild(script);
  }

  window.fbq("init", pixelId);
  window.fbq("track", "PageView");
};

export const trackPixelEvent = (
  eventName: string,
  params?: Record<string, any>,
  options?: { eventID?: string }
) => {
  if (typeof window === "undefined") return;

  const pixelId = getPixelId();
  if (!pixelId) return;

  if (window.fbq) {
    if (options?.eventID) {
      window.fbq("track", eventName, params, { eventID: options.eventID });
    } else {
      window.fbq("track", eventName, params);
    }
  }
};
