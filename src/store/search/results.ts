import type { Show } from '../../api/tvmaze/types'

export const PAGE_SIZE = 3

export const normalizePage = (page: number) => {
  return Number.isSafeInteger(page) && page > 0 ? page : 1
}

export const prepareResults = (
  shows: Show[],
  genre: string | null,
  page: number,
) => {
  const genres = [...new Set(shows.flatMap((show) => show.genres))].sort(
    (a, b) => a.localeCompare(b),
  )
  const requestedGenre = genre?.trim().toLowerCase()
  const selectedGenre =
    genres.find((value) => value.trim().toLowerCase() === requestedGenre) ??
    null
  const normalizedGenre = selectedGenre?.trim().toLowerCase()
  const filtered = selectedGenre
    ? shows.filter((show) =>
        show.genres.some(
          (value) => value.trim().toLowerCase() === normalizedGenre,
        ),
      )
    : shows
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(normalizePage(page), totalPages)
  const start = (currentPage - 1) * PAGE_SIZE

  return {
    shows: filtered.slice(start, start + PAGE_SIZE),
    genres,
    selectedGenre,
    page: currentPage,
    totalPages,
    totalCount: filtered.length,
    totalResults: shows.length,
  }
}
