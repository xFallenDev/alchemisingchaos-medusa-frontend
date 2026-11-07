export type ProductShopOptions = {
  personalisation: { enabled: boolean; label: string; max_length: number; prices: Record<string, number> }
  mix_match: { enabled: boolean; hoodie_product_ids: string[]; jogger_product_ids: string[] }
}

const record = (value: unknown): Record<string, unknown> => value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {}

/** Presentation only. Medusa validates settings and prices independently. */
export const getProductShopOptions = (metadata?: Record<string, unknown> | null): ProductShopOptions => {
  const value = record(metadata?.ac_product_options)
  const personalisation = record(value.personalisation)
  const mix = record(value.mix_match)
  const prices = Object.fromEntries(Object.entries(record(personalisation.prices)).filter((entry): entry is [string, number] => typeof entry[1] === "number" && Number.isFinite(entry[1]) && entry[1] >= 0))
  const ids = (value: unknown): string[] => Array.isArray(value) ? value.filter((id): id is string => typeof id === "string").slice(0, 20) : []
  return {
    personalisation: {
      enabled: personalisation.enabled === true,
      label: typeof personalisation.label === "string" ? personalisation.label : "Name or wording",
      max_length: typeof personalisation.max_length === "number" ? Math.max(1, Math.min(100, personalisation.max_length)) : 30,
      prices,
    },
    mix_match: { enabled: mix.enabled === true, hoodie_product_ids: ids(mix.hoodie_product_ids), jogger_product_ids: ids(mix.jogger_product_ids) },
  }
}

export type ConfiguredProductInput = {
  product_id: string
  quantity: number
  expected_total?: number
  variant_id?: string
  text?: string
  hoodie?: { variant_id: string; text?: string }
  joggers?: { variant_id: string; text?: string }
}

export type DisplayItemConfiguration = {
  role: "product" | "hoodie" | "joggers"
  product_title: string
  text: string
  label: string
  surcharge: number
  currency_code: string
}

export const getItemConfiguration = (metadata?: Record<string, unknown> | null): DisplayItemConfiguration | null => {
  const value = record(metadata?.ac_configuration)
  if (value.version !== 1 || !["product", "hoodie", "joggers"].includes(String(value.role))) return null
  return {
    role: value.role as DisplayItemConfiguration["role"],
    product_title: typeof value.product_title === "string" ? value.product_title : "Tracksuit",
    text: typeof value.text === "string" ? value.text : "",
    label: typeof value.label === "string" ? value.label : "Personalisation",
    surcharge: typeof value.surcharge === "number" && Number.isFinite(value.surcharge) ? value.surcharge : 0,
    currency_code: typeof value.currency_code === "string" && /^[a-z]{3}$/i.test(value.currency_code) ? value.currency_code : "gbp",
  }
}
