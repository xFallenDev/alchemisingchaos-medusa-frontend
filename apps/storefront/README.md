# Alchemising Chaos Festival Shop

This is the customer-facing Next.js storefront. It connects to the existing Medusa server; the backend in this starter repository is not used for the live shop.

## Coolify

Deploy this directory as a separate web application. Keep the Medusa server and worker running separately.

- Base directory: `/apps/storefront`
- Port: `8000`
- Install command: `npm install --include=dev`
- Build command: `npm run build`
- Start command: `npm run start`
- Node: 24

Set the application's domain to `https://store.alchemisingchaos.com`. Point the `store` DNS record at the server or tunnel used by the Coolify proxy, and verify that the HTTPS certificate is issued. If another hostname is proxied through Cloudflare, its public DNS answers are Cloudflare addresses, not necessarily the server's origin address.

Configure these environment variables in Coolify for both build and runtime (replace the example key with the store's publishable key):

```env
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://shop-panel.alchemisingchaos.com
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_your_publishable_key
NEXT_PUBLIC_DEFAULT_REGION=gb
NEXT_PUBLIC_BASE_URL=https://store.alchemisingchaos.com
```

Set `NODE_ENV=production` for runtime only. These `NEXT_PUBLIC_` settings are embedded at build time, so rebuild after changing them. Never put database credentials, admin API keys, JWT secrets, or payment secret keys in the storefront environment.

If using Stripe, also configure `NEXT_PUBLIC_STRIPE_KEY` with the matching Stripe **publishable** key. Medusa Payments and Adyen use different public variables, documented in `.env.template`; configure only those needed for your selected provider. Add these public variables at build and runtime too. Payment provider secret keys belong only in the backend.

Add the storefront's HTTPS origin to the existing Medusa server's `STORE_CORS` and `AUTH_CORS` settings without removing other permitted origins, then restart or redeploy that server for the changes to take effect. The publishable key must be associated with the sales channel used for the store's products.

The catalogue uses the standard Medusa product API and region-specific prices, so it does not require the search index included in the starter's separate backend. Products need to be published in the sales channel and have prices for the chosen region.

## Before accepting orders

- Review and replace the starter's placeholder privacy and terms pages with the store's actual policies. Set accurate shipping and returns details.
- Configure shipping, taxes and a suitable payment provider in the existing Medusa backend. Test a complete checkout with the provider's test mode before taking live payments.
- Configure order email/other notifications separately; the storefront itself does not send WhatsApp messages.
- Verify the configured domain, SSL, product images, prices and checkout in Coolify after deployment.

For local development, use the package manager declared in the repository root and the settings documented in `.env.template`. Do not commit real `.env` files.
