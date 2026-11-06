import { Metadata } from "next"

import CelestialMark from "@modules/home/components/celestial-mark"
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
      <div className="cosmic-ribbon" aria-label="Music, creativity and community">
        <div className="cosmic-ribbon__track" aria-hidden="true">
          {[0, 1].map((copy) => (
            <span key={copy}>FOR THE DREAMERS <i>✦</i> FOR THE DANCERS <i>✦</i> FOR THE BEAUTIFULLY CURIOUS <i>✦</i> A LITTLE CHAOS, A LOT OF MAGIC <i>✦</i></span>
          ))}
        </div>
      </div>

      <section id="the-collection" className="content-container market-section" aria-labelledby="shop-picks-title">
        <div className="market-section__heading">
          <div>
            <p className="cosmic-kicker"><span aria-hidden="true">✧</span> A little magic for the everyday</p>
            <h2 id="shop-picks-title">Find your <em>something.</em></h2>
          </div>
          <p>Thoughts of the gathering, little treasures and festival feeling—made to wander with you.</p>
        </div>
        <div className="market-layout">
          <div className="market-invitation">
            <CelestialMark className="market-invitation__mark" />
            <p className="market-invitation__index">THE SHOP &nbsp; / &nbsp; 01</p>
            <h3>Take a little<br /><em>chaos</em> home.</h3>
            <p>For all the moments between the music and the magic.</p>
            <LocalizedClientLink href="/store" className="cosmic-link">
              Explore all products <span aria-hidden="true">↗</span>
            </LocalizedClientLink>
          </div>
          {products.length ? (
            <ul className="market-products" data-testid="home-products">
              {products.map((product) => (
                <li key={product.id}><ProductPreview product={product} region={region} /></li>
              ))}
            </ul>
          ) : (
            <div className="shop-empty">
              <CelestialMark />
              <h3>Something special is on its way.</h3>
              <p>Our shop is getting ready. Check back soon to discover what&apos;s new.</p>
              <a href="https://alchemisingchaos.com/" className="cosmic-link">Explore the festival <span aria-hidden="true">↗</span></a>
            </div>
          )}
        </div>
      </section>

      <section className="wonder-banner" aria-labelledby="wonder-title">
        <div className="wonder-banner__art" aria-hidden="true" />
        <div className="wonder-banner__frame" aria-hidden="true" />
        <div className="wonder-banner__content">
          <p className="cosmic-kicker"><span aria-hidden="true">✦</span> A world beyond the ordinary</p>
          <h2 id="wonder-title">Come as you are.<br /><em>Leave a little more you.</em></h2>
          <p>Music, creativity, connection and a little beautiful chaos. The gathering is only the beginning.</p>
          <a href="https://alchemisingchaos.com/" className="portal-button portal-button--primary">Explore the festival <span aria-hidden="true">↗</span></a>
        </div>
      </section>

      {collections.length > 0 && (
        <section className="content-container constellation-section" aria-labelledby="collection-title">
          <div className="constellation-section__heading">
            <div><p className="cosmic-kicker"><span aria-hidden="true">✧</span> Find your own orbit</p><h2 id="collection-title">Explore the <em>collections.</em></h2></div>
            <LocalizedClientLink href="/store" className="cosmic-link">See everything <span aria-hidden="true">↗</span></LocalizedClientLink>
          </div>
          <ul className="constellation-grid">
            {collections.slice(0, 6).map((collection, index) => (
              <li key={collection.id}>
                <LocalizedClientLink href={`/collections/${collection.handle}`} className="constellation-card">
                  <CelestialMark className="constellation-card__mark" />
                  <span className="constellation-card__number">0{index + 1} / COLLECTION</span>
                  <span className="constellation-card__title">{collection.title}</span>
                  <span className="constellation-card__action">Explore collection <b aria-hidden="true">↗</b></span>
                </LocalizedClientLink>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="content-container story-section" aria-labelledby="shop-story-title">
        <div className="story-section__images">
          <div className="story-section__photo"><Image src="/brand/festival-moment.webp" alt="Festivalgoers gathering under warm lights" fill sizes="(max-width: 767px) 90vw, 50vw" /></div>
          <div className="story-section__orbit" aria-hidden="true"><CelestialMark /></div>
          <span className="story-section__caption">A LITTLE GLIMPSE OF OUR WORLD <span aria-hidden="true">✦</span></span>
        </div>
        <div className="story-section__copy">
          <p className="cosmic-kicker"><span aria-hidden="true">✧</span> The story behind the shop</p>
          <h2 id="shop-story-title">The feeling<br /><em>stays with you.</em></h2>
          <p>We believe in the magic of gathering: of music that moves you, new friends, big ideas and the freedom to be entirely yourself.</p>
          <p>This little corner of the festival is here for all the days in between.</p>
          <a href="https://alchemisingchaos.com/" className="cosmic-link">Meet Alchemising Chaos <span aria-hidden="true">↗</span></a>
        </div>
      </section>
    </>
  )
}
