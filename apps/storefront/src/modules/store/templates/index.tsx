import SearchForm from "@modules/search/components/search-form"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"

export default function StoreTemplate({
  countryCode,
  sortBy,
  page,
}: {
  countryCode: string
  sortBy: SortOptions
  page: number
}) {
  return (
    <div className="content-container shop-catalog" data-testid="category-container">
      <div className="shop-catalog__heading">
        <p className="shop-eyebrow">The Alchemising Chaos shop</p>
        <h1 data-testid="store-page-title">Find your festival feeling.</h1>
        <p>Explore the collection and carry a little of the gathering with you.</p>
        <SearchForm countryCode={countryCode} className="mt-7 max-w-xl" />
      </div>
      <div className="shop-catalog__body">
        <RefinementList sortBy={sortBy} hideOptionsPicker data-testid="sort-by-container" />
        <div className="w-full min-w-0">
          <PaginatedProducts sortBy={sortBy} page={page} countryCode={countryCode} />
        </div>
      </div>
    </div>
  )
}
