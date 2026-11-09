"use client"

import { addConfiguredProduct } from "@lib/data/configured-products"
import { notifyCartUpdated } from "@lib/util/cart-events"
import { isVariantInStock } from "@lib/util/inventory"
import { convertToLocale } from "@lib/util/money"
import { ConfiguredProductInput, getProductShopOptions } from "@lib/util/product-options"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@modules/common/components/ui"
import OptionSelect from "../product-actions/option-select"
import { FormEvent, useId, useState } from "react"
import { useRouter } from "next/navigation"

type Selection = { productId: string; options: Record<string, string> }
const optionMap = (variant?: HttpTypes.StoreProductVariant) => Object.fromEntries((variant?.options ?? []).filter((value) => value.option_id).map((value) => [value.option_id!, value.value]))
const hasPrice = (variant: HttpTypes.StoreProductVariant) => variant.calculated_price?.calculated_amount != null
const initialSelection = (products: HttpTypes.StoreProduct[]): Selection => {
  const product = products.find((product) => product.variants?.some((variant) => isVariantInStock(variant) && hasPrice(variant))) ?? products[0]
  const variant = product?.variants?.find((variant) => isVariantInStock(variant) && hasPrice(variant)) ?? product?.variants?.[0]
  return { productId: product?.id ?? "", options: optionMap(variant) }
}
const selectedVariant = (products: HttpTypes.StoreProduct[], selection: Selection) => products.find((product) => product.id === selection.productId)?.variants?.find((variant) => {
  const values = optionMap(variant)
  return Object.keys(values).length === Object.keys(selection.options).length && Object.entries(values).every(([id, value]) => selection.options[id] === value)
})

const GarmentPicker = ({ label, name, products, selection, onChange, disabled }: {
  label: string; name: string; products: HttpTypes.StoreProduct[]; selection: Selection; onChange: (value: Selection) => void; disabled: boolean
}) => {
  const product = products.find((product) => product.id === selection.productId)
  const variant = selectedVariant(products, selection)
  return <fieldset className="configured-product__garment" disabled={disabled}>
    <legend>{label}</legend>
    {!products.length ? <p role="status">No {label.toLowerCase()} designs are currently available.</p> : <>
      {products.length > 1 && <label className="configured-product__label">Design<select value={selection.productId} onChange={(event) => onChange(initialSelection(products.filter((product) => product.id === event.target.value)))}>
        {products.map((product) => <option key={product.id} value={product.id}>{product.title}</option>)}
      </select></label>}
      {products.length === 1 && <p className="configured-product__design">{product?.title}</p>}
      {product?.options?.map((option) => <OptionSelect key={`${product.id}-${option.id}`} option={option} current={selection.options[option.id]} title={option.title ?? "Option"} name={`${name}_options[${option.id}]`} updateOption={(id, value) => onChange({ ...selection, options: { ...selection.options, [id]: value } })} disabled={disabled} />)}
      <input type="hidden" name={`${name}_variant_id`} value={variant?.id ?? ""} />
      <p className="configured-product__availability">{variant && hasPrice(variant) ? (isVariantInStock(variant) ? "In stock" : "Out of stock") : "This combination is not available"}</p>
      <noscript><label>Full {label.toLowerCase()} selection<select name={`${name}_variant_id_nojs`} defaultValue={variant?.id}>
        {products.map((product) => <optgroup key={product.id} label={product.title}>{product.variants?.map((variant) => <option key={variant.id} value={variant.id} disabled={!isVariantInStock(variant) || !hasPrice(variant)}>{variant.title}</option>)}</optgroup>)}
      </select></label></noscript>
    </>}
  </fieldset>
}

const Personalisation = ({ name, mode, settings, currency, text, enabled, onText, onToggle, disabled }: {
  name: string; mode: "set" | "garment"; settings: ReturnType<typeof getProductShopOptions>["personalisation"]; currency: string; text: string; enabled: boolean; onText: (value: string) => void; onToggle: (value: boolean) => void; disabled: boolean
}) => {
  const id = useId()
  const surcharge = settings.prices[currency]
  if (!settings.enabled || surcharge == null) return null
  const amount = convertToLocale({ amount: surcharge, currency_code: currency })
  return <fieldset className="configured-product__personalisation" disabled={disabled}>
    <label className="configured-product__toggle"><input type="checkbox" name={`${name}_personalise`} checked={enabled} onChange={(event) => onToggle(event.target.checked)} />{mode === "set" ? `Personalise the whole tracksuit (+${amount}, charged once)` : `Personalise this garment (+${amount} each)`}</label>
    <div hidden={!enabled}>
      <label htmlFor={id} className="configured-product__label">{settings.label}</label>
      <input id={id} className="configured-product__text" name={`${name}_text`} value={text} onChange={(event) => onText(event.target.value)} maxLength={settings.max_length} required={enabled} disabled={!enabled || disabled} autoComplete="off" aria-describedby={`${id}-hint`} />
      <p id={`${id}-hint`} className="configured-product__hint">{Array.from(text).length}/{settings.max_length} characters. Please check your spelling; your wording is sent exactly as entered.</p>
    </div>
    <noscript><label>{settings.label}<input name={`${name}_text_nojs`} maxLength={settings.max_length} placeholder="Leave blank for no personalisation" /></label><p>Enter wording to add the personalisation charge.</p></noscript>
  </fieldset>
}

export default function ConfiguredProductActions({ product, region, countryCode, hoodies = [], joggers = [] }: {
  product: HttpTypes.StoreProduct; region: HttpTypes.StoreRegion; countryCode: string; hoodies?: HttpTypes.StoreProduct[]; joggers?: HttpTypes.StoreProduct[]
}) {
  const settings = getProductShopOptions(product.metadata)
  const mix = settings.mix_match.enabled
  const firstProducts = mix ? hoodies : [product]
  const [first, setFirst] = useState(() => initialSelection(firstProducts))
  const [second, setSecond] = useState(() => initialSelection(joggers))
  const [personalise, setPersonalise] = useState(false)
  const [wording, setWording] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const router = useRouter()
  const one = selectedVariant(firstProducts, first)
  const two = mix ? selectedVariant(joggers, second) : undefined
  const currency = region.currency_code.toLowerCase()
  const surcharge = settings.personalisation.prices[currency] ?? 0
  const baseOne = one?.calculated_price?.calculated_amount
  const baseTwo = two?.calculated_price?.calculated_amount
  const ready = !!one && isVariantInStock(one) && baseOne != null && (!mix || (!!two && isVariantInStock(two) && baseTwo != null))
  const personalValid = !personalise || !!wording.trim()
  const extra = personalise ? surcharge : 0
  const perSet = (baseOne ?? 0) + (mix ? baseTwo ?? 0 : 0) + extra

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!ready || !one || !personalValid || adding) return
    setAdding(true)
    setError("")
    setMessage("")
    const input: ConfiguredProductInput = { product_id: product.id, quantity, expected_total: perSet * quantity }
    if (mix) {
      // One wording for the whole set; the server charges it once, on the hoodie line.
      input.hoodie = { variant_id: one.id, ...(personalise ? { text: wording } : {}) }
      input.joggers = { variant_id: two!.id }
    } else { input.variant_id = one.id; if (personalise) input.text = wording }
    try {
      const result = await addConfiguredProduct(input, countryCode)
      if (result.error) { setError(result.error); return }
      notifyCartUpdated()
      router.refresh()
      setMessage(mix ? "Your hoodie and joggers have been added to the cart." : "Your selection has been added to the cart.")
    } catch { setError("Could not add your selection. Please try again.") }
    finally { setAdding(false) }
  }

  return <form method="post" action={`/${countryCode}/cart/add`} onSubmit={submit} className="configured-product" data-testid="configured-product-form">
    <input type="hidden" name="product_id" value={product.id} />
    <input type="hidden" name="configured_product" value="1" />
    {mix && <div><h2 className="configured-product__heading">Build your tracksuit</h2><p>Mix your favourite designs, sizes and colours. Your set price is the total of the two garments.</p></div>}
    <GarmentPicker label={mix ? "Hoodie" : "Your selection"} name={mix ? "hoodie" : "product"} products={firstProducts} selection={first} onChange={setFirst} disabled={adding} />
    {mix && <GarmentPicker label="Joggers" name="joggers" products={joggers} selection={second} onChange={setSecond} disabled={adding} />}
    <Personalisation name={mix ? "set" : "product"} mode={mix ? "set" : "garment"} settings={settings.personalisation} currency={currency} text={wording} enabled={personalise} onText={setWording} onToggle={setPersonalise} disabled={adding} />
    <label className="configured-product__label">Quantity<input className="configured-product__quantity" type="number" min={1} max={100} name="quantity" value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} required disabled={adding} /></label>
    {ready && <div className="configured-product__summary" aria-live="polite">
      {mix && <><p>Hoodie <span>{convertToLocale({ amount: baseOne!, currency_code: currency })}</span></p><p>Joggers <span>{convertToLocale({ amount: baseTwo!, currency_code: currency })}</span></p></>}
      {extra > 0 && <p>{mix ? "Personalisation for the whole set" : "Personalisation per garment"} <span>+{convertToLocale({ amount: extra, currency_code: currency })}</span></p>}
      <p className="configured-product__total">{mix ? "Set total" : "Price"} <strong data-testid="configured-total">{convertToLocale({ amount: perSet * (Number.isInteger(quantity) && quantity > 0 ? quantity : 1), currency_code: currency })}</strong></p>
      <small>Shipping and any applicable taxes are confirmed at checkout.</small>
    </div>}
    <p role="alert" className="configured-product__error">{error}</p>
    <p role="status">{message}</p>
    <Button type="submit" disabled={!ready || !personalValid || adding || !Number.isInteger(quantity) || quantity < 1 || quantity > 100} isLoading={adding} className="w-full" data-testid="add-configured-product">{ready ? (mix ? "Add tracksuit to cart" : "Add to cart") : "Select an available combination"}</Button>
    {mix && <p className="configured-product__hint">The cart lists both garments separately so sizes, stock and fulfilment stay accurate. Personalisation is entered once and charged once for the whole set.</p>}
  </form>
}
