import type { Show } from '../api/tvmaze/types'

export const PAGE_SIZE = 3

export const prepareResults = (
  shows: Show[],
  genre: string | null,
  page: number,
) => {
  const genres = [...new Set(shows.flatMap((show) => show.genres))].sort(
    (a, b) => a.localeCompare(b),
  )
  const filtered = genre
    ? shows.filter((show) => show.genres.includes(genre))
    : shows
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.max(1, Math.min(page, totalPages))
  const start = (currentPage - 1) * PAGE_SIZE

  return {
    shows: filtered.slice(start, start + PAGE_SIZE),
    genres,
    page: currentPage,
    totalPages,
    totalCount: filtered.length,
    totalResults: shows.length,
  }
}
