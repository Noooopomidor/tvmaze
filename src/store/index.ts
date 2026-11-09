import { configureStore } from '@reduxjs/toolkit'
import { searchListenerMiddleware } from './search/listener'
import { searchReducer } from './search/slice'

export const store = configureStore({
  reducer: { search: searchReducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(searchListenerMiddleware.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
