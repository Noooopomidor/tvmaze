import { useState } from 'react'
import type { ShowCardProps } from './types'

export const usePresenter = (props: ShowCardProps) => {
  const [failedImage, setFailedImage] = useState<string | null>(null)
  const { show } = props

  return {
    name: show.name,
    url: show.url,
    image: show.image ?? undefined,
    imageAlt: `Постер шоу «${show.name}»`,
    hasImage: Boolean(show.image) && failedImage !== show.image,
    onImageError: () => setFailedImage(show.image),
    initial: show.name.trim()[0]?.toUpperCase() ?? 'TV',
    number: String(props.index).padStart(2, '0'),
    hasRating: show.rating !== null,
    rating: show.rating?.toFixed(1) ?? '',
    metadata: [show.year, show.network || show.language]
      .filter(Boolean)
      .join(' · '),
    genres: show.genres.join(' / ') || 'Без жанра',
    summary: show.summary || 'Описание этого шоу пока не добавлено.',
    linkLabel: `О шоу «${show.name}» на TVmaze`,
  }
}
