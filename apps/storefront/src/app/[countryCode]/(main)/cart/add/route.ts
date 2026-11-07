import { sdk } from "@lib/config"
import { getCartId } from "@lib/data/cookies"
import { getRegion } from "@lib/data/regions"
import { HttpTypes } from "@medusajs/types"
import { activateCart, MAX_LINE_ITEM_QUANTITY } from "@lib/util/server-cart"
import { getRequestOrigin } from "@lib/util/site"
import { isEqual } from "lodash"
import { addConfiguredProduct } from "@lib/data/configured-products"
import { ConfiguredProductInput } from "@lib/util/product-options"
import { NextRequest, NextResponse } from "next/server"

const resolveVariantId = async (form: FormData, regionId: string) => {
  const productId = form.get("product_id")?.toString()
  const selectedOptions: Record<string, string> = {}
  form.forEach((value, key) => {
    const match = key.match(/^options\[(.+)\]$/)
    if (match) {
      selectedOptions[match[1]] = value.toString()
    }
  })

  if (!productId || Object.keys(selectedOptions).length === 0) {
    return form.get("variant_id")?.toString() || undefined
  }

  const { product } = await sdk.store.product.retrieve(productId, {
    region_id: regionId,
    fields: "id,*variants,*variants.options",
  })

  return product.variants?.find((variant: HttpTypes.StoreProductVariant) =>
    isEqual(
      Object.fromEntries(
        (variant.options ?? []).map((o) => [o.option_id, o.value])
      ),
      selectedOptions
    )
  )?.id
}

const addLineItem = async (
  cartId: string | undefined,
  regionId: string,
  variantId: string,
  quantity: number
) => {
  const id =
    cartId ?? (await sdk.store.cart.create({ region_id: regionId })).cart.id
  await sdk.store.cart.createLineItem(id, { variant_id: variantId, quantity })
  return id
}

const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Could not add item to cart"

/** No-JavaScript add-to-cart: the product page form posts here. */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ countryCode: string }> }
) {
  const { countryCode } = await params
  const region = await getRegion(countryCode)
  if (!region) {
    return new NextResponse("Unknown country code", { status: 404 })
  }

  const form = await request.formData()
  const quantity = Math.min(
    Math.max(parseInt(form.get("quantity")?.toString() ?? "1", 10) || 1, 1),
    MAX_LINE_ITEM_QUANTITY
  )

  if (form.get("configured_product") === "1") {
    const variant = (role: string) => String(form.get(`${role}_variant_id_nojs`) || form.get(`${role}_variant_id`) || "")
    const text = (role: string) => {
      const fallback = form.get(`${role}_text_nojs`)
      return fallback != null ? String(fallback) : form.get(`${role}_personalise`) ? String(form.get(`${role}_text`) || "") : undefined
    }
    const input: ConfiguredProductInput = { product_id: String(form.get("product_id") || ""), quantity }
    if (form.has("hoodie_variant_id")) {
      input.hoodie = { variant_id: variant("hoodie"), text: text("hoodie") }
      input.joggers = { variant_id: variant("joggers"), text: text("joggers") }
    } else { input.variant_id = variant("product"); input.text = text("product") }
    const result = await addConfiguredProduct(input, countryCode)
    if (result.error) return new NextResponse(result.error, { status: 400, headers: { "Content-Type": "text/plain; charset=utf-8" } })
    return NextResponse.redirect(`${getRequestOrigin(request)}/${countryCode}/cart`, 303)
  }

  let variantId: string | undefined
  try {
    variantId = await resolveVariantId(form, region.id)
  } catch {
    return new NextResponse("Product not found", { status: 404 })
  }
  if (!variantId) {
    return new NextResponse("Select a valid product variant", { status: 400 })
  }

  const existingCartId = await getCartId()
  let cartId: string
  try {
    cartId = await addLineItem(existingCartId, region.id, variantId, quantity)
  } catch (error) {
    if (!existingCartId) {
      return new NextResponse(errorMessage(error), { status: 400 })
    }
    // The stored cart may be completed or belong to another region.
    try {
      cartId = await addLineItem(undefined, region.id, variantId, quantity)
    } catch (retryError) {
      return new NextResponse(errorMessage(retryError), { status: 400 })
    }
  }

  await activateCart(cartId)

  return NextResponse.redirect(
    `${getRequestOrigin(request)}/${countryCode}/cart`,
    303
  )
}
