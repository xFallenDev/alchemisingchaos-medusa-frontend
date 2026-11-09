import { HttpTypes } from "@medusajs/types"
import { isVariantInStock } from "./inventory"
import { convertToLocale } from "./money"
import { getPricedVariants } from "./product-structured-data"
import { formatDayRange, getRegionPolicies } from "./store-policies"
import { getProductShopOptions } from "./product-options"

export const renderProductMarkdown = ({
  product,
  region,
  origin,
  countryCode,
}: {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  origin: string
  countryCode: string
}) => {
  const base = `${origin}/${countryCode}`
  const productUrl = `${base}/products/${product.handle}`
  const settings = getProductShopOptions(product.metadata)
  if (settings.mix_match.enabled) {
    return `# ${product.title}\n\n${product.description ?? ""}\n\nBuild this tracksuit at ${productUrl}. Select a hoodie and joggers independently, including each garment's size and colour. The price is the sum of the chosen garments. This container product cannot be bought as a single variant.\n\n${settings.personalisation.enabled ? "Optional personalisation is entered once for the whole tracksuit and charged once on the product page.\n" : ""}`
  }
  const currency = region.currency_code
  const policies = getRegionPolicies(region)
  const optionTitles = new Map(
    (product.options ?? []).map((option) => [option.id, option.title])
  )

  const policyLines = policies
    ? `
- Shipping: ${
        policies.shippingRate === 0
          ? "free"
          : convertToLocale({ amount: policies.shippingRate, currency_code: currency })
      }, ships in ${formatDayRange(policies.handlingDays)} business days, delivery ${formatDayRange(policies.transitDays)} business days
- Returns: within ${policies.returnWindowDays} days of delivery, ${
        policies.freeReturns ? "free return shipping" : "return shipping paid by the customer"
      }`
    : ""

  const variants = getPricedVariants(product)
  const variantRows = variants.map((variant) => {
    const options = (variant.options ?? [])
      .map((value) => `${optionTitles.get(value.option_id ?? "") ?? "Option"}: ${value.value}`)
      .join(", ")
    const price = convertToLocale({
      amount: variant.calculated_price!.calculated_amount!,
      currency_code: currency,
    })
    const stock = isVariantInStock(variant) ? "In stock" : "Out of stock"
    return `| ${options || variant.title} | ${variant.sku ?? ""} | ${price} | ${stock} | \`${variant.id}\` |`
  })

  return `# ${product.title}

${product.description ?? ""}

- URL: ${productUrl}
- Availability: ${variants.some(isVariantInStock) ? "In stock" : "Out of stock"}${policyLines}

## Variants

| Options | SKU | Price | Availability | Variant ID |
| --- | --- | --- | --- | --- |
${variantRows.join("\n")}

## Buy

- Add to cart: POST \`variant_id={variant_id}&quantity={n}\` (form-encoded) to ${base}/cart/add
- Checkout link: ${origin}/buy/{variant_id}:{quantity}?context/address_country=${countryCode.toUpperCase()}

## Policies

- [Shipping information](${base}/shipping)
- [Return policy](${base}/returns)
- [Terms of service](${base}/terms)
- [Privacy policy](${base}/privacy)
- [Contact](${base}/contact)
`
}
