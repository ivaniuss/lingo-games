import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'LingoGames | Daily Language Challenges',
    short_name: 'LingoGames',
    description: 'Master languages with daily Wordle, Crossword and Connections puzzles.',
    start_url: '/',
    display: 'standalone',
    background_color: '#05080a',
    theme_color: '#2DC9AC',
    orientation: 'portrait',
    icons: [
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      }
    ],
  }
}
