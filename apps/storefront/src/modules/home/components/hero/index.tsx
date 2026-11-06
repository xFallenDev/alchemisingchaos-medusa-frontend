import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CelestialMark from "@modules/home/components/celestial-mark"

export default function Hero() {
  return (
    <section className="portal-hero" aria-labelledby="shop-hero-title">
      <div className="portal-hero__sky" aria-hidden="true" />
      <div className="portal-hero__border" aria-hidden="true" />
      <div className="content-container portal-hero__inner">
        <div className="portal-hero__copy">
          <p className="portal-hero__eyebrow"><span aria-hidden="true">✦</span> Welcome to the festival shop <span aria-hidden="true">✦</span></p>
          <h1 id="shop-hero-title">Carry the<br /><em>wonder</em><br />with you.</h1>
          <p className="portal-hero__description">A little piece of Alchemising Chaos, for wherever your own adventure takes you.</p>
          <div className="portal-hero__actions">
            <LocalizedClientLink href="/store" className="portal-button portal-button--primary">
              Enter the shop <span aria-hidden="true">↗</span>
            </LocalizedClientLink>
            <a href="https://alchemisingchaos.com/" className="portal-button portal-button--ghost">
              Discover the festival <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
        <div className="portal-hero__seal" aria-hidden="true">
          <CelestialMark />
          <span>Created for the<br />curious at heart</span>
        </div>
      </div>
      <div className="content-container portal-hero__bottom">
        <span><b>01</b> &nbsp; THE FESTIVAL SHOP</span>
        <a href="#the-collection">Explore our world <span aria-hidden="true">↓</span></a>
      </div>
    </section>
  )
}
