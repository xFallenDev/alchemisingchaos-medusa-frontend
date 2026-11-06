import { Text } from "@modules/common/components/ui"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"

export default async function ProductPreview({
  product,
  isFeatured,
  region: _region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  // const pricedProduct = await listProducts({
  //   regionId: region.id,
  //   queryParams: { id: [product.id!] },
  // }).then(({ response }) => response.products[0])

  // if (!pricedProduct) {
  //   return null
  // }

  const { cheapestPrice } = getProductPrice({
    product,
  })

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group shop-product-card">
      <div data-testid="product-wrapper">
        <div className="shop-product-card__media">
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            framing={product.metadata?.storefront_image_framing}
            alt=""
            size="full"
            isFeatured={isFeatured}
            className="shop-product-card__image"
          />
          <span className="shop-product-card__arrow" aria-hidden="true">↗</span>
        </div>
        <div className="shop-product-card__details">
          <Text className="shop-product-card__title" data-testid="product-title">
            {product.title}
          </Text>
          <div className="flex items-center gap-x-2">
            {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
