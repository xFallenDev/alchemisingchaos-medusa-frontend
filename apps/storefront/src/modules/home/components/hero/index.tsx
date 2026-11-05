import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function Hero() {
  return (
    <section className="shop-hero" aria-labelledby="shop-hero-title">
      <div className="content-container shop-hero__inner">
        <div className="shop-hero__copy">
          <p className="shop-eyebrow shop-eyebrow--light">
            <span aria-hidden="true">✧</span> The Alchemising Chaos shop
          </p>
          <h1 id="shop-hero-title">
            Take the magic <em>with you.</em>
          </h1>
          <p className="shop-hero__description">
            A little piece of the gathering, for the moments in between. Explore the official Alchemising Chaos Festival shop.
          </p>
          <div className="shop-hero__actions">
            <LocalizedClientLink href="/store" className="shop-button shop-button--gold">
              Explore the shop <span aria-hidden="true">↗</span>
            </LocalizedClientLink>
            <a href="https://alchemisingchaos.com/" className="shop-button shop-button--outline">
              Discover the festival
            </a>
          </div>
        </div>
        <div className="shop-hero__caption" aria-hidden="true">Music · Creativity · Community</div>
      </div>
    </section>
  )
}
