import { configureStore } from '@reduxjs/toolkit'
import applicationSlice from './slice/application'

export const store = configureStore({
  reducer: {
    application: applicationSlice,
  },
})