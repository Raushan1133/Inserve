import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    name:"",
    email :"",
    profilePic : "",
    type : "",
    token : ""
  },
  reducers: {
    setUser: (state,action) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.profilePic = action.payload.profilePic;
      state.type = action.payload.type;
      state.token = action.payload.token;
    },
    
    removeUser : (state, action) => {
        state.name = "",
        state.email = "",
        state.profilePic = "",
        state.type = "",
        state.token = ""
    }
  },
})

// Action creators are generated for each case reducer function
export const {setUser, removeUser} = userSlice.actions

export default userSlice.reducer