import React, { Suspense } from "react"

import VariantImageGallery from "@modules/products/components/image-gallery/variant-image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import { listProducts } from "@lib/data/products"
import { getProductShopOptions } from "@lib/util/product-options"
import ConfiguredProductActions from "@modules/products/components/configured-product-actions"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
}

const ProductTemplate = async ({
  product,
  region,
  countryCode,
}: ProductTemplateProps) => {
  if (!product || !product.id) {
    return notFound()
  }

  const options = getProductShopOptions(product.metadata)
  const configured = options.personalisation.enabled || options.mix_match.enabled
  const ids = [...options.mix_match.hoodie_product_ids, ...options.mix_match.jogger_product_ids]
  const components = options.mix_match.enabled && ids.length
    ? (await listProducts({ regionId: region.id, queryParams: { id: ids, limit: 40 } })).response.products
    : []

  return (
    <>
      <div
        className="content-container shop-product-detail"
        data-testid="product-container"
      >
        <div className="block w-full min-w-0 relative">
          <VariantImageGallery product={product} />
        </div>
        <div className="shop-product-detail__info">
          <p className="shop-eyebrow">Alchemising Chaos Festival Shop</p>
          <ProductInfo product={product} />
          {configured ? <ConfiguredProductActions product={product} region={region} countryCode={countryCode}
            hoodies={components.filter((component) => options.mix_match.hoodie_product_ids.includes(component.id))}
            joggers={components.filter((component) => options.mix_match.jogger_product_ids.includes(component.id))} />
            : <ProductActions product={product} region={region} />}
          <ProductTabs product={product} />
        </div>
      </div>
      <div
        className="content-container my-16 small:my-32"
        data-testid="related-products-container"
      >
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </>
  )
}

export default ProductTemplate
