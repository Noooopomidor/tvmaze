import type { Store } from 'redux'
import { locationRestored } from '../store/search/slice'
import type { SearchState } from '../store/search/types'
import { getSearchUrl, readSearchLocation } from './searchUrl'

type SearchStore = Pick<
  Store<{ search: SearchState }>,
  'getState' | 'dispatch' | 'subscribe'
>
type Browser = Pick<
  Window,
  'location' | 'history' | 'addEventListener' | 'removeEventListener'
>

export const syncSearchLocation = (
  store: SearchStore,
  browser: Browser = window,
) => {
  let previous = store.getState().search
  let restoring = false

  const write = (mode: 'push' | 'replace') => {
    const href = getSearchUrl(browser.location.href, store.getState().search)
    if (href === browser.location.href) return
    if (mode === 'push') {
      browser.history.pushState(null, '', href)
      return
    }
    browser.history.replaceState(browser.history.state, '', href)
  }

  const restore = () => {
    restoring = true
    try {
      store.dispatch(
        locationRestored(readSearchLocation(browser.location.search)),
      )
      write('replace')
    } finally {
      restoring = false
    }
  }

  const unsubscribe = store.subscribe(() => {
    const current = store.getState().search
    const changed =
      current.query !== previous.query ||
      current.selectedGenre !== previous.selectedGenre ||
      current.page !== previous.page
    const queryChanged = current.query.trim() !== previous.query.trim()
    const requestCompleted =
      previous.status === 'loading' && current.status === 'success'
    let mode: 'push' | 'replace' = 'push'
    if (
      restoring ||
      requestCompleted ||
      (queryChanged && previous.status === 'loading')
    ) {
      mode = 'replace'
    }
    previous = current
    if (changed) write(mode)
  })

  restore()
  browser.addEventListener('popstate', restore)

  return () => {
    unsubscribe()
    browser.removeEventListener('popstate', restore)
  }
}
