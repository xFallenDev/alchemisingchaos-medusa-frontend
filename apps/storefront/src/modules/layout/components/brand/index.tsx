import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function Brand() {
  return (
    <LocalizedClientLink
      href="/"
      className="festival-brand"
      aria-label="Alchemising Chaos shop home"
      data-testid="nav-store-link"
    >
      <Image
        src="/brand/festival-mark.png"
        alt=""
        width={48}
        height={48}
        className="festival-brand__mark festival-brand__mark--dark"
      />
      <Image
        src="/brand/festival-mark-light.png"
        alt=""
        width={48}
        height={48}
        className="festival-brand__mark festival-brand__mark--light"
      />
      <span className="festival-brand__name">
        <strong>Alchemising Chaos</strong>
        <span>Festival Shop</span>
      </span>
    </LocalizedClientLink>
  )
}
