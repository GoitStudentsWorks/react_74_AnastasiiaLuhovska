import { createSlice } from "@reduxjs/toolkit";
import {
  deleteUserAvatar,
  fetchCurrentUser,
  updateUserAvatar,
  updateUserInfo,
} from "./operations";
import { logOut } from "../auth/operations";

const initialState = {
  name: "",
  email: "",
  currency: "",
  isLoading: false,
  avatarUrl: "",
  totalIncomes: 0,
  totalExpenses: 0,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(
        fetchCurrentUser.fulfilled,
        (
          state,
          { payload: { name, email, currency, avatarUrl, transactionsTotal } }
        ) => {
          state.name = name;
          state.email = email;
          state.currency = currency;
          state.avatarUrl = avatarUrl;
          state.totalIncomes = transactionsTotal.incomes;
          state.totalExpenses = transactionsTotal.expenses;
          state.isLoading = false;
        }
      )
      .addCase(fetchCurrentUser.pending, (state, { payload }) => {
        state.isLoading = true;
      })
      .addCase(fetchCurrentUser.rejected, (state, { payload }) => {
        state.isLoading = false;
      })
      .addCase(updateUserInfo.fulfilled, (state, { payload }) => {
        state.name = payload.name;
        state.currency = payload.currency;
      })

      .addCase(updateUserAvatar.fulfilled, (state, { payload }) => {
        state.avatarUrl = payload;
      })

      .addCase(deleteUserAvatar.fulfilled, (state) => {
        state.avatarUrl = null;
      })
      .addCase(logOut.fulfilled, (state) => initialState);
  },
});

export const userReducer = userSlice.reducer;
