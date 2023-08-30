import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: "",
  _id: "",
  token: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginRedux: (state, action) => {
      state._id = action.payload.data._id;
      state.email = action.payload.data.email;
      state.token = action.payload.data.token;
      sessionStorage.setItem('userEmail', action.payload.data.email);
      sessionStorage.setItem('userId', action.payload.data._id);
      sessionStorage.setItem('token', action.payload.data.token);
      sessionStorage.setItem('isAdmin', action.payload.data.isAdmin);
    },
    logoutRedux: (state) => {
      state.email = "";
      state._id = "";
      state.token = "";
      sessionStorage.clear();
    }
  },
});

 

export const { loginRedux, logoutRedux } = userSlice.actions;

export default userSlice.reducer;