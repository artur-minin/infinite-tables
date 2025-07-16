import { combineSlices, configureStore } from '@reduxjs/toolkit'

import { tablesSlice } from './tablesSlice.ts'

export const rootReducer = combineSlices(tablesSlice)
export const store = configureStore({
  reducer: rootReducer
})
