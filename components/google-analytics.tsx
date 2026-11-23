import Script from 'next/script'

/** GA4 Measurement ID (Analytics → Admin → Data streams). NEXT_PUBLIC_GA_ID overrides it. */
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-RXN3TX5CZT'

/**
 * Google Analytics 4 (official gtag.js snippet). Loaded after the page becomes
 * interactive so it never delays the first paint, and only in production so
 * local development doesn't show up in the reports.
 *
 * Page views on client-side navigation are recorded by GA4's enhanced
 * measurement ("Page changes based on browser history events"), which is on by
 * default for web streams.
 */
export function GoogleAnalytics() {
  if (process.env.NODE_ENV !== 'production' || !/^G-[A-Z0-9]+$/.test(GA_ID)) return null

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
      </Script>
    </>
  )
}
