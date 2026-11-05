import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Brand from "@modules/layout/components/brand"

export default async function Footer() {
  const [{ collections }, categories] = await Promise.all([
    listCollections({ fields: "id,handle,title" }),
    listCategories({ fields: "id,name,handle,parent_category_id" }),
  ])
  const topCategories = categories?.filter((category) => !category.parent_category_id).slice(0, 6) ?? []

  return (
    <footer className="festival-footer">
      <div className="content-container">
        <div className="festival-footer__grid">
          <div className="festival-footer__intro">
            <Brand />
            <p>Carry a little of the gathering with you, wherever your journey takes you.</p>
            <a className="festival-footer__festival-link" href="https://alchemisingchaos.com/">
              Explore the festival <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div>
            <h2>Explore the shop</h2>
            <ul>
              <li><LocalizedClientLink href="/store">Shop all</LocalizedClientLink></li>
              <li><LocalizedClientLink href="/account">My account</LocalizedClientLink></li>
              <li><LocalizedClientLink href="/cart">My cart</LocalizedClientLink></li>
              {topCategories.map((category) => (
                <li key={category.id}>
                  <LocalizedClientLink href={`/categories/${category.handle}`}>{category.name}</LocalizedClientLink>
                </li>
              ))}
            </ul>
          </div>
          {collections?.length > 0 && (
            <div>
              <h2>Collections</h2>
              <ul>
                {collections.slice(0, 6).map((collection) => (
                  <li key={collection.id}>
                    <LocalizedClientLink href={`/collections/${collection.handle}`}>{collection.title}</LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div>
            <h2>Here to help</h2>
            <ul>
              <li><LocalizedClientLink href="/shipping">Shipping information</LocalizedClientLink></li>
              <li><LocalizedClientLink href="/returns">Returns</LocalizedClientLink></li>
              <li><LocalizedClientLink href="/contact">Contact</LocalizedClientLink></li>
              <li><LocalizedClientLink href="/privacy">Privacy policy</LocalizedClientLink></li>
              <li><LocalizedClientLink href="/terms">Terms of service</LocalizedClientLink></li>
            </ul>
          </div>
        </div>
        <div className="festival-footer__bottom">
          <span>© {new Date().getFullYear()} Alchemising Chaos Festival</span>
          <span>Music <span aria-hidden="true">✦</span> Creativity <span aria-hidden="true">✦</span> Community</span>
        </div>
      </div>
    </footer>
  )
}
