import { Suspense } from "react"
import { MagnifyingGlass } from "@medusajs/icons"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { listRegions } from "@lib/data/regions"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Brand from "@modules/layout/components/brand"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"

export default async function Nav() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions(),
    listLocales(),
    getLocale(),
  ])

  return (
    <div className="sticky top-0 inset-x-0 z-50">
      <div className="festival-announcement">
        A little festival magic, wherever you are <span aria-hidden="true">✦</span>
      </div>
      <header className="festival-header">
        <nav className="content-container festival-nav" aria-label="Main navigation">
          <Brand />
          <div className="festival-nav__links">
            <LocalizedClientLink href="/store">Shop all</LocalizedClientLink>
            <a href="https://alchemisingchaos.com/">The festival</a>
            <LocalizedClientLink href="/account" data-testid="nav-account-link">
              Account
            </LocalizedClientLink>
          </div>
          <div className="festival-nav__actions">
            <LocalizedClientLink href="/search" aria-label="Search products" data-testid="nav-search-button">
              <MagnifyingGlass />
            </LocalizedClientLink>
            <Suspense fallback={<LocalizedClientLink href="/cart">Cart (0)</LocalizedClientLink>}>
              <CartButton />
            </Suspense>
            <SideMenu regions={regions} locales={locales} currentLocale={currentLocale} />
          </div>
        </nav>
      </header>
    </div>
  )
}
