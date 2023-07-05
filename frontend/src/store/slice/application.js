import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isNight: false,
  role: "test",
}

export const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    changeNight: (state)=> {
        state.isNight = !state.isNight
    },
    setRole: (state, action) => {
        state.role = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { changeNight, setRole } = applicationSlice.actions

export default applicationSlice.reducer