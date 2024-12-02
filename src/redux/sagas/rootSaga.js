import { all } from "redux-saga/effects";
import watchFetchMovies from "./movieSaga";

export default function* rootSaga() {
  yield all([watchFetchMovies()]);
}
