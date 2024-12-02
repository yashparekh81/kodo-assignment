import { call, put, takeLatest } from "redux-saga/effects";
import { fetchMovies } from "../../services/apis";
import {
  fetchMoviesRequested,
  fetchMoviesSuccess,
  fetchMoviesFailure,
} from "../slices/movieSlice";

// Worker Saga: Fetch movies
function* fetchMoviesSaga(action) {
  try {
    const data = yield call(fetchMovies, action.payload);
    yield put(fetchMoviesSuccess(data));
  } catch (error) {
    yield put(fetchMoviesFailure(error.message));
  }
}

// Watcher Saga: Watch for fetchMoviesRequested action
function* watchFetchMovies() {
  yield takeLatest(fetchMoviesRequested.type, fetchMoviesSaga);
}

export default watchFetchMovies;
