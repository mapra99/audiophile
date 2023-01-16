import invariant from 'tiny-invariant'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { getProduct } from '~/models/product'
import { getProductStocks } from '~/models/product-stock'
import { allAvailableProductCategories } from '~/models/product-category'
import { ProductHeading, ProductFeatures, ProductGallery, CategoriesList, BestAudioBanner, ProductRecommendations } from '~/components'
import trackPageView from '~/utils/track-page-view'
import goBack from '~/utils/go-back'

import type { LoaderArgs } from '@remix-run/node'

export const loader = async ({ params, request }: LoaderArgs) => {
  trackPageView(request)

  const { productSlug } = params
  invariant(productSlug, "Product slug is required")

  let product
  try {
    product = await getProduct(productSlug)
  } catch (err) {
    throw new Response("Not Found", { status: 404 })
  }

  const stocks = await getProductStocks(productSlug)
  const categories = await allAvailableProductCategories()

  return json({ product, categories, stocks })
}

export default () => {
  const { product, categories, stocks } = useLoaderData<typeof loader>()

  return (
    <div>
      <div className="pt-4 pb-6 px-6 sm:pt-8 sm:px-10">
        <div className="max-w-6xl mx-auto">
          <button onClick={goBack} className="text-base text-black opacity-50 hover:opacity-100 transition">
            Go Back
          </button>
        </div>
      </div>

      <div className="px-6 sm:px-10 mb-20 sm:mb-28 lg:mb-40">
        <ProductHeading product={product} stocks={stocks} />
      </div>

      <div className="px-6 sm:px-10 mb-20 sm:mb-28 lg:mb-40">
        <ProductFeatures product={product} />
      </div>

      <div className="px-6 sm:px-10 mb-20 sm:mb-28 lg:mb-40">
        <ProductGallery product={product} />
      </div>

      <div className="px-6 sm:px-10 mb-20 sm:mb-28 lg:mb-40">
        <ProductRecommendations recommendations={product.recommendations} />
      </div>

      <div className="mb-20 sm:mb-28 lg:mb-40">
        <CategoriesList categories={categories} />
      </div>

      <div className="mb-28 lg:mb-40">
        <BestAudioBanner />
      </div>
    </div>
  )
}
