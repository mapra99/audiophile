import type { Product } from '~/models/product'

export interface ProductRecommendationsProps {
  recommendations: Product["recommendations"]
}
