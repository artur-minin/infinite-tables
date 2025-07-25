import { rootReducer, store } from '@/store/store'

export type RootState = ReturnType<typeof rootReducer>

export type AppStore = typeof store
export type AppDispatch = AppStore['dispatch']
