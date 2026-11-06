import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ChevronDown from "@modules/common/icons/chevron-down"
import Brand from "@modules/layout/components/brand"
import ThemeSwitch from "@modules/layout/components/theme-switch"

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="checkout-shell w-full relative small:min-h-screen">
      <div className="festival-header h-20">
        <nav className="flex h-full items-center content-container justify-between gap-3">
          <LocalizedClientLink
            href="/cart"
            className="checkout-back text-small-semi flex items-center gap-x-2 uppercase flex-1 basis-0"
            data-testid="back-to-cart-link"
          >
            <ChevronDown className="rotate-90" size={16} />
            <span className="mt-px hidden small:block txt-compact-plus hover:text-[#f1d79f]">
              Back to shopping cart
            </span>
            <span className="mt-px block small:hidden txt-compact-plus hover:text-[#f1d79f]">
              Back
            </span>
          </LocalizedClientLink>
          <Brand />
          <div className="flex-1 basis-0 flex justify-end"><ThemeSwitch /></div>
        </nav>
      </div>
      <div className="relative" data-testid="checkout-container">{children}</div>
      <div className="py-4 w-full flex items-center justify-center">
        <span className="text-sm text-[#526872]">Alchemising Chaos Festival Shop</span>
      </div>
    </div>
  )
}
