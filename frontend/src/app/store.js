import { configureStore } from '@reduxjs/toolkit'
// import { userSlice } from '@/features/UserSlice'
import userReducer from '../features/UserSlice'

export default configureStore({
  reducer: {
    user : userReducer
  },
})