import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'LingoGames',
    short_name: 'LingoGames',
    description: 'Daily language challenges: Wordle, Crossword and Connections.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0b1120',
    theme_color: '#2DC9AC',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  }
}
