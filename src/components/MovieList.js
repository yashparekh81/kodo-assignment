import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMoviesRequested } from "../redux/slices/movieSlice";
import { POSTER_BASE_URL } from "../utils/constants";

const MovieList = ({ query }) => {
  const dispatch = useDispatch();
  const observerRef = useRef(null);
  const [page, setPage] = useState(1);
  const { data, isLoading, hasMoreData, error } = useSelector(
    (state) => state.movies
  );

  useEffect(() => {
    // On change of search term, reset page value to 1
    setPage(1);
  }, [query]);

  useEffect(() => {
    if (!isLoading) {
      // On change of page or search, fetch with new values
      dispatch(fetchMoviesRequested({ page, query }));
    }
  }, [dispatch, page, query]);

  useEffect(() => {
    const observerOptions = { root: null, rootMargin: "0px", threshold: 0.1 };

    const observer = new IntersectionObserver((entries) => {
      // When user scrolls to the bottom of the page and there are more data to fetch,
      // then fetch new data by incrementing page number.
      if (entries[0].isIntersecting && !isLoading && hasMoreData) {
        setPage((prev) => prev + 1);
      }
    }, observerOptions);

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [isLoading, hasMoreData]);

  return (
    <div>
      {error && (
        <p data-testid="error-message" className="text-red-500 text-center">
          {error}
        </p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 p-4">
        {data.map((movie) => (
          <div
            key={movie.id}
            className="bg-gray-800 text-white p-2 rounded shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-300 h-full"
          >
            <img
              loading="lazy"
              alt={movie.title}
              className="rounded mb-2 w-full"
              src={`${POSTER_BASE_URL}${movie.poster_path}`}
            />
            <div className="flex flex-col justify-between">
              <p className="font-semibold text-base">{movie.title}</p>
              <div className="flex justify-between my-2 text-sm text-gray-100">
                <p>
                  Rating:{" "}
                  {movie.vote_average ? movie.vote_average.toFixed(1) : "-"}
                </p>
                <p>Release Date: {movie.release_date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {isLoading && (
        <p data-testid="loadingMore" className="text-center text-gray-500 mt-4">
          Loading more movies...
        </p>
      )}
      <div ref={observerRef} className="p-4 h-10"></div>
    </div>
  );
};

export default React.memo(MovieList);
