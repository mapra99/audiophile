import { Link } from '@remix-run/react'
import { Text, ButtonLink } from '~/components'
import getRandom from '~/utils/get-random'

import type { Product } from '~/models/product'
import type { ProductRecommendationsProps } from './types'

const ProductRecommendations = ({ recommendations }: ProductRecommendationsProps) => {
  if (recommendations.length < 3) return null;

  const randomRecommendations = getRandom(recommendations, 3) as Product["recommendations"]

  return (
    <div className="max-w-6xl mx-auto">
      <Text variant="heading-3" className="!text-2xl sm:!text-4xl mb-10 sm:mb-14 lg:mb-16 text-center">
        You may also like
      </Text>

      <div className="flex flex-col gap-14 sm:flex-row sm:gap-3 lg:gap-8">
        { randomRecommendations.map(recommendation => (
          <Link key={recommendation.slug} to={`/products/${recommendation.slug}`} className="flex-1">
            <div className="bg-gray rounded-lg p-3 flex justify-center items-center mb-8 sm:p-8 sm:h-80 sm:mb-10">
              <img
                className="min-w-20 max-h-24 sm:max-h-48"
                src={recommendation.image.url}
                alt={`Overview of ${recommendation.name}`}
              />
            </div>

            <Text variant="heading-5" className="text-center mb-8">
              { recommendation.name }
            </Text>

            <ButtonLink variant="primary" to={`/products/${recommendation.slug}`} className="text-center w-44 mx-auto">
              See product
            </ButtonLink>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default ProductRecommendations
