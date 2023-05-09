import { z } from 'zod'
import { ProductSchema } from './schema'
import * as AudiophileClient from '~/utils/audiophile-client'
import getRandom from '~/utils/get-random'

export const featuredProducts = async () => {
  const response = await AudiophileClient.sendRequest('get', 'products?featured=true&stock_available=true')
  const products = z.array(ProductSchema).parse(response)

  return products
}

export const getProduct = async (slug: string) => {
  const response = await AudiophileClient.sendRequest('get', `products/${slug}`)
  const product = ProductSchema.parse(response)

  return product
}

export const unfeaturedProducts = async () => {
  const response = await AudiophileClient.sendRequest('get', 'products?featured=false&stock_available=true')
  const products = z.array(ProductSchema).parse(response)

  return products
}

export const homeFeaturedProducts = async () => {
  const response = await AudiophileClient.sendRequest('get', 'products?content[home_featured]=true&stock_available=true')
  const products = z.array(ProductSchema).parse(response)
  
  return products
}

export const homepageProducts = async () => {
  const allProducts = await homeFeaturedProducts();

  const primaryProducts = allProducts.filter(product => product.contents.home_banner === 'primary')
  const primary = primaryProducts.length > 0 ? getRandom(primaryProducts) : null

  const backgroundProducts = allProducts.filter(product => product.contents.home_banner === 'integrated_background')
  const background = backgroundProducts.length > 0 ? getRandom(backgroundProducts) : null

  const sideBySideProducts = allProducts.filter(product => product.contents.home_banner === 'side_by_side')
  const sideBySide = sideBySideProducts.length > 0 ? getRandom(sideBySideProducts) : null

  return {
    primary,
    background,
    sideBySide
  }
}
