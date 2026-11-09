import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Show } from '../../api/tvmaze/types'
import type { SearchState } from './types'

const initialState: SearchState = {
  query: '',
  selectedGenre: null,
  page: 1,
  shows: [],
  status: 'idle',
  error: null,
  requestVersion: 0,
}

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    queryChanged: (state, action: PayloadAction<string>) => {
      const previousQuery = state.query.trim()
      state.query = action.payload
      state.selectedGenre = null
      state.page = 1
      const query = action.payload.trim()
      if (query === previousQuery) return
      state.requestVersion += 1
      state.shows = []
      state.error = null
      state.status = query ? 'loading' : 'idle'
    },
    genreChanged: (state, action: PayloadAction<string | null>) => {
      state.selectedGenre = action.payload
      state.page = 1
    },
    pageChanged: (state, action: PayloadAction<number>) => {
      state.page = Math.max(1, action.payload)
    },
    retryRequested: (state) => {
      if (!state.query.trim()) return
      state.requestVersion += 1
      state.shows = []
      state.error = null
      state.status = 'loading'
    },
    requestSucceeded: (
      state,
      action: PayloadAction<{ requestVersion: number; shows: Show[] }>,
    ) => {
      if (state.requestVersion !== action.payload.requestVersion) return
      state.shows = action.payload.shows
      state.error = null
      state.status = 'success'
    },
    requestFailed: (
      state,
      action: PayloadAction<{ requestVersion: number; error: string }>,
    ) => {
      if (state.requestVersion !== action.payload.requestVersion) return
      state.shows = []
      state.error = action.payload.error
      state.status = 'error'
    },
  },
})

export const {
  queryChanged,
  genreChanged,
  pageChanged,
  retryRequested,
  requestSucceeded,
  requestFailed,
} = searchSlice.actions

export const searchReducer = searchSlice.reducer
