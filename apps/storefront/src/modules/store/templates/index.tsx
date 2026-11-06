import SearchForm from "@modules/search/components/search-form"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import CelestialMark from "@modules/home/components/celestial-mark"

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
        <CelestialMark className="shop-catalog__ornament" />
        <p className="cosmic-kicker"><span aria-hidden="true">✧</span> The Alchemising Chaos shop</p>
        <h1 data-testid="store-page-title">Find your <em>something.</em></h1>
        <p>Little pieces of our world, ready to wander with you.</p>
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
