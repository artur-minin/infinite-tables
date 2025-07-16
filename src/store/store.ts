import { combineSlices, configureStore } from '@reduxjs/toolkit'

import { tablesSlice } from './tablesSlice'

export const rootReducer = combineSlices(tablesSlice)
export const store = configureStore({
  reducer: rootReducer
})
