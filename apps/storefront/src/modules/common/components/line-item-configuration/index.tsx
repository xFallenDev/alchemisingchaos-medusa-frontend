import { getItemConfiguration } from "@lib/util/product-options"
import { convertToLocale } from "@lib/util/money"

export default function LineItemConfiguration({ metadata }: { metadata?: Record<string, unknown> | null }) {
  const config = getItemConfiguration(metadata)
  if (!config) return null
  return <div className="line-item-configuration" data-testid="line-item-configuration">
    {config.role !== "product" && <p>{config.product_title} · {config.role === "hoodie" ? "Hoodie" : "Joggers"}</p>}
    {config.text && <><p className="break-words">{config.label}: <strong>{config.text}</strong></p><p>Includes {convertToLocale({ amount: config.surcharge, currency_code: config.currency_code })} personalisation per garment</p></>}
  </div>
}
