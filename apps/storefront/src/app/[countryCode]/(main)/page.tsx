import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import { listCollections } from "@lib/data/collections"
import { listProducts } from "@lib/data/products"
import { getRegion, listRegions } from "@lib/data/regions"
import { toJsonLd } from "@lib/util/product-structured-data"
import { getSiteOrigin, listCountryCodes, STORE_NAME } from "@lib/util/site"
import { buildRegionsReturnPolicies } from "@lib/util/store-policies"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductPreview from "@modules/products/components/product-preview"
import Image from "next/image"

export const dynamic = "force-static"
export const revalidate = 60

export async function generateMetadata(props: {
  params: Promise<{ countryCode: string }>
}): Promise<Metadata> {
  const { countryCode } = await props.params
  const [origin, regions] = await Promise.all([getSiteOrigin(), listRegions()])

  return {
    title: STORE_NAME,
    description:
      "Explore the official Alchemising Chaos Festival shop and take a little festival magic with you.",
    alternates: {
      canonical: `${origin}/${countryCode}`,
      languages: {
        ...Object.fromEntries(
          listCountryCodes(regions).map((code) => [
            `en-${code.toUpperCase()}`,
            `${origin}/${code}`,
          ])
        ),
        "x-default": origin,
      },
    },
  }
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  if (!collections || !region) {
    return null
  }

  const { response: { products } } = await listProducts({
    regionId: region.id,
    queryParams: { limit: 4 },
  })

  const [origin, regions] = await Promise.all([getSiteOrigin(), listRegions()])
  const homeUrl = `${origin}/${countryCode}`
  const returnPolicies = buildRegionsReturnPolicies(regions)
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: STORE_NAME,
      url: origin,
      ...(returnPolicies.length
        ? { hasMerchantReturnPolicy: returnPolicies }
        : {}),
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: STORE_NAME,
      url: homeUrl,
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${homeUrl}/search?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(structuredData) }}
      />
      <Hero />
      <div className="shop-values" aria-label="Our festival spirit">
        <span>Music</span><span aria-hidden="true">✦</span>
        <span>Creativity</span><span aria-hidden="true">✦</span>
        <span>Community</span>
      </div>
      <section className="content-container shop-section" aria-labelledby="shop-picks-title">
        <div className="shop-section__heading">
          <div>
            <p className="shop-eyebrow">From the gathering</p>
            <h2 id="shop-picks-title">A little festival, every day.</h2>
            <p>Find something to bring the spirit of Alchemising Chaos home.</p>
          </div>
          <LocalizedClientLink href="/store" className="shop-text-link">
            Shop all products <span aria-hidden="true">↗</span>
          </LocalizedClientLink>
        </div>
        {products.length ? (
          <ul className="shop-product-grid" data-testid="home-products">
            {products.map((product) => (
              <li key={product.id}><ProductPreview product={product} region={region} /></li>
            ))}
          </ul>
        ) : (
          <div className="shop-empty">
            <span aria-hidden="true">✧</span>
            <h3>Something special is on its way.</h3>
            <p>Our shop is getting ready. Check back soon to discover what&apos;s new.</p>
            <a href="https://alchemisingchaos.com/" className="shop-text-link">Explore the festival ↗</a>
          </div>
        )}
      </section>
      {collections.length > 0 && <div className="shop-collections">
        <ul className="flex flex-col gap-x-6">
          <FeaturedProducts collections={collections} region={region} />
        </ul>
      </div>}
      <section className="content-container shop-story" aria-labelledby="shop-story-title">
        <div className="shop-story__image">
          <Image src="/brand/festival-gathering.webp" alt="An illustrated gathering under a starry festival sky" fill sizes="(max-width: 768px) 100vw, 50vw" />
        </div>
        <div className="shop-story__copy">
          <p className="shop-eyebrow">More than a festival</p>
          <h2 id="shop-story-title">A gathering for the curious, the creative, the connected.</h2>
          <p>Alchemising Chaos brings music, wellness and creativity together in a celebration of community. Take a little of that feeling with you.</p>
          <a className="shop-text-link" href="https://alchemisingchaos.com/">
            Discover our story <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>
    </>
  )
}
