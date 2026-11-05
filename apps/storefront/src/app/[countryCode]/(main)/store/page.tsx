import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getRegion } from "@lib/data/regions"
import StoreTemplate from "@modules/store/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

export const metadata: Metadata = {
  title: "Shop | Alchemising Chaos Festival",
  description: "Explore the Alchemising Chaos Festival shop.",
}

export default async function StorePage(props: {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ sortBy?: string; page?: string }>
}) {
  const { countryCode } = await props.params
  const { sortBy, page } = await props.searchParams
  const region = await getRegion(countryCode)

  if (!region) {
    notFound()
  }

  const sort: SortOptions = sortBy === "price_asc" || sortBy === "price_desc" ? sortBy : "created_at"
  const parsedPage = Number(page)
  const pageNumber = Number.isSafeInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1

  return <StoreTemplate countryCode={countryCode} sortBy={sort} page={pageNumber} />
}
