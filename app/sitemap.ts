import type { MetadataRoute } from 'next'
import { languages } from '@/lib/languages'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const routes = ['', '/wordle', '/crossword', '/connections']
  const lastModified = new Date()

  const allEntries: MetadataRoute.Sitemap = []

  routes.forEach((path) => {
    // Basic route (defaults to English or based on middleware/client logic)
    allEntries.push({
      url: `${base}${path}`,
      lastModified,
      changeFrequency: 'daily',
      priority: path === '' ? 1 : 0.8,
    })

    // Localized routes
    languages.forEach((lang) => {
      allEntries.push({
        url: `${base}${path}?lang=${lang.code}`,
        lastModified,
        changeFrequency: 'daily',
        priority: path === '' ? 0.9 : 0.7,
      })
    })
  })

  return allEntries
}
