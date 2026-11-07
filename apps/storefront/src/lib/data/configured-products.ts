"use server"

import { sdk } from "@lib/config"
import { getOrSetCart } from "./cart"
import { getAuthHeaders, getCacheTag } from "./cookies"
import { ConfiguredProductInput } from "@lib/util/product-options"
import { revalidateTag } from "next/cache"

export async function addConfiguredProduct(input: ConfiguredProductInput, countryCode: string): Promise<{ error: string | null }> {
  try {
    if (!input.product_id || !Number.isInteger(input.quantity) || input.quantity < 1 || input.quantity > 100) {
      return { error: "Choose a product and a quantity between 1 and 100." }
    }
    const cart = await getOrSetCart(countryCode)
    if (!cart) return { error: "Could not create a shopping cart. Please try again." }
    await sdk.client.fetch(`/store/carts/${cart.id}/configured-items`, {
      method: "POST", body: input, headers: await getAuthHeaders(), cache: "no-store",
    })
    for (const name of ["carts", "fulfillment"]) {
      const tag = await getCacheTag(name)
      if (tag) revalidateTag(tag, { expire: 0 })
    }
    return { error: null }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Could not add your selection. Please try again." }
  }
}
