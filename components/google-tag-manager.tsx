import Script from 'next/script'

/** Google Tag Manager container. NEXT_PUBLIC_GTM_ID overrides it (e.g. for a test container). */
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-NJPP9FHN'

/**
 * Google Tag Manager (official snippet). Loaded after the page becomes
 * interactive so it never delays the first paint. Only rendered in
 * production, so local development doesn't show up in analytics.
 *
 * Page views on client-side navigation are picked up by GA4's enhanced
 * measurement ("page changes based on browser history events"), which is on
 * by default for a GA4 tag set up in Tag Manager.
 */
export function GoogleTagManager() {
  if (process.env.NODE_ENV !== 'production' || !/^GTM-[A-Z0-9]+$/.test(GTM_ID)) return null

  return (
    <>
      <Script id="google-tag-manager" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
      </Script>
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
          title="Google Tag Manager"
        />
      </noscript>
    </>
  )
}
