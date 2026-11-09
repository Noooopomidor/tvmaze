import type { SearchLocation } from './types'

const parsePage = (value: string | null) => {
  if (!value || !/^\d+$/.test(value)) return 1
  const page = Number(value)
  return Number.isSafeInteger(page) && page > 0 ? page : 1
}

export const readSearchLocation = (search: string): SearchLocation => {
  const params = new URLSearchParams(search)
  const query = params.get('q')?.trim() ?? ''
  if (!query) return { query: '', selectedGenre: null, page: 1 }

  return {
    query,
    selectedGenre: params.get('genre')?.trim() || null,
    page: parsePage(params.get('page')),
  }
}

export const getSearchUrl = (href: string, selection: SearchLocation) => {
  const url = new URL(href)
  for (const key of ['q', 'genre', 'page']) url.searchParams.delete(key)
  const query = selection.query.trim()
  if (query) {
    url.searchParams.set('q', query)
    if (selection.selectedGenre) {
      url.searchParams.set('genre', selection.selectedGenre)
    }
    if (Number.isSafeInteger(selection.page) && selection.page > 1) {
      url.searchParams.set('page', String(selection.page))
    }
  }
  return url.href
}
