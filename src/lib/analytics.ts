/**
 * Utilitaires Google Analytics
 * Envoie des événements personnalisés si GA est chargé et accepté
 */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

// Vérifier si GA est disponible et accepté
function isAnalyticsEnabled(): boolean {
  if (typeof window === "undefined") return false;
  const consent = localStorage.getItem("cookie-consent");
  return consent === "accepted" && typeof window.gtag === "function";
}

// Événement générique
export function trackEvent(eventName: string, params?: Record<string, any>) {
  if (!isAnalyticsEnabled()) return;

  window.gtag!("event", eventName, params);
}

// Événements spécifiques

export function trackDownload(format: "epub" | "pdf") {
  trackEvent("download", {
    event_category: "engagement",
    event_label: format,
    format: format,
  });
}

export function trackLike(daySlug: string, action: "add" | "remove") {
  trackEvent("like", {
    event_category: "engagement",
    event_label: daySlug,
    action: action,
  });
}

export function trackDonation(amount: number, currency: string = "EUR") {
  trackEvent("donation_initiated", {
    event_category: "conversion",
    event_label: `${amount}_${currency}`,
    value: amount,
    currency: currency,
  });
}

export function trackDonationSuccess(amount: number, currency: string = "EUR") {
  trackEvent("donation_completed", {
    event_category: "conversion",
    event_label: `${amount}_${currency}`,
    value: amount,
    currency: currency,
  });
}

export function trackContact() {
  trackEvent("contact_form_submit", {
    event_category: "engagement",
  });
}

export function trackPageView(url: string, title: string) {
  if (!isAnalyticsEnabled()) return;

  window.gtag!("config", process.env.NEXT_PUBLIC_GA_ID!, {
    page_path: url,
    page_title: title,
  });
}

// Hook pour Next.js App Router
export function usePageTracking() {
  if (typeof window === "undefined") return;

  // Next.js App Router gère automatiquement les changements de page
  // Mais on peut ajouter un listener si besoin
  const handleRouteChange = (url: string) => {
    trackPageView(url, document.title);
  };

  return handleRouteChange;
}
