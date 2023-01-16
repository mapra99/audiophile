import { z } from 'zod'

export const ProductSchema = z.object({
  name: z.string(),
  slug: z.string(),
  base_price: z.number(),
  featured: z.boolean(),
  total_quantity: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
  image: z.object({
    url: z.string()
  }),
  category: z.object({
      name: z.string(),
      slug: z.string(),
      created_at: z.string(),
      updated_at: z.string(),
      image: z.object({
        url: z.string()
      })
  }),
  contents: z.object({
    featured_description: z.string().optional(),
    featured_image: z.array(z.string()).optional(),
    home_image: z.array(z.string()).optional(),
    home_banner: z.string().optional(),
    home_description: z.string().optional(),
    description: z.string(),
    features: z.string(),
    box_content: z.string(),
    preview_images: z.array(z.string()),
  }),
  recommendations: z.array(z.object({
    name: z.string(),
    slug: z.string(),
    base_price: z.number(),
    featured: z.boolean(),
    total_quantity: z.number(),
    created_at: z.string(),
    updated_at: z.string(),
    image: z.object({
      url: z.string()
    }),
  }))
})

export interface BoxItem {
  quantity: string
  content: string
}

export type Product = z.infer<typeof ProductSchema>;
