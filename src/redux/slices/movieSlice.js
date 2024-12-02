import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
  error: null,
  isLoading: false,
  hasMoreData: true,
};

const movieSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    fetchMoviesRequested: (state, action) => {
      state.isLoading = true;
    },
    fetchMoviesSuccess: (state, action) => {
      state.isLoading = false;
      state.hasMoreData = action.payload.results.length > 0;
      if (action.payload.page === 1) {
        state.data = [...action.payload.results];
      } else {
        state.data = [...state.data, ...action.payload.results];
      }
    },
    fetchMoviesFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchMoviesRequested, fetchMoviesSuccess, fetchMoviesFailure } =
  movieSlice.actions;

export default movieSlice.reducer;
