import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const routes = ['', '/wordle', '/crossword', '/connections']
  const lastModified = new Date()
  return routes.map((path) => ({
    url: `${base}${path}`,
    lastModified,
    changeFrequency: 'daily',
    priority: path === '' ? 1 : 0.8,
  }))
}
