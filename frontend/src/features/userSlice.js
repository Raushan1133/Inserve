import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    id:"",
    name:"",
    email :"",
    profile_pic : "",
    type : "",
  },
  reducers: {
    setUser: (state,action) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.profile_pic = action.payload.profile_pic;
      state.type = action.payload.type;
    },
    
    removeUser : (state, action) => {
        state.id = "",
        state.name = "",
        state.email = "",
        state.profile_pic = "",
        state.type = ""
    }
  },
})

// Action creators are generated for each case reducer function
export const {setUser, removeUser} = userSlice.actions

export default userSlice.reducer