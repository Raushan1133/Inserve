import { configureStore } from '@reduxjs/toolkit'
// import { userSlice } from '@/features/UserSlice'
import userReducer from '../features/userSlice.js'

export default configureStore({
  reducer: {
    user : userReducer
  },
})