import { useLoaderData } from "@remix-run/react"
import { json } from '@remix-run/node'
import invariant from "tiny-invariant"
import { allAvailableProductCategories, getProductCategory } from "~/models/product-category"
import { Heading, ProductBanner, CategoriesList, BestAudioBanner } from '~/components'
import type { LoaderArgs } from "@remix-run/server-runtime"

export const loader = async ({ params, request }: LoaderArgs) => {
  const { categorySlug } = params
  invariant(categorySlug, "Category slug is required")

  let currentCategory
  try {
    currentCategory = await getProductCategory(categorySlug)
  } catch (err) {
    throw new Response("Not Found", { status: 404 })
  }

  const categories = await allAvailableProductCategories()
  return json({ currentCategory, categories })
}

export default () => {
  const { currentCategory, categories } = useLoaderData<typeof loader>();

  return (
    <div>
      <Heading name={currentCategory.name} />
      <div className="flex flex-col gap-28 pt-16 pb-28 px-6 sm:py-28 sm:px-10">
        { currentCategory.products.map((product, index) => (
          <ProductBanner key={product.slug} product={product} index={index} />
        )) }
      </div>

      <div className="mb-28 lg:mb-40">
        <CategoriesList categories={categories} />
      </div>

      <div className="mb-28 lg:mb-40">
        <BestAudioBanner />
      </div>
    </div>
  )
}
