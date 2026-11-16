import { createTvmazeError } from './errors'
import type { Show } from './types'

export const asRecord = (value: unknown): Record<string, unknown> => {
  return value !== null && typeof value === 'object'
    ? (value as Record<string, unknown>)
    : {}
}

const text = (value: unknown, fallback = '') => {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback
}

const number = (value: unknown) => {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

const summary = (value: unknown) => {
  if (typeof value !== 'string') return ''
  const markup = value.replace(/<\/p>|<br\s*\/?>/gi, ' ')
  const document = new DOMParser().parseFromString(markup, 'text/html')
  for (const node of document.querySelectorAll('script, style, noscript')) {
    node.remove()
  }
  return (document.body.textContent ?? '').replace(/\s+/g, ' ').trim()
}

const image = (value: unknown) => {
  if (typeof value !== 'string') return null
  try {
    const url = new URL(value)
    return url.protocol === 'https:' ? url.href : null
  } catch {
    return null
  }
}

export const normalizeShow = (value: unknown): Show => {
  const show = asRecord(value)
  const id = number(show.id)
  const name = text(show.name)
  if (id === null || !Number.isInteger(id) || id < 1 || !name) {
    throw createTvmazeError('invalid-response')
  }
  const genres = Array.isArray(show.genres)
    ? show.genres.map((genre) => text(genre)).filter(Boolean)
    : []
  const premiered = text(show.premiered)
  const runtime = number(show.averageRuntime) ?? number(show.runtime)

  return {
    id,
    name,
    url: `https://www.tvmaze.com/shows/${id}`,
    genres: [...new Set(genres)],
    summary: summary(show.summary),
    image: image(asRecord(show.image).medium),
    year: /^\d{4}-/.test(premiered) ? premiered.slice(0, 4) : null,
    rating: number(asRecord(show.rating).average),
    language: text(show.language) || null,
    network:
      text(asRecord(show.network).name, text(asRecord(show.webChannel).name)) ||
      null,
    runtime: runtime !== null && runtime > 0 ? runtime : null,
    status: text(show.status, 'Unknown'),
  }
}
