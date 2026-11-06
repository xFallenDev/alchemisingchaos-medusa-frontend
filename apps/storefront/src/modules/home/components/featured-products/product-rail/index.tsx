import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductPreview from "@modules/products/components/product-preview"

export default async function ProductRail({
  collection,
  region,
}: {
  collection: HttpTypes.StoreCollection
  region: HttpTypes.StoreRegion
}) {
  const {
    response: { products: pricedProducts },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      collection_id: collection.id,
      fields: "*variants.calculated_price",
    },
  })

  if (!pricedProducts?.length) {
    return null
  }

  return (
    <div className="content-container shop-collection-section">
      <div className="shop-collection-section__heading">
        <div>
          <p className="shop-eyebrow">Explore the collection</p>
          <h2 className="shop-collection-title">{collection.title}</h2>
        </div>
        <LocalizedClientLink href={`/collections/${collection.handle}`} className="shop-text-link">
          Explore collection <span aria-hidden="true">↗</span>
        </LocalizedClientLink>
      </div>
      <ul className="shop-collection-grid">
        {pricedProducts &&
          pricedProducts.map((product) => (
            <li key={product.id}>
              <ProductPreview product={product} region={region} isFeatured />
            </li>
          ))}
      </ul>
    </div>
  )
}
